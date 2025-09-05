from urllib.parse import urlparse
import validators

if __name__ == "__main__":
    uri = "https://css"
    print(urlparse(uri))
    print(validators.url(uri))
