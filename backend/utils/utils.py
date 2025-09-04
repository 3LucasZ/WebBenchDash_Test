import json
import os
from urllib.parse import urlparse

import pandas as pd
import requests
import tldextract

from backend.external.bad_words import BAD_WORDS
from backend.utils.config import DATA_DIR, EXTERNAL_DIR


def is_webpage(uri: str) -> bool:
    """
    Determines if a URI is likely a webpage by checking its file extension against a blacklist.
    """
    # Common file extensions for assets, documents, and other non-HTML resources.
    BLACKLISTED_EXTENSIONS = {
        # Images
        '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
        # Scripts
        '.js', '.json', '.xml',
        # Stylesheets
        '.css',
        # Fonts
        '.woff', '.woff2', '.ttf', '.eot',
        # Documents & Media
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
        '.mp3', '.mp4', '.webm', '.zip', '.rar', '.tar', '.gz'
    }

    try:
        parsed_uri = urlparse(uri)
        # get the file extension from the path
        _, extension = os.path.splitext(parsed_uri.path)
        if extension:
            return extension.lower() not in BLACKLISTED_EXTENSIONS
        return True
    except (ValueError, AttributeError):
        # Potential malformed URIs
        return False


def is_blocklisted(url):
    for word in BAD_WORDS:
        if word in url:
            return True
    blocklist_domains = get_blocklist_domains()
    return tldextract.extract(url).domain in blocklist_domains


def get_blocklist_domains():
    filepath = os.path.join(DATA_DIR, "blocklist_domains.csv")
    if (os.path.exists(filepath)):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except:
            pass
    blocklist = get_blocklist()
    blocklist_domains = []
    for url in blocklist:
        blocklist_domains.append(tldextract.extract(url).domain)
    with open(filepath, 'w') as f:
        json.dump(blocklist_domains, f, indent=4)
    return blocklist_domains


def get_blocklist():
    filepath = os.path.join(EXTERNAL_DIR, "blocklist.json")
    # return blocklist contents if blocklist already exists
    if (os.path.exists(filepath)):
        with open(filepath, 'r') as f:
            return json.load(f)
    # otherwise, download a blocklist and return its contents
    url = "https://raw.githubusercontent.com/mozilla/heatmap/master/pornfilter/domain_blocklist.txt"
    try:
        response = requests.get(url)
        response.raise_for_status()
        blocklist = response.text.splitlines()
        with open(filepath, 'w') as f:
            json.dump(blocklist, f, indent=4)
        return blocklist
    except requests.exceptions.RequestException as e:
        print(f"Error fetching a blocklist: {e}")
        return []


def get_proxy(iso2: str) -> str:
    proxy_file = os.path.join(
        EXTERNAL_DIR, "random-proxy-entry-points-oxylabs-residential.csv")
    df = pd.read_csv(proxy_file)
    matches = df[df['Entry Point:port'].str.startswith(iso2)]
    match = matches.iloc[0]
    return "http://"+match['Entry Point:port']


if __name__ == "__main__":
    print(get_proxy("au"))
