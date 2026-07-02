from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PayPulse API Engine", version="1.0.0")

# Configure baseline cross-origin security settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "active",
        "system": "PayPulse Transaction Core Engine",
        "environment": "development"
    }
