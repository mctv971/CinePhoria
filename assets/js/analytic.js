/**
 * import all components and functions
 */


import { search } from "./search-analytic.js";
import { api_key } from "./api.js";


let previousScene = 1;
let starField;

let mouseX = 0;
let mouseY = 0;
let scene, renderer, camera;
let section;
let cercleImg, cameramanImg;
let analyseDiv, analyseResumDiv,analyseFilmDiv,analyseSelectionDiv,analyseSearchDiv;




document.addEventListener("DOMContentLoaded", function() {




    // Sélectionnez les éléments DOM nécessaires
    const options = document.querySelectorAll('.option');
    const filmSelections = document.querySelectorAll('.analyse-film-selection');

    // Parcours des éléments et ajout d'un gestionnaire d'événement pour chaque option
    options.forEach(option => {
        option.addEventListener('click', () => {
            // Supprimer la classe "active" de toutes les options
            options.forEach(opt => opt.classList.remove('active'));
            // Ajouter la classe "active" à l'option cliquée
            option.classList.add('active');
            filmSelections[1].style.display = 'none';

            // Si l'option "Comparer" est active, affichez la deuxième sélection de film
            if (option.classList.contains('comparer')) {
                filmSelections[1].style.display = 'block';
            } else {
                filmSelections[0].style.display = 'block';
            }

                
        });
    });
    const container = document.querySelector('.content-analytic');

    // Ajoutez un gestionnaire d'événements de clic au conteneur parent
    container.addEventListener('click', async (event) => {
        console.log(event.target)

        if(event.target.classList.contains("option")){
            const options = document.querySelectorAll('.option');
            const filmSelections = document.querySelectorAll('.analyse-film-selection');
    
            // Supprimer la classe "active" de toutes les options
            options.forEach(opt => opt.classList.remove('active'));
            // Ajouter la classe "active" à l'option cliquée
            event.target.classList.add('active');
            filmSelections[1].style.display = 'none';
    
            // Si l'option "Comparer" est active, affichez la deuxième sélection de film
            if (event.target.classList.contains('comparer')) {
                filmSelections[1].style.display = 'block';
            } else {
                filmSelections[0].style.display = 'block';
            }    

        }

        // Vérifiez si l'élément cliqué est un cart-btn
        if (event.target.classList.contains("card-btn")) {

            // Récupérez le code TMDB et le type à partir des attributs de l'élément <a>
            const tmdbId = event.target.getAttribute('tmdb-id');
            const type = event.target.getAttribute('type');
            const img = event.target.getAttribute('img');
    
            // Vérifiez si l'option "Fiche" est active
            const isFicheActive = document.querySelector('.option.fiche').classList.contains('active');

            
            // Appel de la fonction fetchIMDbId pour obtenir l'ID IMDb
            const imdbId = await fetchIMDbId(type, tmdbId);
    
            // En fonction de l'option active, effectuez les actions nécessaires
            if (isFicheActive) {

                const filmSelection1 = document.querySelector('.analyse-film-selection[data-selection="1"]');
                if (!filmSelection1.querySelector('img')) {
                    // Si aucune image n'est présente, ajoutez l'image de la constante img
                    const image = document.createElement('img');
                    image.src = img;
                    image.classList.add("affiche-selection")
                    filmSelection1.appendChild(image);
                    
                }
                filmSelection1.querySelector('p').style.display = 'none';
                localStorage.setItem('tmdbId1', tmdbId);
                localStorage.setItem('type1', type);
                localStorage.setItem('imdb1', imdbId);

                const deleteImage = document.createElement('img');
                deleteImage.src = 'assets/images/delete.png';
                deleteImage.alt = 'delete';
                deleteImage.setAttribute('data-select', '1');
                deleteImage.classList.add('delete-selection');

                deleteImage.onclick = function() {
                    // Récupérez l'élément parent de l'image de suppression
                    const parentSelection = deleteImage.closest('.analyse-film-selection');
                    // Vérifiez si data-select est "1" ou "2"
                    const dataSelectValue = parentSelection.getAttribute('data-selection');
                    if (dataSelectValue === "1" || dataSelectValue === "2") {
                        // Sélectionnez toutes les images enfants de l'élément parent
                        const images = parentSelection.querySelectorAll('img');
                        // Supprimez toutes les images
                        images.forEach(image => {
                            image.remove();
                        });
            
                        // Affichez à nouveau le paragraphe
                        parentSelection.querySelector('p').style.display = 'block';
                    }
                };

                filmSelection1.appendChild(deleteImage);

            } else {
                const filmSelection1 = document.querySelector('.analyse-film-selection[data-selection="1"]');
                if (!filmSelection1.querySelector('img')) {
                    // Si la première sélection est vide, ajoutez l'image à cette sélection
                    const image = document.createElement('img');
                    image.src = img;
                    image.classList.add("affiche-selection")
                    filmSelection1.appendChild(image);

                    const deleteImage = document.createElement('img');
                    deleteImage.src = 'assets/images/delete.png';
                    deleteImage.alt = 'delete';
                    deleteImage.setAttribute('data-select', '1');
                    deleteImage.classList.add('delete-selection');

                    deleteImage.onclick = function() {
                        // Récupérez l'élément parent de l'image de suppression
                        const parentSelection = deleteImage.closest('.analyse-film-selection');
                        // Vérifiez si data-select est "1" ou "2"
                        const dataSelectValue = parentSelection.getAttribute('data-selection');
                        if (dataSelectValue === "1" || dataSelectValue === "2") {
                            // Sélectionnez toutes les images enfants de l'élément parent
                            const images = parentSelection.querySelectorAll('img');
                            // Supprimez toutes les images
                            images.forEach(image => {
                                image.remove();
                            });
                
                            // Affichez à nouveau le paragraphe
                            parentSelection.querySelector('p').style.display = 'block';
                        }
                    };

                    filmSelection1.appendChild(deleteImage);

                    // Masquer le paragraphe de l'élément filmSelection1
                    filmSelection1.querySelector('p').style.display = 'none';
                    localStorage.setItem('tmdbId1', tmdbId);
                    localStorage.setItem('type1', type);
                    localStorage.setItem('imdb1', imdbId);
                } else {
                    // Vérifiez si la deuxième sélection est vide
                    const filmSelection2 = document.querySelector('.analyse-film-selection[data-selection="2"]');
                    if (!filmSelection2.querySelector('img')) {
                        // Si la deuxième sélection est vide, ajoutez l'image à cette sélection
                        const image = document.createElement('img');
                        image.src = img;
                        image.classList.add("affiche-selection")
                        filmSelection2.appendChild(image);

                        // Masquer le paragraphe de l'élément filmSelection2
                        filmSelection2.querySelector('p').style.display = 'none';
                        localStorage.setItem('tmdbId2', tmdbId);
                        localStorage.setItem('type2', type);
                        localStorage.setItem('imdb2', imdbId);

                        const deleteImage = document.createElement('img');
                        deleteImage.src = 'assets/images/delete.png';
                        deleteImage.alt = 'delete';
                        deleteImage.setAttribute('data-select', '2');
                        deleteImage.classList.add('delete-selection');

                        deleteImage.onclick = function() {
                            // Récupérez l'élément parent de l'image de suppression
                            const parentSelection = deleteImage.closest('.analyse-film-selection');
                            // Vérifiez si data-select est "1" ou "2"
                            const dataSelectValue = parentSelection.getAttribute('data-selection');
                            if (dataSelectValue === "1" || dataSelectValue === "2") {
                                // Sélectionnez toutes les images enfants de l'élément parent
                                const images = parentSelection.querySelectorAll('img');
                                // Supprimez toutes les images
                                images.forEach(image => {
                                    image.remove();
                                });
                    
                                // Affichez à nouveau le paragraphe
                                parentSelection.querySelector('p').style.display = 'block';
                            }
                        };

                        
                        filmSelection2.appendChild(deleteImage);
                    } else {
                        // Si les deux sélections sont pleines, affichez une alerte
                        alert('Les deux sélections sont pleines');
                    }
                }
            }
        }
    });
    





        
    section = document.querySelector('.content-analytic');
    initializeScene(1);
    gsap.registerPlugin(ScrollToPlugin);
    document.querySelectorAll("nav button").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const activeButton = document.querySelector("button.sectionBtn.active");
            activeButton.classList.remove("active");
            btn.classList.add("active");
            
            // Appel de changeScene pour changer de scène
            changeScene(index + 1);
        });
    });
    let isScrolling = false;

    document.addEventListener("wheel", (event) => {
        if (!isScrolling) { // Vérifie si un défilement est en cours de traitement
            isScrolling = true; // Active le défilement
            let delta = Math.sign(event.deltaY); // Obtient la direction du défilement (1 pour vers le bas, -1 pour vers le haut)
            const activeButton = document.querySelector("button.sectionBtn.active");
            console.log(delta)
            if (Math.abs(event.deltaY) < 20){
                delta = 0;
            }
    
            let newIndex = previousScene + delta; // Calcule le nouvel index en fonction de la direction du défilement
            newIndex = Math.round(newIndex);
        
            // Vérifie si le nouvel index est valide (entre 1 et le nombre total de boutons)
            if (newIndex >= 1 && newIndex != previousScene && newIndex <= document.querySelectorAll("nav button").length) {
                // Désactive le bouton actuel
                activeButton.classList.remove("active");
                const newActiveButtonId = `section${newIndex}Btn`;
                document.querySelector(`#${newActiveButtonId}`).classList.add("active");
                // Sélectionne le nouveau bouton et l'active
        
                // Appel de changeScene pour changer de scène
                changeScene(newIndex);
            }
    
            setTimeout(() => {
                isScrolling = false; // Désactive le défilement après un court délai
            }, 300); // Délai d'attente en millisecondes avant de désactiver le défilement
        }
    });
});

