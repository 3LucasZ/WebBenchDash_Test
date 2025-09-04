from dotenv import load_dotenv
import os
import country_converter as coco

# -- Directories --
# backend project base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# where imported files from external sources are stored
EXTERNAL_DIR = os.path.join(BASE_DIR, "external")
# where intermediate generated datasets are stored
DATA_DIR = os.path.join(BASE_DIR, "data")
# the final files that should be exported to the frontend
OUT_DIR = os.path.join(BASE_DIR, "out")


# -- Constants --
countries = ["USA", "Netherlands", "South Korea",
             "Belgium", "Germany", "Australia"]
countries = ["USA", "Canada"]


COUNTRY_CODES = coco.convert(names=countries, to='ISO2')
COUNTRY_CODES_REAL = []
for filename in os.listdir(os.path.join(EXTERNAL_DIR, "Government_Resources")):
    cc = filename.split("_")[1].split(".")[0]
    COUNTRY_CODES_REAL.append(cc)
NUM_SITES = 20

load_dotenv()
OXYLABS_SERVER = "http://pr.oxylabs.io:7777"
OXYLABS_USERNAME = "webdash"
OXYLABS_PASSWORD = os.getenv("OXYLABS_PASSWORD")
FAKE_USER_AGENT = fake_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
# print("Configuration:")
# print(COUNTRY_CODES_REAL)
# print(COUNTRY_CODES)
# print(NUM_SITES)
# print(BASE_DIR)
# print(EXTERNAL_DIR)
# print(DATA_DIR)
# print(OUT_DIR)
