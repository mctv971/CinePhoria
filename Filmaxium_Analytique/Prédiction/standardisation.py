import pandas as pd
import re

file_path = 'C:/Users/nowli/OneDrive/Documents/GitHub/CinePhoria/Filmaxium_Analytique/Prédiction/Final.csv'

df = pd.read_csv(file_path)

    # Convertir les notes :

df['Rotten Tomatoes'] = df['Rotten Tomatoes'].str.strip('%').astype('float')
df['Metacritic'] = df['Metacritic'].str.split('/').str[0]
df['Metacritic'] = pd.to_numeric(df['Metacritic'], errors= 'coerce')
df['Internet Movie Database'] = df['Internet Movie Database'].str.split('/').str[0]
df['Internet Movie Database'] = pd.to_numeric(df['Internet Movie Database'], errors = 'coerce')


 #Je remarque que je n'ai aucune donnée sur le Box Office, en attendant mon deban de RottenTomatoes je supprime cette colonne

df.pop('Boc Office')


    #Je ne suis pas satisfait du nom de mes colonnes donc je vais les renommer :

df = df.rename(columns={
        'year_film': 'year',
        'film': 'titre',
        'winner': 'Oscar',
        'TMDb Ratings': 'Notes TMDB',
        'Internet Movie Database': 'NotesIMDb',
        'Rotten Tomatoes': 'NotesRottenTomatoes',
        'Metacritic': 'NotesMetacritic',
        'IMDb Rating': 'ÉvaluationIMDb',

    })


    #Maintenant je vais gérer les genres.
    #Je commence par déterminer tout les genres présent dans mon df

genre_split = df['Genre'].dropna().str.split('/') #J'enlève les valeurs absentes et je sépare les genres par le /

genre_unique = set()
for genres in genre_split :
    genre_unique.update(genres)


genre_unique= sorted(list(genre_unique))
print(genre_unique)

    #voici les différents genres :
    #['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy',
    # 'History', 'Holiday', 'Horror', 'Kids & family',
    # 'Lgbtq+', 'Musical', 'Mystery & thriller', 'Romance', 'Sci-fi', 'War', 'Western']

    #Maintenant je vais créer des colonnes uniques pour chaque genre et atrribuer des 1 si le genre est un genre du film ou 0 sinnon
for genre in genre_unique:
    # Pour chaque genre, créer une colonne et définir 0 ou 1 si le genre est présent dans la ligne
    df[genre] = df['Genre'].str.contains(genre, na=False).astype(int)

print(df.head)



    #je n'ai plus besoin de mes colonnes genres

df.pop('Genre')
df.pop('Genre.1')
df.pop('TMDb Genre')


    #Maintenant je vais attribuer le nombre de nomination aux oscars de mes films :

nomination = pd.read_csv('Data/nomminations.csv')

nomination.rename(columns={'film_text': 'titre'}, inplace=True)
merged = df.merge(nomination[['titre', 'Nominations']], on='titre', how='left')
merged['Nominations'].fillna(0, inplace=True)
merged['Nominations'] = merged['Nominations'].astype(int)




    # Standardisation de l'heure :
def standardisation_heure(duration):
    # Convertir les heures de str à un int (en minutes)
    if pd.isna(duration):
        return None

    match = re.match(r'(?:(\d+)h)?\s*(?:(\d+)m)?', duration)
    if not match:
        return None

    hours, minutes = match.groups()
    hours = int(hours) if hours else 0
    minutes = int(minutes) if minutes else 0
    total_minutes = hours * 60 + minutes
    return total_minutes

# Appliquer la fonction au DataFrame
merged['Duration'] = merged['Duration'].apply(standardisation_heure)

merged.to_csv('Final.csv', index = True)


