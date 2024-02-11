import pandas as pd
import matplotlib.pyplot as plt
import re  # N'oubliez pas d'importer le module re pour les expressions régulières

# Chargement des données
df = pd.read_csv('Data/Data.csv')

# Conversion des notes
df['Rotten Tomatoes'] = df['Rotten Tomatoes'].str.strip('%').astype('float') / 100  # Convertir en pourcentage réel
df['Metacritic'] = df['Metacritic'].str.split('/').str[0].astype('float')  # Assurez-vous que Metacritic est un float
df['Internet Movie Database'] = df['Internet Movie Database'].str.split('/').str[0].astype('float')  # Convertir IMDb en float

# Renommage des colonnes
df.rename(columns={
    'year_film': 'Année',
    'film': 'Titre',
    'winner': 'Oscar',
    'TMDb Ratings': 'Notes TMDB',
    'Internet Movie Database': 'Notes IMDb',
    'Rotten Tomatoes': 'Notes Rotten Tomatoes',
    'Metacritic': 'Notes Metacritic',
    'IMDb Rating': 'Évaluation IMDb',
}, inplace=True)

# Sauvegarde des modifications
df.to_csv('Data/Test.csv', index=False)

# Traitement des genres
genres = df['Genre'].dropna().str.split('/')
genre_unique = sorted(set([genre for sublist in genres for genre in sublist]))

# Création de colonnes de genre
for genre in genre_unique:
    df[genre] = df['Genre'].str.contains(genre, na=False).astype(int)

# Suppression des anciennes colonnes de genre
df.drop(['Genre', 'Genre.1', 'TMDb Genre'], axis=1, inplace=True)

# Fusion avec les données de nominations
nomination = pd.read_csv('Data/nominations.csv')
nomination.rename(columns={'film_text': 'Titre'}, inplace=True)
merged = df.merge(nomination[['Titre', 'Nominations']], on='Titre', how='left')
merged['Nominations'].fillna(0, inplace=True)
merged['Nominations'] = merged['Nominations'].astype(int)

# Standardisation de la durée
def standardisation_heure(duration):
    if pd.isna(duration):
        return None
    match = re.match(r'(?:(\d+)h)?\s*(?:(\d+)m)?', duration)
    if not match:
        return None
    hours, minutes = match.groups(default='0')
    return int(hours) * 60 + int(minutes)

merged['Duration'] = merged['Duration'].apply(standardisation_heure)

# Sauvegarde du DataFrame final
merged.to_csv('Data/Final.csv', index=False)
