import json
import os
import random

import tldextract
from backend.data_collector import resilience_dns
import country_converter as coco
from urllib.parse import urlparse

from backend.data_collector.utils import get_gov_sites, get_top_sites, get_unique_domains
from backend.utils import getProjDir


def collect(sites):
    domains = get_unique_domains(sites)
    print("sites:", len(sites),
          "domains:", len(domains))
    resilience_dns.collect(domains, os.path.join(
        getProjDir(), 'data', 'resilience_dns.csv'))


if __name__ == "__main__":
    gov_sites = get_gov_sites()
    print(len(gov_sites))
    top_sites = get_top_sites()
    print(len(top_sites))
    sites = gov_sites + top_sites
    collect(sites)