// Garde une référence à la scène précédente



function changeScene(sectionNumber) {
    // Arrêter et nettoyer la scène précédente s'il y en a une
    if (previousScene) {
        stopScene(previousScene);
    }

    // Initialiser la nouvelle scène
    initializeScene(sectionNumber);
    
    // Mettre à jour la référence de la scène précédente
    previousScene = sectionNumber;
}



// Fonction pour arrêter toutes les animations et les timers associés à une scène spécifique
function stopScene(sceneNumber) {
    switch (sceneNumber) {
        case 1:
            stopScene1();
            break;
        case 2:
            stopScene2();
            break;
        case 3:
            stopScene3();
            break;
        case 4:
            stopScene4();
            break;
        // Ajoutez d'autres cas pour les sections supplémentaires
        default:
            console.error("Scene not supported");
            break;
    }
}

function stopScene1(){

    gsap.to("#cercle", {
        duration: 1, // Durée de l'animation en secondes
        opacity: 0,
        y: -500, // Déplacement vertical de l'image vers le haut
        ease: "power1.inOut", // Effet de lissage de l'animation
        onComplete: function() { // Fonction à exécuter à la fin de l'animation
            section.removeChild(cercleImg); // Supprimer l'image cercle de la section
        }
    });
    gsap.to("#cameraman", {
        duration: 1, // Durée de l'animation en secondes
        opacity: 0,
        y: -200, // Déplacement vertical de l'image vers le haut
        ease: "power1.inOut", // Effet de lissage de l'animation
        onComplete: function() { // Fonction à exécuter à la fin de l'animation
            section.removeChild(cameramanImg); // Supprimer l'image cameraman de la section
        }
    });

        // Animation de sortie pour les éléments
    gsap.to(".stats", {
        duration: 1,
        opacity: 0,
        onComplete: function() {
            presentAnalytic.removeChild(stats);
        }
    });

    gsap.to(".filma", {
        duration: 1,
        opacity: 0,
        x: -500,
        onComplete: function() {
            nameSite.removeChild(filma);
        }
    });

    gsap.to(".ana", {
        duration: 1,
        opacity: 0,
        x: 500,
        onComplete: function() {
            nameSite.removeChild(ana);
        }
    });

    gsap.to(".present-ana", {
        duration: 1,
        opacity: 0,
        y: 500,
        onComplete: function() {
            presentAnalytic.removeChild(nameSite)
            presentAnalytic.removeChild(presentAna);
            section.removeChild(presentAnalytic)

        }
    });

    // gsap.to(gltfObject.material, {
    //     duration: 1, // Durée de l'animation en secondes
    //     opacity: 0, // Transition d'opacité vers 0
    //     onComplete: function() { // Fonction à exécuter à la fin de l'animation
    //         scene.remove(gltfObject); // Supprime l'objet de la scène
    //     }
    // });


}

