import csv
import json
import pandas as pd


# Function to convert a CSV to JSON
# Takes the file paths as arguments
def make_json(csvFilePath):
    
    # create a dictionary
    data = {}
    
    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        cont = 0
        for rows in csvReader:
            if (rows['lat'] == '0') or (rows['lon'] == '0') or (rows['mp25'] == "") or (rows['mp10'] == "") or (rows['mp25'] == '0') or (rows['mp10'] == '0'):
               continue
            rows['No'] = cont
            key = rows['No']
            data[key] = rows
            cont = cont + 1
            print(rows)
    return data
    
    
        
# Driver Code

# Decide the two file paths according to your
# computer system
csvFilePath = r'C:\Users\amard\OneDrive\Escritorio\mediciones en pucón\DATA.csv'

# Call the make_json function


dat = make_json(csvFilePath)
# sensor = 
# for i in dat:
#     #print(dat[i]['lon'])
# #    if (dat[i]['lat'] == "0") or (dat[i]['lon'] == "0") or (dat[i]['mp25'] == "None") or (dat[i]['mp10'] == "None") or (dat[i]['mp25'] == "0") or (dat[i]['mp10'] == "0"):
# #        #print("hola")
# #        dat.pop(i)
#     print(dat[i]['lat'])
       
# print(dat)
# print(len(dat))
