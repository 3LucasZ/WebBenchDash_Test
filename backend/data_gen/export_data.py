import json
import os

import pandas as pd
from backend.utils.config import COUNTRY_CODES_REAL, DATA_DIR, OUT_DIR


def summarize(csv_filenames, verbose=False) -> pd.DataFrame:
    # combine all the csv files into one big csv
    merged_df = None
    for csv_filename in csv_filenames:
        csv_file = os.path.join(DATA_DIR, csv_filename)
        df = pd.read_csv(csv_file)
        if merged_df is None:
            merged_df = df
        else:
            merged_df = pd.merge(merged_df, df, on=[
                                 'cc', 'gov', 'url', 'bad'], how='inner')
    df = merged_df
    # print(df)
    df = df[df['bad'] == False].drop(columns=['bad'])
    # print(df)

    # boolean columns are turned into 0 or 1
    bool_cols = df.columns[df.isin([True, False]).any()]
    df[bool_cols] = df[bool_cols].replace(
        {True: 1, False: 0})

    # one hot encode categorical columns
    df_copy = df.copy()
    for column in df_copy.columns:
        if column not in ["url", 'cc', 'gov'] and df_copy[column].dtype == 'object':
            dummies = pd.get_dummies(
                df_copy[column], prefix=column, dtype=int)
            df = pd.concat([df, dummies], axis=1)
            df.drop(column, axis=1, inplace=True)

    # get means
    means = df.drop(columns=["url"]).groupby(['cc', 'gov']).mean()
    if verbose:
        print(means)
    return means


if __name__ == "__main__":
    # export country codes in scope
    with open(os.path.join(OUT_DIR, "country_codes.json"), 'w') as f:
        json.dump(COUNTRY_CODES_REAL, f, indent=4)
    # export dataset
    df = summarize(["resilience_dns.csv", "performance.csv",
                    "security.csv"])
    df.to_csv(os.path.join(OUT_DIR, "dataset.csv"))
