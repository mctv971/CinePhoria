import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt


file_path = 'C:/Users/nowli/OneDrive/Documents/GitHub/CinePhoria/Filmaxium_Analytique/Prédiction/Final.csv'

df = pd.read_csv(file_path)

sns.set(style='darkgrid')

corrected_genres_columns = df.columns[15:-1]

oscars_by_genre_corrected = {}

for genre in corrected_genres_columns:
    oscars_by_genre_corrected[genre] = (df[genre] * df['Oscar']).sum()


oscars_by_genre_df_corrected = pd.DataFrame(list(oscars_by_genre_corrected.items()), columns=['Genre', 'Total Oscars']).sort_values(by='Total Oscars', ascending=False)


plt.figure(figsize=(10, 8))
sns.barplot(x='Total Oscars', y='Genre', data=oscars_by_genre_df_corrected, palette='coolwarm')
plt.xlabel('Nombre total d\'Oscars', fontsize=14)
plt.ylabel('Genres', fontsize=14)
plt.title('Nombre total d\'Oscars gagnés par Genre', fontsize=16)
plt.tight_layout()

plt.show()
