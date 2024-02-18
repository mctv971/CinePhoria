# Imports nécessaires
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer


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

# Gestion des valeurs manquantes pour les notes avec imputation par la moyenne
imputer = SimpleImputer(strategy='mean')
df[['NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic']] = imputer.fit_transform(df[['NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic']])

# Sélection des prédicteurs
predictors = ['GG', 'DGA', 'PGA', 'SAG', 'BAFTA', 'NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic'] + ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'History', 'Horror', 'Musical', 'Mystery & thriller', 'Romance', 'Sci-fi', 'War', 'Western']
X = df[predictors]
y = df['Oscar']

# Normalisation des prédicteurs
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Entraînement du modèle de régression logistique
model = LogisticRegression(max_iter=1000)

# Entraîner le modèle sur l'ensemble du jeu de données normalisé
model.fit(X_scaled, y)

# Extraire les coefficients du modèle et les associer aux prédicteurs
feature_importance = pd.DataFrame(model.coef_[0], index=predictors, columns=['Coefficient']).sort_values(by='Coefficient', ascending=False)

# Afficher les importances des caractéristiques
print("Importance des caractéristiques dans la prédiction du gagnant des Oscars :")
print(feature_importance)

# Validation croisée avec 5 folds pour évaluer la performance du modèle
accuracy_scores = cross_val_score(model, X_scaled, y, cv=5, scoring='accuracy')
roc_auc_scores = cross_val_score(model, X_scaled, y, cv=5, scoring='roc_auc')

# Calcul et affichage des moyennes des scores de performance
mean_accuracy = accuracy_scores.mean()
mean_roc_auc = roc_auc_scores.mean()

print(f'\nMoyenne de la précision (Accuracy): {mean_accuracy:.4f}')
print(f'Moyenne du score AUC: {mean_roc_auc:.4f}')