import csv
import json
import os
import random


import pandas as pd
import tldextract

from backend.utils import getProjDir
import country_converter as coco

countries = ["USA", "Netherlands", "South Korea",
             "Belgium", "Germany", "Australia"]
countries = ["USA", "Canada", "Australia"]
country_codes = coco.convert(names=countries, to='ISO2')


def get_scope_countries():
    return countries


def get_scope_ccs():
    return country_codes


def get_top_sites(target_cc=None):
    def helper(target_cc):
        inFile = os.path.join(getProjDir(), 'top_sites.csv')
        df = pd.read_csv(inFile)
        df = df[df["country_code"] == target_cc.lower()]
        top_sites = df["origin"].sample(
            n=min(df.shape[0], 50), random_state=42)
        return top_sites
    if target_cc is None:
        ret = []
        for cc in country_codes:
            ret.extend(helper(cc))
        return ret
    else:
        return helper(target_cc)


def get_gov_sites(target_cc=None):
    def helper(target_cc):
        gov_path = os.path.join(getProjDir(), "data_collector", "Government_Resources", 'govtResources_' +
                                target_cc.upper()+".json")
        with open(gov_path, 'r') as file:
            gov_sites = json.load(file)
        random.seed(42)
        gov_sites = random.sample(gov_sites, min(50, len(gov_sites)))
        return gov_sites
    if target_cc is None:
        ret = []
        for cc in country_codes:
            ret.extend(helper(cc))
        return ret
    else:
        return helper(target_cc)


def get_unique_domains(sites):
    return list(
        set([tldextract.extract(site).domain + "." + tldextract.extract(site).suffix for site in sites]))


def read_existing_domains(csv_file, domain_col_index=0):
    existing_domains = set()
    try:
        with open(csv_file, newline='') as f:
            reader = csv.reader(f)
            for row in reader:
                if row:
                    existing_domains.add(row[domain_col_index])
    except FileNotFoundError:
        # File does not exist yet, so no existing domains
        pass
    return existing_domains


def write_result(lock, output_file, result):
    with lock:
        file_exists = os.path.exists(output_file)
        with open(output_file, 'a', newline='') as f:
            fieldnames = result.keys()
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            if not file_exists:
                writer.writeheader()
            writer.writerow(result)
