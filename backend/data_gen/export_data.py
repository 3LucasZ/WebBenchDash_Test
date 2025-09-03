import json
import os
from backend.utils.config import COUNTRY_CODES_REAL, OUT_DIR


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
    # export country codes in scope
    with open(os.path.join(OUT_DIR, "country_codes.json"), 'w') as f:
        json.dump(COUNTRY_CODES_REAL, f, indent=4)
    # export dataset
