import os
import sys
import json
import joblib

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def evaluate_stored_model():
    meta_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'model_meta.json'))
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'essay_detector_v1.joblib'))

    if not os.path.exists(meta_path) or not os.path.exists(model_path):
        print("Error: Model or metadata file not found. Run `python training/train.py` first.")
        return

    with open(meta_path, 'r') as f:
        meta = json.load(f)

    print("=== Essay Detector Model Evaluation ===")
    print(json.dumps(meta, indent=2))

if __name__ == '__main__':
    evaluate_stored_model()