function stopScene2(){

    // Animation de sortie pour analyseDiv (opacity)
    gsap.to(analyseDiv, { duration: 1, opacity: 0, onComplete: removeElement });

    // Animation de sortie pour analyseResumDiv (déplacement vers la gauche)
    gsap.to(analyseResumDiv, { duration: 1, x: -1000 });

    // Animation de sortie pour analyseFilmDiv (déplacement vers le haut)
    gsap.to(analyseFilmDiv, { duration: 1, y: -500 });

    // Animation de sortie pour analyseSelectionDiv (opacity)
    gsap.to(analyseSelectionDiv, { duration: 1, opacity: 0 });

    // Animation de sortie pour analyseSearchDiv (déplacement vers la gauche et vers le haut)
    gsap.to(analyseSearchDiv, { duration: 1, x: -500, y: -500 });

    // Définition de la fonction pour supprimer l'élément
    function removeElement() {
        // Supprimez l'élément de son parent
        analyseDiv.parentNode.removeChild(analyseDiv);
    }

        // Sortis des élements de la scène 

    }

function stopScene3(){

    // Sortis des élements de la scène 
   
}
function stopScene4(){
    // Animation de sortie pour analyseDiv (opacity)
    gsap.to(analyseDiv, { duration: 1, opacity: 0, onComplete: removeElement });

    // Animation de sortie pour analyseResumDiv (déplacement vers la gauche)
    gsap.to(analyseResumDiv, { duration: 1, x: -1000 });

    // Animation de sortie pour analyseFilmDiv (déplacement vers le haut)
    gsap.to(analyseFilmDiv, { duration: 1, y: -500 });

    // Animation de sortie pour analyseSelectionDiv (opacity)
    gsap.to(analyseSelectionDiv, { duration: 1, opacity: 0 });

    // Animation de sortie pour analyseSearchDiv (déplacement vers la gauche et vers le haut)
    

    // Définition de la fonction pour supprimer l'élément
    function removeElement() {
        // Supprimez l'élément de son parent
        analyseDiv.parentNode.removeChild(analyseDiv);
    }

        // Sortis des élements de la scène 

     
}


















