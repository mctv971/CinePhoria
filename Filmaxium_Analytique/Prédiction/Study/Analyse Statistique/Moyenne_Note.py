import pandas as pd 
import matplotlib.pyplot as plt 
import seaborn as sns


df = pd.read_csv('Final.csv')

df['NotesRottenTomatoes']= pd.to_numeric(df['NotesRottenTomatoes'], errors='coerce')
df['NotesMetacritic'] = pd.to_numeric(df['NotesMetacritic'], errors='coerce')

fig, axs = plt.subplot(2,2 ,figsize=(14,10), sharey='row')

sns.histplot(df[df['Oscar']==0]['NotesRottenTomatoes'], kde=True, ax = axs[0,0], color='red', bins= 20)
axs[0,0].set_title('Rotten Tomatoes - Non Gagnants')
axs[0,0].set_xlabel('Notes')
axs[0,0].set_ylabel('Nombre de films')

sns.histplot(df[df['Oscar']== 1]['NotesRottenTomatoes'], kde=True, ax = axs[0,0], color='yellow', bins= 20)
axs[0,1].set_title('Rotten Tomatoes -  Gagnants')
axs[0,1].set_xlabel('Notes')
axs[0,1].set_ylabel('Nombre de films')


sns.histplot(df[df['Oscar']==0]['NotesMetacritic'], kde=True, ax = axs[0,0], color='red', bins= 20)
axs[1,0].set_title('Meta Critics - Non Gagnants')
axs[1,0].set_xlabel('Notes')
axs[1,0].set_ylabel('Nombre de films')

sns.histplot(df[df['Oscar']==1]['NotesMetacritic'], kde=True, ax = axs[0,0], color='yellow', bins= 20)
axs[1,1].set_title('Meta Critics - Gagnants')
axs[1,1].set_xlabel('Notes')
axs[1,1].set_ylabel('Nombre de films')


plt.tight_layout()
plt.show()


