# Imports nécessaires
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
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

# Entraînement du modèle de forêt aléatoire
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_scaled, y)

# Utilisation de la validation croisée pour évaluer la performance du modèle de forêt aléatoire
accuracy_scores_rf = cross_val_score(rf_model, X_scaled, y, cv=5, scoring='accuracy')
roc_auc_scores_rf = cross_val_score(rf_model, X_scaled, y, cv=5, scoring='roc_auc')

# Calcul et affichage des moyennes des scores de performance pour la forêt aléatoire
mean_accuracy_rf = accuracy_scores_rf.mean()
mean_roc_auc_rf = roc_auc_scores_rf.mean()

print(f'\nMoyenne de la précision (Accuracy) avec la forêt aléatoire: {mean_accuracy_rf:.4f}')
print(f'Moyenne du score AUC avec la forêt aléatoire: {mean_roc_auc_rf:.4f}')
