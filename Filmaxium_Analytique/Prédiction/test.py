from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

final_df = pd.read_csv('Final.csv')

def convert_duration_to_minutes(duration):
    if pd.isnull(duration):
        return np.nan
    parts = duration.split(' ')
    minutes = 0
    for part in parts:
        if 'h' in part:
            minutes += int(part.replace('h', '')) * 60
        if 'm' in part:
            minutes += int(part.replace('m', ''))
    return minutes

# Appliquer la conversion de la durée
final_df['Duration'] = final_df['Duration'].apply(convert_duration_to_minutes)

# Remplacer les chaînes vides par NaN pour une imputation correcte
final_df.replace('', np.nan, inplace=True)

# Sélection des caractéristiques pour le modèle
features = ['Duration', 'GG', 'DGA', 'PGA', 'SAG', 'BAFTA', 'NotesIMDb', 'NotesRottenTomatoes', 'NotesMetacritic', 'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'History', 'Horror', 'Kids & family', 'Lgbtq+', 'Musical', 'Mystery & thriller', 'Romance', 'Sci-fi', 'War', 'Western', 'Nommination Bafta', 'Nommination SAG', 'Nommination PGA', 'Nommination DGA', 'Nommination GG']
X = final_df[features]
y = final_df['Oscar']  # Cible : Oscar gagné (1 ou 0)


numeric_features = X.select_dtypes(include=['int64', 'float64']).columns
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())])


preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features)])


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


model = Pipeline(steps=[('preprocessor', preprocessor),
                        ('classifier', RandomForestRegressor(n_estimators=100, random_state=42))])

model.fit(X_train, y_train)


y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

mse, r2

#Le r2 est trop faible je dois trouver un autre modèle.