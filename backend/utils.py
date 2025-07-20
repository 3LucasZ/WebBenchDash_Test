import os


def getProjDir():
    return os.path.dirname(os.path.abspath(__file__))


def getDataDir():
    return os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets")
