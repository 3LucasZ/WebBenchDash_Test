import pandas as pd

from backend.ccmap import ccmap


inFile = 'backend/gov_sites.csv'

df = pd.read_csv(inFile, usecols=["Domain"])
def get_country(domain):
    tld = '.' + domain.split('.')[-1].lower()
    return ccmap.get(tld, 'N/A')
df['Country'] = df['Domain'].apply(get_country)

# Perform analysis
# Get the counts of each country
country_frequencies = df['Country'].value_counts()
print("Frequency of each country:")
for country, frequency in country_frequencies.items():
    print(f"{country}: {frequency}")

# Get the first website for each country
first_websites = df.groupby('Country')['Domain'].first()
print("First website for each country:")
for country, domain in first_websites.items():
    print(f"{country}: {domain}")

print("Countries discovered:", len(country_frequencies), "out of", len(ccmap))