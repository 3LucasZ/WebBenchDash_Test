import os
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from backend.utils.utils import getDataDir, getProjDir
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


# --Non-technical dimensions--
# Get and clean internet-usage.csv
it_file = os.path.join(getDataDir(), "internet-usage.csv")
it_df = pd.read_csv(it_file, skiprows=1)
it_df = it_df.sort_values("Year", ascending=False).drop_duplicates(
    subset=['Region/Country/Area'], keep='first')
it_df['alpha_2'] = coco.convert(
    names=it_df['Region/Country/Area'], to='ISO2', not_found=None)


@app.get("/nontech/{country}")
def nontech(country: str):
    country_code = coco.convert(names=[country], to='ISO2')
    hdi_file = os.path.join(getDataDir(), "hdi.xlsx")
    _it_df = it_df[it_df['alpha_2'] ==
                   country_code]
    try:
        it = _it_df.iloc[0]['Value']
    except:
        it = -1
    return {"Internet usage": it}

# Technical dimensions--


@app.get("/resilience-dns/{country}/{subset}")
def resilience_dns(country: str, subset: str):
    return data_endpoint(country, subset, "resilience_dns.csv", use_domains=True)


@app.get("/performance/{country}/{subset}")
def performance(country: str, subset: str):
    return data_endpoint(country, subset, "performance.csv")


@app.get("/security/{country}/{subset}")
def security(country: str, subset: str):
    return data_endpoint(country, subset, "security.csv")


def data_endpoint(country: str, subset: str, csv_filename: str, use_domains=False):
    country_code = coco.convert(names=[country], to='ISO2')
    csv_file = os.path.join(getProjDir(), "data", csv_filename)
    df = pd.read_csv(csv_file)
    categories = df.columns.tolist()
    sites = get_gov_sites(
        country_code) if subset == 'gov' else get_top_sites(country_code)
    if use_domains:
        sites = get_unique_domains(sites)
    # return real data for countries in scope
    if country_code in get_scope_ccs():
        df = df[df["domain"].isin(sites)]
        try:
            df = df[df['bad'] == False]
            df = df.drop(columns=["bad"])
        except:
            pass
        bool_cols = df.columns[df.isin(["True", "False"]).any()]
        df[bool_cols] = df[bool_cols].replace(
            {"True": 1, "False": 0})
        # one hot encode categorical columns
        df_copy = df.copy()
        for column in df_copy.columns:
            if column != "domain" and df_copy[column].dtype == 'object':
                dummies = pd.get_dummies(
                    df_copy[column], prefix=column, dtype=int)
                df = pd.concat([df, dummies], axis=1)
                df.drop(column, axis=1, inplace=True)
        # get means
        means = df.drop(columns=["domain"]).mean().to_dict()
        return means
    # generate fake data for countries not in scope
    else:
        means = {}
        for cat in categories:
            if cat != "domain" and cat != "bad":
                means[cat] = round(hash(country+cat)/2**64 + 0.5, 2)
        return means


if __name__ == "__main__":
    means = resilience_dns("United States", "gov")
    print(means)
