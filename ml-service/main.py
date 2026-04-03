from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(title="Cinelytics ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model artifacts
try:
    BASE_DIR = os.path.dirname(__file__)
    model = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))
    scaler = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
    genre_map = joblib.load(os.path.join(BASE_DIR, 'genre_map.pkl'))
    industry_map = joblib.load(os.path.join(BASE_DIR, 'industry_map.pkl'))
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

class PredictionInput(BaseModel):
    genre: str
    budget: float
    cast_popularity: float
    director_track_record: float
    release_year: int
    industry: str

@app.post("/predict")
async def predict(data: PredictionInput):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Preprocess input
        genre_enc = genre_map.get(data.genre, 0)
        industry_enc = industry_map.get(data.industry, 0)
        budget_log = np.log1p(data.budget)
        year_norm = (data.release_year - 2000) / 24.0
        
        features = np.array([[
            genre_enc, 
            budget_log, 
            data.cast_popularity, 
            data.director_track_record, 
            year_norm, 
            industry_enc
        ]])
        
        # Scale and predict
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        
        # Result mapping
        SUCCESS_MAP = {0: "Flop", 1: "Average", 2: "Hit"}
        result = SUCCESS_MAP.get(int(prediction), "Unknown")
        
        return {
            "prediction": result,
            "confidence": 0.85 # Placeholder for actual confidence
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
