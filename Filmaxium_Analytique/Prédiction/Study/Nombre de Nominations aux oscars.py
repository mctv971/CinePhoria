import pandas as pd


Test_df = pd.read_csv('Data/Test.csv')
oscar_df = pd.read_csv('Data.the_oscar_award (2).csv')

oscar_nominations = oscar_df.groupby('film').size()

# Renommer la série pour une fusion claire
oscar_nominations = oscar_nominations.rename('Nombre de Nominations')

# Fusionner les données de nominations avec le fichier Test sur le titre du film
test_df = test_df.merge(oscar_nominations, how='left', left_on='titre', right_index=True)

# Remplacer les valeurs NaN par 0 pour les films sans nominations
test_df['Nombre de Nominations'] = test_df['Nombre de Nominations'].fillna(0).astype(int)

# Afficher les premières lignes pour vérifier la fusion
test_df.head()

modified_test_file_path = 'Data/Test.csv'

# Sauvegarder le fichier modifié
test_df.to_csv(modified_test_file_path, index=False)

