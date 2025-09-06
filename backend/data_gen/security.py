from playwright.sync_api import sync_playwright

from backend.data_gen.utils import wrap_domain
from backend.utils.config import FAKE_USER_AGENT, OXYLABS_PASSWORD, OXYLABS_USERNAME
from backend.utils.utils import get_proxy
# https://developers.oxylabs.io/proxies/residential-proxies/location-settings/select-country


def get_data(cc, url, verbose=False):
    try:
        with sync_playwright() as playwright:
            proxy = {
                "server": get_proxy(cc),
                "username": OXYLABS_USERNAME,
                "password": OXYLABS_PASSWORD
            }
            print(proxy)
            browser = playwright.chromium.launch(headless=True, proxy=proxy)
            context = browser.new_context(
                user_agent=FAKE_USER_AGENT,
                viewport={'width': 1920, 'height': 1080},
                ignore_https_errors=True)
            page = context.new_page()

            response = page.goto(url, wait_until="domcontentloaded")
            is_https = response.url[:5] == "https"

            security_protocol = "none"
            if is_https:
                security = response.security_details()
                security_protocol = security["protocol"]

            ip = response.server_addr()["ipAddress"]
            is_v6 = ":" in ip

            page.wait_for_timeout(250)  # give js some time to evaluate
            http_protocol = page.evaluate(
                "() => performance.getEntries()[0].nextHopProtocol")
            page.wait_for_timeout(750)  # give js some time to evaluate

            cookies = context.cookies()
            external_cookies = []
            for cookie in cookies:
                if cookie["domain"] in url:
                    external_cookies.append(cookie["domain"])

            ret = {"bad": False,
                   "security_protocol": security_protocol,
                   "is_https": is_https,
                   "is_IPv6": is_v6,
                   "http_protocol": http_protocol,
                   "3rd_cookies": len(external_cookies),
                   "3rd_cookie_domains": len(set(external_cookies)),
                   "bad": False}
            page.close()
            context.close()
            browser.close()
    except Exception as e:
        print(e)
        ret = {"bad": True,
               "security_protocol": "",
               "is_https": False,
               "is_IPv6": False,
               "http_protocol": "",
               "3rd_cookies": 0,
               "3rd_cookie_domains": 0,
               }
    finally:
        if verbose:
            print(ret)
        return ret


if __name__ == "__main__":
    data = get_data("us", "https://www.reddit.com/")
    print(data)
