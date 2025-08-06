from playwright.sync_api import sync_playwright

from backend.data_collector.utils import wrap_domain


def get_data(domain):
    url = wrap_domain(domain)
    fake_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=fake_user_agent,
            viewport={'width': 1920, 'height': 1080},
            ignore_https_errors=True)
        page = context.new_page()
        try:
            response = page.goto(url, wait_until="domcontentloaded")
            is_https = response.url[:5] == "https"

            security_protocol = "None"
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
                if cookie["domain"] in domain:
                    external_cookies.append(cookie["domain"])

            ret = {"domain": domain,
                   "security_protocol": security_protocol,
                   "is_https": is_https,
                   "is_v6": is_v6,
                   "http_protocol": http_protocol,
                   "3rd_cookies": len(external_cookies),
                   "3rd_cookie_domains": len(set(external_cookies))}
        except Exception as e:
            print(e)
            ret = {"domain": domain,
                   "security_protocol": "none",
                   "is_https": "none",
                   "is_v6": "none",
                   "http_protocol": "none",
                   "3rd_cookies": "none",
                   "3rd_cookie_domains": "none"}
            page.close()
            context.close()
            browser.close()
            return ret


if __name__ == "__main__":
    data = get_data("google.com")
    print(data)
