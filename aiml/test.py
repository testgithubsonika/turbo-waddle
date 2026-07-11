import joblib

try:
    features = joblib.load("rtc_feature_names.pkl")
    print("Loaded features:", features)
except Exception as e:
    print("Error:", e)
