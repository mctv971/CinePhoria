import pandas as pd
import matplotlib.pyplot as plt 
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

file_path = 'C:/Users/nowli/OneDrive/Documents/GitHub/CinePhoria/Filmaxium_Analytique/Prédiction/Final.csv'

df = pd.read_csv(file_path)

def standardisation_durée(duration):
    if pd.isna(duration):
        return None
    parts = duration.split(' ')
    minutes = int(parts[0][:-1]*60 +int(parts[1][:-1]) if len(parts) > 1 else int(parts[0][:-1]))
    return minutes
#Application de la fonction
df['Duration']= df['Duration'].apply(standardisation_durée)
#Gestion des valeurs manquantes
df['Duration'].fillna(df['Duration'].median(), inplace = True)

df['Notes TMDB'] = pd.to_numeric(df['Notes TMDB'], errors='coerce')
df['Notes TMDB'].fillna(df['Notes TMDB'].median(), inplace= True)

#Mise en place des données pour l'entrainement : 

X = df.drop(['titre', 'Oscar'], axis=1)
y = df['Oscar']


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = LogisticRegression()
model.fit(X_train_scaled, y_train)

# Prédiction sur l'ensemble de test
y_pred = model.predict(X_test_scaled)

# Calcul et affichage des métriques
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"Accuracy: {accuracy}")
print(f"Precision: {precision}")
print(f"Recall: {recall}")
print(f"F1 Score: {f1}")





