import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Remplacer par le chemin d'accès correct sur votre système
file_path = 'C:/Users/nowli/OneDrive/Documents/GitHub/CinePhoria/Filmaxium_Analytique/Prédiction/Final.csv'

df = pd.read_csv(file_path)

def standardisation_durée(duration):
    if pd.isna(duration):
        return None
    parts = duration.split(' ')
    minutes = int(parts[0][:-1]) * 60 + int(parts[1][:-1]) if len(parts) > 1 else int(parts[0][:-1])
    return minutes

df['Duration'] = df['Duration'].apply(standardisation_durée)
df['Duration'].fillna(df['Duration'].median(), inplace=True)
df['Notes TMDB'] = pd.to_numeric(df['Notes TMDB'], errors='coerce')
df['Notes TMDB'].fillna(df['Notes TMDB'].median(), inplace=True)



X = df.drop(['titre', 'Oscar', 'imdbID'], axis=1)

X =X = df.drop(['titre', 'Oscar', 'imdbID'], axis=1)

X = X.fillna(X.median())
# Ensure no NaN values remain
print(X.isnull().sum())


