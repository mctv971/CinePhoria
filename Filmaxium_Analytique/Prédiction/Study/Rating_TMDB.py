import requests
import pandas as pd


api_key = '484b985c6e782eb80c4f40efc283376c'

def get_movie_id(title):

    url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={title}"
    response = requests.get(url)
    data = response.json()

#J'avais énormément d'erreur , j'ai demandé à chatgpt de m'aider à y voir plus clair et ce print( "Response :" data) m'a été d'une grande aidé !
    print("Réponse de l'API :", data)

    if 'results' in data and data['results']:
        return data['results'][0]['id']  # Retourne l'ID du premier résultat
    return None


def get_movie_rating(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}"
    response = requests.get(url)
    data = response.json()
    return data.get('vote_average')


df = pd.read_csv('Data/Data.csv')


ratings = []
for title in df['film']:
    movie_id = get_movie_id(title)
    if movie_id:
        rating = get_movie_rating(movie_id)
        ratings.append(rating)
    else:
        ratings.append('Non Disponible')

df['TMDb Ratings'] = ratings

df.to_csv('Data/Data.csv', index=False)
