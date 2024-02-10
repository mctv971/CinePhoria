import requests
import pandas as pd
from datetime import datetime


api_key = '484b985c6e782eb80c4f40efc283376c'

def get_genre_and_release_date_by_movie_id(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}"
    response = requests.get(url)
    data = response.json()

    genre = data['genres'][0]['name'] if 'genres' in data and data['genres'] else 'Non Disponible'
    release_date = data['release_date'] if 'release_date' in data else 'Non Disponible'
    return genre, release_date

def get_quarter(release_date):
    if release_date != 'Non Disponible':
        month = datetime.strptime(release_date, '%Y-%m-%d').month
        return (month - 1) // 3 + 1
    return 'Non Disponible'


df = pd.read_csv('Data/Data.csv')


genres = []
quarters = []
for title in df['film']:
    genre, release_date = get_genre_and_release_date_by_movie_id(title)
    quarter = get_quarter(release_date)
    genres.append(genre)
    quarters.append(quarter)


df['TMDb Genre'] = genres
df['Release Quarter'] = quarters


df.to_csv('Data/Data.csv', index=False)
