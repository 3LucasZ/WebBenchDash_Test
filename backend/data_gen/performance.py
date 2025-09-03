import asyncio
import json
import subprocess
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright


def get_data(url, verbose=False):
    port = 9222
    ret = {"domain": url, "bad": True}
    keys = ["speed_index", "ttfb", "num_objects",
            "sz_objects", "num_js_objects", "servers", "origins"]
    for key in keys:
        ret[key] = 0
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                # headless=False,
                args=[f"--remote-debugging-port={port}"]
            )
            command_args = [
                "lighthouse",
                url,
                f"--port={port}",
                "--output=json",
                "--output-path=stdout",
                "--only-categories=performance",
            ]

            # Run the command in a new shell process
            proc = subprocess.Popen(
                command_args,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )

            # Wait for the command to finish and capture the output
            stdout, stderr = proc.communicate()

            if proc.returncode != 0:
                if verbose:
                    print("Lighthouse failed with error:")
                    print(stderr.decode())
                raise Exception("Lighthouse failed")

            report = json.loads(stdout)

            # milliseconds
            ret["speed_index"] = round(
                report["audits"]["speed-index"]["numericValue"])
            # milliseconds
            ret["ttfb"] = round(
                report["audits"]["server-response-time"]["numericValue"])
            resources = report["audits"]["resource-summary"]["details"]["items"]
            for item in resources:
                if item["resourceType"] == "total":
                    ret["num_objects"] = item["requestCount"]
                    # bytes
                    ret["sz_objects"] = item["transferSize"]
                elif item["resourceType"] == "script":
                    ret["num_js_objects"] = item["requestCount"]
            requests = report["audits"]["network-requests"]["details"]["items"]
            req_urls = [request["url"] for request in requests]
            servers = set()
            origins = set()
            for req in req_urls:
                parsed_url = urlparse(req)
                if parsed_url.hostname:
                    servers.add(parsed_url.hostname)
                    origin = (parsed_url.scheme,
                              parsed_url.hostname, parsed_url.port)
                    origins.add(origin)
            ret["servers"] = len(servers)
            ret["origins"] = len(origins)
            ret["bad"] = False
            if verbose:
                print("--- Performance Results ---")
                print(ret)
                print("-------------------------")

            # The full JSON report is available in the 'report' variable
            # You could save it to a file if needed:
            # with open("lighthouse-report.json", "w") as f:
            #     json.dump(report, f, indent=2)
    finally:
        # browser.close()
        return ret


if __name__ == "__main__":
    get_data("https://google.com", True)
    get_data("https://google.com", True)
