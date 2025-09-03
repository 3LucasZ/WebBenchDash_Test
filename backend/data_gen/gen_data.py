import os


from backend.data_gen import performance, resilience_dns, security
from backend.data_gen import utils
from backend.utils.config import COUNTRY_CODES, DATA_DIR, NUM_SITES
import pandas as pd


def get_json_for_wqe(wqe, get_json_for_url):
    # get_json_for_url works on urls, transform it to work on work_queue elements
    country_code, isGov, url = wqe
    return {"url": url, "cc": country_code, "gov": isGov, **get_json_for_url(url)}


def generate_data(work_queue):
    utils.collect(resilience_dns.get_data, work_queue, os.path.join(
        DATA_DIR, 'resilience_dns.csv'))
    utils.collect(security.get_data, work_queue, os.path.join(
        DATA_DIR, 'security.csv'))
    utils.collect(performance.get_data, work_queue, os.path.join(
        DATA_DIR, 'performance.csv'), single_threaded=True)


if __name__ == "__main__":
    work_queue = []
    df = pd.read_csv(os.path.join(DATA_DIR, "sites.csv"))
    work_queue = df.values.tolist()
    generate_data(work_queue)