// Écouter les mouvements de la souris
window.addEventListener('mousemove', onMouseMove);

function onMouseMove(event) {
    // Mettre à jour les coordonnées de la souris
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
}



function initializeScene(sectionNumber) {


    const rendererElement = section.querySelector('canvas');
    if (!rendererElement) {

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setClearColor(0xffffff, 0);
        renderer.setSize(section.offsetWidth, section.offsetHeight);
        section.appendChild(renderer.domElement);
    
        scene = new THREE.Scene();
        const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Couleur, Intensité
        scene.add(ambientLight);
    
        camera = new THREE.PerspectiveCamera(75, section.offsetWidth / section.offsetHeight, 0.1, 1000);
        camera.position.set(0, 0, 50); // Ajuste la position de la caméra selon les besoins
    
        const starCount = 5000;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
    
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * window.innerWidth - window.innerWidth / 2;
            const y = Math.random() * window.innerHeight - window.innerHeight / 2;
            const z = Math.random() * 2000 - 1000;
    
            starPositions[i * 3] = x;
            starPositions[i * 3 + 1] = y;
            starPositions[i * 3 + 2] = z;
        }
    
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 }); // Taille des particules
        starField = new THREE.Points(starGeometry, starMaterial);
        starField.name = "stars";
        scene.add(starField);
    
    
    
        // Déplacement des particules en fonction de la position de la souris
    
    
        moveParticles(scene, renderer, camera);

    }



    



    // Appeler la fonction spécifique à chaque section
    switch (sectionNumber) {
        case 1:
            initializeScene1(scene, renderer, camera);
            break;
        case 2:
            initializeScene2(scene, renderer, camera);
            break;
        case 3:
            initializeScene3(scene, renderer, camera);
            break;
        case 4:
            initializeScene4(scene, renderer, camera);
            break;        
        // Ajoute d'autres cas pour les sections supplémentaires
        default:
            console.error("Section not supported");
            break;
    }
}
function moveParticles(scene, renderer, camera) {

    const time = Date.now() * 0.00005;

    const positions = starField.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const speed = 0.05; // Vitesse de déplacement

        // Calculer la direction en fonction de la position de la souris
        const dx = positions[i] - mouseX;
        const dy = positions[i + 1] - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const directionX = dx / distance;
        const directionY = dy / distance;

        // Déplacer les particules dans la direction opposée à la souris
        positions[i] += directionX * speed;
        positions[i + 1] += directionY * speed;

        // Limiter les coordonnées pour rester dans la zone visible
        positions[i] = Math.min(window.innerWidth / 2, Math.max(-window.innerWidth / 2, positions[i]));
        positions[i + 1] = Math.min(window.innerHeight / 2, Math.max(-window.innerHeight / 2, positions[i + 1]));
    }

    starField.geometry.attributes.position.needsUpdate = true;


    renderer.render(scene, camera);
    requestAnimationFrame(() => moveParticles(scene, renderer, camera));


}

