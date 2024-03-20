 // Création de l'élément div analyse
 analyseDiv = document.createElement('div');
 analyseDiv.classList.add('analyse');

 // Création de l'élément div analyse-resum
 analyseResumDiv = document.createElement('div');
 analyseResumDiv.classList.add('analyse-resum');

 // Création de l'élément div analyse-explain
 const analyseExplainDiv = document.createElement('div');
 analyseExplainDiv.classList.add('analyse-explain');

 // Création de l'élément h1 analyse-title
 const analyseTitleH1 = document.createElement('h1');
 analyseTitleH1.classList.add('analyse-title');
 analyseTitleH1.textContent = 'Analyse';

 // Création de l'élément p analyse-text
 const analyseTextP = document.createElement('p');
 analyseTextP.classList.add('analyse-text');
 analyseTextP.textContent = 'Facilitez vos choix cinématographiques avec notre outil de comparaison et explorez des statistiques détaillées sur la popularité des films.';

 // Ajout des éléments créés dans la structure
 analyseExplainDiv.appendChild(analyseTitleH1);
 analyseExplainDiv.appendChild(analyseTextP);

 // Création de l'élément div analyse-btn
 const analyseBtnDiv = document.createElement('div');
 analyseBtnDiv.classList.add('analyse-btn');

 // Création de l'élément div bouton-ovale
 const boutonOvaleDiv = document.createElement('div');
 boutonOvaleDiv.classList.add('bouton-ovale');

 // Création des éléments div option fiche et comparer
 const optionFicheDiv = document.createElement('div');
 optionFicheDiv.classList.add('option', 'fiche', 'active');
 optionFicheDiv.textContent = 'Fiche';

 const optionComparerDiv = document.createElement('div');
 optionComparerDiv.classList.add('option', 'comparer');
 optionComparerDiv.textContent = 'Comparer';

 // Ajout des éléments div option dans bouton-ovale
 boutonOvaleDiv.appendChild(optionFicheDiv);
 boutonOvaleDiv.appendChild(optionComparerDiv);

 // Ajout de bouton-ovale dans analyse-btn
 analyseBtnDiv.appendChild(boutonOvaleDiv);

 // Ajout de analyse-explain et analyse-btn dans analyse-resum
 analyseResumDiv.appendChild(analyseExplainDiv);
 analyseResumDiv.appendChild(analyseBtnDiv);

 // Création de l'élément div analyse-film
 analyseFilmDiv = document.createElement('div');
 analyseFilmDiv.classList.add('analyse-film');

 // Création de l'élément div analyse-selection
 analyseSelectionDiv = document.createElement('div');
 analyseSelectionDiv.classList.add('analyse-selection');

 // Création de deux éléments div analyse-film-selection
 const analyseFilmSelection1Div = document.createElement('div');
 analyseFilmSelection1Div.classList.add('analyse-film-selection');
 analyseFilmSelection1Div.setAttribute('data-selection', '1');
 analyseFilmSelection1Div.style.position = 'relative';
 analyseFilmSelection1Div.innerHTML = '<p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Aucun Contenu Sélectionné</p>';

 const analyseFilmSelection2Div = document.createElement('div');
 analyseFilmSelection2Div.classList.add('analyse-film-selection');
 analyseFilmSelection2Div.setAttribute('data-selection', '2');
 analyseFilmSelection2Div.style.display = 'none';
 analyseFilmSelection2Div.style.position = 'relative';
 analyseFilmSelection2Div.innerHTML = '<p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Aucun Contenu Sélectionné</p>';

 // Ajout des éléments div analyse-film-selection dans analyse-selection
 analyseSelectionDiv.appendChild(analyseFilmSelection1Div);
 analyseSelectionDiv.appendChild(analyseFilmSelection2Div);

 // Création de l'élément div analyse-search
 analyseSearchDiv = document.createElement('div');
 analyseSearchDiv.classList.add('analyse-search');

 // Création de l'élément section movie-list
 const movieListSection = document.createElement('section');
 movieListSection.classList.add('movie-list');
 movieListSection.setAttribute('aria-label', 'Animation');

 // Création de l'élément div slider-list-analytic
 const sliderListAnalyticDiv = document.createElement('div');
 sliderListAnalyticDiv.classList.add('slider-list-analytic');

 // Création de l'élément div search-box
 const searchBoxDiv = document.createElement('div');
 searchBoxDiv.classList.add('search-box');
 searchBoxDiv.style.margin = '0 auto';
 searchBoxDiv.style.paddingBottom = '20px';
 searchBoxDiv.style.paddingTop = '10px';
 searchBoxDiv.style.position = 'absolute';
 searchBoxDiv.style.zIndex = '100000';
 searchBoxDiv.style.marginLeft = '2%';
 searchBoxDiv.setAttribute('search-box', '');

 // Création de l'élément div search-wrapper
 const searchWrapperDiv = document.createElement('div');
 searchWrapperDiv.classList.add('search-wrapper');
 searchWrapperDiv.setAttribute('search-wrapper', '');

 // Création de l'élément input search-field
 const searchFieldInput = document.createElement('input');
 searchFieldInput.setAttribute('type', 'text');
 searchFieldInput.setAttribute('name', 'search');
 searchFieldInput.setAttribute('aria-label', 'search movies');
 searchFieldInput.setAttribute('placeholder', 'Search any movies...');
 searchFieldInput.classList.add('search-field');
 searchFieldInput.setAttribute('autocomplete', 'off');
 searchFieldInput.setAttribute('search-field', '');

 // Création des éléments img leading-icon et leading-icon2
 const leadingIconImg = document.createElement('img');
 leadingIconImg.setAttribute('src', './assets/images/search.png');
 leadingIconImg.setAttribute('width', '24');
 leadingIconImg.setAttribute('height', '24');
 leadingIconImg.setAttribute('alt', 'search');
 leadingIconImg.classList.add('leading-icon');

 const leadingIcon2Img = document.createElement('img');
 leadingIcon2Img.setAttribute('src', './assets/images/play_circle.png');
 leadingIcon2Img.setAttribute('width', '24');
 leadingIcon2Img.setAttribute('height', '24');
 leadingIcon2Img.setAttribute('alt', 'search');
 leadingIcon2Img.classList.add('leading-icon2');

 // Ajout des éléments img dans search-wrapper
 searchWrapperDiv.appendChild(searchFieldInput);
 searchWrapperDiv.appendChild(leadingIconImg);
 searchWrapperDiv.appendChild(leadingIcon2Img);

 // Création de l'élément button search-btn
 const searchBtnButton = document.createElement('button');
 searchBtnButton.classList.add('search-btn');
 searchBtnButton.setAttribute('search-toggler', '');

 // Création de l'élément img pour search-btn
 const searchBtnImg = document.createElement('img');
 searchBtnImg.setAttribute('src', './assets/images/close.png');
 searchBtnImg.setAttribute('width', '24');
 searchBtnImg.setAttribute('height', '24');
 searchBtnImg.setAttribute('alt', 'close search box');

 // Ajout de l'élément img dans search-btn
 searchBtnButton.appendChild(searchBtnImg);

 // Ajout de search-wrapper et search-btn dans search-box
 searchBoxDiv.appendChild(searchWrapperDiv);
 searchBoxDiv.appendChild(searchBtnButton);

 // Création de l'élément button search-btn
 const searchBtnButton2 = document.createElement('button');
 searchBtnButton2.classList.add('search-btn');
 searchBtnButton2.setAttribute('search-toggler', '');
 searchBtnButton2.setAttribute('menu-close', '');

 // Création de l'élément img pour search-btn
 const searchBtnImg2 = document.createElement('img');
 searchBtnImg2.setAttribute('src', './assets/images/search.png');
 searchBtnImg2.setAttribute('width', '24');
 searchBtnImg2.setAttribute('height', '24');
 searchBtnImg2.setAttribute('alt', 'open search box');

 // Ajout de l'élément img dans search-btn
 searchBtnButton2.appendChild(searchBtnImg2);

 // Ajout de search-btn dans search-box
 searchBoxDiv.appendChild(searchBtnButton2);

 // Création de l'élément div slider-inner
 const sliderInnerDiv = document.createElement('div');
 sliderInnerDiv.classList.add('slider-inner');

 // Création de deux éléments p pour slider-inner
 const sliderInnerP1 = document.createElement('p');
 sliderInnerP1.textContent = 'Recherchez le contenu : Utilisez la barre de recherche en haut de la page pour saisir le titre/nom du contenu que vous recherchez.';
 sliderInnerP1.style.color = 'white';
 sliderInnerP1.style.marginTop = '40px';
 sliderInnerP1.innerHTML = '<strong>Recherchez le contenu :</strong> Utilisez la barre de recherche en haut de la page pour saisir le titre/nom du contenu que vous recherchez.';

 const sliderInnerP2 = document.createElement('p');
 sliderInnerP2.textContent = "Sélectionnez votre contenu : Une fois que vous avez trouvé le contenu que vous souhaitez comparer/visualiser, cliquez simplement sur l'affiche du contenu.";
 sliderInnerP2.style.color = 'white';
 sliderInnerP2.style.marginTop = '40px';
 sliderInnerP2.innerHTML = "<strong>Sélectionnez votre contenu :</strong> Une fois que vous avez trouvé le contenu que vous souhaitez comparer/visualiser, cliquez simplement sur l'affiche du contenu.";

 // Ajout des éléments p dans slider-inner
 sliderInnerDiv.appendChild(sliderInnerP1);
 sliderInnerDiv.appendChild(sliderInnerP2);

 // Ajout de slider-inner dans slider-list-analytic
 sliderListAnalyticDiv.appendChild(sliderInnerDiv);

 // Ajout de search-box et slider-list-analytic dans movie-list
 movieListSection.appendChild(searchBoxDiv);
 movieListSection.appendChild(sliderListAnalyticDiv);

 // Ajout de movie-list dans analyse-search
 analyseSearchDiv.appendChild(movieListSection);

 analyseFilmDiv.appendChild(analyseSelectionDiv);
 analyseFilmDiv.appendChild(analyseSearchDiv);

 // Ajout de analyse-resum et analyse-film dans analyse
 analyseDiv.appendChild(analyseResumDiv);
 analyseDiv.appendChild(analyseFilmDiv);

 // Ajout de analyse dans le document body
 section.appendChild(analyseDiv);
 search();

 // Animation d'arrivée pour les éléments
 gsap.from(".analyse-title", {
     duration: 1,
     opacity: 0
 });

 gsap.from(".analyse-text", {
     duration: 1,
     opacity: 0,
     y: -50
 });

 gsap.from(".bouton-ovale", {
     duration: 1,
     opacity: 0,
     x: -500
 });

 gsap.from(".analyse-selection", {
     duration: 1,
     opacity: 0,
     x: 500
 });

 gsap.from(".search-box", {
     duration: 1,
     opacity: 0,
     y: 500
 });
 gsap.from(".slider-list-analytic", {
     duration: 3,
     opacity: 0,
 });


 // Element de la scène 
