import csv
import pandas as pd

keywords = [".gov", ".mil", ".gouv", ".gob", ".go"]
inFile = 'backend/top10milliondomains.csv'
outFile = 'backend/gov_sites.csv'

df = pd.read_csv(inFile, usecols=["Domain"])
pattern = '|'.join(["\\"+keyword+"$" for keyword in keywords]+["\\"+keyword+"\\." for keyword in keywords])
print(pattern)
filtered = df[df["Domain"].str.contains(pattern, case=True, na=False)]
gov_sites = filtered["Domain"].tolist()
print(len(gov_sites), "government related websites found")
filtered.to_csv(outFile, index=False)