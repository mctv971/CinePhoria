import pandas as pd 
import seaborn as sns
import matplotlib.pyplot as plt 

sns.set(style='darkgrid')

df = pd.read_csv('../../Final.csv')

corrected_genres_columns = df.columns[15:-1]

oscars_by_genre_corrected = {}

for genre in corrected_genres_columns:
    oscars_by_genre_corrected[genre] = (df[genre] * df['Oscar']).sum()