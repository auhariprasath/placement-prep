import json
import os
import sys
import types
import warnings

warnings.filterwarnings("ignore")

import numpy as np

# The saved model has a broken numpy dtype module reference ('RandomForestClassifier'
# instead of 'numpy'); register a stub so unpickling resolves dtype correctly.
if "RandomForestClassifier" not in sys.modules:
    stub = types.ModuleType("RandomForestClassifier")
    stub.dtype = np.dtype
    sys.modules["RandomForestClassifier"] = stub

import joblib


def load_model():
    model_path = os.environ.get(
        "CAREER_MODEL_PATH",
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "career_system.h5"),
    )
    return joblib.load(model_path)


def main():
    raw = sys.stdin.read()
    data = json.loads(raw) if raw else {}
    features = data.get("features") or {}

    obj = load_model()
    model = obj["model"]
    feature_names = list(obj["features"])

    row = np.zeros((1, len(feature_names)), dtype=int)
    for i, name in enumerate(feature_names):
        if features.get(name, False):
            row[0, i] = 1

    proba = model.predict_proba(row)[0]
    classes = model.classes_.tolist()
    pred = int(model.predict(row)[0])

    top = sorted(
        ({"class": int(c), "prob": float(p)} for p, c in zip(proba, classes)),
        key=lambda item: item["prob"],
        reverse=True,
    )

    result = {
        "predicted_class": pred,
        "confidence": round(float(proba[classes.index(pred)]) * 100.0, 1),
        "top_classes": top[:5],
    }
    sys.stdout.write(json.dumps(result))


if __name__ == "__main__":
    main()
