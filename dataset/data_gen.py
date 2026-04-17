import sqlite3
import pandas as pd
import numpy as np
import random
import os

# Connect to SQLite
DB_PATH = os.path.join(os.path.dirname(__file__), '../cinelytics.sqlite')

def generate_mock_data():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Drop and Create Tables
    cursor.executescript("""
        DROP TABLE IF EXISTS movies;
        DROP TABLE IF EXISTS actors;
        DROP TABLE IF EXISTS directors;
        DROP TABLE IF EXISTS users;

        CREATE TABLE movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            year INTEGER,
            industry TEXT,
            genres TEXT,
            actors TEXT,
            director TEXT,
            budget INTEGER,
            revenue INTEGER,
            imdbRating REAL,
            votes INTEGER,
            posterUrl TEXT,
            ottPlatform TEXT
        );

        CREATE TABLE actors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            industry TEXT,
            totalMovies INTEGER,
            averageRating REAL,
            averageRevenue REAL
        );

        CREATE TABLE directors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            industry TEXT,
            totalMovies INTEGER,
            averageRating REAL,
            averageRevenue REAL
        );

        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    """)

    np.random.seed(42)
    industries = ['Bollywood', 'Tollywood', 'Kollywood']
    genres_list = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Sci-Fi']
    actors_list = [f'Actor {i}' for i in range(1, 51)]
    directors_list = [f'Director {i}' for i in range(1, 21)]
    ott_platforms = ['Netflix', 'Amazon Prime', 'Hotstar', 'Zee5']

    movies = []
    for i in range(1, 501):
        budget = np.random.randint(50000000, 2000000000)
        success_factor = np.random.uniform(0.5, 3.5)
        revenue = int(budget * success_factor)
        
        movie = (
            f'Movie Title {i}',
            np.random.randint(2010, 2024),
            np.random.choice(industries),
            ','.join(random.sample(genres_list, k=np.random.randint(1, 3))),
            ','.join(random.sample(actors_list, k=np.random.randint(2, 5))),
            np.random.choice(directors_list),
            budget,
            revenue,
            round(np.random.uniform(4.0, 9.5), 1),
            np.random.randint(1000, 500000),
            f'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Poster+{i}',
            np.random.choice(ott_platforms)
        )
        movies.append(movie)

    cursor.executemany("""
        INSERT INTO movies (title, year, industry, genres, actors, director, budget, revenue, imdbRating, votes, posterUrl, ottPlatform)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, movies)
    print(f"Inserted {len(movies)} movies.")

    # Actors Stats
    # We'll calculate these from the movies data
    df = pd.DataFrame(movies, columns=['title', 'year', 'industry', 'genres', 'actors', 'director', 'budget', 'revenue', 'imdbRating', 'votes', 'posterUrl', 'ottPlatform'])
    
    actor_stats = {}
    for _, row in df.iterrows():
        for actor in row['actors'].split(','):
            if actor not in actor_stats:
                actor_stats[actor] = {'count': 0, 'rating': 0, 'revenue': 0, 'industry': row['industry']}
            actor_stats[actor]['count'] += 1
            actor_stats[actor]['rating'] += row['imdbRating']
            actor_stats[actor]['revenue'] += row['revenue']
    
    actors_to_insert = [
        (name, data['industry'], data['count'], data['rating']/data['count'], data['revenue']/data['count'])
        for name, data in actor_stats.items()
    ]
    cursor.executemany("INSERT INTO actors (name, industry, totalMovies, averageRating, averageRevenue) VALUES (?, ?, ?, ?, ?)", actors_to_insert)

    # Directors Stats
    director_stats = {}
    for _, row in df.iterrows():
        d = row['director']
        if d not in director_stats:
            director_stats[d] = {'count': 0, 'rating': 0, 'revenue': 0, 'industry': row['industry']}
        director_stats[d]['count'] += 1
        director_stats[d]['rating'] += row['imdbRating']
        director_stats[d]['revenue'] += row['revenue']

    directors_to_insert = [
        (name, data['industry'], data['count'], data['rating']/data['count'], data['revenue']/data['count'])
        for name, data in director_stats.items()
    ]
    cursor.executemany("INSERT INTO directors (name, industry, totalMovies, averageRating, averageRevenue) VALUES (?, ?, ?, ?, ?)", directors_to_insert)

    conn.commit()
    conn.close()
    print("Database seeded successfully with SQLite.")

if __name__ == "__main__":
    generate_mock_data()