let presentAnalytic, presentAna, stats, nameSite,filma,ana;
let gltfObject;


function initializeScene1(scene, renderer, camera) {
    cercleImg = document.createElement('img');
    // Créer et ajouter l'élément d'image #cercle
    cercleImg.src = 'assets/3d/cercle.png';
    cercleImg.classList.add('cercle');
    cercleImg.id = 'cercle';
    section.appendChild(cercleImg);

    // Créer et ajouter l'élément d'image #cameraman
    cameramanImg = document.createElement('img');
    cameramanImg.src = 'assets/3d/cameraman.png';
    cameramanImg.classList.add('cercle');
    cameramanImg.id = 'cameraman';
    section.appendChild(cameramanImg);


    // Création de l'élément div present-analytic
    presentAnalytic = document.createElement('div');
    presentAnalytic.classList.add('present-analytic');

    // Création de l'élément p stats
    stats = document.createElement('p');
    stats.classList.add('stats');
    stats.textContent = 'STATISTICS';

    // Création de l'élément div name-site
    nameSite = document.createElement('div');
    nameSite.classList.add('name-site');

    // Création de l'élément h1 filma
    filma = document.createElement('h1');
    filma.classList.add('filma');
    filma.textContent = 'Filmaxium';

    // Création de l'élément h1 ana
    ana = document.createElement('h1');
    ana.classList.add('ana');
    ana.textContent = 'Analytics';

    // Création de l'élément p present-ana
    presentAna = document.createElement('p');
    presentAna.classList.add('present-ana');
    presentAna.textContent = "Explorez le cinéma sous un nouvel angle, des statistiques qui racontent l'histoire derrière chaque film";

    // Ajout des éléments créés dans la structure
    nameSite.appendChild(filma);
    nameSite.appendChild(ana);
    presentAnalytic.appendChild(stats);
    presentAnalytic.appendChild(nameSite);
    presentAnalytic.appendChild(presentAna);
    section.appendChild(presentAnalytic);


    // Animation d'arrivée pour les éléments
    gsap.from(".stats", {
        duration: 1,
        opacity: 0
    });

    gsap.from(".filma", {
        duration: 1,
        opacity: 0,
        x: -500
    });

    gsap.from(".ana", {
        duration: 1,
        opacity: 0,
        x: 500
    });

    gsap.from(".present-ana", {
        duration: 1,
        opacity: 0,
        y: 500
    });
    // const loader = new THREE.GLTFLoader();
    // loader.load(
    //     'assets/3d/luffy-dead.glb', // Chemin vers ton fichier 3D
    //     function (gltf) {
    //         // Modifie la position de l'objet
    //         gltf.scene.position.set(10, 20, 0); // Tu peux ajuster ces valeurs selon tes besoins
    //         gltf.scene.scale.set(5, 5, 5);
    //         gltfObject = gltf.scene;

    //         // Ajoute le modèle à la scène
    //         scene.add(gltf.scene);
    //         const pointLight = new THREE.PointLight(0xffffff, 1); // Couleur, Intensité
    //         pointLight.position.set(-10, 0, 0); // Position de la lumière (la même que l'objet)
    //         scene.add(pointLight);

    //         // Animation de rotation de l'objet
    //         function animate() {
    //             requestAnimationFrame(animate);

    //             // Fait tourner l'objet sur lui-même
    //             gltf.scene.rotation.y += 0.01;


    //             renderer.render(scene, camera);
    //         }

    //         animate();
    //     },
    //     undefined,
    //     function (error) {
    //         console.error(error);
    //     }
    // );
    // camera.position.set(100,70,80)









    

    // Animation d'arrivée pour l'image #cercle
    gsap.from("#cercle", {
    duration: 1, // Durée de l'animation en secondes
    opacity: 0, // Opacité initiale
    top: "-50vh", // Position initiale depuis le haut de la fenêtre
    ease: "power1.inOut" // Effet de lissage de l'animation
    });

    // Animation d'arrivée pour l'image #cameraman
    gsap.from("#cameraman", {
    duration: 1, // Durée de l'animation en secondes
    opacity: 0, // Opacité initiale
    top: "100vh", // Position initiale depuis le haut de la fenêtre
    ease: "power1.inOut", // Effet de lissage de l'animation
    onComplete: function() { // Callback lorsque l'animation est terminée
        // Démarrer les animations répétitives après l'animation d'arrivée
        animateRepetitive();
    }
    });

    // Fonction pour démarrer les animations répétitives avec GSAP
    function animateRepetitive() {
    // Animation répétitive pour l'image #cercle
    gsap.to("#cercle", {
        duration: 3, // Durée de l'animation en secondes
        y: 20, // Déplacement vertical de l'image (de haut en bas)
        repeat: -1, // Répéter l'animation indéfiniment
        yoyo: true, // Faire rebondir l'image (aller-retour)
        ease: "power1.inOut" // Effet de lissage de l'animation
    });

    // Animation répétitive pour l'image #cameraman
    gsap.to("#cameraman", {
        duration: 3, // Durée de l'animation en secondes
        x: -30, // Déplacement horizontal de l'image
        repeat: -1, // Répéter l'animation indéfiniment
        yoyo: true, // Faire rebondir l'image (aller-retour)
        ease: "power1.inOut" // Effet de lissage de l'animation
    });
    }


    
}


