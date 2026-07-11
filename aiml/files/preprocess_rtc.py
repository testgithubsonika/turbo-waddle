"""
Train Ticket Confirmation Probability — Data Preprocessing Pipeline
Dataset: Final_RTC.csv  (30,000 rows × 25 columns)
Target:  Final_Status  (CNF = Confirmed, CAN = Cancelled / Not Confirmed)
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
import warnings
warnings.filterwarnings("ignore")

# ─────────────────────────────────────────────
# 1. LOAD DATA
# ─────────────────────────────────────────────
df = pd.read_csv("Final_RTC.csv")
print(f"✅ Loaded dataset: {df.shape[0]:,} rows × {df.shape[1]} columns")

# ─────────────────────────────────────────────
# 2. DROP USELESS COLUMNS
# ─────────────────────────────────────────────
# Columns dropped and why:
#   Unnamed: 0        — row index duplicate
#   PNR_Number        — unique identifier, zero predictive signal
#   Train_Number      — too high-cardinality; Train_Type captures category
#   Date_of_Journey   — raw date string; Holiday_or_Peak_Season encodes seasonality
#   Booking_Date      — same reasoning; lead-time captured indirectly
#   Source_Station    — too high-cardinality for classification (use if you build a route feature)
#   Destination_Station — same
#   Booking_Status    — leaks target (it IS an early version of Final_Status)
#   Distance          — duplicate of Travel_Distance (scaled version); keep Travel_Distance

DROP_COLS = [
    "Unnamed: 0",
    "PNR_Number",
    "Train_Number",
    "Date_of_Journey",
    "Booking_Date",
    "Source_Station",
    "Destination_Station",
    "Booking_Status",   # ⚠️  target leakage — remove always
    "Distance",         # duplicate of Travel_Distance
]
df.drop(columns=DROP_COLS, inplace=True)
print(f"📌 Kept {df.shape[1]} columns after dropping identifiers / leaky cols")

# ─────────────────────────────────────────────
# 3. HANDLE MISSING VALUES
# ─────────────────────────────────────────────
# Special_Considerations — 9,955 nulls (~33 %)
#   Meaning: passenger has NO special consideration → fill with "None"
df["Special_Considerations"] = df["Special_Considerations"].fillna("None")

# Waitlist_Position — 19,947 nulls (~66 %)
#   Nulls mean the passenger was NOT waitlisted → extract numeric WL number
#   and fill missing with 0 (= no waitlist position)
df["WL_Number"] = (
    df["Waitlist_Position"]
    .str.extract(r"(\d+)")   # pulls digits from "WL086" → "86"
    .astype(float)
    .fillna(0)
    .astype(int)
)
df.drop(columns=["Waitlist_Position"], inplace=True)

# Waiting_Num already carries this info as an integer — keep both as cross-check
# (they should be identical; WL_Number is now cleaner)

print("✅ Missing values handled")
print(df.isnull().sum()[df.isnull().sum() > 0])   # should print nothing

# ─────────────────────────────────────────────
# 4. ENCODE TARGET
# ─────────────────────────────────────────────
# CNF → 1  (confirmed = positive class)
# CAN → 0  (cancelled / not confirmed = negative class)
df["label"] = (df["Final_Status"] == "CNF").astype(int)
df.drop(columns=["Final_Status"], inplace=True)
print(f"\n🎯 Target distribution:\n{df['label'].value_counts().to_string()}")
print(f"   Class balance: {df['label'].mean()*100:.1f}% CNF")

# ─────────────────────────────────────────────
# 5. DEFINE FEATURE SETS
# ─────────────────────────────────────────────

# Numeric features — will be scaled with StandardScaler
NUMERIC_FEATURES = [
    "Travel_Distance",       # distance in km — strong signal
    "Number_of_Stations",    # number of stops — more stops = more seat churn
    "Travel_Time",           # journey duration in hours
    "Seat_Availability",     # seats available at booking time — very strong signal
    "Number_of_Passengers",  # group size
    "WL_Number",             # extracted waitlist position (0 = not waitlisted)
    "Waiting_Num",           # original numeric waitlist field
]

# Categorical features — will be one-hot encoded
#   Current_Status captures RAC / Confirmed / Waitlisted at booking time → important
#   Quota        captures General / Tatkal etc → affects priority
#   Class_of_Travel, Train_Type, Booking_Channel also informative
CATEGORICAL_FEATURES = [
    "Class_of_Travel",          # 1AC / 2AC / 3AC / Sleeper
    "Quota",                    # General / Tatkal / Premium Tatkal / Ladies
    "Current_Status",           # Confirmed / RAC / Waitlisted
    "Age_of_Passengers",        # Adult / Child / Senior Citizen
    "Booking_Channel",          # Counter / Mobile App / IRCTC Website
    "Train_Type",               # Express / Rajdhani / Superfast / Shatabdi
    "Special_Considerations",   # None / Senior Citizen / Defense Quota
    "Holiday_or_Peak_Season",   # Yes / No
]

print(f"\n📊 Feature summary:")
print(f"   Numeric   : {len(NUMERIC_FEATURES)} features")
print(f"   Categorical: {len(CATEGORICAL_FEATURES)} features")

# ─────────────────────────────────────────────
# 6. BUILD FEATURE MATRIX & LABELS
# ─────────────────────────────────────────────
X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
y = df["label"]

# ─────────────────────────────────────────────
# 7. TRAIN / TEST SPLIT (stratified)
# ─────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,          # 80 / 20 split
    random_state=42,
    stratify=y              # preserve CNF / CAN ratio in both splits
)
print(f"\n✂️  Train size: {len(X_train):,}  |  Test size: {len(X_test):,}")
print(f"   Train CNF rate: {y_train.mean()*100:.1f}%  |  Test CNF rate: {y_test.mean()*100:.1f}%")

# ─────────────────────────────────────────────
# 8. PREPROCESSING PIPELINE
# ─────────────────────────────────────────────
numeric_pipeline = Pipeline([
    ("scaler", StandardScaler()),   # zero-mean, unit-variance
])

categorical_pipeline = Pipeline([
    ("ohe", OneHotEncoder(
        handle_unknown="ignore",    # silently ignores unseen categories at test time
        sparse_output=False         # return dense array (easier to inspect)
    )),
])

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_pipeline, NUMERIC_FEATURES),
        ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
    ],
    remainder="drop"   # drops any column not listed above
)

# ─────────────────────────────────────────────
# 9. FIT ON TRAIN, TRANSFORM BOTH SETS
# ─────────────────────────────────────────────
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed  = preprocessor.transform(X_test)

# Recover column names for interpretability
ohe_cols = preprocessor.named_transformers_["cat"]["ohe"].get_feature_names_out(CATEGORICAL_FEATURES).tolist()
all_feature_names = NUMERIC_FEATURES + ohe_cols

print(f"\n🔧 Preprocessing complete")
print(f"   Input features : {X.shape[1]}")
print(f"   Output features: {X_train_processed.shape[1]}  (after one-hot expansion)")

# ─────────────────────────────────────────────
# 10. SAVE PROCESSED SPLITS
# ─────────────────────────────────────────────
# Save as DataFrames for easy downstream use
train_df = pd.DataFrame(X_train_processed, columns=all_feature_names)
train_df["label"] = y_train.values

test_df = pd.DataFrame(X_test_processed, columns=all_feature_names)
test_df["label"] = y_test.values

train_df.to_csv("train_processed.csv", index=False)
test_df.to_csv("test_processed.csv",  index=False)
print("\n💾 Saved:")
print("   → train_processed.csv")
print("   → test_processed.csv")

# ─────────────────────────────────────────────
# 11. QUICK SANITY CHECK
# ─────────────────────────────────────────────
print("\n=== Sanity Check — first 3 numeric features (scaled) ===")
print(pd.DataFrame(X_train_processed[:5, :3], columns=NUMERIC_FEATURES[:3]).round(3).to_string())

print("\n=== One-hot columns generated ===")
for col in ohe_cols:
    print(f"   {col}")

print("\n✅ Preprocessing pipeline ready. Plug X_train_processed / X_test_processed into any sklearn model.")
