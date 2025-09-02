import os

from backend.data_collector import performance, resilience_dns, security

from backend.data_collector import utils
from backend.data_collector.utils import COUNTRY_CODES, NUM_SITES, get_gov_sites, get_top_sites, get_unique_domains
from backend.utils import remove_blocklist_urls, getProjDir


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
    work_queue = []
    for country_code in COUNTRY_CODES:
        country_gov_sites = get_gov_sites(NUM_SITES)
        country_top_sites = get_top_sites(NUM_SITES)
        work_queue.extend([(country_code, site)
                          for site in country_gov_sites + country_top_sites])
    collect(work_queue)
