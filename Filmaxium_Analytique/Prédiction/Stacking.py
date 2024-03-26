import pandas as pd 
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

from sklearn.impute import SimpleImputer

file_path = r'C:\Users\nowli\OneDrive\Bureau\Filmaxium\CinePhoria\Filmaxium_Analytique\Prédiction\Final1.csv'
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
predictors = ['GG', 'DGA', 'PGA', 'SAG', 'BAFTA', 'NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic','Oscar_Nominations'] + ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'History', 'Horror', 'Musical', 'Mystery & thriller', 'Romance', 'Sci-fi', 'War', 'Western']
X = df[predictors]
y = df['Oscar']

# Normalisation des prédicteurs
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train , X_test , y_train, y_test = train_test_split(X_scaled, y, test_size= 0.2 , random_state= 42)

#Définiton des me hyperparamètres
HyperTSVC = {'C': 10, 'gamma': 0.001, 'kernel': 'rbf'}

HyperTLR = {'C': 0.13755408446087358, 'penalty': 'l1', 'solver': 'saga', 'max_iter': 10000, 'random_state': 42}

#Premier Niveau
modele_de_base = [
    ('rf', RandomForestClassifier(n_estimators= 100, random_state= 42)), 
    ('svc', SVC(**HyperTSVC))
]

#Meta Modele
meta_modele = LogisticRegression(**HyperTLR)

# Modèle de stacking
stacking_model = StackingClassifier(estimators=modele_de_base, final_estimator=meta_modele, cv=5)

# Entraînement
stacking_model.fit(X_train, y_train)

# Évaluation
accuracy = stacking_model.score(X_test, y_test)
print(f'Accuracy du modèle de stacking sur l\'ensemble de test: {accuracy:.4f}')

#Accuracy du modèle de stacking sur l'ensemble de test: 0.8761 L'accuracy a augmenté je suis aux anges