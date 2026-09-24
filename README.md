# CIVICFLOW
**AI-Powered Civic Grievance Resolution Orchestrator**

[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)]()

CIVICFLOW is an AI-powered civic technology platform designed to streamline municipal complaint reporting, intelligent triage, and SLA enforcement.

## 🚀 Live Demo
- **Public URL**: TBD
- **GitHub Repository**: [madarazorodevop/civicflow-ai-grievance-orchestrator](https://github.com/madarazorodevop/civicflow-ai-grievance-orchestrator)

## 🏗 Architecture
- **Frontend**: Next.js 14 (App Router), TailwindCSS, React-Leaflet (OpenStreetMap), Lucide Icons.
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL / SQLite.
- **AI Triage Layer**: OpenAI API (`gpt-3.5-turbo`) with a deterministic `DemoAIProvider` fallback.

## ✨ Features
1. **Responsive-First Citizen Reporting**: Mobile-optimized camera uploads and HTML5 geolocation.
2. **AI Triage**: Automatically categorizes issues (e.g., Road Damage, Sanitation) and sets priority levels and SLAs.
3. **Smart Routing**: Autonomous agents map tickets to correct municipal departments.
4. **Live Orchestrator UI**: Real-time observability of autonomous AI agents executing tasks.
5. **Interactive Mapping**: Dedicated interactive map built on Leaflet with touch-friendly bottom sheets.

## ⚙️ Setup & Deployment

### Backend Setup (FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt # (or install directly)
cp .env.example .env
# Edit .env with your OPENAI_API_KEY
uvicorn main:app --reload
```

### Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security
- All AI calls happen server-side; no LLM keys are exposed to the frontend.
- API endpoints support CORS restrictions and fallback mechanisms.
- Graceful degradation if the AI provider fails (Deterministic Triage).

## 📝 License
MIT License
