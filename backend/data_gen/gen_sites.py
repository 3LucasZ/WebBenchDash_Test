import csv
import json
import os
from urllib.parse import urlparse
import pandas as pd
from backend.utils.config import COUNTRY_CODES, DATA_DIR, EXTERNAL_DIR, NUM_SITES
from backend.utils.utils import is_blocklisted, is_webpage


def get_gov_sites(target_cc, num_sites):
    """
    Return first N gov websites from cc that are valid webpages and not blocklisted
    """
    gov_path = os.path.join(EXTERNAL_DIR, "Government_Resources", 'govtResources_' +
                            target_cc.upper()+".json")
    with open(gov_path, 'r') as file:
        gov_sites = json.load(file)
    gov_sites = set([urlparse(uri).scheme+"://" +
                    urlparse(uri).netloc for uri in gov_sites])
    # Filter
    gov_sites = [site for site in gov_sites if is_webpage(
        site) and not is_blocklisted(site)]
    # Return
    if (num_sites > len(gov_sites)):
        return gov_sites
    else:
        return gov_sites[:num_sites]


def get_top_sites(target_cc, num_sites):
    """
    Return first N top websites from cc that are valid webpages and not blocklisted
    """
    inFile = os.path.join(EXTERNAL_DIR, 'crux_top_sites.csv')
    df = pd.read_csv(inFile)
    df = df[df["country_code"] == target_cc.lower()]
    top_sites = set(df["origin"].to_list())
    # Filter
    top_sites = [site for site in top_sites if is_webpage(
        site) and not is_blocklisted(site)]
    # Return
    if (num_sites > len(top_sites)):
        return top_sites
    else:
        return top_sites[:num_sites]


def clear_sites(csv_path):
    if os.path.exists(csv_path):
        os.remove(csv_path)


def put_sites(country_code, sites, csv_path):
    try:
        with open(csv_path, mode='a', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)
            for site in sites:
                writer.writerow([country_code, site])
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    clear_sites(os.path.join(DATA_DIR, "gov_sites.csv"))
    clear_sites(os.path.join(DATA_DIR, "top_sites.csv"))
    for country_code in COUNTRY_CODES:
        country_gov_sites = get_gov_sites(country_code, NUM_SITES)
        put_sites(country_code, country_gov_sites,
                  os.path.join(DATA_DIR, "gov_sites.csv"))
        country_top_sites = get_top_sites(country_code, NUM_SITES)
        put_sites(country_code, country_top_sites,
                  os.path.join(DATA_DIR, "top_sites.csv"))
