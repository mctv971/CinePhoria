import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os

file_path = r'C:\Users\nowli\OneDrive\Documents\GitHub\CinePhoria\Filmaxium_Analytique\Prédiction\Final.csv'


df = pd.read_csv(file_path)

df['NotesRottenTomatoes'] = pd.to_numeric(df['NotesRottenTomatoes'], errors='coerce')
df['NotesMetacritic'] = pd.to_numeric(df['NotesMetacritic'], errors='coerce')

# Calcul des moyennes
mean_rt_non_gagnants = df[df['Oscar'] == 0]['NotesRottenTomatoes'].median()
mean_rt_gagnants = df[df['Oscar'] == 1]['NotesRottenTomatoes'].median()
mean_mc_non_gagnants = df[df['Oscar'] == 0]['NotesMetacritic'].median()
mean_mc_gagnants = df[df['Oscar'] == 1]['NotesMetacritic'].median()

fig, axs = plt.subplots(2, 2, figsize=(10, 6), sharey='row')

sns.histplot(df[df['Oscar'] == 0]['NotesRottenTomatoes'], kde=True, ax=axs[0, 0], color='red', bins=20)
axs[0, 0].axvline(mean_rt_non_gagnants, color='black', linestyle='--', linewidth=2, label=f'Moyenne: {mean_rt_non_gagnants:.2f}')
axs[0, 0].set_title('Rotten Tomatoes - Non-Gagnants')
axs[0, 0].set_xlabel('Notes')
axs[0, 0].set_ylabel('Nombre de films')

sns.histplot(df[df['Oscar'] == 1]['NotesRottenTomatoes'], kde=True, ax=axs[0, 1], color='blue', bins=20)
axs[0, 1].axvline(mean_rt_non_gagnants, color='black', linestyle='--', linewidth=2, label=f'Moyenne: {mean_rt_non_gagnants:.2f}')
axs[0, 1].set_title('Rotten Tomatoes - Gagnants')
axs[0, 1].set_xlabel('Notes')
axs[0, 1].set_ylabel('Nombre de films')

sns.histplot(df[df['Oscar'] == 0]['NotesMetacritic'], kde=True, ax=axs[1, 0], color='red', bins=20)
axs[1, 0].axvline(mean_rt_non_gagnants, color='black', linestyle='--', linewidth=2, label=f'Moyenne: {mean_rt_non_gagnants:.2f}')
axs[1, 0].set_title('Metacritic - Non-Gagnants')
axs[1, 0].set_xlabel('Notes')
axs[1, 0].set_ylabel('Nombre de films')

sns.histplot(df[df['Oscar'] == 1]['NotesMetacritic'], kde=True, ax=axs[1, 1], color='blue', bins=20)
axs[1, 1].axvline(mean_rt_non_gagnants, color='black', linestyle='--', linewidth=2, label=f'Moyenne: {mean_rt_non_gagnants:.2f}')
axs[1, 1].set_title('Metacritic - Gagnants')
axs[1, 1].set_xlabel('Notes')
axs[1, 1].set_ylabel('Nombre de films')

plt.tight_layout()
plt.show()
