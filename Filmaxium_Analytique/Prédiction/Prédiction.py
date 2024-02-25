import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer


def standardisation_durée(duration):
    if pd.isna(duration):
        return None
    parts = duration.split(' ')
    minutes = int(parts[0][:-1]) * 60 + int(parts[1][:-1]) if len(parts) > 1 else int(parts[0][:-1])
    return minutes


file_path = 'C:/Users/nowli/OneDrive/Documents/GitHub/CinePhoria/Filmaxium_Analytique/Prédiction/Final.csv'
df = pd.read_csv(file_path)

# Prétraitement des données d'entraînement
df['Duration'] = df['Duration'].apply(standardisation_durée)
df['Duration'].fillna(df['Duration'].median(), inplace=True)
df['Notes TMDB'] = pd.to_numeric(df['Notes TMDB'], errors='coerce')
df['Notes TMDB'].fillna(df['Notes TMDB'].median(), inplace=True)
imputer = SimpleImputer(strategy='mean')
df[['NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic']] = imputer.fit_transform(df[['NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic']])


predictors = ['GG', 'DGA', 'PGA', 'SAG', 'BAFTA', 'NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic'] + \
             ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', \
              'History', 'Horror', 'Musical', 'Mystery & thriller', 'Romance', 'Sci-fi', 'War', 'Western']
X = df[predictors]
y = df['Oscar']
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)  

# Ensembles d'entraînement et de test
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Définition des hyperparamètres 
HyperTSVC = {'C': 10, 'gamma': 0.001, 'kernel': 'rbf'}
HyperTLR = {'C': 0.13755408446087358, 'penalty': 'l1', 'solver': 'saga', 'max_iter': 10000, 'random_state': 42}

#  modèle de stacking
modele_de_base = [
    ('rf', RandomForestClassifier(n_estimators=100, random_state=42)), 
    ('svc', SVC(**HyperTSVC, probability=True))
]
meta_modele = LogisticRegression(**HyperTLR)
stacking_model = StackingClassifier(estimators=modele_de_base, final_estimator=meta_modele, cv=5)

# Entraînement 
stacking_model.fit(X_train, y_train)

# Charger et prétraiter les données des nominés de 2024
df_2024 = pd.read_csv('Data_2024.csv')

X_2024 = df_2024[predictors]
X_2024_scaled = scaler.fit_transform(X_2024) 


predictions_proba_2024 = stacking_model.predict_proba(X_2024_scaled)
chances_to_win = predictions_proba_2024[:, 1]  

# Affichage des pourcentages de chance pour chaque nominé
df_2024['Chance_to_Win'] = chances_to_win
print(df_2024[['titre', 'Chance_to_Win']])