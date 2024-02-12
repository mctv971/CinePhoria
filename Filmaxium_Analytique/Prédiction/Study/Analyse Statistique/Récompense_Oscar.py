import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

file_path = 'C:/Users/nowli/OneDrive/Documents/GitHub/CinePhoria/Filmaxium_Analytique/Prédiction/Final.csv'

df = pd.read_csv(file_path)

sns.set(style='darkgrid')

oscars_by_award = {
    'GG': df[df['GG'] == 1]['Oscar'].sum(),
    'DGA': df[df['DGA'] == 1]['Oscar'].sum(),
    'PGA': df[df['PGA'] == 1]['Oscar'].sum(),
    'SAG': df[df['SAG'] == 1]['Oscar'].sum(),
    'BAFTA': df[df['BAFTA'] == 1]['Oscar'].sum()
}

# Convertir en DataFrame pour la visualisation
oscars_by_award_df = pd.DataFrame(list(oscars_by_award.items()), columns=['Award', 'Total Oscars Won'])

# Création du graphique
plt.figure(figsize=(10, 6))
sns.barplot(x='Award', y='Total Oscars Won', data=oscars_by_award_df, palette='viridis')

plt.title('Impact des Victoires dans d\'Autres Récompenses sur les Victoires aux Oscars')
plt.xlabel('Récompense')
plt.ylabel('Nombre Total d\'Oscars Gagnés')
plt.xticks(rotation=45)

plt.show()