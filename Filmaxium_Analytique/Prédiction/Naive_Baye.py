import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer

# Charger les données
file_path = 'C:/Users/nowli/OneDrive/Documents/GitHub/CinePhoria/Filmaxium_Analytique/Prédiction/Final.csv'
df = pd.read_csv(file_path)

def standardisation_durée(duration):
    if pd.isna(duration):
        return None
    parts = duration.split(' ')
    minutes = int(parts[0][:-1]) * 60 + int(parts[1][:-1]) if len(parts) > 1 else int(parts[0][:-1])
    return minutes

df['Duration'] = df['Duration'].apply(standardisation_durée)
df['Duration'] = df['Duration'].fillna(df['Duration'].median())
df['Notes TMDB'] = pd.to_numeric(df['Notes TMDB'], errors='coerce')
df['Notes TMDB'] = df['Notes TMDB'].fillna(df['Notes TMDB'].median())

# Gestion des valeurs manquantes pour les notes avec imputation par la moyenne
imputer = SimpleImputer(strategy='mean')
df[['NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic']] = imputer.fit_transform(df[['NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic']])

# Sélection des prédicteurs
predictors = ['GG', 'DGA', 'PGA', 'SAG', 'BAFTA', 'NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic'] + ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'History', 'Horror', 'Musical', 'Mystery & thriller', 'Romance', 'Sci-fi', 'War', 'Western']
X = df[predictors]
y = df['Oscar']

# Diviser les données en ensembles d'entraînement et de test AVANT l'entraînement du modèle
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Créer et entraîner le modèle Naive Bayes
model = GaussianNB()
model.fit(X_train, y_train)

# Faire des prédictions
y_pred = model.predict(X_test)

# Évaluer le modèle
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy}')

# 0.20353982300884957 d'accuracy xdddddddddddddd