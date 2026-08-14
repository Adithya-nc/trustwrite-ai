# TrustWrite AI Admissions Essay Detector — Backend

This is the Python backend service for the **TrustWrite AI Admissions Essay Detector**. It provides explainable AI-content detection and stylometric writing analysis specifically designed for college admissions essays.

The system uses **traditional Natural Language Processing (NLP) and statistical machine learning** (spaCy, scikit-learn, NumPy, pandas) without using any generative LLM APIs (OpenAI, Gemini, Claude, etc.).

---

## Technical Stack
- **Language**: Python 3.11+
- **Framework**: FastAPI + Uvicorn
- **Machine Learning**: scikit-learn (LogisticRegression, RandomForest, GradientBoosting)
- **NLP & Stylometrics**: spaCy (`en_core_web_sm`), NLTK, Regex
- **Data & Model Utilities**: NumPy, pandas, joblib, Pydantic

---

## Directory Structure
```
backend/
├── app/
│   ├── main.py                  # FastAPI application entry point & CORS
│   ├── api/
│   │   └── endpoints.py         # Routes (/api/analyze, /api/health, /api/essays/{id})
│   ├── schemas/
│   │   └── essay.py             # Pydantic schemas matching TypeScript interfaces
│   ├── services/
│   │   ├── feature_extractor.py # 20+ document & sentence level stylometric features
│   │   ├── explanation_engine.py# Deterministic reason & explanation generator
│   │   └── analyzer.py          # Core detection pipeline orchestrator
│   ├── models/                  # Package init
│   └── utils/                   # Helper utilities
├── training/
│   ├── dataset_builder.py       # Dataset loader, sample generator, & validator
│   ├── train.py                 # Stratified CV model comparison & joblib exporter
│   └── evaluate.py              # Model evaluation metrics printer
├── tests/
│   ├── test_analyzer.py         # Pytest for NLP pipeline, features, & explanations
│   └── test_api.py              # Pytest for API endpoints & error cases
├── models/                      # Saved trained model artifacts (.joblib, .json)
├── requirements.txt             # Python dependencies
└── README.md
```

---

## Setup & Installation

### 1. Requirements & Virtual Environment
```bash
# Windows PowerShell / CMD
python -m venv venv
venv\Scripts\activate

# Or using uv (recommended for speed)
uv venv venv
venv\Scripts\activate
```

### 2. Install Dependencies
```bash
uv pip install -r requirements.txt --python venv/Scripts/python.exe
# Or standard pip:
pip install -r requirements.txt
```

### 3. Download spaCy English Model (Optional but recommended)
```bash
python -m spacy download en_core_web_sm
```

---

## Running Model Training & Evaluation

The training pipeline loads labeled dataset samples, validates dataset integrity, extracts document stylometric features, and compares Logistic Regression, Random Forest, and Gradient Boosting models using Stratified K-Fold cross-validation.

To train and generate the model bundle `backend/models/essay_detector_v1.joblib`:
```bash
venv/Scripts/python.exe training/train.py
```

To evaluate the stored model:
```bash
venv/Scripts/python.exe training/evaluate.py
```

To run unit and integration tests:
```bash
venv/Scripts/pytest backend/tests -v
```

---

## Starting the API Server

Run the FastAPI application with Uvicorn on port 8000:
```bash
venv/Scripts/python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

---

## API Endpoints

### 1. Health Check
`GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "model_version": "1.0.0",
  "reliability_notice": "Detection is probabilistic and should not be treated as proof of AI authorship."
}
```

### 2. Essay Analysis
`POST /api/analyze`

**Request:**
```json
{
  "essay": "Raw text of admissions essay..."
}
```

**Response Schema (`EssayAnalysisResponse` matching Frontend `EssayAnalysis` TS Interface):**
```json
{
  "essayId": "essay_a1b2c3d4",
  "authenticityScore": 87.5,
  "aiProbability": 12.5,
  "confidence": "high",
  "classification": "Likely Human",
  "writingQuality": 91.2,
  "originality": 88.4,
  "sentences": [
    {
      "id": "s_1",
      "index": 0,
      "text": "I have always been fascinated by the way computers solve problems.",
      "label": "human",
      "aiProbability": 12.0,
      "confidence": "high",
      "patterns": [],
      "explanation": "Contains direct first-person reflection and personal narrative elements.",
      "paragraphIndex": 0
    }
  ],
  "metrics": {
    "vocabularyDiversity": 82.4,
    "sentenceVariation": 74.1,
    "sentenceComplexity": 65.0,
    "readability": 72.3,
    "grammar": 92.0,
    "passiveVoice": 95.0,
    "emotionalTone": 85.0,
    "vocabularyRichness": 88.0,
    "writingConsistency": 91.0
  },
  "fingerprint": {
    "vocabulary": 82.4,
    "sentenceRhythm": 74.1,
    "complexity": 65.0,
    "punctuation": 84.0,
    "formality": 56.0,
    "uniqueness": 79.5
  },
  "paragraphRisks": [
    {
      "paragraphIndex": 0,
      "label": "Paragraph 1",
      "aiProbability": 12.0
    }
  ],
  "improvements": [],
  "analyzedAt": "2026-08-14T19:30:00Z",
  "reliability_notice": "Detection is probabilistic and should not be treated as proof of AI authorship."
}
```

---

## Environment Variables
- `PORT`: Server listening port (default `8000`).
- `HOST`: Server listening host (default `0.0.0.0`).
- `MODEL_PATH`: Optional path override for `.joblib` model bundle.

---

## How to Train with Custom/Production Datasets
To update or retrain the model on a custom dataset:
1. Place your CSV dataset at `backend/data/essays.csv`.
2. Format the CSV with columns: `text` (raw essay content) and `label` (`human` or `ai`).
3. Run `python training/train.py`.
4. The pipeline will automatically re-evaluate candidates, select the top-performing model, save `essay_detector_v1.joblib`, and update `model_meta.json`.

---

## Known Scientific Limitations
1. **Probabilistic Nature**: AI detection based on stylometrics is probabilistic and cannot serve as definitive legal proof of authorship.
2. **Non-Native English Writing**: Highly structured formal academic prose by non-native English speakers may occasionally produce elevated AI signals.
3. **Minimum Word Requirement**: Essays with fewer than 50 words return an `Insufficient Evidence` assessment to avoid false positives due to small sample size variance.
