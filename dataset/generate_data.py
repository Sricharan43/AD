import json
import random
import math

random.seed(42)

INDUSTRIES = {
    "Bollywood": {"language": "Hindi", "weight": 0.35},
    "Tollywood": {"language": "Telugu", "weight": 0.20},
    "Kollywood": {"language": "Tamil", "weight": 0.20},
    "Mollywood": {"language": "Malayalam", "weight": 0.13},
    "Sandalwood": {"language": "Kannada", "weight": 0.12},
}

GENRES = ["Action", "Drama", "Romance", "Comedy", "Thriller", "Horror", "Sci-Fi", "Fantasy", "Crime", "Family", "Biography", "Sports", "Historical"]

BOLLYWOOD_ACTORS = [
    "Shah Rukh Khan", "Salman Khan", "Aamir Khan", "Hrithik Roshan",
    "Ranveer Singh", "Ranbir Kapoor", "Akshay Kumar", "Ajay Devgn",
    "Deepika Padukone", "Alia Bhatt", "Priyanka Chopra", "Katrina Kaif",
    "Varun Dhawan", "Tiger Shroff", "Ayushmann Khurrana", "Rajkummar Rao",
]

BOLLYWOOD_DIRECTORS = [
    "Sanjay Leela Bhansali", "Rajkumar Hirani", "Rohit Shetty", "Karan Johar",
    "Kabir Khan", "Zoya Akhtar", "Anurag Kashyap", "Vishal Bhardwaj",
    "Nitesh Tiwari", "Aanand L Rai", "Shoojit Sircar", "Imtiaz Ali",
]

TOLLYWOOD_ACTORS = [
    "Prabhas", "Ram Charan", "Jr NTR", "Mahesh Babu",
    "Allu Arjun", "Vijay Deverakonda", "Rana Daggubati", "Nani",
    "Samantha Ruth Prabhu", "Rashmika Mandanna", "Pooja Hegde", "Nithya Menen",
]

TOLLYWOOD_DIRECTORS = [
    "S. S. Rajamouli", "Sukumar", "Trivikram Srinivas", "Koratala Siva",
    "Boyapati Srinu", "Vamshi Paidipally", "Sandeep Reddy Vanga", "Anil Ravipudi",
]

KOLLYWOOD_ACTORS = [
    "Rajinikanth", "Kamal Haasan", "Vijay", "Ajith Kumar",
    "Suriya", "Dhanush", "Vikram", "Sivakarthikeyan",
    "Nayanthara", "Trisha Krishnan", "Keerthy Suresh", "Jyotika",
]

KOLLYWOOD_DIRECTORS = [
    "Mani Ratnam", "Shankar", "Rajkumar Hirani", "Pa. Ranjith",
    "Atlee Kumar", "Nelson Dilipkumar", "Lokesh Kanagaraj", "Vetrimaaran",
]

MOLLYWOOD_ACTORS = [
    "Mohanlal", "Mammootty", "Fahadh Faasil", "Dulquer Salmaan",
    "Tovino Thomas", "Prithviraj Sukumaran", "Nivin Pauly", "Asif Ali",
    "Parvathy Thiruvothu", "Manju Warrier", "Nazriya Nazim", "Anna Ben",
]

MOLLYWOOD_DIRECTORS = [
    "Jeethu Joseph", "Lijo Jose Pellissery", "Dileesh Pothan", "Vineeth Sreenivasan",
    "Anjali Menon", "Alphonse Puthren", "Aashiq Abu", "Shyamaprasad",
]

SANDALWOOD_ACTORS = [
    "Yash", "Darshan", "Sudeep", "Puneeth Rajkumar",
    "Rakshit Shetty", "Duniya Vijay", "Ganesh", "Challenging Star Dhruva Sarja",
    "Rashmika Mandanna", "Rachita Ram", "Srinidhi Shetty", "Amulya",
]

SANDALWOOD_DIRECTORS = [
    "Prashanth Neel", "Pawan Kumar", "Guruprasad", "Om Prakash Rao",
    "Anup Bhandari", "Narthan", "Raj B. Shetty", "Suni",
]

OTT_PLATFORMS = ["Netflix", "Amazon Prime", "Disney+ Hotstar", "ZEE5", "SonyLIV", "Aha", "MX Player", "Apple TV+", "Theatre Only"]

