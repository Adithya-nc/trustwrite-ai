# 🎓 TrustWrite AI - Admissions Essay AI & Writing Analyzer

A modern full-stack web application designed for analyzing college admissions essays. **TrustWrite AI** provides probabilistic AI-content detection, writing quality evaluation, stylometric fingerprinting, and sentence-level explainability without relying on external generative LLM APIs.

---

## 🏗️ Project Architecture

```
trustwrite-ai/
├── backend/                # Python FastAPI Backend (Stylometrics & ML)
│   ├── app/                # Application routes, models & services
│   ├── models/             # Trained ML models (.joblib, .json)
│   ├── tests/              # Backend Pytest test suites
│   ├── training/           # Model training, dataset generation, & evaluation
│   ├── requirements.txt    # Python dependency manifest
│   └── run_server.py       # Standalone backend server runner script
├── src/                    # React + TypeScript Frontend (Vite + Tailwind CSS)
│   ├── components/         # Reusable UI components & graphs
│   ├── pages/              # Application views (Dashboard, Analyzer, Login, etc.)
│   └── services/           # API integration services (axios)
├── public/                 # Static public assets
├── package.json            # Frontend dependency manifest & scripts
└── vite.config.ts          # Vite build configuration
```

---

## 🧰 Prerequisites & Software Requirements

Before running the application, ensure you have the following installed on your machine:

1. **Node.js**: `v18.0.0` or higher
2. **npm** (comes with Node.js) or **pnpm / yarn**
3. **Python**: `v3.10` or higher (`v3.11+` recommended)
4. **Git**

---

## 📦 What to Install

### 1. Frontend Dependencies
- **Core Framework**: React 19, React Router DOM
- **Build Tool**: Vite, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI components, Framer Motion, Lucide Icons
- **State & Utils**: Zustand, Axios, React Hook Form, Zod, Recharts

### 2. Backend Dependencies
- **Web Framework**: FastAPI, Uvicorn, Pydantic, HTTPX
- **NLP & Stylometrics**: spaCy (`en_core_web_sm`), NLTK
- **Machine Learning**: scikit-learn, NumPy, pandas, joblib
- **Testing**: Pytest

---

## 🚀 How to Run the Application

You can run the frontend and backend servers separately from their respective directories or launch them using npm scripts.

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/trustwrite-ai.git
cd trustwrite-ai
```

---

### Step 2: Backend Setup & Execution

#### 📍 Directory: `trustwrite-ai/backend`

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   - **Windows (PowerShell / CMD)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   *(Optional for faster installation: use `uv pip install -r requirements.txt`)*

4. **Download the required spaCy English model**:
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Start the FastAPI backend server**:
   - **Option A (using Python command)**:
     ```bash
     python run_server.py
     ```
   - **Option B (using Uvicorn directly)**:
     ```bash
     python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
     ```

The backend server will launch at **`http://localhost:8000`**.
- Interactive API Docs (Swagger): `http://localhost:8000/docs`
- Health Check Endpoint: `http://localhost:8000/api/health`

---

### Step 3: Frontend Setup & Execution

#### 📍 Directory: `trustwrite-ai/` (Project Root)

Open a **new terminal window/tab** in the root project folder:

1. **Navigate to the root project directory** (if not already there):
   ```bash
   cd trustwrite-ai
   ```

2. **Install Node modules**:
   ```bash
   npm install
   ```

3. **Start the Vite frontend development server**:
   ```bash
   npm run dev
   ```

The frontend application will be running at **`http://localhost:5173`** (or the port specified in terminal).

---

## ⚡ Quick Full-Stack Launch Script

Alternatively, you can run the backend directly from the **root directory** using the root `package.json` script:

```bash
# Terminal 1 (Backend from Root):
npm run backend

# Terminal 2 (Frontend from Root):
npm run dev
```

---

## 🧪 Testing & Model Operations

### Running Tests
- **Backend Tests** (from `backend/` directory with `venv` active):
  ```bash
  pytest tests/ -v
  ```

### Training ML Models
To retrain or re-evaluate the custom stylometric detection model:
```bash
cd backend
python training/train.py
python training/evaluate.py
```

---

## 📝 Important Disclaimer & Limitations

- **Probabilistic Scoring**: AI detection scores are statistical estimations based on writing style, rhythm, and vocabulary variation. They should be used as guidance, not absolute legal proof of AI generation.
- **Minimum Essay Length**: Essays with fewer than 50 words trigger an `Insufficient Evidence` state to prevent false positives.
