import os
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from backend.data_collector.utils import get_gov_sites, get_scope_ccs, get_top_sites, get_unique_domains
from backend.utils import getProjDir
import country_converter as coco

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/clusters/{country}")
def getClusters(country: str):
    N = 25
    clusters = {
        f"C{i+1}": round(25*(hash(country+str(i))/2**64 + 0.5)) for i in range(N)}
    return clusters


@app.get("/percentiles/{country}")
def getPercentiles(country: str):
    categories = ["Req size", "Req num", "CDN", "NS", "Mem"]
    percentiles = {}
    for cat in categories:
        percentiles[cat] = hash(country+cat)/2**64 + 0.5
    return percentiles

# Web performance


@app.get("/performance/{country}/{subset}")
def performance(country: str, subset: str):
    country_code = coco.convert(names=[country], to='ISO2')
    csv_file = os.path.join(getProjDir(), "data", "resilience_dns.csv")
    df = pd.read_csv(csv_file)
    categories = df.columns.tolist()
    sites = get_gov_sites(
        country_code) if subset == 'gov' else get_top_sites(country_code)
    domains = get_unique_domains(sites)
    if country_code in get_scope_ccs():
        filtered = df[df["domain"].isin(domains)]
        bool_cols = filtered.columns[filtered.isin(["True", "False"]).any()]
        filtered[bool_cols] = filtered[bool_cols].replace(
            {"True": 1, "False": 0})
        means = filtered.drop(columns=["domain"]).mean().to_dict()
        return means
    else:
        means = {}
        for cat in categories:
            if cat != "domain":
                means[cat] = round(hash(country+cat)/2**64 + 0.5, 2)
        return means

# DNS resilience


@app.get("/resilience-dns/{country}/{subset}")
def resilience_dns(country: str, subset: str):
    country_code = coco.convert(names=[country], to='ISO2')
    csv_file = os.path.join(getProjDir(), "data", "resilience_dns.csv")
    df = pd.read_csv(csv_file)
    categories = df.columns.tolist()
    sites = get_gov_sites(
        country_code) if subset == 'gov' else get_top_sites(country_code)
    domains = get_unique_domains(sites)
    if country_code in get_scope_ccs():
        filtered = df[df["domain"].isin(domains)]
        bool_cols = filtered.columns[filtered.isin(["True", "False"]).any()]
        filtered[bool_cols] = filtered[bool_cols].replace(
            {"True": 1, "False": 0})
        means = filtered.drop(columns=["domain"]).mean().to_dict()
        return means
    else:
        means = {}
        for cat in categories:
            if cat != "domain":
                means[cat] = round(hash(country+cat)/2**64 + 0.5, 2)
        return means


if __name__ == "__main__":
    means = resilience_dns("United States", "gov")
    print(means)
