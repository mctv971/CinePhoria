import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


# Conversion des notes de Rotten Tomatoes et Metacritic en numérique
data['NotesRottenTomatoes'] = pd.to_numeric(data['NotesRottenTomatoes'], errors='coerce')
data['NotesMetacritic'] = pd.to_numeric(data['NotesMetacritic'], errors='coerce')

# Définition du nombre de bins pour augmenter le détail sur l'axe des x
bins_rt_mc = 20

# Création de subplots pour les histogrammes
fig, axs = plt.subplots(2, 2, figsize=(14, 10), sharey='row')

# Histogrammes pour les notes de Rotten Tomatoes
sns.histplot(data[data['Oscar'] == 0]['NotesRottenTomatoes'], kde=True, ax=axs[0, 0], color='skyblue', bins=bins_rt_mc)
axs[0, 0].set_title('Rotten Tomatoes - Non-Gagnants')
axs[0, 0].set_xlabel('Notes')
axs[0, 0].set_ylabel('Nombre de Films')

sns.histplot(data[data['Oscar'] == 1]['NotesRottenTomatoes'], kde=True, ax=axs[0, 1], color='salmon', bins=bins_rt_mc)
axs[0, 1].set_title('Rotten Tomatoes - Gagnants')
axs[0, 1].set_xlabel('Notes')
axs[0, 1].set_ylabel('Nombre de Films')

# Histogrammes pour les notes de Metacritic
sns.histplot(data[data['Oscar'] == 0]['NotesMetacritic'], kde=True, ax=axs[1, 0], color='skyblue', bins=bins_rt_mc)
axs[1, 0].set_title('Metacritic - Non-Gagnants')
axs[1, 0].set_xlabel('Notes')
axs[1, 0].set_ylabel('Nombre de Films')

sns.histplot(data[data['Oscar'] == 1]['NotesMetacritic'], kde=True, ax=axs[1, 1], color='salmon', bins=bins_rt_mc)
axs[1, 1].set_title('Metacritic - Gagnants')
axs[1, 1].set_xlabel('Notes')
axs[1, 1].set_ylabel('Nombre de Films')

# Ajustement de la mise en page
plt.tight_layout()
plt.show()