MOVIE_TITLE_PREFIXES = [
    "The", "Ek", "Tera", "Mera", "Aaj", "Kal", "Zindagi", "Dil", "Pyaar",
    "Khoon", "Raja", "Rani", "Baazigar", "War", "Saaho", "Pushpa", "KGF",
    "RRR", "Jawan", "Pathaan", "Tiger", "Don", "Krrish", "Dhoom",
    "Vikram", "Beast", "Bigil", "Mersal", "Theri", "Baahubali",
    "Roja", "Bombay", "Dil Se", "Guru", "Raavan", "Rockstar",
    "Chak De", "Sultan", "Dangal", "Secret Superstar",
    "Ek Tha Tiger", "Bang Bang", "War", "Brahmastra", "Adipurush",
]

MOVIE_TITLE_SUFFIXES = [
    "Returns", "Rising", "Chapter 2", "Reloaded", "Origins",
    "The Beginning", "Reborn", "Legacy", "Unleashed", "Forever",
    "", "", "", "", "", "", "", "", "", "",  # More empty for single-word titles
]

def generate_title(industry):
    prefix = random.choice(MOVIE_TITLE_PREFIXES)
    suffix = random.choice(MOVIE_TITLE_SUFFIXES)
    if suffix:
        return f"{prefix}: {suffix}"
    return prefix + f" {random.randint(1, 999):03d}"

def get_cast_and_crew(industry):
    if industry == "Bollywood":
        actors = random.sample(BOLLYWOOD_ACTORS, k=random.randint(1, 3))
        director = random.choice(BOLLYWOOD_DIRECTORS)
    elif industry == "Tollywood":
        actors = random.sample(TOLLYWOOD_ACTORS, k=random.randint(1, 3))
        director = random.choice(TOLLYWOOD_DIRECTORS)
    elif industry == "Kollywood":
        actors = random.sample(KOLLYWOOD_ACTORS, k=random.randint(1, 3))
        director = random.choice(KOLLYWOOD_DIRECTORS)
    elif industry == "Mollywood":
        actors = random.sample(MOLLYWOOD_ACTORS, k=random.randint(1, 3))
        director = random.choice(MOLLYWOOD_DIRECTORS)
    else:  # Sandalwood
        actors = random.sample(SANDALWOOD_ACTORS, k=random.randint(1, 3))
        director = random.choice(SANDALWOOD_DIRECTORS)
    return actors, director

STAR_POPULARITY = {
    "Shah Rukh Khan": 9.5, "Salman Khan": 9.2, "Aamir Khan": 9.0, "Hrithik Roshan": 8.8,
    "Ranveer Singh": 8.5, "Ranbir Kapoor": 8.3, "Akshay Kumar": 8.6, "Ajay Devgn": 8.2,
    "Deepika Padukone": 8.4, "Alia Bhatt": 8.3, "Priyanka Chopra": 8.1, "Katrina Kaif": 7.8,
    "Varun Dhawan": 7.5, "Tiger Shroff": 7.4, "Ayushmann Khurrana": 8.0, "Rajkummar Rao": 7.9,
    "Prabhas": 9.3, "Ram Charan": 8.9, "Jr NTR": 8.8, "Mahesh Babu": 8.7,
    "Allu Arjun": 9.0, "Vijay Deverakonda": 8.2, "Rana Daggubati": 7.8, "Nani": 7.5,
    "Samantha Ruth Prabhu": 8.0, "Rashmika Mandanna": 8.2, "Pooja Hegde": 7.8, "Nithya Menen": 7.6,
    "Rajinikanth": 9.8, "Kamal Haasan": 9.5, "Vijay": 9.3, "Ajith Kumar": 9.1,
    "Suriya": 8.7, "Dhanush": 8.5, "Vikram": 8.6, "Sivakarthikeyan": 8.0,
    "Nayanthara": 9.0, "Trisha Krishnan": 8.3, "Keerthy Suresh": 8.0, "Jyotika": 7.8,
    "Mohanlal": 9.7, "Mammootty": 9.6, "Fahadh Faasil": 9.0, "Dulquer Salmaan": 8.8,
    "Tovino Thomas": 8.3, "Prithviraj Sukumaran": 8.5, "Nivin Pauly": 8.0, "Asif Ali": 7.5,
    "Parvathy Thiruvothu": 8.2, "Manju Warrier": 8.5, "Nazriya Nazim": 7.9, "Anna Ben": 7.5,
    "Yash": 9.4, "Darshan": 8.5, "Sudeep": 8.3, "Puneeth Rajkumar": 9.0,
    "Rakshit Shetty": 8.0, "Duniya Vijay": 7.6, "Ganesh": 7.2, "Challenging Star Dhruva Sarja": 7.5,
    "Rachita Ram": 7.5, "Srinidhi Shetty": 7.8, "Amulya": 7.3,
}

