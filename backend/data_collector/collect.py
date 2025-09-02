import os

from backend.data_collector import performance, resilience_dns, security

from backend.data_collector import utils
from backend.data_collector.utils import get_gov_sites, get_top_sites, get_unique_domains
from backend.utils import clean_urls, getProjDir


def collect(sites):
    domains = get_unique_domains(sites)
    print("sites:", len(sites),
          "| domains:", len(domains))
    utils.collect(resilience_dns.get_data, domains, os.path.join(
        getProjDir(), 'data', 'resilience_dns.csv'))
    utils.collect(security.get_data, sites, os.path.join(
        getProjDir(), 'data', 'security.csv'))
    utils.collect(performance.get_data, sites, os.path.join(
        getProjDir(), 'data', 'performance.csv'), single_threaded=True)


if __name__ == "__main__":
    gov_sites = get_gov_sites()
    print(len(gov_sites))
    top_sites = get_top_sites()
    print(len(top_sites))
    sites = gov_sites + top_sites
    sites = clean_urls(sites)
    print(len(sites))
    collect(sites)
