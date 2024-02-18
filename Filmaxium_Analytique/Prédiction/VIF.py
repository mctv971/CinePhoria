import pandas as pd
import statsmodels.api as sm
from sklearn.impute import SimpleImputer

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

# Préparation du DataFrame pour le calcul du VIF
X = df.drop(['titre', 'Oscar', 'Duration'], axis=1)  # Suppression des colonnes non pertinentes ou non numériques

# Calcul du VIF pour les variables prédictives sélectionnées
vif_data = calculate_vif(X)
print(vif_data)
