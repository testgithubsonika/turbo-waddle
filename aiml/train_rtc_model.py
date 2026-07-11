"""
Train Ticket Confirmation (RTC) — Model Training & Evaluation Script
======================================================================
Input  : train_processed.csv  (24,000 rows, already scaled + one-hot encoded)
         test_processed.csv   (6,000  rows)
Output : rtc_model.pkl        — best trained model (XGBoost)
         rtc_feature_names.pkl — ordered list of feature names
         rtc_threshold.pkl    — optimal decision threshold (from ROC)

Predictions this model returns
  → model.predict_proba(X)[:, 1]   # confirmation probability ∈ [0, 1]
  → model.predict(X)               # 0 = CAN, 1 = CNF  (at optimal threshold)

Usage from an API
-----------------
  import joblib, numpy as np
  model    = joblib.load("rtc_model.pkl")
  features = joblib.load("rtc_feature_names.pkl")
  threshold = joblib.load("rtc_threshold.pkl")

  prob = model.predict_proba(input_df[features])[:, 1]
  pred = (prob >= threshold).astype(int)
"""

import pandas as pd
import numpy as np
import joblib
import warnings
warnings.filterwarnings("ignore")

from sklearn.linear_model    import LogisticRegression
from sklearn.ensemble        import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics         import (
    accuracy_score, roc_auc_score, classification_report,
    confusion_matrix, average_precision_score, roc_curve
)

# Try importing XGBoost; fall back gracefully if not installed
try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    HAS_XGB = False
    print("⚠️  XGBoost not found — skipping XGB model. Install with: pip install xgboost")

# ─────────────────────────────────────────────────────────────────────
# 1. LOAD PROCESSED DATA
# ─────────────────────────────────────────────────────────────────────
print("=" * 65)
print(" RTC CONFIRMATION PROBABILITY — MODEL TRAINING")
print("=" * 65)

train_df = pd.read_csv("train_processed.csv")
test_df  = pd.read_csv("test_processed.csv")

FEATURE_COLS = [c for c in train_df.columns if c != "label"]
LABEL_COL    = "label"

X_train = train_df[FEATURE_COLS].values
y_train = train_df[LABEL_COL].values
X_test  = test_df[FEATURE_COLS].values
y_test  = test_df[LABEL_COL].values

print(f"\n📦 Train : {X_train.shape[0]:,} rows × {X_train.shape[1]} features")
print(f"📦 Test  : {X_test.shape[0]:,}  rows × {X_test.shape[1]} features")
print(f"🎯 CNF rate — Train: {y_train.mean()*100:.1f}%  |  Test: {y_test.mean()*100:.1f}%")

# ─────────────────────────────────────────────────────────────────────
# 2. DEFINE CANDIDATE MODELS
# ─────────────────────────────────────────────────────────────────────
MODELS = {
    "Logistic Regression": LogisticRegression(
        max_iter=1000,
        C=1.0,
        solver="lbfgs",
        random_state=42
    ),
    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=5,
        class_weight="balanced",   # handles slight imbalance
        random_state=42,
        n_jobs=-1
    ),
    "Gradient Boosting": GradientBoostingClassifier(
        n_estimators=200,
        learning_rate=0.1,
        max_depth=5,
        subsample=0.8,
        random_state=42
    ),
}

if HAS_XGB:
    # scale_pos_weight handles class imbalance; value = count(0)/count(1)
    neg, pos   = np.bincount(y_train)
    spw        = neg / pos
    MODELS["XGBoost"] = XGBClassifier(
        n_estimators=400,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=spw,
        eval_metric="logloss",
        use_label_encoder=False,
        random_state=42,
        n_jobs=-1,
        verbosity=0
    )

# ─────────────────────────────────────────────────────────────────────
# 3. TRAIN & EVALUATE ALL MODELS
# ─────────────────────────────────────────────────────────────────────
results   = {}
print("\n" + "─" * 65)
print(" TRAINING & EVALUATION")
print("─" * 65)

for name, model in MODELS.items():
    print(f"\n⏳ Training [{name}] ...")
    model.fit(X_train, y_train)

    # Probabilities + hard predictions (default 0.5 threshold for now)
    prob_train = model.predict_proba(X_train)[:, 1]
    prob_test  = model.predict_proba(X_test)[:, 1]
    pred_test  = model.predict(X_test)

    # Core metrics
    acc   = accuracy_score(y_test, pred_test)
    auc   = roc_auc_score(y_test, prob_test)
    ap    = average_precision_score(y_test, prob_test)   # area under PR curve

    results[name] = {
        "model"    : model,
        "prob_test": prob_test,
        "accuracy" : acc,
        "roc_auc"  : auc,
        "avg_prec" : ap
    }

    print(f"   Accuracy       : {acc*100:.2f}%")
    print(f"   ROC-AUC        : {auc:.4f}")
    print(f"   Avg Precision  : {ap:.4f}  (area under PR curve)")

