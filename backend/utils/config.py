import os
import country_converter as coco

# Build constants
countries = ["USA", "Netherlands", "South Korea",
             "Belgium", "Germany", "Australia"]
countries = ["USA", "Canada"]

# Constants
COUNTRY_CODES = coco.convert(names=countries, to='ISO2')
NUM_SITES = 20
# backend project base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# where imported files from external sources are stored
EXTERNAL_DIR = os.path.join(BASE_DIR, "external")
# where intermediate generated datasets are stored
DATA_DIR = os.path.join(BASE_DIR, "data")
# the final csv files that should be exported to the frontend
OUT_DIR = os.path.join(BASE_DIR, "out")
print("Configuration:")
print(COUNTRY_CODES)
print(NUM_SITES)
print(BASE_DIR)
print(EXTERNAL_DIR)
print(DATA_DIR)
print(OUT_DIR)
