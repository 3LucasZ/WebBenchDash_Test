import ipaddress
import os
import socket
import dns.resolver

from backend.utils.config import EXTERNAL_DIR


# for reference only if you want to download the list!
# ipv4_anycast_list_url = "https://raw.githubusercontent.com/bgptools/anycast-prefixes/refs/heads/master/anycatch-v4-prefixes.txt"
# ipv6_anycast_list_url = "https://raw.githubusercontent.com/bgptools/anycast-prefixes/refs/heads/master/anycatch-v6-prefixes.txt"
ipv4_anycast_list_path = os.path.join(
    EXTERNAL_DIR, "anycatch-v4-prefixes.txt")
ipv6_anycast_list_path = os.path.join(
    EXTERNAL_DIR, "anycatch-v6-prefixes.txt")

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


def get_data(domain_name, verbose=False):
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
    ret = {
        "bad": False,
        "AS spread": len(asns),
        "ipv4 anycast": ipv4_anycast,
        "ipv6 anycast": ipv6_anycast,
        "ipv4s": len(ipv4s),
        "ipv6s": len(ipv6s)}
    if verbose:
        print(ret)
    return ret


if __name__ == "__main__":
    get_data("www.usa.gov.external-domains-production.cloud.gov", verbose=True)
