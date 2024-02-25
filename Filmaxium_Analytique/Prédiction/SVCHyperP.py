import pandas as pd 
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC
import numpy as np
from sklearn.preprocessing import StandardScaler


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

# Définir le modèle SVM
svm_model = SVC()

# Définir la grille d'hyperparamètres à tester
param_grid = {
    'C': [0.1, 1, 10, 100],  # Valeurs de pénalité de l'erreur
    'gamma': [1, 0.1, 0.01, 0.001],  # Coefficient pour les noyaux 'rbf', 'poly' et 'sigmoid'
    'kernel': ['rbf', 'linear']  # Type de noyau à utiliser
}

# Configurer GridSearchCV
grid_search = GridSearchCV(estimator=svm_model, param_grid=param_grid, cv=5, scoring='accuracy', verbose=2, n_jobs=-1)

# Exécuter la recherche par grille
grid_search.fit(X_scaled, y)

# Afficher les meilleurs hyperparamètres et le meilleur score
print("Meilleurs hyperparamètres:", grid_search.best_params_)
print("Meilleur score:", grid_search.best_score_)

#Meilleurs hyperparamètres: {'C': 10, 'gamma': 0.001, 'kernel': 'rbf'}
#Meilleur score: 0.8706068268015171
