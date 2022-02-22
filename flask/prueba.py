#import csv
#data = []
#f = open("DATA.csv")
#reader = csv.reader(f)
#for row in reader:
#    if len(row) == 4:
#        data.append(row)

#for r in data:
#    print (r)

import pandas as pd
csv = pd.read_csv("DATA.csv", sep=",")
print (csv)
#print(csv.to_json(orient="records"))
