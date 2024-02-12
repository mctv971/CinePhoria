import requests
import pandas as pd


cle = '1e26b158'

df = pd.read_csv('Data/Data.csv')

def get_ratings(imdb_id):
    url = f"http://www.omdbapi.com/?i={imdb_id}&apikey={cle}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            ratings = {rating['Source']: rating['Value'] for rating in data.get('Ratings', [])}
            return ratings
        else:
            print(f"Erreur HTTP: {response.status_code} pour {imdb_id}")
            return {}
    except ValueError as e:
        print(f"Erreur de JSON pour {imdb_id}: {e}")
        return {}

# Ajouter des colonnes 
for source in ['Internet Movie Database', 'Rotten Tomatoes', 'Metacritic']:
    df[source] = ''

# Mise à jour 
for index, row in df.iterrows():
    imdb_id = row['imdbID']
    ratings = get_ratings(imdb_id)
    for source in ratings:
        df.at[index, source] = ratings[source]

# Save
df.to_csv('Data/Data.csv', index=False)
