import requests
from bs4 import BeautifulSoup
import csv
#Voici un script de webscrapping que j'ai utilisé quand je n'avais pas connaissance de lapi OMDB. ne surtout pas lancer car on peut se faire ban de Rotten Tomatoes.
url = 'https://editorial.rottentomatoes.com/guide/oscars-best-and-worst-best-pictures/'

response = requests.get(url)

# Vérifier si la requête a réussi
if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')

    # Trouver tous les éléments contenant les scores
    divs = soup.find_all('div', {'class': 'col-sm-18 col-full-xs countdown-item-content'})


    with open('RT_Oscar_BP.csv', 'w', newline='') as csv_file:

        csv_writer = csv.writer(csv_file)
        csv_writer.writerow(['Nom du film', 'Score Rotten Tomatoes'])
        for div in divs:
            
            link = div.find('a')
            movie_name = link.text.strip()
            score = div.find('span', {'class': 'tMeterScore'}).text.strip()
            csv_writer.writerow([movie_name, score])

    print("Données sauvegardées avec succès dans le fichier CSV.")
else:
    print(f"Erreur lors de l'accès au site. Status Code: {response.status_code}")