DIRECTOR_TRACK = {
    "Sanjay Leela Bhansali": 0.85, "Rajkumar Hirani": 0.95, "Rohit Shetty": 0.80, "Karan Johar": 0.75,
    "Kabir Khan": 0.78, "Zoya Akhtar": 0.82, "Anurag Kashyap": 0.70, "Vishal Bhardwaj": 0.72,
    "Nitesh Tiwari": 0.88, "Aanand L Rai": 0.75, "Shoojit Sircar": 0.83, "Imtiaz Ali": 0.76,
    "S. S. Rajamouli": 0.98, "Sukumar": 0.90, "Trivikram Srinivas": 0.82, "Koratala Siva": 0.85,
    "Boyapati Srinu": 0.78, "Vamshi Paidipally": 0.80, "Sandeep Reddy Vanga": 0.88, "Anil Ravipudi": 0.77,
    "Mani Ratnam": 0.90, "Shankar": 0.88, "Pa. Ranjith": 0.72, "Atlee Kumar": 0.85,
    "Nelson Dilipkumar": 0.80, "Lokesh Kanagaraj": 0.92, "Vetrimaaran": 0.88, "Rajkumar Hirani": 0.95,
    "Jeethu Joseph": 0.82, "Lijo Jose Pellissery": 0.75, "Dileesh Pothan": 0.80, "Vineeth Sreenivasan": 0.78,
    "Anjali Menon": 0.82, "Alphonse Puthren": 0.85, "Aashiq Abu": 0.78, "Shyamaprasad": 0.72,
    "Prashanth Neel": 0.93, "Pawan Kumar": 0.78, "Guruprasad": 0.70, "Om Prakash Rao": 0.72,
    "Anup Bhandari": 0.75, "Narthan": 0.70, "Raj B. Shetty": 0.82, "Suni": 0.74,
}

GENRE_MULTIPLIER = {
    "Action": 1.4, "Drama": 1.0, "Romance": 0.9, "Comedy": 1.1,
    "Thriller": 1.2, "Horror": 0.85, "Sci-Fi": 1.3, "Fantasy": 1.35,
    "Crime": 1.15, "Family": 1.05, "Biography": 1.0, "Sports": 1.1, "Historical": 1.2
}

def get_cast_popularity(actors):
    pops = [STAR_POPULARITY.get(a, 7.0) for a in actors]
    return round(sum(pops) / len(pops), 2)

def get_director_track(director):
    return DIRECTOR_TRACK.get(director, 0.72)

movies = []
titles_used = set()

for i in range(1000):
    # Select industry
    industries = list(INDUSTRIES.keys())
    weights = [INDUSTRIES[ind]["weight"] for ind in industries]
    industry = random.choices(industries, weights=weights, k=1)[0]
    language = INDUSTRIES[industry]["language"]

    # Title
    for _ in range(100):
        title = generate_title(industry)
        if title not in titles_used:
            titles_used.add(title)
            break

    # Cast & crew
    actors, director = get_cast_and_crew(industry)
    genre = random.choice(GENRES)
    year = random.randint(2000, 2024)

    # Budget (in crores INR)
    budget = round(random.uniform(5, 350), 2)

    # Revenue simulation
    cast_pop = get_cast_popularity(actors)
    dir_track = get_director_track(director)
    genre_mult = GENRE_MULTIPLIER[genre]
    noise = random.uniform(0.5, 1.8)
    base_revenue = budget * (cast_pop / 5) * dir_track * genre_mult * noise

    # Cap revenue for realism
    revenue = round(min(base_revenue, budget * 8), 2)

    # Rating
    rating = round(min(10, max(3, random.gauss(6.5, 1.5))), 1)
    votes = random.randint(500, 500000)

    # OTT
    ott = random.choice(OTT_PLATFORMS)

    # Success classification
    roi = revenue / budget if budget > 0 else 0
    if roi >= 2.0:
        success = "Hit"
    elif roi >= 1.0:
        success = "Average"
    else:
        success = "Flop"

    movies.append({
        "id": i + 1,
        "title": title,
        "industry": industry,
        "language": language,
        "genre": genre,
        "cast": actors,
        "director": director,
        "budget": budget,
        "revenue": revenue,
        "rating": rating,
        "votes": votes,
        "ott_platform": ott,
        "release_year": year,
        "success": success,
        "cast_popularity": cast_pop,
        "director_track_record": round(dir_track, 2),
    })

with open("movies.json", "w") as f:
    json.dump(movies, f, indent=2)

print(f"Generated {len(movies)} movies successfully!")
print(f"Industries: {set(m['industry'] for m in movies)}")
print(f"Success breakdown: Hit={sum(1 for m in movies if m['success']=='Hit')}, Average={sum(1 for m in movies if m['success']=='Average')}, Flop={sum(1 for m in movies if m['success']=='Flop')}")
