# ai_service/main.py
from pathlib import Path
import warnings
from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict, Field
from typing import List
import joblib
import numpy as np
import pandas as pd

warnings.filterwarnings("ignore", message=".*If you are loading a serialized model.*", category=UserWarning)

try:
    import xgboost as xgb
except ImportError:
    xgb = None

app = FastAPI(title="RTC Prediction Service")

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "rtc_model.pkl"
MODEL_JSON_PATH = BASE_DIR / "rtc_model.json"
FEATURE_NAMES_PATH = BASE_DIR / "rtc_feature_names.pkl"
THRESHOLD_PATH = BASE_DIR / "rtc_threshold.pkl"


def load_model_artifact():
    if xgb is not None and MODEL_JSON_PATH.exists():
        model = xgb.XGBClassifier()
        model.load_model(str(MODEL_JSON_PATH))
        return model

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model artifact not found: {MODEL_PATH}")

    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", message=".*If you are loading a serialized model.*", category=UserWarning)
        model = joblib.load(MODEL_PATH)

    if xgb is not None and hasattr(model, "save_model") and not MODEL_JSON_PATH.exists():
        try:
            model.save_model(str(MODEL_JSON_PATH))
        except Exception as exc:
            print(f"⚠️ Could not export model to JSON: {exc}")

    return model


model = load_model_artifact()
feature_names = joblib.load(FEATURE_NAMES_PATH)
threshold = joblib.load(THRESHOLD_PATH)

# Database values
CLASS_OPTIONS = ["Sleeper", "3A", "2A", "CC"]

QUOTA_OPTIONS = ["GN", "TATKAL", "PT", "Ladies"]

STATUS_OPTIONS = ["CNF", "RAC", "WL"]

TRAIN_CATEGORY_OPTIONS = [
    "EXPRESS",
    "RAJDHANI",
    "SHATABDI",
    "PASSENGER"
]

class PredictRequest(BaseModel):
    class_: str = Field(alias="class")
    quota: str
    wl_used: int
    available_seats: int
    current_status: str
    train_category: str

    model_config = ConfigDict(populate_by_name=True)


class PredictResponse(BaseModel):
    probability: float


def build_feature_row(req):

    row = {
        "available_seats": req.get("available_seats", 0),
        "wl_used": req.get("wl_used", 0),
    }

    # Class
    for c in CLASS_OPTIONS:
        row[f"class_type_{c}"] = int(req.get("class") == c)

    # Quota
    for q in QUOTA_OPTIONS:
        row[f"quota_{q}"] = int(req.get("quota") == q)

    # Status
    for s in STATUS_OPTIONS:
        row[f"current_status_{s}"] = int(
            req.get("current_status") == s
        )

    # Train Category
    for t in TRAIN_CATEGORY_OPTIONS:
        row[f"train_category_{t}"] = int(
            req.get("train_category") == t
        )

    df = pd.DataFrame([row])

    df = df.reindex(columns=feature_names, fill_value=0)

    return df


@app.post("/predict-batch", response_model=List[PredictResponse])
def predict_batch(requests: List[PredictRequest]):
    if not requests:
        return []

    rows = [
        build_feature_row(
            req.model_dump(by_alias=True)
        )
        for req in requests
    ]
    X = pd.concat(rows, ignore_index=True)

    probs = model.predict_proba(X.values)[:, 1]

    return [{"probability": round(float(p) * 100, 2)} for p in probs]


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}