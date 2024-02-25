from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
import pandas as pd 


file_path = 'C:/Users/nowli/OneDrive/Documents/GitHub/CinePhoria/Filmaxium_Analytique/Prédiction/Final.csv'
df = pd.read_csv(file_path)

# Fonction de standardisation de la durée
def standardisation_duree(duration):
    if pd.isna(duration):
        return None
    parts = duration.split(' ')
    minutes = int(parts[0][:-1]) * 60 + int(parts[1][:-1]) if len(parts) > 1 else int(parts[0][:-1])
    return minutes

# Application de la fonction de standardisation de la durée
df['Duration'] = df['Duration'].apply(standardisation_duree)

# Remplacement des valeurs manquantes de la durée par la médiane
df['Duration'].fillna(df['Duration'].median(), inplace=True)

# Conversion des notes TMDB en numérique et gestion des valeurs manquantes
df['Notes TMDB'] = pd.to_numeric(df['Notes TMDB'], errors='coerce')
df['Notes TMDB'].fillna(df['Notes TMDB'].median(), inplace=True)

# Sélection des variables cibles
predictors = ['Duration', 'GG', 'DGA', 'PGA', 'SAG', 'BAFTA', 'Notes TMDB'] + list(df.columns[df.columns.str.contains('Nommination|Action|Adventure|Animation|Biography|Comedy|Crime|Documentary|Drama|Fantasy|History|Horror|Musical|Mystery & thriller|Romance|Sci-fi|War|Western')])
X = df[predictors]
y = df['Oscar']

# Normalisatiojn
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Division de l'ensemble
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

svm_best_params = {'C': 10, 'gamma': 'scale', 'kernel': 'linear'}
svm_model = SVC(**svm_best_params)
svm_model.fit(X_train, y_train)


accuracy = svm_model.score(X_test, y_test)
print(accuracy)
