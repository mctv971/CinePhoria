import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
import xgboost as xgb

# Charger les données
file_path = 'C:/Users/nowli/OneDrive/Documents/GitHub/CinePhoria/Filmaxium_Analytique/Prédiction/Final.csv'
df = pd.read_csv(file_path)

# Fonctions de prétraitement (standardisation_durée, etc.)

# Gestion des valeurs manquantes et sélection des prédicteurs
imputer = SimpleImputer(strategy='mean')
df[['NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic']] = imputer.fit_transform(df[['NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic']])

predictors = ['GG', 'DGA', 'PGA', 'SAG', 'BAFTA', 'NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic'] + ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'History', 'Horror', 'Musical', 'Mystery & thriller', 'Romance', 'Sci-fi', 'War', 'Western']
X = df[predictors]
y = df['Oscar']

# Normalisation des prédicteurs
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Configuration de RandomizedSearchCV pour XGBoost
param_distributions = {
    'n_estimators': [100, 200, 300, 500, 600, 700,],
    'learning_rate': [0.01, 0.05, 0.1,0.001,0.0001, 1], 
    'max_depth': [3, 5, 7, 9],
    'min_child_weight': [1, 3, 5],
    'subsample': [0.6, 0.8, 1.0],
    'colsample_bytree': [0.6, 0.8, 1.0],
}

random_search_xgb = RandomizedSearchCV(estimator=xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42),
                                       param_distributions=param_distributions,
                                       n_iter=100,
                                       cv=5,
                                       scoring='accuracy',
                                       n_jobs=-1,
                                       random_state=42)

random_search_xgb.fit(X_scaled, y)

# Affichage des meilleurs hyperparamètres pour XGBoost
print("Meilleurs hyperparamètres pour XGBoost:", random_search_xgb.best_params_)

# Entraînement et évaluation du modèle de forêt aléatoire
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_scaled, y)

accuracy_scores_rf = cross_val_score(rf_model, X_scaled, y, cv=5, scoring='accuracy')
roc_auc_scores_rf = cross_val_score(rf_model, X_scaled, y, cv=5, scoring='roc_auc')

mean_accuracy_rf = accuracy_scores_rf.mean()
mean_roc_auc_rf = roc_auc_scores_rf.mean()

print(f'\nMoyenne de la précision (Accuracy) avec la forêt aléatoire: {mean_accuracy_rf:.4f}')
print(f'Moyenne du score AUC avec la forêt aléatoire: {mean_roc_auc_rf:.4f}')

# Optionnel: Évaluation du modèle XGBoost avec les meilleurs hyperparamètres
best_xgb_model = random_search_xgb.best_estimator_
accuracy_scores_xgb = cross_val_score(best_xgb_model, X_scaled, y, cv=5, scoring='accuracy')
mean_accuracy_xgb = accuracy_scores_xgb.mean()
print(f'\nMoyenne de la précision (Accuracy) avec le meilleur modèle XGBoost: {mean_accuracy_xgb:.4f}')

#Meilleurs hyperparamètres pour XGBoost: {'subsample': 0.8, 'n_estimators': 300, 'min_child_weight': 3, 'max_depth': 9, 'learning_rate': 0.01, 'colsample_bytree': 1.0}
#Moyenne de la précision (Accuracy) avec la forêt aléatoire: 0.8457
#Moyenne du score AUC avec la forêt aléatoire: 0.6872