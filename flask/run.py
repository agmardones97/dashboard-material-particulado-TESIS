from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import couchdb
import csv


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = './Archivos'


def make_json(csvFilePath):
    # create a dictionary
    data = {}
    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        # Convert each row into a dictionary
        # and add it to data
        cont = 0
        for rows in csvReader:
            if (rows['lat'] == '0') or (rows['lon'] == '0') or (rows['mp25'] == "") or (rows['mp10'] == "") or (rows['mp25'] == '0') or (rows['mp10'] == '0'):
                continue
            rows['No'] = cont
            key = rows['No']
            data[key] = rows
            cont = cont + 1
        arr = {'data': data, 'lendata': len(data)}
        return arr


@app.route('/')
def hello_world():
    return 'PAGINA INDEX'


@app.route('/agregarfile', methods=['POST'])
def agregar():
    # Recibe datos
    file = request.files['files']
    titulo = request.values['titulo']
    descripcion = request.values['descripcion']
    region = request.values['region']
    comuna = request.values['comuna']
    temperatura = request.values['temperatura']
    horario = request.values['horario']
    altura = request.values['altura']
    fecha = request.values['fecha']
    # Guardamos el archivo en el directorio "Archivos PDF"
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], 'data.csv'))
    dbname = 'datos-mpp'
    couch = couchdb.Server()
    couch.resource.credentials = ('admin', 'admin')
    # Conecta con db
    if dbname in couch:
        db = couch[dbname]  # Se conecta a la base de datos
    else:
        db = couch.create(dbname)  # Si no existe la crea
    csvFilePath = r'Archivos/data.csv'
    dat = make_json(csvFilePath)
    arr = dat['data']

    datos = {
        'titulo': titulo,
        'descripcion': descripcion,
        'fecha': fecha,
        'data': arr,
        'region': region,
        'comuna': comuna,
        'lendata': dat['lendata'] - 1,
        'temperatura': int(temperatura),
        'horario': horario,
        'altura': altura
    }
    db.save(datos)
    return jsonify('Vuelo agregado.')


@app.route('/deleteVuelos', methods=['POST'])
def deleteVuelos():
    # Recibe datos
    seleccionados = request.values['seleccionados']
    docs = seleccionados.split(",")
    print(docs)
    dbname = 'datos-mpp'
    couch = couchdb.Server()
    couch.resource.credentials = ('admin', 'admin')
    # Conecta con db
    if dbname in couch:
        db = couch[dbname]  # Se conecta a la base de datos
    else:
        db = couch.create(dbname)  # Si no existe la crea
    # Elimina cada documento
    for i in range(0, len(docs)):
        documento = db[docs[i]]
        db.delete(documento)
    return jsonify('Vuelo Eliminado .')


@app.route('/getmpp/<comuna>', methods=['GET'])
def getmpp(comuna):
    datos = []
    couch = couchdb.Server()
    couch.resource.credentials = ('admin', 'admin')
    if 'datos-mpp' in couch:
        db = couch['datos-mpp']
        data = db.find({'selector': {'comuna': comuna},
                        'fields': ['_id', 'titulo', 'fecha', 'data', 'lendata', 'temperatura', 'horario', 'altura']
                        })
    for row in data:
        datos.append({'data': row['data'], '_id': row['_id'], 'titulo': row['titulo'], 'fecha': row['fecha'],
                     'lendata': row['lendata'], 'temperatura': row['temperatura'], 'horario': row['horario'], 'altura': row['altura']})
    return jsonify(datos)


@app.route('/getRegion', methods=['GET'])
def getRegion():
    couch = couchdb.Server()
    couch.resource.credentials = ('admin', 'admin')
    if 'datos-mpp' in couch:
        db = couch['datos-mpp']
        data = db.find({
            "selector": {
                "region": {
                    "$gt": None
                }
            },
            "fields": [
                "region",
                "comuna"
            ]
        })

    datos = []
    for row in data:
        datos.append([row['region'], row['comuna']])
    r = []
    c = []
    for x in datos:
        if x[0] not in r:
            r.append(x[0])
    e = {}
    for c in r:
        aux = []
        for j in datos:
            if c == j[0]:
                if j[1] not in aux:
                    aux.append(j[1])
                e[c] = aux
    req = {
        'datos': e,
    }
    return jsonify(req)


@app.route('/getmppid/<ide>', methods=['GET'])
def getmppid(ide):
    couch = couchdb.Server()
    couch.resource.credentials = ('admin', 'admin')
    if 'datos-mpp' in couch:
        db = couch['datos-mpp']
        data = db.find({'selector': {'_id': ide},
                        'fields': ['data']
                        })
    datos = []
    # print(len(data))
    for row in data:
        datos.append(row['data'])
        # print(len(row['data']))
    # print(datos)
    req = {
        'datos': datos,
        'lendata': len(datos[0])
    }
    return jsonify(req)


@app.route('/getmppidReporte/<ide>', methods=['GET'])
def getmppidSS(ide):
    # print(ide)
    ide = ide.split(",")
    print(ide)
    couch = couchdb.Server()
    couch.resource.credentials = ('admin', 'admin')
    if 'datos-mpp' in couch:
        db = couch['datos-mpp']
        req = []
        for i in ide:
            data = db.find({'selector': {'_id': i},
                            'fields': ['titulo', 'fecha', 'data', 'lendata', 'temperatura', 'horario', 'altura', 'descripcion']
                            })
            datos = []
            # print(len(data))
            for row in data:
                datos.append({'data': row['data'], 'titulo': row['titulo'], 'fecha': row['fecha'],
                     'lendata': row['lendata'], 'temperatura': row['temperatura'], 'horario': row['horario'],'descripcion': row['descripcion'], 'altura': row['altura']})
                # print(len(row['data']))
            # print(datos)
            req.append({
                'datos': datos,
                'lendata': len(datos[0])
            })
        print(req)
    return jsonify(req)


if __name__ == '__main__':
    app.run(debug=True)
