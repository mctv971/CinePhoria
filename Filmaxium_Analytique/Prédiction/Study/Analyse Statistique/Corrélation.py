import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os


base_dir = os.path.dirname(__file__) 
file_path = os.path.join(base_dir,'Final.csv')

df = pd.read_csv(file_path)


relevant_columns = ['Oscar', 'GG', 'DGA', 'PGA', 'SAG', 'BAFTA', 'Nombre de Nominations']
df_relevant = df[relevant_columns]


matrix = df_relevant.corr()


plt.figure(figsize=(10, 8))
sns.heatmap(matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=.5)
plt.title('Matrice de Corrélation des Prix Gagnés, Nominations, et Victoires aux Oscars')
plt.show()
