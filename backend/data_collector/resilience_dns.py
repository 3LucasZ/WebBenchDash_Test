import csv
from functools import partial
import ipaddress
from multiprocessing import Lock, Manager, Pool
import multiprocessing
import os
import socket
import dns.resolver
from tqdm import tqdm

from backend.data_collector.utils import read_existing_domains, write_result
from backend.utils import getProjDir

# for reference only if you want to download the list!
# ipv4_anycast_list_url = "https://raw.githubusercontent.com/bgptools/anycast-prefixes/refs/heads/master/anycatch-v4-prefixes.txt"
# ipv6_anycast_list_url = "https://raw.githubusercontent.com/bgptools/anycast-prefixes/refs/heads/master/anycatch-v6-prefixes.txt"
ipv4_anycast_list_path = os.path.join(
    getProjDir(), "data_collector", "anycatch-v4-prefixes.txt")
ipv6_anycast_list_path = os.path.join(
    getProjDir(), "data_collector", "anycatch-v6-prefixes.txt")

with open(ipv4_anycast_list_path, 'r') as f:
    ipv4_anycast_prefixes = [ipaddress.ip_network(
        line.strip()) for line in f if line.strip() and not line.startswith('#')]
with open(ipv6_anycast_list_path, 'r') as f:
    ipv6_anycast_prefixes = [ipaddress.ip_network(
        line.strip()) for line in f if line.strip() and not line.startswith('#')]


def is_anycast(ip_str, ipv6=False):
    ip_obj = ipaddress.ip_address(ip_str)
    prefixes = ipv6_anycast_prefixes if ipv6 else ipv4_anycast_prefixes
    return any(ip_obj in prefix for prefix in prefixes)


def get_ips(domain):
    try:
        a_records = dns.resolver.resolve(domain, 'A')
        ipv4 = [ip.address for ip in a_records]
    except:
        ipv4 = []
    try:
        aaaa_records = dns.resolver.resolve(domain, 'AAAA')
        ipv6 = [ip.address for ip in aaaa_records]
    except:
        ipv6 = []
    return ipv4, ipv6


def get_nameservers(domain, recursion_counter=0):
    if recursion_counter > 5:
        return []
    try:
        answers = dns.resolver.resolve(domain, 'NS')
        nameservers = []
        for rdata in answers:
            ns = str(rdata.target).rstrip('.')
            ipv4, ipv6 = get_ips(ns)
            nameservers.append((ns, ipv4, ipv6))
        return nameservers
    except:
        try:
            answers = dns.resolver.resolve(domain, "CNAME")
            for rdata in answers:
                cname = rdata.target.rstrip(".")
                print(cname)
                return get_nameservers(cname, recursion_counter=recursion_counter+1)
        except:
            return []


def get_asn_info(ip):
    query = f" -v {ip}\n"
    server = "whois.cymru.com"
    port = 43

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((server, port))
        s.sendall(query.encode())
        response = b""
        while True:
            data = s.recv(4096)
            if not data:
                break
            response += data

    lines = response.decode().strip().splitlines()
    if len(lines) < 2:
        return None
    fields = [field.strip() for field in lines[1].split("|")]

    return {
        "asn": fields[0],
        "ip": fields[1],
        "prefix": fields[2],
        "country": fields[3],
        "registry": fields[4],
        "allocated": fields[5],
        "as_name": fields[6],
    }


def test(domain_name):
    nameservers = get_nameservers(domain_name)
    print(f"Nameservers for {domain_name}:", nameservers)
    # collect IPv4 addresses
    ipv4s = set()
    for nameserver in nameservers:
        ipv4s.update(nameserver[1])
    print("Namserver IPv4s:", ipv4s)
    print([f"anycast: {is_anycast(ip)}" for ip in ipv4s])
    # collect IPv6 addresses
    ipv6s = set()
    for nameserver in nameservers:
        ipv6s.update(nameserver[2])
    print("Nameserver IPv6s:", ipv6s)
    # collect ASNs from IPv4s
    asns = set()
    for ipv4 in ipv4s:
        info = get_asn_info(ipv4)
        print(info)
        asns.add(info["asn"])
    print("Nameserver ASNs:", asns)


def get_data(domain_name):
    nameservers = get_nameservers(domain_name)
    # collect IPv4 addresses
    ipv4s = set()
    for nameserver in nameservers:
        ipv4s.update(nameserver[1])
    # collect IPv6 addresses
    ipv6s = set()
    for nameserver in nameservers:
        ipv6s.update(nameserver[2])
    # check for anycast
    ipv4_anycast = any([is_anycast(ip, False) for ip in ipv4s])
    ipv6_anycast = any([is_anycast(ip, True) for ip in ipv6s])
    # collect ASNs from IPv4s
    asns = set()
    for ipv4 in ipv4s:
        info = get_asn_info(ipv4)
        asns.add(info["asn"])
    return {"domain": domain_name,
            "AS spread": len(asns),
            "ipv4 anycast": ipv4_anycast,
            "ipv6 anycast": ipv6_anycast,
            "ipv4s": len(ipv4s),
            "ipv6s": len(ipv6s)}


def process_and_write(domain_name, lock, output_file):
    result = get_data(domain_name)
    write_result(lock, output_file, result)


def collect(domain_names, csv_file):
    existing_domain_names = read_existing_domains(csv_file)
    domain_names = [d for d in domain_names if d not in existing_domain_names]

    manager = Manager()
    lock = manager.Lock()
    with Pool(processes=multiprocessing.cpu_count()) as pool:
        func = partial(process_and_write, lock=lock, output_file=csv_file)
        for _ in tqdm(pool.imap_unordered(func, domain_names),
                      total=len(domain_names)):
            pass


if __name__ == "__main__":
    # test("www.usa.gov")
    test("www.usa.gov.external-domains-production.cloud.gov")
    # urls = ["www.usa.gov"]
    # for url in urls:
    #     print(url, get_data(url))
