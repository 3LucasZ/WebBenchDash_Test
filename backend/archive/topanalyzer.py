import pandas as pd


inFile = 'backend/top_sites.csv'

df = pd.read_csv(inFile)
counts = df['country_code'].value_counts().sort_values()
for country, count in counts.items():
    if count < 50:
        print(f"{country}: {count}")
print("number of countries tracked:", len(counts))
