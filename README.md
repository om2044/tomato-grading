# 🍅 TomatoGrade

**AI-Powered Tomato Quality Grading | Computer Vision · Data Engineering · Full-Stack Development**

TomatoGrade is an **industry-inspired academic prototype** for automated tomato quality classification. The project combines image preprocessing, deep learning experiments, a FastAPI inference backend, and a React dashboard to assign tomato images to three commercial grades.

[Dataset on Kaggle](https://www.kaggle.com/datasets/mohamedafkir90/tomato-quality-classification) · [Model experiments](ai/notebooks/) · [Data pipeline](ai/pipeline/) · [Related Hugging Face demo](https://huggingface.co/spaces/om440/tomato-grading-app)

> **Scope:** This repository documents an academic prototype, not a production-certified industrial sorting system. The Hugging Face Space is a separate demonstration, not the deployment of this repository's Docker stack.

## Quality grades

| Grade | Label | Meaning |
|---|---|---|
| **A** | Export | Export-quality tomato |
| **B** | Local | Local-market tomato |
| **C** | Rejet / Rotten | Rejected tomato |

## Main features

- **AI classification:** YOLOv8 image classification for the current backend's prediction endpoint, with a confidence score.
- **ML experimentation:** custom CNN, EfficientNetB0, YOLOv8, and exploratory pretrained-model comparisons in Jupyter notebooks.
- **Image data preparation:** Bronze / Silver / Gold scripts for ingestion, validation, background removal, cleaning, splitting, and augmentation.
- **Web interface:** React application with image uploads, webcam-based classification, prediction history, metrics, reporting, and alert views.
- **Demo production-line mode:** periodic webcam captures are sent for inference. This is a software simulation, **not** a physical conveyor-belt integration.
- **Backend and persistence:** FastAPI, JWT-based authentication, SQLAlchemy, and PostgreSQL prediction records.
- **Infrastructure assets:** Docker, Compose, Nginx, and GitHub Actions configurations, with known setup limitations listed below.

## Architecture

```mermaid
flowchart TD
    A[Kaggle image dataset] --> B[Bronze: ingest and validate]
    B --> C[Silver: clean and preprocess]
    C --> D[Gold: split and augment]
    D --> E[Training and evaluation notebooks]
    E --> F[Model artifacts]
    G[React: image upload or webcam] --> H[FastAPI prediction endpoint]
    H --> I[Background removal: rembg]
    I --> J[YOLOv8 classifier]
    F -. separate model provisioning .-> J
    J --> K[Grade A/B/C and confidence]
    K --> L[PostgreSQL prediction history]
    L --> M[Dashboard, history and reports]
```

The Bronze / Silver / Gold layers are **local image-processing stages**, not a distributed lakehouse. Training notebooks use their own dataset preparation, so the full training workflow is not yet reproducible through one command.

## Machine learning experiments

| Approach | Notebook | Status |
|---|---|---|
| CNN trained from scratch (TensorFlow/Keras) | [CNN experiment](ai/notebooks/cnn-tomato-quality-classification.ipynb) | Recorded training and evaluation |
| EfficientNetB0 transfer learning | [CNN / MLflow experiment](ai/notebooks/cnn-MLflow-tomato-quality-classification.ipynb) | Experimental |
| YOLOv8 image classification (Ultralytics) | [YOLO experiment](ai/notebooks/yolo-tomato-quality-classification.ipynb) | Model family used by current inference API |
| Other pretrained architectures | [Model comparison](ai/notebooks/test-models.ipynb) | Exploratory benchmarking |

**Recorded benchmark:** The CNN-from-scratch notebook reports approximately **95% accuracy on 1,545 test images**. Its saved dataset split contains 12,324 training images, 1,539 validation images, and 1,545 test images. This result is **not** the accuracy of the current YOLO deployment. The YOLO notebook includes validation results, but its saved code and execution outputs are not fully aligned; rerun it before publishing a definitive YOLO score or cross-model comparison.

MLflow and DagsHub appear in the experiment notebooks for tracking. These experiments are not wired into a single automated training pipeline.

### Inference flow

The [FastAPI prediction route](backend/app/api/routes/predict.py) receives an image, validates the user's JWT, removes the image background using `rembg`, runs YOLO classification, maps the result to A/B/C, and stores the prediction and confidence in PostgreSQL.

It expects a model file named `Tomato_grading_YOLO_BEST.pt`, or a path configured through `MODEL_PATH`. **The YOLO weight file is not included in this Git repository.**

## Technology stack

| Layer | Tools |
|---|---|
| ML | Python, Ultralytics/YOLOv8, TensorFlow/Keras, PyTorch, OpenCV, Pillow, Albumentations, rembg |
| Experiments | Jupyter, Kaggle, MLflow, DagsHub |
| Backend | FastAPI, SQLAlchemy, JWT |
| Database | PostgreSQL |
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Infrastructure | Docker, Docker Compose, Nginx, GitHub Actions |

## Repository layout

```text
tomato-grading/
├── ai/
│   ├── notebooks/           # ML experiments and evaluation
│   ├── pipeline/            # Bronze / Silver / Gold stages
│   ├── models/              # Model scaffolding and artifacts
│   └── run_pipeline.py      # Partial pipeline runner
├── backend/
│   └── app/                 # FastAPI routes, database, authentication
├── frontend/
│   └── src/                 # React pages, components, and hooks
├── database/                # PostgreSQL schema and sample-data script
├── infra/                   # Compose and Nginx configurations
├── docs/                    # Technical documentation
├── scripts/                 # Dataset utilities
└── README.md
```

## Local development

> **Important:** These are **manual developer setup steps**, not a verified one-command deployment. Model provisioning, tenant setup, and some Docker/Makefile configuration still need attention. Running the frontend and backend successfully requires completing these prerequisites.

**Requirements:** Git, Python 3.11, Node.js 20/npm, PostgreSQL 16 (local or Docker), and access to the trained YOLO weights. Kaggle authentication is only needed for dataset downloading.

### 1. Clone

```bash
git clone https://github.com/om2044/tomato-grading.git
cd tomato-grading
```

### 2. Start PostgreSQL

A fresh local database can be started separately through Compose:

```bash
docker compose -f infra/docker-compose.yml up -d db
```

The database service uses [`database/init.sql`](database/init.sql) to initialize schema on a new volume. **Known setup issue:** current application code references a fixed demo tenant UUID; a matching tenant must exist for registration and prediction to work. Proper per-tenant isolation is future work.

### 3. Prepare backend

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the environment on your platform:

```powershell
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

```bash
# Linux/macOS
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `backend/.env` file (this is an example for a local database, **not** production secrets):

```dotenv
DATABASE_URL=postgresql://user:password@localhost:5432/tomato_grading
SECRET_KEY=replace-with-a-long-random-secret
ALGORITHM=HS256
MODEL_PATH=/absolute/path/to/Tomato_grading_YOLO_BEST.pt
```

Run the API:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Health endpoint: `http://localhost:8000/health`
- Swagger UI: `http://localhost:8000/docs`

The prediction endpoint cannot work unless the trained model weights are available. The database's expected demo tenant must also be initialized. A green health response alone does not guarantee inference is ready.

### 4. Prepare frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:3000`. The Vite configuration proxies `/api` requests to `http://localhost:8000` during development.

### 5. Explore the dataset and models

The image dataset is published on [Kaggle](https://www.kaggle.com/datasets/mohamedafkir90/tomato-quality-classification). Preprocessing stages are in [`ai/pipeline/`](ai/pipeline/); training experiments are in [`ai/notebooks/`](ai/notebooks/).

**Do not rely on `make train` yet:** [`ai/run_pipeline.py`](ai/run_pipeline.py) calls `ai/models/train.py`, which is currently empty. Use the notebooks to inspect recorded experiments and their environment requirements.

## Current limitations and roadmap

- **Model provisioning:** store and distribute YOLO weights separately and fix model-volume/`MODEL_PATH` consistency in Docker Compose.
- **Reproducibility:** unify preprocessing, training, evaluation, and model export into an executable, versioned pipeline.
- **Configuration:** repair mismatched `.env.example` references in the Makefile and Compose setup.
- **Security:** remove fixed tenant IDs and fallback secret keys; implement tenant-level authorization consistently.
- **Testing / CI:** the active root `.github/workflows/ci.yml` only runs an `echo` smoke step. The more complete workflow files under `infra/.github/workflows/` are not active at the repository root.
- **Deployment validation:** test a clean-install startup and document actual production requirements.
- **Industrial readiness:** replace simulated webcam polling with a validated camera/line interface if the system is ever used in a real production setting.

## Academic context

TomatoGrade began as an academic machine learning project and was extended with data processing, experimentation, backend services, and a web interface. Its purpose is to demonstrate the engineering path from image data and model development to an interactive quality-monitoring application.

See the [Git commit history](https://github.com/om2044/tomato-grading/commits/main) for contributor attribution and development history.
