from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    clusters = {f"C{i+1}": round(25*(hash(country+str(i))/2**64 + 0.5)) for i in range(N)}
    return clusters


@app.get("/percentiles/{country}")
def getPercentiles(country: str):
    categories = ["Req size", "Req num", "CDN", "NS", "Mem"]
    percentiles = {}
    for cat in categories:
        percentiles[cat] = hash(country+cat)/2**64 + 0.5
    return percentiles