# ─────────────────────────────────────────────────────────────────────
# 4. SELECT BEST MODEL (by ROC-AUC)
# ─────────────────────────────────────────────────────────────────────
best_name  = max(results, key=lambda n: results[n]["roc_auc"])
best       = results[best_name]
best_model = best["model"]

print("\n" + "─" * 65)
print(f" BEST MODEL → {best_name}  (ROC-AUC = {best['roc_auc']:.4f})")
print("─" * 65)

# ─────────────────────────────────────────────────────────────────────
# 5. FIND OPTIMAL DECISION THRESHOLD (Youden's J)
# ─────────────────────────────────────────────────────────────────────
fpr, tpr, thresholds = roc_curve(y_test, best["prob_test"])
j_scores              = tpr - fpr                              # Youden's J statistic
best_threshold        = float(thresholds[np.argmax(j_scores)])

pred_optimal = (best["prob_test"] >= best_threshold).astype(int)

print(f"\n🎯 Optimal decision threshold (Youden's J): {best_threshold:.4f}")
print(f"   At this threshold:")
print(f"   Accuracy : {accuracy_score(y_test, pred_optimal)*100:.2f}%")
print(f"   ROC-AUC  : {best['roc_auc']:.4f}")

# ─────────────────────────────────────────────────────────────────────
# 6. DETAILED CLASSIFICATION REPORT
# ─────────────────────────────────────────────────────────────────────
print("\n📋 Classification Report (at optimal threshold):\n")
print(classification_report(y_test, pred_optimal,
                             target_names=["CAN (0)", "CNF (1)"]))

print("Confusion Matrix:")
cm = confusion_matrix(y_test, pred_optimal)
print(f"  True Negatives  (CAN→CAN): {cm[0,0]:,}")
print(f"  False Positives (CAN→CNF): {cm[0,1]:,}")
print(f"  False Negatives (CNF→CAN): {cm[1,0]:,}")
print(f"  True Positives  (CNF→CNF): {cm[1,1]:,}")

# ─────────────────────────────────────────────────────────────────────
# 7. FEATURE IMPORTANCE (tree-based models)
# ─────────────────────────────────────────────────────────────────────
if hasattr(best_model, "feature_importances_"):
    print("\n🌟 Top-20 Feature Importances:")
    fi = pd.Series(best_model.feature_importances_, index=FEATURE_COLS)
    top20 = fi.nlargest(20)
    for feat, imp in top20.items():
        bar = "█" * int(imp * 300)
        print(f"   {feat:<45} {imp:.4f}  {bar}")

# ─────────────────────────────────────────────────────────────────────
# 8. SAVE ARTIFACTS
# ─────────────────────────────────────────────────────────────────────
joblib.dump(best_model,    "rtc_model.pkl")
joblib.dump(FEATURE_COLS,  "rtc_feature_names.pkl")
joblib.dump(best_threshold,"rtc_threshold.pkl")

if HAS_XGB and isinstance(best_model, XGBClassifier):
    best_model.save_model("rtc_model.json")
    print("  rtc_model.json        — native XGBoost model export")

print("\n" + "=" * 65)
print(" SAVED ARTIFACTS")
print("=" * 65)
print("  rtc_model.pkl          — trained model")
print("  rtc_feature_names.pkl  — ordered feature name list")
print("  rtc_threshold.pkl      — optimal decision threshold")
print()
print("── HOW TO USE IN AN API ──────────────────────────────────────")
print("""
import joblib, pandas as pd

model     = joblib.load("rtc_model.pkl")
features  = joblib.load("rtc_feature_names.pkl")
threshold = joblib.load("rtc_threshold.pkl")

# input_df must already be preprocessed (scaled + one-hot encoded)
# via the same ColumnTransformer from preprocess_rtc.py
prob = model.predict_proba(input_df[features])[:, 1]   # 0.0 – 1.0
pred = (prob >= threshold).astype(int)                  # 0=CAN / 1=CNF

# Return to the client
response = {
    "confirmation_probability": round(float(prob[0]), 4),
    "prediction": "CNF" if pred[0] == 1 else "CAN"
}
""")
print("=" * 65)
print("✅ Training complete.")
