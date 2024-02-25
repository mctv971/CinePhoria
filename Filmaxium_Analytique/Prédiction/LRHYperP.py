import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.model_selection import RandomizedSearchCV
from sklearn.pipeline import make_pipeline
from scipy.stats import uniform


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

# Définir le modèle de régression logistique
logistic_model = LogisticRegression(solver='saga', max_iter=10000)  

# Définir l'espace des hyperparamètres
param_distributions = {
    'C': uniform(loc=0, scale=4),  
    'penalty': ['l2', 'l1'], 
}


random_search = RandomizedSearchCV(logistic_model, param_distributions, n_iter=100, cv=5, verbose=2, random_state=42, n_jobs=-1)


random_search.fit(X_scaled, y)

# Afficher les meilleurs hyperparamètres et le meilleur score
print("Meilleurs hyperparamètres:", random_search.best_params_)
print("Meilleur score:", random_search.best_score_)

#Meilleurs hyperparamètres: {'C': 0.13755408446087358, 'penalty': 'l1'}
#Meilleur score: 0.872376738305942
#SVM Meilleur score : 0.8706068268015171
# Avec l'hypertuning mon modèle de regression linéaire est plus efficace ! 
