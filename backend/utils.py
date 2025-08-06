import json
import os

import requests


def getProjDir():
    return os.path.dirname(os.path.abspath(__file__))


def getDataDir():
    return os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets")


def clean_urls(domains):
    domain_blocklist = get_block_list()
    return [domain for domain in domains if domain not in domain_blocklist]


def get_block_list():
    filepath = os.path.join(getProjDir(), "blocklist.json")
    if (os.path.exists(filepath)):
        with open(filepath, 'r') as f:
            return json.load(f)
    url = "https://raw.githubusercontent.com/mozilla/heatmap/master/pornfilter/domain_blocklist.txt"
    try:
        response = requests.get(url)
        response.raise_for_status()
        blocklist = response.text.splitlines()
        print(
            f"✅ Successfully fetched and created a blocklist ({len(blocklist)} domains).")
        with open(filepath, 'w') as f:
            json.dump(blocklist, f, indent=4)
        return blocklist

    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching the list: {e}")
        return []
