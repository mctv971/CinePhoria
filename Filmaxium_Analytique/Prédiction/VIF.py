import pandas as pd
import statsmodels.api as sm
from sklearn.impute import SimpleImputer
import numpy as np

# Chemin vers votre fichier CSV
file_path = 'C:/Users/nowli/OneDrive/Documents/GitHub/CinePhoria/Filmaxium_Analytique/Prédiction/Final.csv'
df = pd.read_csv(file_path)

# Fonction pour standardiser la durée
def standardisation_durée(duration):
    if pd.isna(duration):
        return None
    parts = duration.split(' ')
    minutes = int(parts[0][:-1]) * 60 + int(parts[1][:-1]) if len(parts) > 1 else int(parts[0][:-1])
    return minutes

# Application de la standardisation de la durée et gestion des valeurs manquantes
df['Duration'] = df['Duration'].apply(standardisation_durée)
df['Duration'] = df['Duration'].fillna(df['Duration'].median())
df['Notes TMDB'] = pd.to_numeric(df['Notes TMDB'], errors='coerce')
df['Notes TMDB'] = df['Notes TMDB'].fillna(df['Notes TMDB'].median())

# Imputation des valeurs manquantes pour les autres notes
imputer = SimpleImputer(strategy='mean')
df[['NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic']] = imputer.fit_transform(df[['NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic']])

# Fonction pour calculer le VIF
def calculate_vif(data):
    vif_df = pd.DataFrame(columns=['Var', 'Vif'])
    x_var_names = data.columns
    for i in range(0, x_var_names.shape[0]):
        y = data[x_var_names[i]].values
        x = data[x_var_names.drop([x_var_names[i]])]
        x = sm.add_constant(x)  # Ajout d'une constante pour le terme d'intercept
        r_squared = sm.OLS(y, x).fit().rsquared
        vif = round(1 / (1 - r_squared), 2)
        vif_df.loc[i] = [x_var_names[i], vif]
    return vif_df.sort_values(by='Vif', axis=0, ascending=False, inplace=False)


X = df.drop(['titre', 'Oscar', 'Duration','imdbID'], axis=1)  # Suppression des colonnes non pertinentes ou non numériques
# Identifier les colonnes contenant des valeurs NaN


# Conversion des types pour toutes les colonnes en numériques et traitement des valeurs infinies ou manquantes
for col in X.columns:
    X[col] = pd.to_numeric(X[col], errors='coerce')  # Convertir en numérique, 'coerce' transforme les erreurs en NaN

# Remplacer les valeurs infinies par NaN
X.replace([np.inf, -np.inf], np.nan, inplace=True)

# Appliquer l'imputation sur l'ensemble du DataFrame pour traiter toutes les valeurs NaN restantes
imputer = SimpleImputer(strategy='median')  # Utiliser 'median' peut être plus robuste que 'mean' pour certaines données
X_imputed = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

# Assurer que le DataFrame n'a plus de valeurs NaN
assert not X_imputed.isnull().values.any(), "Il y a encore des valeurs NaN dans le DataFrame après l'imputation."

# Fonction calculate_vif inchangée...

# Calcul du VIF sur les données imputées
vif_data = calculate_vif(X_imputed)
print(vif_data)
# Calcul du VIF pour les variables prédictives sélectionnées

