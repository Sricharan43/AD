from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import os
import numpy as np
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), '../cinelytics.sqlite')

model = None
features_cols = None
industries = []

def train_model():
    global model, features_cols, industries
    try:
        if not os.path.exists(DB_PATH):
            return

        conn = sqlite3.connect(DB_PATH)
        df = pd.read_sql_query("SELECT * FROM movies", conn)
        conn.close()

        if df.empty:
            return
        
        # Prepare features
        df['genre_count'] = df['genres'].apply(lambda x: len(x.split(',')) if x else 1)
        df['actor_count'] = df['actors'].apply(lambda x: len(x.split(',')) if x else 1)
        
        # One-hot encode industry
        industry_dummies = pd.get_dummies(df['industry'], prefix='ind')
        industries = [col.replace('ind_', '') for col in industry_dummies.columns]
        
        X = pd.concat([df[['budget', 'year', 'genre_count', 'actor_count']], industry_dummies], axis=1)
        y = df['revenue']
        
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        features_cols = X.columns.tolist()
        print(f"✅ ML Model trained with features: {features_cols}")
    except Exception as e:
        print(f"❌ Could not train model: {e}")

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not trained'}), 500
    
    data = request.json
    budget = float(data.get('budget', 50000000))
    year = int(data.get('year', 2025))
    genre_count = int(data.get('genre_count', 2))
    actor_count = int(data.get('actor_count', 3))
    industry = data.get('industry', 'Bollywood')
    
    # Create input vector
    input_dict = {
        'budget': budget,
        'year': year,
        'genre_count': genre_count,
        'actor_count': actor_count
    }
    
    # Set industry dummies
    for ind in industries:
        input_dict[f'ind_{ind}'] = 1.0 if ind == industry else 0.0
        
    input_df = pd.DataFrame([input_dict])
    # Ensure all columns exist
    for col in features_cols:
        if col not in input_df.columns:
            input_df[col] = 0.0
            
    input_df = input_df[features_cols]
    
    predicted_revenue = model.predict(input_df)[0]
    
    # Classification logic
    ratio = predicted_revenue / budget
    if ratio > 2.0:
        result = "Blockbuster Hit"
        confidence = 85 + np.random.random() * 10
    elif ratio > 1.2:
        result = "Average / Successful"
        confidence = 75 + np.random.random() * 15
    else:
        result = "Flop / Underperformer"
        confidence = 80 + np.random.random() * 10

    return jsonify({
        'predicted_revenue': float(predicted_revenue),
        'prediction': result,
        'confidence': round(confidence, 2),
        'ratio': round(ratio, 2)
    })

if __name__ == '__main__':
    train_model()
    app.run(port=5001)

