import json
import random
import pandas as pd
import tldextract
from backend.utils.utils import getProjDir
import country_converter as coco
import csv
from functools import partial
from multiprocessing import Manager, Pool
import multiprocessing
import os
from tqdm import tqdm


def get_unique_domains(sites):
    return list(
        set([tldextract.extract(site).domain + "." + tldextract.extract(site).suffix for site in sites]))


def wrap_domain(domain):
    if "http://" in domain or "https:" in domain:
        return domain
    else:
        return "http://" + domain
# -- Cache builder --


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


def process_and_write(domain_name, get_data, lock, output_file):
    result = get_data(domain_name)
    write_result(lock, output_file, result)


def collect(get_data, domain_names, csv_file, single_threaded=False):
    print("Collecting to:", csv_file)
    existing_domain_names = read_existing_domains(csv_file)
    domain_names = list(set(
        [d for d in domain_names if d not in existing_domain_names]))

    manager = Manager()
    lock = manager.Lock()
    with Pool(processes=1 if single_threaded else multiprocessing.cpu_count()) as pool:
        func = partial(process_and_write, get_data=get_data,
                       lock=lock, output_file=csv_file)
        for _ in tqdm(pool.imap_unordered(func, domain_names),
                      total=len(domain_names)):
            pass
