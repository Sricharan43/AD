import pandas as pd
import numpy as np
import json
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import os

# Load dataset
with open(os.path.join(os.path.dirname(__file__), '..', 'dataset', 'movies.json')) as f:
    movies = json.load(f)

df = pd.DataFrame(movies)

# Feature engineering
GENRE_MAP = {
    "Action": 0, "Drama": 1, "Romance": 2, "Comedy": 3,
    "Thriller": 4, "Horror": 5, "Sci-Fi": 6, "Fantasy": 7,
    "Crime": 8, "Family": 9, "Biography": 10, "Sports": 11, "Historical": 12
}
INDUSTRY_MAP = {
    "Bollywood": 0, "Tollywood": 1, "Kollywood": 2, "Mollywood": 3, "Sandalwood": 4
}
SUCCESS_MAP = {"Flop": 0, "Average": 1, "Hit": 2}

df['genre_enc'] = df['genre'].map(GENRE_MAP).fillna(0)
df['industry_enc'] = df['industry'].map(INDUSTRY_MAP).fillna(0)
df['success_enc'] = df['success'].map(SUCCESS_MAP)
df['budget_log'] = np.log1p(df['budget'])
df['year_norm'] = (df['release_year'] - 2000) / 24.0

features = ['genre_enc', 'budget_log', 'cast_popularity', 'director_track_record', 'year_norm', 'industry_enc']
X = df[features].values
y = df['success_enc'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

model = GradientBoostingClassifier(n_estimators=200, learning_rate=0.1, max_depth=4, random_state=42)
model.fit(X_train_s, y_train)

y_pred = model.predict(X_test_s)
acc = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {acc:.4f}")
print(classification_report(y_test, y_pred, target_names=["Flop", "Average", "Hit"]))

# Save artifacts
joblib.dump(model, os.path.join(os.path.dirname(__file__), 'model.pkl'))
joblib.dump(scaler, os.path.join(os.path.dirname(__file__), 'scaler.pkl'))
joblib.dump(GENRE_MAP, os.path.join(os.path.dirname(__file__), 'genre_map.pkl'))
joblib.dump(INDUSTRY_MAP, os.path.join(os.path.dirname(__file__), 'industry_map.pkl'))
print("Model artifacts saved!")
