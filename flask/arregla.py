import csv
for i in range(21,22):
    with open("C:/Users/amard/OneDrive/Escritorio/vuelos final/vuelos/vuelo"+str(i)+".csv") as csv_file:
        with open("C:/Users/amard/OneDrive/Escritorio/vuelos final/vuelos/vuelo"+str(i)+"_out.CSV", "w") as out_file:
            for row in csv.reader(csv_file, delimiter=';'):
                textLat = row[1].replace('.', '')
                textLat = textLat[:3]+"."+textLat[3:]
                textLon = row[2].replace('.', '')
                textLon = textLon[:3]+"."+textLon[3:]
                row[1] = textLat
                row[2] = textLon
                csv.writer(out_file).writerow(row)