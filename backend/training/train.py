import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from typing import Tuple

# Add app directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.feature_extractor import FeatureExtractor
from training.dataset_builder import DatasetBuilder
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

FEATURE_NAMES = [
    'avg_sent_len', 'sent_len_std', 'burstiness', 'ttr', 'yules_k',
    'avg_word_len', 'function_word_ratio', 'pronoun_1st_ratio',
    'transition_word_ratio', 'passive_ratio', 'flesch_reading_ease',
    'gunning_fog', 'ngram_repetition_rate', 'para_len_var',
    'lexical_sophistication', 'sentence_starter_diversity',
    'contraction_ratio', 'punctuation_variety', 'pos_distribution_entropy'
]

def extract_dataset_features(df: pd.DataFrame, extractor: FeatureExtractor) -> Tuple[np.ndarray, np.ndarray]:
    X_list = []
    y_list = []

    for _, row in df.iterrows():
        text = row['text']
        label = 1 if row['label'] == 'ai' else 0
        doc_feats, _, _ = extractor.extract_document_features(text)
        feat_vector = [doc_feats[fn] for fn in FEATURE_NAMES]
        X_list.append(feat_vector)
        y_list.append(label)

    return np.array(X_list), np.array(y_list)

def train_detector():
    print("=== Training AI Admissions Essay Detector ===")
    
    # 1. Load dataset
    data_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'essays.csv'))
    if os.path.exists(data_path):
        print(f"Loading dataset from {data_path}...")
        df = pd.read_csv(data_path)
    else:
        print("CSV dataset not found, generating sample dataset...")
        df = DatasetBuilder.create_dataset()

    # Basic Dataset Validation
    if df is None or df.empty:
        raise ValueError("Dataset is empty.")
    if 'text' not in df.columns or 'label' not in df.columns:
        raise ValueError("Dataset missing required 'text' or 'label' columns.")

    initial_count = len(df)
    df = df[df['text'].dropna().str.strip().astype(bool)].copy()
    removed_count = initial_count - len(df)
    if removed_count > 0:
        print(f"Removed {removed_count} empty text row(s) from dataset.")
    if df.empty:
        raise ValueError("Dataset is empty after removing empty text rows.")

    labels = set(df['label'].unique())
    if 'human' not in labels or 'ai' not in labels:
        raise ValueError(f"Dataset must contain both 'human' and 'ai' labels. Found: {labels}")

    valid, issues = DatasetBuilder.validate_dataset(df)
    if not valid:
        print("Dataset validation issues:", issues)

    print(f"Dataset loaded: {len(df)} samples ({sum(df['label'] == 'human')} human, {sum(df['label'] == 'ai')} AI)")

    # 2. Extract features with spaCy if available
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        extractor = FeatureExtractor(nlp)
        spacy_status = "[OK] spaCy model loaded: en_core_web_sm"
        print(spacy_status)
    except Exception as e:
        spacy_status = f"[WARNING] spaCy model unavailable: {e}"
        extractor = FeatureExtractor()
        print(spacy_status)

    X, y = extract_dataset_features(df, extractor)

    # 3. Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )

    # 4. Compare models using Stratified K-Fold CV & Pipelines to prevent data leakage
    skf = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

    candidates = {
        'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
        'Random Forest': RandomForestClassifier(n_estimators=50, random_state=42, max_depth=5),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=50, random_state=42, max_depth=3)
    }

    best_score = -1.0
    best_name = ""
    best_candidate_model = None

    for name, model in candidates.items():
        pipe = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', model)
        ])
        scores = cross_val_score(pipe, X_train, y_train, cv=skf, scoring='f1')
        mean_f1 = float(np.mean(scores))
        print(f"Candidate '{name}' Cross-Val F1: {mean_f1:.4f}")
        if mean_f1 > best_score:
            best_score = mean_f1
            best_name = name
            best_candidate_model = model

    print(f"\nSelected Model: {best_name} (CV F1: {best_score:.4f})")

    # Fit best pipeline on complete train set
    best_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', best_candidate_model)
    ])
    best_pipeline.fit(X_train, y_train)

    # 5. Evaluate on test set
    y_pred = best_pipeline.predict(X_test)
    y_prob = best_pipeline.predict_proba(X_test)[:, 1] if hasattr(best_pipeline, "predict_proba") else y_pred

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    roc = float(roc_auc_score(y_test, y_prob)) if len(np.unique(y_test)) > 1 else 1.0

    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel() if cm.shape == (2, 2) else (0, 0, 0, 0)

    fpr = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0
    fnr = float(fn / (fn + tp)) if (fn + tp) > 0 else 0.0

    metrics = {
        'model_name': best_name,
        'model_version': '1.1.0',
        'accuracy': round(acc, 4),
        'precision': round(prec, 4),
        'recall': round(rec, 4),
        'f1_score': round(f1, 4),
        'roc_auc': round(roc, 4),
        'false_positive_rate': round(fpr, 4),
        'false_negative_rate': round(fnr, 4),
        'confusion_matrix': {'tn': int(tn), 'fp': int(fp), 'fn': int(fn), 'tp': int(tp)},
        'feature_names': FEATURE_NAMES
    }

    print("\n--- Test Set Evaluation Results ---")
    print(json.dumps(metrics, indent=2))
    print(f"\nFeature count: {len(FEATURE_NAMES)}")

    # 6. Save model bundle & metadata
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
    os.makedirs(models_dir, exist_ok=True)

    model_path = os.path.join(models_dir, 'essay_detector_v1.joblib')
    meta_path = os.path.join(models_dir, 'model_meta.json')

    pipeline_bundle = {
        'scaler': None,
        'classifier': best_pipeline,
        'feature_names': FEATURE_NAMES,
        'model_version': '1.1.0'
    }

    joblib.dump(pipeline_bundle, model_path)
    with open(meta_path, 'w') as f:
        json.dump(metrics, f, indent=2)

    print(f"\nModel bundle saved to: {model_path}")
    print(f"Model metadata saved to: {meta_path}")

if __name__ == '__main__':
    train_detector()
