# CIVICFLOW v0.9.2
**AI-Powered Civic Grievance Resolution Orchestrator**

[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-0.9.2-blue.svg)]()

CIVICFLOW is an AI-powered civic technology platform designed to streamline municipal complaint reporting, intelligent triage, and SLA enforcement.

## 🚀 Live Demo
- **Public URL**: TBD
- **GitHub Repository**: [madarazorodevop/civicflow-ai-grievance-orchestrator](https://github.com/madarazorodevop/civicflow-ai-grievance-orchestrator)

## 🏗 Architecture
- **Frontend**: Next.js 14 (App Router), TailwindCSS, React-Leaflet (OpenStreetMap), Lucide Icons.
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL / SQLite.
- **AI Inference Layer**: Powered by the ultra-fast [Groq API](https://groq.com/) for real-time AI Chatbox capabilities and Intelligent Triage.

## ✨ Features
1. **Responsive-First Citizen Reporting**: Mobile-optimized camera uploads and HTML5 geolocation.
2. **AI Triage**: Automatically categorizes issues (e.g., Road Damage, Sanitation) and sets priority levels and SLAs.
3. **Smart Routing**: Autonomous agents map tickets to correct municipal departments.
4. **Live Orchestrator UI**: Real-time observability of autonomous AI agents executing tasks.
5. **Interactive Mapping**: Dedicated interactive map built on Leaflet with touch-friendly bottom sheets.

## ⚙️ Setup & Deployment (Cross-Platform)

### 1. Install Prerequisites
You will need **Python 3.10+**, **Node.js 18+**, and **Git**. Choose your Operating System below:

#### 🐧 Linux
**Debian / Ubuntu**
```bash
sudo apt update && sudo apt install -y python3 python3-venv python3-pip nodejs npm git
```
**Fedora**
```bash
sudo dnf install -y python3 python3-pip nodejs npm git
```
**Arch Linux**
```bash
sudo pacman -S python python-pip nodejs npm git
```

#### 🪟 Windows
Using [Winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) in PowerShell:
```powershell
winget install Python.Python.3.11 OpenJS.NodeJS Git.Git
```
*(Alternatively, download the installers directly from the official Python and Node.js websites).*

#### 🍎 macOS
Using [Homebrew](https://brew.sh/):
```bash
brew install python node git
```

### 2. Clone the Repository
```bash
git clone https://github.com/madarazorodevop/civicflow-ai-grievance-orchestrator.git
cd civicflow-ai-grievance-orchestrator
```

### 3. Backend Setup (FastAPI)
```bash
cd backend
python3 -m venv .venv

# On Linux/macOS:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
# (or manually: pip install fastapi uvicorn sqlalchemy passlib python-jose python-multipart requests python-dotenv)

cp .env.example .env
# Edit .env and add your API Keys (e.g., GROQ_API_KEY)

# Start the server (runs on http://localhost:8000)
uvicorn main:app --reload
```

### 4. Frontend Setup (Next.js)
Open a new terminal window:
```bash
cd frontend
npm install

# Start the dev server (runs on http://localhost:3000)
npm run dev
```

## 🔒 Security
- All AI calls happen server-side; no LLM keys are exposed to the frontend.
- API endpoints support CORS restrictions and fallback mechanisms.
- Graceful degradation if the AI provider fails (Deterministic Triage).

## 🏆 Credits
- **AI Chatbox & Triage**: High-speed, real-time AI inference is proudly powered by [Groq API](https://groq.com/).

## 📝 License
MIT License
