import requests
import pandas as pd
import time
# Charger le fichier CSV
df = pd.read_csv('Data/Data.csv')

# Votre clé API OMDB
api_key = '895d690'

def get_imdb_id(title, year):
    url = f"http://www.omdbapi.com/?t={title}&y={year}&apikey={api_key}"
    try:
        response = requests.get(url)
        # Vérifier si la réponse est réussie
        if response.status_code == 200:
            data = response.json()
            return data.get('imdbID', None)
        else:
            print(f"Erreur HTTP: {response.status_code} pour le film {title} ({year})")
            return None
    except requests.RequestException as e:
        print(f"Erreur de requête pour le film {title} ({year}): {e}")
    except ValueError as e:
        print(f"Erreur de JSON pour le film {title} ({year}): {e}")

    return None


df['imdbID'] = df.apply(lambda row: get_imdb_id(row['film'], row['year_film']), axis=1)

# Sauvegarder les résultats dans un nouveau fichier CSV
df.to_csv('Data/Data.csv', index=False)