function initializeScene2(scene, renderer, camera) {
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

}
function initializeScene3(scene,renderer,camera){
// Element de la scène 

} console.log("salut");

function initializeScene4(scene,renderer,camera){
   console.log("salut");
       /*  // Création des éléments
        var prediction = document.createElement('div');
        var title = document.createElement('h1');
        var predictionText = document.createElement('p');
        var button = document.createElement('button');
      
        // Ajout de classes pour le style (optionnel, dépend du CSS existant)
        prediction.classList.add('content-analytic');
        title.classList.add('analyse-title');
        predictionText.classList.add('prediction-texte');
        button.classList.add('getPrediction');
      
        // Attribution des styles pour l'animation
        prediction.style.opacity = '0';
        prediction.style.transition = 'opacity 1s ease-out';
        setTimeout(function() {
          prediction.style.opacity = '1';
        }, 100); // Délai avant le début de l'animation
      
        // Configuration des éléments
        title.textContent = 'Prédiction';
        title.style.position = 'absolute';
        title.style.top = '30%';
        title.style.transform = 'translateY(-50%)';
        title.style.width = '100%';
        title.style.textAlign = 'center';
      
        predictionText.textContent = 'Découvrez qui sera le gagnant des oscars grâce à notre modèle de Prédiction';
        predictionText.style.position = 'absolute';
        predictionText.style.top = '40%';
        predictionText.style.width = '100%';
        predictionText.style.textAlign = 'center';
        predictionText.style.fontSize = '30px';
      
        button.textContent = "C'est ici que ça se passe";
        button.style.position = 'absolute';
        button.style.top = '60%';
        button.style.left = '50%';
        button.style.transform = 'translateX(-50%)';
        button.style.borderRadius = '20px';
        button.style.backgroundColor = 'grey';
        button.style.width = '20%';
        button.style.textAlign = 'center';
        button.style.fontSize = '25px';
      
        // Assemblage des éléments
        prediction.appendChild(title);
        prediction.appendChild(predictionText);
        prediction.appendChild(button);
      
        // Ajout au document
        document.body.appendChild(prediction);
      };
      */
async function fetchIMDbId(type, tmdbId) {
    // Remplacez 'YOUR_API_KEY' par votre clé API TMDB
    const apiKey = api_key;
    const url = `https://api.themoviedb.org/3/${type}/${tmdbId}/external_ids?api_key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Vérifie si l'ID IMDb est disponible dans les External IDs
        if (data.imdb_id) {
            return data.imdb_id;
        } else {
            return "IMDb ID not found";
        }
    } catch (error) {
        console.error('Error fetching IMDb ID:', error);
        return null;
    }
}


const oscars_nominés = [
      

    { title : 'Barbie' , year: '2023', winner : 'False', itemId :346698 },

    { title : 'Maestro' , year: '2023',winner : 'False',itemId :523607},

    { title : 'The Zone of Interest' , year: '2023',winner : 'False',itemId :467244},

    { title : 'American Fiction' , year: '2023',winner : 'False',itemId :1056360},

    { title : 'Killers of the flower Moon' , year: '2023',winner : 'False',itemId :466420},

    { title : 'Oppenheimer' , year: '2023',winner : 'True',itemId :872585},

    { title : 'Past Lives' , year: '2023',winner : 'False',itemId :666277},

    { title : 'Poor Things' , year: '2023',winner : 'False',itemId :792307},

    { title : 'The Holdovers' , year: '2023',winner : 'False',itemId :840430},

    { title : 'Anatomy Of a Fall' , year: '2023',winner : 'False',itemId :915935}


];
function displayMovieDetails(item, itemType) {
    const pageContent = document.querySelector('.page-content');
    pageContent.innerHTML = ''; // Vide les détails précédents

    // Extraire les données nécessaires de l'objet item
    const {
        backdrop_path,
        poster_path,
        title,
        name,
        release_date,
        first_air_date,
        runtime,
        episode_run_time,
        vote_average,
        genres,
        overview,
        number_of_seasons,
        credits: { cast, crew },
        videos: { results: videos },
        seasons
    } = item;

    document.title = `${title || name} - Filmaxium`;

    const itemDetail = document.createElement("div");
    itemDetail.classList.add("movie-detail");

    // Appliquer un style spécifique si le film est "Oppenheimer"
    if (title === "Oppenheimer" || name === "Oppenheimer") {
        itemDetail.style.border = "2px solid yellow"; // Par exemple, ajouter une bordure jaune
    }

    itemDetail.innerHTML = `
        <div class="backdrop-image" style="background-image: url('https://image.tmdb.org/t/p/w1280${backdrop_path || poster_path}')"></div>
        
        <figure class="poster-box movie-poster">
          <img src="https://image.tmdb.org/t/p/w342${poster_path}" alt="${title || name} poster" class="img-cover">
        </figure>
        
        <div class="detail-box">
        
          <div class="detail-content">
            <h1 class="heading">${title || name}</h1>
        
            <div class="meta-list">
        
              <div class="meta-item">
                <img src="./assets/images/star.png" width="20" height="20" alt="rating">
                <span class="span">${vote_average.toFixed(1)}</span>
              </div>
        
              <div class="separator"></div>
        
              <div class="meta-item">${runtime || episode_run_time?.[0] || number_of_seasons} ${itemType === "tv" ? `Seasons` : "Min"}
              </div>
        
              <div class="separator"></div>
        
              <div class="meta-item">${release_date?.split("-")[0] || first_air_date?.split("-")[0] || "Not Released"}</div>
        
            </div>
        
            <p class="genre">${genres.map(genre => genre.name).join(', ')}</p>
        
            <p class="overview">${overview}</p>
        
            <div class="casting">
              <p><strong>Cast:</strong> ${cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
              <p><strong>Director(s):</strong> ${crew.filter(person => person.job === 'Director').map(director => director.name).join(', ')}</p>
            </div>
        
          </div>
        </div>
    `;

    // Ajout des vidéos (trailers, clips)
    const videoContainer = document.createElement("div");
    videoContainer.classList.add("video-container");
    videos.forEach(video => {
        if (video.site === "YouTube") {
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${video.key}`;
            iframe.width = "500";
            iframe.height = "280";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            videoContainer.appendChild(iframe);
        }
    });

    itemDetail.appendChild(videoContainer);
    pageContent.appendChild(itemDetail);
}


document.querySelector('.getPrediction').addEventListener('click', displayOscarNominations);

async function displayOscarNominations() {
  const nominationsContainer = document.createElement('div');
  nominationsContainer.classList.add('nominations-container');

  for (let film of oscars_nominés) {
      const imdbId = await fetchIMDbId('movie', film.itemId);
      const filmElement = document.createElement('div');
      filmElement.classList.add('film-nomination');
      filmElement.innerHTML = `
          <p>Title: ${film.title}</p>
          <p>Year: ${film.year}</p>
          <p>Winner: ${film.winner}</p>
          <p>IMDb ID: ${imdbId}</p>
      `;
      nominationsContainer.appendChild(filmElement);
  }

  document.body.appendChild(nominationsContainer);
}





}
