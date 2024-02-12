import requests
from bs4 import BeautifulSoup
import pandas as pd

#NE PAS LANCER LE SCRIPT SAUF SI VOUS VOULEZ VOUS FAIRE BAN 

# Fonction pour effectuer le scraping de Rotten Tomatoes
def scrape_rotten_tomatoes(url):
    try:
        response = requests.get(url)
        if response.status_code != 200:
            return None, None

        soup = BeautifulSoup(response.content, 'html.parser')
        info = soup.find('p', {'slot': 'info', 'class': 'info'})
        if info:
            parts = info.text.split(',')
            if len(parts) >= 3:
                genre = parts[1].strip()
                duration = parts[2].strip()
                return genre, duration
        return None, None
    except Exception as e:
        print(f"Erreur lors du scraping de {url}: {e}")
        return None, None


# Chargement du DataFrame
#cHARGER ICI

# Ajout de nouvelles colonnes pour le genre et la durée
df['Genre'] = None
df['Duration'] = None

# Mise à jour des informations pour chaque film
for index, row in df.iterrows():
    # Construire l'URL de Rotten Tomatoes (à adapter selon la structure de votre DataFrame)
    film_name = row['film'].replace(' ', '_').lower()
    url = f"https://www.rottentomatoes.com/m/{film_name}"
    genre, duration = scrape_rotten_tomatoes(url)

    df.at[index, 'Genre'] = genre
    df.at[index, 'Duration'] = duration

# Sauvegarde du DataFrame enrichi
df.to_csv('sortie du fichier', index=False)
