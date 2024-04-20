/**
 * import all components and functions
 */


import { search } from "./search-analytic.js";
const api_key = "4bff542b068c0fff85589d72c363051d";


let previousScene = 1;
let starField;

let mouseX = 0;
let mouseY = 0;
let scene, renderer, camera;
let section;
let cercleImg, cameramanImg;
let analyseDiv, analyseResumDiv,analyseFilmDiv,analyseSelectionDiv,analyseSearchDiv;
let chartInstances = [];
let selection;
let changeStatActive =1;
let changeGraphActive =1;






document.addEventListener("DOMContentLoaded", function() {








    // GESTION CLICK


    const container = document.querySelector('.content-analytic');

    // Ajoutez un gestionnaire d'événements de clic au conteneur parent
    container.addEventListener('click', async (event) => {
        console.log(event.target)


        if(event.target.classList.contains("option")){
            selection = document.querySelector('.option.active')
            if(!(event.target.classList.contains("active"))){
                selection.classList.remove('active');
                event.target.classList.add('active');
                if(selection.classList.contains("contain")){

                    document.querySelector(".analyse-film").classList.remove("active");
                    document.querySelector(".analyse-genre").classList.add("active");
                    document.querySelector(".comparer").style.display = 'none';
                }
                else{
                    document.querySelector(".analyse-genre").classList.remove("active");
                    document.querySelector(".analyse-film").classList.add("active");
                    document.querySelector(".comparer").style.display = 'flex';
                }
            }
        }


        const filmSelections = document.querySelectorAll('.analyse-film-selection');
        const formSelections = document.querySelectorAll(".selection-form");
        console.log(formSelections)
        if(event.target.classList.contains("comparerbtn")){
            var img = document.querySelector('.comparerbtn')
            filmSelections[1].style.display = 'none';

            if(img.alt==="switch1"){
                img.src="assets/images/switch2.png"
                img.alt="switch2"
                filmSelections[1].style.display = 'block';
            }
            else{
                img.src="assets/images/switch.png"
                img.alt="switch1"
                localStorage.removeItem("imdb2");
                localStorage.removeItem("type2");
                localStorage.removeItem("tmdb2");
                localStorage.removeItem("title2");
            }

        }




        // Vérifiez si l'élément cliqué est un cart-btn
        if (event.target.classList.contains("card-btn")) {

            // Récupérez le code TMDB et le type à partir des attributs de l'élément <a>
            const tmdbId = event.target.getAttribute('tmdb-id');
            const type = event.target.getAttribute('type');
            const img = event.target.getAttribute('img');
            const title = event.target.getAttribute('title');
    
            // Vérifiez si l'option "Fiche" est active
            const isFicheActive = document.querySelector('.comparerbtn').alt == "switch1";

            
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
                localStorage.setItem('title1', title);


                // Vérifie si une image avec la classe delete-selection existe déjà
                const existingDeleteImage = document.querySelector('.delete-selection');

                // Si aucune image n'existe, crée et ajoute l'image
                if (!existingDeleteImage) {
                    const deleteImage = document.createElement('img');
                    deleteImage.src = 'assets/images/delete.png';
                    deleteImage.alt = 'delete';
                    deleteImage.setAttribute('data-select', '1');
                    deleteImage.classList.add('delete-selection');
                    filmSelection1.appendChild(deleteImage);
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
                    
                }

  

                

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
                    localStorage.setItem('title1', title);
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
                        localStorage.setItem('title2', title);

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
    document.querySelectorAll(".navBtn button").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const activeButton = document.querySelector(".navBtn button.active");
            activeButton.classList.remove("active");
            btn.classList.add("active");
    
            // Appel de changeScene pour changer de scène
            changeScene(index + 1);
        });
    });
    
    document.querySelectorAll(".navBtnMenu button").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const btnId = btn.id;

            // Recherche du bouton correspondant dans navBtn
            const correspondingBtn = document.getElementById(btnId);
    
            // Recherche du bouton actif dans navBtn et désactivation
            const activeButton = document.querySelector(".sectionBtn.active");
            activeButton.classList.remove("active");
    
            // Activation du bouton correspondant dans navBtn
            correspondingBtn.classList.add("active");

            // Appel de changeScene pour changer de scène
            changeScene(index + 1);
            openMenuSection();
        });
    });
    

    // let isScrolling = false;

    // document.addEventListener("wheel", (event) => {
    //     if (!isScrolling) { // Vérifie si un défilement est en cours de traitement
    //         isScrolling = true; // Active le défilement
    //         let delta = Math.sign(event.deltaY); // Obtient la direction du défilement (1 pour vers le bas, -1 pour vers le haut)
    //         const activeButton = document.querySelector("button.sectionBtn.active");
    //         console.log(delta)
    //         if (Math.abs(event.deltaY) < 20){
    //             delta = 0;
    //         }
    
    //         let newIndex = previousScene + delta; // Calcule le nouvel index en fonction de la direction du défilement
    //         newIndex = Math.round(newIndex);
        
    //         // Vérifie si le nouvel index est valide (entre 1 et le nombre total de boutons)
    //         if (newIndex >= 1 && newIndex != previousScene && newIndex <= document.querySelectorAll("nav button").length) {
    //             // Désactive le bouton actuel
    //             activeButton.classList.remove("active");
    //             const newActiveButtonId = `section${newIndex}Btn`;
    //             document.querySelector(`#${newActiveButtonId}`).classList.add("active");
    //             // Sélectionne le nouveau bouton et l'active
        
    //             // Appel de changeScene pour changer de scène
    //             changeScene(newIndex);
    //         }
    
    //         setTimeout(() => {
    //             isScrolling = false; // Désactive le défilement après un court délai
    //         }, 300); // Délai d'attente en millisecondes avant de désactiver le défilement
    //     }
    // });
});




window.openMenuSection = function (){
    const btn = document.querySelector('.BtnMenuOverlay');
    document.querySelector('.navBtnMenuOverlay').classList.toggle('active');
    if(document.querySelector('.navBtnMenuOverlay').classList.contains('active')){
        btn.src = "assets/images/menu-close.png";
    }
    else{
        btn.src = "assets/images/menu.png";
    }

}



// GESTION DU CHANGEMENT D'ESPACE

function changeScene(sectionNumber) {

    if(previousScene && previousScene == sectionNumber){
        return;
    }
    // Arrêter et nettoyer la scène précédente s'il y en a une
    if (previousScene) {
        stopScene(previousScene);
    }

    // Initialiser la nouvelle scène
    initializeScene(sectionNumber);
    
    // Mettre à jour la référence de la scène précédente
    previousScene = sectionNumber;
}



// GESTION DE SUPPRESSION DES ESPACES

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

    // Sélection de l'élément div avec la classe "analyse"
    const divAnalyse = document.querySelector(".analyse");

    // Vérification si l'élément div avec la classe "analyse" existe
    if (divAnalyse) {
        // Suppression de l'élément div avec la classe "analyse"
        gsap.to('.analyse', { opacity: 0, duration: 1, ease: 'power2.out', onComplete: function() {
        divAnalyse.remove();}  });
    }

    // Sélection de l'élément div avec la classe "analyseResult"
    const divAnalyseResult = document.querySelector(".analyseResult");

    // Vérification si l'élément div avec la classe "analyseResult" existe
    if (divAnalyseResult) {
        // Suppression de l'élément div avec la classe "analyseResult"
        gsap.to('.analyseResult', { opacity: 0, duration: 1, ease: 'power2.out', onComplete: function() {
        divAnalyseResult.remove(); }  });
    }
    

}
function stopScene21(){

}    

function stopScene3(){
    gsap.to('.analyse', { opacity: 0, duration: 1, ease: 'power2.out', onComplete: function() {
        // Supprime l'élément .analyse une fois que l'animation est terminée
        document.querySelector('.analyse').remove();
    } });
    gsap.to('.from', { opacity: 0, duration: 1, ease: 'power2.out',    onComplete: function() {
        // Supprime l'élément .testResult une fois que l'animation est terminée
        document.querySelector('.testResult').remove();
    } });


    // Sortis des élements de la scène 
   
}
function stopScene4(){
    // Utiliser GSAP pour animer la div .prediction avant de la supprimer
    gsap.to('.prediction', {
   duration: 0.2, // Durée de l'animation en secondes
   opacity: 0, // Animer l'opacité à 0 pour la faire disparaître
   ease: "power2.in", // Type d'effet d'animation pour un effet d'estompage
    onComplete: function() {
   document.querySelector('.prediction').remove();
   nominationsLoaded = false; // Assurez-vous de réinitialiser cet état si nécessaire
    }
 });
}




















// INITIALISATION ESPACE COMMUN

// Écouter les mouvements de la souris
window.addEventListener('mousemove', onMouseMove);

function onMouseMove(event) {
    // Mettre à jour les coordonnées de la souris
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
}


function initializeScene(sectionNumber) {



    const rendererElement = section.querySelector('.chartStar');
    console.log(rendererElement)
    if (!rendererElement) {
  

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setClearColor(0xffffff, 0);
        renderer.setSize(section.offsetWidth, section.offsetHeight);
        renderer.domElement.classList.add('chartStar');
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
        case 21:
            initializeScene21(scene,renderer,camera);
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

// CREATION DES DIVERS ESPACES

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

    // Création de l'élément div
    const divAnalyseActive = document.createElement("div");
    divAnalyseActive.classList.add("analyse", "active");

    // Création des éléments HTML
    const divAnalyseResum = document.createElement("div");
    divAnalyseResum.classList.add("analyse-resum");

    const divAnalyseExplain = document.createElement("div");
    divAnalyseExplain.classList.add("analyse-explain");

    const h1AnalyseTitle = document.createElement("h1");
    h1AnalyseTitle.classList.add("analyse-title");
    h1AnalyseTitle.textContent = "Analyse";

    const pAnalyseText = document.createElement("p");
    pAnalyseText.classList.add("analyse-text");
    pAnalyseText.textContent = "Facilitez vos choix cinématographiques avec notre outil de comparaison et explorez des statistiques détaillées sur la popularité des films.";

    divAnalyseExplain.appendChild(h1AnalyseTitle);
    divAnalyseExplain.appendChild(pAnalyseText);

    const divAnalyseBtn = document.createElement("div");
    divAnalyseBtn.classList.add("analyse-btn");

    const divBoutonOvale = document.createElement("div");
    divBoutonOvale.classList.add("bouton-ovale");

    const divOptionContain = document.createElement("div");
    divOptionContain.classList.add("option", "contain", "active");

    const pContenuText1 = document.createElement("p");
    pContenuText1.classList.add("contenu-text");
    pContenuText1.textContent = "Recherche par contenu";

    const pContenuText2 = document.createElement("p");
    pContenuText2.classList.add("contenu-text2");
    pContenuText2.textContent = "(films, séries, acteurs)";

    divOptionContain.appendChild(pContenuText1);
    divOptionContain.appendChild(pContenuText2);

    const divOptionFiltre = document.createElement("div");
    divOptionFiltre.classList.add("option", "filtre");

    const pContenuText3 = document.createElement("p");
    pContenuText3.classList.add("contenu-text");
    pContenuText3.textContent = "Recherche par filtre";

    const pContenuText4 = document.createElement("p");
    pContenuText4.classList.add("contenu-text2");
    pContenuText4.textContent = "(types, genres, langues etc...)";

    divOptionFiltre.appendChild(pContenuText3);
    divOptionFiltre.appendChild(pContenuText4);

    divBoutonOvale.appendChild(divOptionContain);
    divBoutonOvale.appendChild(divOptionFiltre);

    const divComparer = document.createElement("div");
    divComparer.classList.add("comparer");

    const pCompareTo = document.createElement("p");
    pCompareTo.textContent = "COMPARE TO";

    const imgSwitch = document.createElement("img");
    imgSwitch.src = "assets/images/switch.png";
    imgSwitch.alt = "switch1";
    imgSwitch.classList.add("comparerbtn");

    divComparer.appendChild(pCompareTo);
    divComparer.appendChild(imgSwitch);

    divAnalyseBtn.appendChild(divBoutonOvale);
    divAnalyseBtn.appendChild(divComparer);

    divAnalyseResum.appendChild(divAnalyseExplain);
    divAnalyseResum.appendChild(divAnalyseBtn);

    // Ajout de l'élément à la page
    divAnalyseActive.appendChild(divAnalyseResum);

        // Création des éléments HTML
    const divAnalyseFilm = document.createElement("div");
    divAnalyseFilm.classList.add("analyse-film", "active");

    const divAnalyseSelection = document.createElement("div");
    divAnalyseSelection.classList.add("analyse-selection");

    const divAnalyseSelectionFilm = document.createElement("div");
    divAnalyseSelectionFilm.classList.add("analyse-selection-film");

    const divAnalyseFilmSelection1 = document.createElement("div");
    divAnalyseFilmSelection1.classList.add("analyse-film-selection");
    divAnalyseFilmSelection1.setAttribute("data-selection", "1");

    const pAucunContenu1 = document.createElement("p");
    pAucunContenu1.textContent = "Aucun Contenu Sélectionné";
    pAucunContenu1.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";

    const divAnalyseFilmSelection2 = document.createElement("div");
    divAnalyseFilmSelection2.classList.add("analyse-film-selection");
    divAnalyseFilmSelection2.setAttribute("data-selection", "2");
    divAnalyseFilmSelection2.style.display = "none";

    const pAucunContenu2 = document.createElement("p");
    pAucunContenu2.textContent = "Aucun Contenu Sélectionné";
    pAucunContenu2.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";

    divAnalyseFilmSelection1.appendChild(pAucunContenu1);
    divAnalyseFilmSelection2.appendChild(pAucunContenu2);

    divAnalyseSelectionFilm.appendChild(divAnalyseFilmSelection1);
    divAnalyseSelectionFilm.appendChild(divAnalyseFilmSelection2);

    const buttonRoundedSquareBtn = document.createElement("button");
    buttonRoundedSquareBtn.classList.add("rounded-square-btn");
    buttonRoundedSquareBtn.setAttribute("onclick", "activeSearch()");

    const imgFlame = document.createElement("img");
    imgFlame.src = "assets/images/flame.png";
    imgFlame.alt = "flame";
    imgFlame.style.width = "24px";
    imgFlame.style.height = "24px";

    buttonRoundedSquareBtn.textContent = "Lance la visualisation ";
    buttonRoundedSquareBtn.appendChild(imgFlame);

    const divAnalyseSearch = document.createElement("div");
    divAnalyseSearch.classList.add("analyse-search");

    const sectionMovieList = document.createElement("section");
    sectionMovieList.classList.add("movie-list");
    sectionMovieList.setAttribute("aria-label", "Animation");

    const divSliderListAnalytic = document.createElement("div");
    divSliderListAnalytic.classList.add("slider-list-analytic");

    const divSearchBox = document.createElement("div");
    divSearchBox.classList.add("search-box");
    divSearchBox.style.cssText = "margin: 0 auto; padding-bottom:20px; position: absolute; z-index:100000; margin-left:2%;";
    divSearchBox.setAttribute("search-box", "");

    const divSearchWrapper = document.createElement("div");
    divSearchWrapper.classList.add("search-wrapper");
    divSearchWrapper.setAttribute("search-wrapper", "");

    const inputSearch = document.createElement("input");
    inputSearch.type = "text";
    inputSearch.name = "search";
    inputSearch.setAttribute("aria-label", "search movies");
    inputSearch.placeholder = "Search any movies...";
    inputSearch.classList.add("search-field");
    inputSearch.autocomplete = "off";
    inputSearch.setAttribute("search-field", "");

    const imgSearch = document.createElement("img");
    imgSearch.src = "./assets/images/search.png";
    imgSearch.width = "24";
    imgSearch.height = "24";
    imgSearch.alt = "search";
    imgSearch.classList.add("leading-icon");

    const imgPlayCircle = document.createElement("img");
    imgPlayCircle.src = "./assets/images/play_circle.png";
    imgPlayCircle.width = "24";
    imgPlayCircle.height = "24";
    imgPlayCircle.alt = "search";
    imgPlayCircle.classList.add("leading-icon2");

    divSearchWrapper.appendChild(inputSearch);
    divSearchWrapper.appendChild(imgSearch);
    divSearchWrapper.appendChild(imgPlayCircle);

    const buttonSearchBtn = document.createElement("button");
    buttonSearchBtn.classList.add("search-btn");
    buttonSearchBtn.setAttribute("search-toggler", "");

    const imgCloseSearch = document.createElement("img");
    imgCloseSearch.src = "./assets/images/close.png";
    imgCloseSearch.width = "24";
    imgCloseSearch.height = "24";
    imgCloseSearch.alt = "close search box";

    buttonSearchBtn.appendChild(imgCloseSearch);

    divSearchBox.appendChild(divSearchWrapper);
    divSearchBox.appendChild(buttonSearchBtn);

    const buttonSearchBtn2 = document.createElement("button");
    buttonSearchBtn2.classList.add("search-btn");
    buttonSearchBtn2.setAttribute("search-toggler", "");
    buttonSearchBtn2.setAttribute("menu-close", "");

    const imgOpenSearch = document.createElement("img");
    imgOpenSearch.src = "./assets/images/search.png";
    imgOpenSearch.width = "24";
    imgOpenSearch.height = "24";
    imgOpenSearch.alt = "open search box";

    buttonSearchBtn2.appendChild(imgOpenSearch);

    const divSliderInner = document.createElement("div");
    divSliderInner.classList.add("slider-inner");

    const pRechercheContenu = document.createElement("p");
    pRechercheContenu.textContent = "Recherchez le contenu : Utilisez la barre de recherche en haut de la page pour saisir le titre/nom du contenu que vous recherchez.";
    pRechercheContenu.style.color = "white";
    pRechercheContenu.style.marginTop = "40px";

    const pSelectionContenu = document.createElement("p");
    pSelectionContenu.textContent = "Sélectionnez votre contenu : Une fois que vous avez trouvé le contenu que vous souhaitez comparer/visualiser, cliquez simplement sur l'affiche du contenu.";
    pSelectionContenu.style.color = "white";
    pSelectionContenu.style.marginTop = "40px";

    divSliderInner.appendChild(pRechercheContenu);
    divSliderInner.appendChild(pSelectionContenu);

    divSearchBox.appendChild(buttonSearchBtn2);

    divSliderListAnalytic.appendChild(divSearchBox);
    divSliderListAnalytic.appendChild(divSliderInner);

    sectionMovieList.appendChild(divSliderListAnalytic);

    divAnalyseSearch.appendChild(sectionMovieList);
    

    divAnalyseSelection.appendChild(divAnalyseSelectionFilm);
    divAnalyseSelection.appendChild(buttonRoundedSquareBtn);

    divAnalyseFilm.appendChild(divAnalyseSelection);
    divAnalyseFilm.appendChild(divAnalyseSearch);

    // Ajout de l'élément à la page
    divAnalyseActive.appendChild(divAnalyseFilm);








    // Création des éléments HTML
    const divAnalyseGenre = document.createElement("div");
    divAnalyseGenre.classList.add("analyse-genre");

    const pContenuText2X = document.createElement("p");
    pContenuText2X.classList.add("contenu-text2");
    pContenuText2X.textContent = "* : Filtre obligatoire";
    pContenuText2X.style.height = "auto";
    pContenuText2X.style.marginLeft = "10vw";

    const divSelectionForm1 = createSelectionForm(1, "Test 1");

    const buttonRoundedSquareBtnC = document.createElement("button");
    buttonRoundedSquareBtnC.classList.add("rounded-square-btn");
    buttonRoundedSquareBtnC.setAttribute("onclick", "activeSearch()");

    const imgFlame3 = document.createElement("img");
    imgFlame3.src = "assets/images/flame.png";
    imgFlame3.alt = "flame";
    imgFlame3.style.width = "24px";
    imgFlame3.style.height = "24px";

    buttonRoundedSquareBtnC.textContent = "Lance la visualisation ";
    buttonRoundedSquareBtnC.appendChild(imgFlame3);

    divAnalyseGenre.appendChild(pContenuText2X);
    divAnalyseGenre.appendChild(divSelectionForm1);

    divAnalyseGenre.appendChild(buttonRoundedSquareBtnC);

    // Fonction pour créer un formulaire de sélection
    function createSelectionForm(selectionNumber, title) {
        const divSelectionForm = document.createElement("div");
        divSelectionForm.classList.add("selection-form");
        divSelectionForm.setAttribute("data-selection", selectionNumber);



        const divSelectionLabelForm = document.createElement("div");
        divSelectionLabelForm.classList.add("selection-label-form");

        const dropdowns = [
            { label: "* Type :", options: ["movie", "tv"], datatype:"type" },
            { label: "Genre :", id: "genre-menu" , datatype:"genre"},
            { label: "Pays d'origine :", id: "country-menu" , datatype:"pays"},
            { label: "Date de départ :", inputType: "date", id: "date_depart" },
            { label: "Date de fin :", inputType: "date", id: "date_fin" }
        ];

        dropdowns.forEach(dropdown => {
            const divDropdown = document.createElement("div");
            divDropdown.classList.add("dropdown");

            if(!dropdown.inputType){
                const divSelect = document.createElement("div");
                divSelect.classList.add("select");
    
                const spanSelected = document.createElement("span");
                spanSelected.classList.add("selected");
                spanSelected.textContent = dropdown.label;
    
                const divCaret = document.createElement("div");
                divCaret.classList.add("caret");
    
                divSelect.appendChild(spanSelected);
                divSelect.appendChild(divCaret);
    
                const ulMenu = document.createElement("ul");
                ulMenu.classList.add("menu");
                if(dropdown.datatype) spanSelected.setAttribute("data-type",dropdown.datatype)

                if (dropdown.id) ulMenu.id = dropdown.id;

                if (dropdown.options) {
                    dropdown.options.forEach(option => {
                        const liOption = document.createElement("li");
                        liOption.setAttribute("data-value", option.toLowerCase());
                        liOption.textContent = option;
                        ulMenu.appendChild(liOption);
                    });
                }
    
                divDropdown.appendChild(divSelect);
                divDropdown.appendChild(ulMenu);

            }




            if (dropdown.inputType) {
                const divSelectDated = document.createElement("div");
                divSelectDated.classList.add("select", "dated");

                const spanSelected = document.createElement("span");
                spanSelected.classList.add("selected");
                spanSelected.textContent = dropdown.label;

                const inputDate = document.createElement("input");
                inputDate.type = dropdown.inputType;
                inputDate.id = dropdown.id;
                inputDate.name = dropdown.id;
                inputDate.classList.add("form-input");

                divSelectDated.appendChild(spanSelected);
                divSelectDated.appendChild(inputDate);

                divDropdown.appendChild(divSelectDated);
            }

            divSelectionLabelForm.appendChild(divDropdown);
        });

        divSelectionForm.appendChild(divSelectionLabelForm);

        return divSelectionForm;
    }


    divAnalyseActive.appendChild(divAnalyseGenre);

    // Création de l'élément div
    const divAnalyseResult = document.createElement("div");
    divAnalyseResult.classList.add("analyseResult");

    // Création du bouton de retour
    const buttonBackSearch = document.createElement("button");
    buttonBackSearch.classList.add("backSearch");
    buttonBackSearch.innerHTML = '<img src="assets/images/retour.png" alt="" style="width:100%; height:100%" onclick="backSearch()">';

    // Création de la div analyseResultPresent
    const divAnalyseResultPresent = document.createElement("div");
    divAnalyseResultPresent.classList.add("analyseResultPresent");

    // Création de la div analyseResultSubject
    const divAnalyseResultSubject = document.createElement("div");
    divAnalyseResultSubject.classList.add("analyseResultSubject");

    // Création des div choixFilm
    const divChoixFilm1 = document.createElement("div");
    divChoixFilm1.classList.add("choixFilm");
    divChoixFilm1.setAttribute("data-choix", "1");

    const divChoixFilm2 = document.createElement("div");
    divChoixFilm2.classList.add("choixFilm");
    divChoixFilm2.setAttribute("data-choix", "2");

    // Création de l'image versus
    const imgVersus = document.createElement("img");
    imgVersus.src = "assets/images/vs.png";
    imgVersus.alt = "";
    imgVersus.classList.add("versus");

    divAnalyseResultSubject.appendChild(divChoixFilm1);
    divAnalyseResultSubject.appendChild(imgVersus);
    divAnalyseResultSubject.appendChild(divChoixFilm2);

    // Création de l'élément div.analyseResultChiffre
    const divAnalyseResultChiffre = document.createElement("div");
    divAnalyseResultChiffre.classList.add("analyseResultChiffre");

    // Création de l'élément div.chartNumbers (premier ensemble de chiffres)
    const divChartNumbers1 = document.createElement("div");
    divChartNumbers1.classList.add("chartNumbers");
    divChartNumbers1.setAttribute("data", "contenu1");

    // Création des éléments p.statsInfo (chiffres du premier ensemble)
    const pStatsInfoPopularity1 = document.createElement("p");
    pStatsInfoPopularity1.classList.add("statsInfo");
    pStatsInfoPopularity1.setAttribute("data", "popularity1");

    const pStatsInfoBudget1 = document.createElement("p");
    pStatsInfoBudget1.classList.add("statsInfo");
    pStatsInfoBudget1.setAttribute("data", "budget1");

    const pStatsInfoNomi1 = document.createElement("p");
    pStatsInfoNomi1.classList.add("statsInfo");
    pStatsInfoNomi1.setAttribute("data", "nomi1");

    // Ajout des éléments p.statsInfo au premier ensemble de chiffres
    divChartNumbers1.appendChild(pStatsInfoPopularity1);
    divChartNumbers1.appendChild(pStatsInfoBudget1);
    divChartNumbers1.appendChild(pStatsInfoNomi1);

    // Création de l'élément div.chartGlobal
    const divChartGlobal = document.createElement("div");
    divChartGlobal.classList.add("chartGlobal");

    // Création des éléments pour les graphiques
    // (Remplissez les détails manquants selon vos besoins)

    // Création des éléments p.statsInfo (labels)
    const pStatsInfoPopularityLabel = document.createElement("p");
    pStatsInfoPopularityLabel.classList.add("statsInfo");
    pStatsInfoPopularityLabel.textContent = "Popularity";

    const pStatsInfoBudgetLabel = document.createElement("p");
    pStatsInfoBudgetLabel.classList.add("statsInfo");
    pStatsInfoBudgetLabel.textContent = "Budget";

    const pStatsInfoNomiLabel = document.createElement("p");
    pStatsInfoNomiLabel.classList.add("statsInfo");
    pStatsInfoNomiLabel.textContent = "Nomination";

    // Création des éléments canvas.chart (graphiques)
    const canvasChartPopularity = document.createElement("canvas");
    canvasChartPopularity.classList.add("chart");
    canvasChartPopularity.classList.add("chartPopularity");

    const canvasChartBudget = document.createElement("canvas");
    canvasChartBudget.classList.add("chart");
    canvasChartBudget.classList.add("chartBudget");

    const canvasChartNomination = document.createElement("canvas");
    canvasChartNomination.classList.add("chart");
    canvasChartNomination.classList.add("chartNomination");

    // Création des div.chartDiv pour chaque graphique
    const divChartDivPopularity = document.createElement("div");
    divChartDivPopularity.classList.add("chartDiv");
    divChartDivPopularity.appendChild(canvasChartPopularity);

    const divChartDivBudget = document.createElement("div");
    divChartDivBudget.classList.add("chartDiv");
    divChartDivBudget.appendChild(canvasChartBudget);

    const divChartDivNomination = document.createElement("div");
    divChartDivNomination.classList.add("chartDiv");
    divChartDivNomination.appendChild(canvasChartNomination);

    // Ajout des éléments dans la hiérarchie
    divChartGlobal.appendChild(pStatsInfoPopularityLabel);
    divChartGlobal.appendChild(divChartDivPopularity);
    divChartGlobal.appendChild(pStatsInfoBudgetLabel);
    divChartGlobal.appendChild(divChartDivBudget);
    divChartGlobal.appendChild(pStatsInfoNomiLabel);
    divChartGlobal.appendChild(divChartDivNomination);

    // Création de l'élément div.chartNumbers (deuxième ensemble de chiffres)
    const divChartNumbers2 = document.createElement("div");
    divChartNumbers2.classList.add("chartNumbers");
    divChartNumbers2.setAttribute("data", "contenu1");

    // Création des éléments p.statsInfo (chiffres du deuxième ensemble)
    const pStatsInfoPopularity2 = document.createElement("p");
    pStatsInfoPopularity2.classList.add("statsInfo");
    pStatsInfoPopularity2.setAttribute("data", "popularity2");

    const pStatsInfoBudget2 = document.createElement("p");
    pStatsInfoBudget2.classList.add("statsInfo");
    pStatsInfoBudget2.setAttribute("data", "budget2");

    const pStatsInfoNomi2 = document.createElement("p");
    pStatsInfoNomi2.classList.add("statsInfo");
    pStatsInfoNomi2.setAttribute("data", "nomi2");

    // Ajout des éléments p.statsInfo au deuxième ensemble de chiffres
    divChartNumbers2.appendChild(pStatsInfoPopularity2);
    divChartNumbers2.appendChild(pStatsInfoBudget2);
    divChartNumbers2.appendChild(pStatsInfoNomi2);

    // Ajout de tous les éléments créés à div.analyseResultChiffre
    divAnalyseResultChiffre.appendChild(divChartNumbers1);
    divAnalyseResultChiffre.appendChild(divChartGlobal);
    divAnalyseResultChiffre.appendChild(divChartNumbers2);

    divAnalyseResultPresent.appendChild(divAnalyseResultSubject);
    divAnalyseResultPresent.appendChild(divAnalyseResultChiffre);

    // Création de la div analyseResultGraph
    const divAnalyseResultGraph = document.createElement("div");
    divAnalyseResultGraph.classList.add("analyseResultGraph");

    // Création de la div analyseResultExplain
    const divAnalyseResultExplain = document.createElement("div");
    divAnalyseResultExplain.classList.add("analyseResultExplain");

    // Création de la div choix-ovale
    const divChoixOvale = document.createElement("div");
    divChoixOvale.classList.add("choix-ovale");

    // Création des div choix
    const divChoixVotes = document.createElement("div");
    divChoixVotes.classList.add("choix", "votes", "active");
    divChoixVotes.setAttribute("onclick", "changeStats(1)");
    divChoixVotes.innerHTML = '<p class="contenu-text">Votes</p>';

    const divChoixRevenus = document.createElement("div");
    divChoixRevenus.classList.add("choix", "revenus");
    divChoixRevenus.setAttribute("onclick", "changeStats(2)");
    divChoixRevenus.innerHTML = '<p class="contenu-text">Revenus par région</p>';

    const divChoixCasting = document.createElement("div");
    divChoixCasting.classList.add("choix", "casting");
    divChoixCasting.setAttribute("onclick", "changeStats(3)");
    divChoixCasting.innerHTML = '<p class="contenu-text">Casting</p>';

    divChoixOvale.appendChild(divChoixVotes);
    divChoixOvale.appendChild(divChoixRevenus);
    divChoixOvale.appendChild(divChoixCasting);

    // Création de la div choix-ovale-revenu
    const divChoixOvaleRevenu = document.createElement("div");
    divChoixOvaleRevenu.classList.add("choix-ovale-revenu");

    // Création des div choix contenu 1 et contenu 2
    const divChoixContenu1 = document.createElement("div");
    divChoixContenu1.classList.add("choix", "contenu1", "active");
    divChoixContenu1.setAttribute("onclick", "changeGraphRevenu(1)");
    divChoixContenu1.innerHTML = '<p class="contenu-text" data="contenu 1">Contenu 1</p>';

    const divChoixContenu2 = document.createElement("div");
    divChoixContenu2.classList.add("choix", "contenu2");
    divChoixContenu2.setAttribute("onclick", "changeGraphRevenu(2)");
    divChoixContenu2.innerHTML = '<p class="contenu-text" data="contenu 2">Contenu 2</p>';

    divChoixOvaleRevenu.appendChild(divChoixContenu1);
    divChoixOvaleRevenu.appendChild(divChoixContenu2);

    // Création du paragraphe graph-ana
    const pGraphAna = document.createElement("p");
    pGraphAna.classList.add("graph-ana");
    pGraphAna.textContent = "Il était une fois un super Graphique fait par Yacine";

    divAnalyseResultExplain.appendChild(divChoixOvale);
    divAnalyseResultExplain.appendChild(divChoixOvaleRevenu);
    divAnalyseResultExplain.appendChild(pGraphAna);

    // Création de la div analyseResultGraphique
    const divAnalyseResultGraphique = document.createElement("div");
    divAnalyseResultGraphique.classList.add("analyseResultGraphique");

    // Création du canvas
    const canvasChartGraph = document.createElement("canvas");
    canvasChartGraph.classList.add("chartGraph");

    divAnalyseResultGraphique.appendChild(canvasChartGraph);

    divAnalyseResultGraph.appendChild(divAnalyseResultExplain);
    divAnalyseResultGraph.appendChild(divAnalyseResultGraphique);

    divAnalyseResult.appendChild(buttonBackSearch);
    divAnalyseResult.appendChild(divAnalyseResultPresent);
    divAnalyseResult.appendChild(divAnalyseResultGraph);

    // Ajout de l'élément à la page
    section.appendChild(divAnalyseActive);
    section.appendChild(divAnalyseResult);
    gsap.from('.analyse', { opacity: 0, duration: 1, ease: 'power2.out' });

    localStorage.clear();


    loadCountries();
    loadGenres();

    dropdown();
    search();

    document.querySelector('.dropdown:nth-child(1) .menu').addEventListener('click', loadGenres);











 
    


}

function initializeScene3(scene,renderer,camera){
    const analyseHTML = `
    <div class="analyse active">
      <div class="analyse-resum">
        <div class="analyse-explain">
          <h1 class="analyse-title" style="">Test Statistic</h1>
          <p class="analyse-text">Facilitez vos choix cinématographiques avec notre outil de test statistics .</p>
        </div>

        <div class="prediction-btn">
          <div class="bouton-ovale-prediction" >
            <div class="option-prediction stape1 active" onclick="changeState(this)">
              <div class="divImgStape">
                <img src="assets/images/stape1.png" alt="" class="imgStape">
                <img src="assets/images/barreStape.png" alt="" class="barreStape active" >
              </div>

              <img src="assets/images/textStape1.png" alt="" class="textStape">

            </div>
            <div class="option-prediction stape2" onclick="changeState(this)">
             <div class="divImgStape">
                <img src="assets/images/stape2.png" alt="" class="imgStape">
                <img src="assets/images/barreStape.png" alt="" class="barreStape" >
              </div>

              <img src="assets/images/textStape2.png" alt="" class="textStape">
             </div>
            <div class="option-prediction stape3" onclick="changeState(this)">
                <div class="divImgStape">
                  <img src="assets/images/stape3.png" alt="" class="imgStape">
                  <img src="assets/images/barreStape.png" alt="" class="barreStape">
                </div>

                <img src="assets/images/textStape3.png" alt="" class="textStape">
            </div>

          </div>

        </div>
      </div>
      <div class="analyse-film active">
        <div class="divStape active" stape="1">
          <h1 class="divStapeTitle">Etape 1 : Choisis ta plage de données</h1>
          <div class="selection-label-form">

            <div class="dropdown">
              <div class="select">
                <span class="selected" data-type="type">Type * :</span>
                <div class="caret"></div>
              </div>
              <ul class="menu">
                <li data-value="movie">Film</li>
                <li data-value="tv">Série</li>
              </ul>
            </div>

            <div class="dropdown">
              <div class="select">
                <span class="selected" data-type="genre">Genre :</span>
                <div class="caret"></div>
              </div>
              <ul class="menu" id="genre-menu">
                <!-- Les options seront ajoutées dynamiquement ici -->
              </ul>
            </div>

            <div class="dropdown">
              <div class="select">
                <span class="selected" data-type="pays">Pays d'origine :</span>
                <div class="caret"></div>
              </div>
              <ul class="menu" id="country-menu">
                <!-- Les options seront ajoutées dynamiquement ici -->
              </ul>
            </div>

            <div class="dropdown">
              <div class="select dated" >
                <span class="selected">Date de départ :</span>
                <input type="date" id="date_depart" name="date_depart" class="form-input">
              </div>

            </div>

            <div class="dropdown">
              <div class="select dated">
                <span class="selected">Date de fin :</span>
                <input type="date" id="date_fin" name="date_fin" class="form-input">
              </div>
              
            </div>


          </div>
          <button class="btnNextStape" onclick="verifyStape()">Etape Suivante</button>
          
        </div>
        <div class="divStape" stape="2">
          <h1 class="divStapeTitle">Etape 2 : Choisis ton test</h1>
          <div class="navTestStape">
            <div class="testStape" test="pearson">
              <h1 class="textTestStape">Correlation de Pearson</h1>
            </div>
            <div class="testStape" test="regression">
              <h1 class="textTestStape">Régression Linéaire
            </h1>
            </div>

            <div class="testStape" test="cluestering">
              <h1 class="textTestStape">Clustering</h1>
            </div>
          </div>
          <button class="btnNextStape" onclick="verifyStape()">Etape Suivante</button>
        </div>
        <div class="divStape" stape="3">
          <h1 class="divStapeTitle">Etape 3 : Choisis tes variables</h1>
          <div class="variableStape" test="1">
            <div class="navVariableStape" variable = "1">
              <h2 class="textVar">Variable 1 :</h2>
              <div class="varStape" var="budget">
                  <h1 class="textVarStape">Budget</h1>
              </div>
              <div class="varStape" var="revenue">
                <h1 class="textVarStape">Revenue</h1>
              </div>

              <div class="varStape" var="runtime">
                <h1 class="textVarStape">Duree</h1>
              </div>
              <div class="varStape" var="popularity">
                <h1 class="textVarStape">Popularité
                </h1>
              </div>

              <div class="varStape" var="vote_count">
                <h1 class="textVarStape">Nombre de vote</h1>
              </div>
            </div>
            <div class="navVariableStape" variable = "2">
              <h2 class="textVar">Variable 2 :</h2>
              <div class="varStape" var="budget">
                <h1 class="textVarStape">Budget</h1>
              </div>
              <div class="varStape" var="revenue">
                <h1 class="textVarStape">Revenue</h1>
              </div>

              <div class="varStape" var="runtime">
                <h1 class="textVarStape">Duree</h1>
              </div>
              <div class="varStape" var="popularity">
                <h1 class="textVarStape">Popularité
              </h1>
              </div>

              <div class="varStape" var="vote_count">
                <h1 class="textVarStape">Nombre de vote</h1>
              </div>
            </div>

          </div>
          <div class="variableStape" test="3" >
            <div class="navVariableStape" variable = "1">
                <h2 class="textVar">K  :</h2>
                <div class="varStape" var="1">
                    <h1 class="textVarStape">1</h1>
                </div>
                <div class="varStape" var="2">
                  <h1 class="textVarStape">2</h1>
                </div>

                <div class="varStape" var="3">
                  <h1 class="textVarStape">3</h1>
                </div>
                <div class="varStape" var="4">
                  <h1 class="textVarStape">4
                  </h1>
                </div>

                <div class="varStape" var="5">
                  <h1 class="textVarStape">5</h1>
                </div>
            </div>
           

          </div>
          <button class="btnNextStape" onclick="verifyStape()">Lancer le Test</button>

        </div>

        

      </div>

    </div>
    `;
    section.insertAdjacentHTML('beforeend', analyseHTML);

    const testResultHTML = `
    <div class="testResult">
      <div class="loadingDiv">
        <div class="divImgStapeLoad">
          <img src="assets/images/loadingImg.png" alt="" class="imgStape">
          <img src="assets/images/barreStape.png" alt="" class="barreStape" >
        </div>

        <img src="assets/images/loadingTxt.png" alt="" class="textStapeLoad">


      </div>
      <div class="testResum">
        <h1 style="text-align:center">Recherche effectuée :</h1>
        <div class="divTestVar">
          <p class="testVar" type="test"></p>
          <p class="testVar" type="var1"></p>
          <p class="testVar" type="var2"></p>
        </div>
        <button class="backTest" onclick="backTest()">Nouvelle Recherche</button>
        <button class="backTest" id="downloadButton" >Download le graphique</button>

      </div>

      <div class="testExplain"></div>


      <div class="testData">
        <h2 class="dataText">Données récupérées</h2>
          <table id="dataTable">
              <thead>
                  <tr>
                      <th>Titre du film</th>
                      <th>Variable 1</th>
                      <th>Variable 2</th>
                  </tr>
              </thead>
              <tbody id="dataBody">
              </tbody>
          </table>
      </div>


      <div class="testGraph">
        <div id="myDiv">
          <canvas id="correlationChart" width="400" height="400"></canvas>
        </div>
      </div>
        



   
      

    </div>
    `;
    section.insertAdjacentHTML('beforeend', testResultHTML);
    gsap.from('.analyse', { opacity: 0, duration: 1, ease: 'power2.out' });

    // Sélection de tous les éléments avec la classe "testStape"
    const testStapes = document.querySelectorAll('.testStape');

    // Parcourir chaque élément et ajouter un écouteur d'événements
    testStapes.forEach(testStape => {
        testStape.addEventListener('click', () => {
            // Supprimer la classe "active" de tous les éléments
            testStapes.forEach(element => {
                element.classList.remove('active');
            });
            // Ajouter la classe "active" à l'élément cliqué
            testStape.classList.add('active');
        });
    });

    const navVariable3 = document.querySelector('.divStape[stape="3"]');

    navVariable3.querySelectorAll('.navVariableStape').forEach(nav => {
        nav.addEventListener('click', () => {
            // Remove 'active' class from all varStape elements within the same navVariableStape
            nav.querySelectorAll('.varStape').forEach(varStape => {
                varStape.classList.remove('active');
            });
            // Add 'active' class to the clicked varStape element
            event.target.closest('.varStape').classList.add('active');
        });
    });


    loadCountries();


    dropdown();

    
    
    
    document.querySelector('.dropdown:nth-child(1) .menu').addEventListener('click', loadGenres);



}

let nominationsLoaded = false;
function initializeScene4() {
    // Créez et configurez les éléments HTML seulement si les nominations n'ont pas encore été chargées
    if (!nominationsLoaded) {
        const contentAnalytic = document.createElement('div');
        contentAnalytic.className = 'content-analytic';

        const predictionDiv = document.createElement('div');
        predictionDiv.className = 'prediction';

        const titleH1 = document.createElement('h1');
        titleH1.className = 'analyse-title';
        titleH1.style.cssText = 'position: absolute; top: 30%; transform: translateY(-50%); width: 100%; text-align: center;';
        titleH1.textContent = 'Prédiction';

        const predictionText = document.createElement('p');
        predictionText.className = 'prediction-texte';
        predictionText.style.cssText = 'position: absolute; top: 40%; width: 100%; text-align: center; font-size: 30px;';
        predictionText.textContent = 'Découvrez qui sera le gagnant des oscars grâce à notre modèle de Prédiction';

        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';
        pageContent.style.cssText = 'display: flex; flex-wrap: wrap; position: absolute;';

        const getPredictionButton = document.createElement('button');
        getPredictionButton.className = 'getPrediction';
        getPredictionButton.style.cssText = 'position: absolute; top: 60%; left: 50%; transform: translateX(-50%); border-radius: 20px; background-color: grey; width: 30%; text-align: center; font-size: 25px;';
        getPredictionButton.textContent = "C'est ici que ça se passe";

        getPredictionButton.addEventListener('click', async () => {
            gsap.to('.analyse-title, .prediction-texte, .getPrediction', {
                y: '-100%', opacity: 0, duration: 1.5,
                onComplete: async () => {
                    const nominationsContainer = document.querySelector('.page-content');
                    nominationsContainer.innerHTML = ''; 
                    await displayOscarNominations();
                    nominationsLoaded = true; // Important : Mettez à jour cette variable après le chargement des données
                    animateNominationsEntry();
                }
            });
        });
        predictionDiv.appendChild(titleH1);
        predictionDiv.appendChild(predictionText);
        predictionDiv.appendChild(pageContent);
        predictionDiv.appendChild(getPredictionButton);

        contentAnalytic.appendChild(predictionDiv);

        document.body.appendChild(contentAnalytic); 
    } else {
        
        displayOscarNominations();
    }
    

    async function fetchPosterPath(itemId) {
        const url = `https://api.themoviedb.org/3/movie/${itemId}?api_key=${api_key}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
            return `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null; 
        }
    }
    const oscars_nominés = [
        { title : 'Barbie' , year: '2023', winner : 'False', itemId :346698,itemType: 'movie'  },
    
        { title : 'Maestro' , year: '2023',winner : 'False',itemId :523607, itemType:'movie'},
    
        { title : 'The Zone of Interest' , year: '2023',winner : 'False',itemId :467244, itemType: 'movie'},
    
        { title : 'American Fiction' , year: '2023',winner : 'False',itemId :1056360,itemType: 'movie'},
    
        { title : 'Killers of the flower Moon' , year: '2023',winner : 'False',itemId :466420,itemType: 'movie'},
    
        { title : 'Oppenheimer' , year: '2023',winner : 'True',itemId :872585, itemType: 'movie'},
    
        { title : 'Past Lives' , year: '2023',winner : 'False',itemId :666277, itemType: 'movie'},
    
        { title : 'Poor Things' , year: '2023',winner : 'False',itemId :792307, itemType: 'movie'},
    
        { title : 'The Holdovers' , year: '2023',winner : 'False',itemId :840430, itemType: 'movie'},
    
        { title : 'Anatomy Of a Fall' , year: '2023',winner : 'False',itemId :915935, itemType: 'movie'}
    
    
    ];

    async function displayOscarNominations() {
        const nominationsContainer = document.querySelector('.page-content');
    
        // Styles pour le conteneur pour s'assurer que les films sont sur 2 lignes avec 5 films par ligne
        nominationsContainer.style.display = 'flex';
        nominationsContainer.style.flexWrap = 'wrap';
        nominationsContainer.style.justifyContent = 'center';
        nominationsContainer.style.alignItems = 'flex-start'; // Alignement au début pour éviter des espacements verticaux inégaux
        nominationsContainer.style.gap = '20px'; // Espacement entre les films
    
        nominationsContainer.style.maxWidth = '1080px';
        nominationsContainer.style.marginTop = '180px';
        nominationsContainer.style.marginLeft = '200px';
        nominationsContainer.style.marginRight = 'auto';
    
        for (let i = 0; i < oscars_nominés.length; i++) {
            const film = oscars_nominés[i];
            const posterPath = await fetchPosterPath(film.itemId);
            if (posterPath) {
                const filmElement = document.createElement('div');
                filmElement.classList.add('film-nomination');
                // Ajouter la classe 'right' ou 'left' basée sur l'index de l'élément
                if (i < 5) { // Première ligne
                    filmElement.classList.add('right');
                } else { // Deuxième ligne
                    filmElement.classList.add('left');
                }
    
                const completePosterPath = `https://image.tmdb.org/t/p/w500${posterPath}`;
    
                
                const imgElement = document.createElement('img');
                imgElement.classList.add('movie-P');
                imgElement.src = completePosterPath;
                imgElement.alt = `${film.title} Poster`;
                imgElement.style.width = '200px'; 
                imgElement.style.height = '280px';
                imgElement.style.objectFit = 'cover';
                
                filmElement.appendChild(imgElement);  
                filmElement.onclick = function() {
                    
                    getMovieDetail(film.itemId);
                };  

                nominationsContainer.appendChild(filmElement);
            }
        }
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex'; // Utilisation de Flexbox pour aligner les boutons côte à côte
        buttonsContainer.style.justifyContent = 'space-around'; // Espacement autour des boutons
        buttonsContainer.style.marginTop = '20px'; // Espace au-dessus du conteneur de boutons
        
        // Création du premier bouton pour les résultats
        const resultatButton = document.createElement('button');
        resultatButton.textContent = 'Cliquez ici pour découvrir le gagnant';
        resultatButton.style.marginTop = '0px';
        resultatButton.style.border = 'none';
        resultatButton.style.borderRadius = '5px';
        resultatButton.style.backgroundColor = 'red';
        resultatButton.style.color = 'white';
        resultatButton.style.fontSize = '24px';
        resultatButton.style.padding = '10px 20px'; // Uniformisation du padding avec le deuxième bouton
        resultatButton.style.cursor = 'pointer'; // Ajout du curseur pointeur
        
        // Création du deuxième bouton pour la prédiction
        const predictionButton = document.createElement('button');
        predictionButton.textContent = 'Découvrez comment fonctionne le système de Prédiction';
        predictionButton.style.border = 'none';
        predictionButton.style.borderRadius = '5px';
        predictionButton.style.backgroundColor = '#808080';
        predictionButton.style.color = 'white';
        predictionButton.style.fontSize = '16px';
        predictionButton.style.padding = '10px 20px';
        predictionButton.style.cursor = 'pointer'; // Ajout du curseur pointeur
        
        // Ajout des boutons au conteneur
        buttonsContainer.appendChild(resultatButton);
        buttonsContainer.appendChild(predictionButton);




        const modalContainer = document.createElement('div');
        modalContainer.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; z-index: 1000;';

        const modalContent = document.createElement('div');
        modalContent.style.cssText = 'background-color: white; padding: 20px; border-radius: 5px; width: 80%; max-width: 600px; position: relative; overflow-y: auto; max-height: 80vh;';

        const bouttonFermeture = document.createElement('span');
        bouttonFermeture.textContent = 'x';
        bouttonFermeture.style.cssText = 'position: fixed; cursor: pointer; font-size: 24px; font-weight: bold; color: #333;';

        const mediumWidget = document.createElement('div');
        mediumWidget.classList = 'sk-ww-medium-post';
        mediumWidget.setAttribute('data-embed-id', '25400423');

        modalContent.appendChild(bouttonFermeture);
        modalContent.appendChild(mediumWidget);
        modalContainer.appendChild(modalContent);
        nominationsContainer.appendChild(modalContainer);
        nominationsContainer.appendChild(buttonsContainer);

        predictionButton.addEventListener('click', function(){
            modalContainer.style.display = 'flex';
        });
        resultatButton.addEventListener('click', animateBorderOnNominations);

        
        
        bouttonFermeture.addEventListener('click', function(){
            modalContainer.style.display = 'none';
        });

        
        const skScript = document.createElement('script');
        skScript.src = 'https://widgets.sociablekit.com/medium-post/widget.js';
        skScript.async = true;
        skScript.defer = true;
        document.body.appendChild(skScript);
    
    }

    function animateNominationsEntry() {
        gsap.from('.right', { x: '100%', opacity: 0, duration: 1.5, stagger: 0.1 });
        gsap.from('.left', { x: '-100%', opacity: 0, duration: 1.5, stagger: 0.1 });
    }

    function animateBorderOnNominations() {
    const movieImages = document.querySelectorAll('.movie-P');
    let previousIndex = -1;  // Garder une trace de l'index précédent
    
    // Fonction pour réinitialiser la bordure de l'image précédente
    function resetPreviousBorder() {
        if (previousIndex !== -1) {
            movieImages[previousIndex].style.border = 'none'; // Réinitialiser seulement l'image précédente
        }
    }

    // Fonction pour animer les bordures
    const intervalId = setInterval(() => {
        resetPreviousBorder();
        // Choisir une image au hasard, mais pas la même consécutivement
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * movieImages.length);
        } while (randomIndex === previousIndex);
        previousIndex = randomIndex;
        
        // Mettre une bordure rouge sur l'image choisie
        movieImages[randomIndex].style.border = '3px solid gold';
    }, 150); // Changer de bordure toutes les 150 millisecondes

    // Arrêter l'animation après 3.75 secondes
    setTimeout(() => {
        clearInterval(intervalId);
        resetPreviousBorder();  // Réinitialiser la dernière image avant de mettre en évidence Oppenheimer
        // Mettre en évidence Oppenheimer
        const oppenheimerImage = Array.from(movieImages).find(img => img.alt.includes('Oppenheimer'));
        if (oppenheimerImage) {
            oppenheimerImage.style.border = '3px solid gold';
        }

        // Afficher un message sur la droite de la page
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "D'après le modèle, Oppenheimer a remporté les Oscars avec une probabilité de 94.4%.Pour en savoir plus, découvrez comment on a crée notre système de prédiction";
        messageDiv.style.cssText = 'position: absolute; right: 100px; top: 50%; transform: translateY(-50%); background-color: transparent; color: white; padding: 10px; border-radius: 5px; z-index: 100; font-size: 25px; width: 250px;';

        document.body.appendChild(messageDiv);

    }, 3750);
}

    

    
    




}



let filmdetails;

// GESTION DU LANCEMENT DES DIFFERENTS GRAPHIQUES - PAGE ANALYSE-RESULT

window.changeStats = async function(number){
    const comparerbtnOn = document.querySelector('.comparerbtn').alt == "switch2";
    const containOn = document.querySelector('.option.contain.active');

    if (number==changeStatActive){
        return;
    }
    const choixElements = document.querySelectorAll('.choix');

    // Parcourir tous les éléments et retirer la classe "active" de ceux qui la possèdent
    for (let i = 0; i < choixElements.length; i++) {
        choixElements[i].classList.remove('active');
    }
    document.querySelector(".choix-ovale-revenu").classList.remove("active");
    changeStatActive = number;
    clearChart();

    const imdb1 = localStorage.getItem("imdb1");
    const imdb2 = localStorage.getItem("imdb2");


    if(number==1){
        document.querySelector(".choix.votes").classList.add("active");
        if(containOn){
            if(comparerbtnOn){
                getCombinedVotesDetails(imdb1,imdb2);
            }
            else{
                getSingleMovieVotesDetails(imdb1);
            }
        }
        else{
            const filmsData = await fetchDetails();
            const type = document.querySelector('.selected[data-type="type"]').getAttribute("data-value");
            if(type =="movie"){
                createFilmBubbleChart(filmsData);
                
    


            }
            else{
                createSeriesBubbleChart(filmsData);

               
                
        

            }
            

        }




    }
    else if(number==2){
        if(containOn){
            document.querySelector(".choix.revenus").classList.add("active");
            document.querySelector(".choix-ovale-revenu").classList.add("active");
            document.querySelector(".choix.contenu1").classList.add("active");
            getRevenueData(imdb1);
        }
        else{
            const filmsData = await fetchDetails();
            const type = document.querySelector('.selected[data-type="type"]').getAttribute("data-value");
            if(type =="movie"){
                createFilmRevenueBudgetChart(moyennesParGenre(filmsData));
            }
            else{
                createGenreSeasonsChart(filmsData);
                
            }
          


            
        }
        

    }
    else if(number==3){
        document.querySelector(".choix.casting").classList.add("active");
        if(containOn){
            if(comparerbtnOn){
                const topCastDetailsMovie1 = await getTopCastDetails(imdb1);
                const topCastDetailsMovie2 = await getTopCastDetails(imdb2);
        
                if (topCastDetailsMovie1 && topCastDetailsMovie2) {
                    createCombinedCastChart(topCastDetailsMovie1, topCastDetailsMovie2);
                }
            }
            else{
                
                const topCastDetailsMovie1 = await getTopCastDetails(imdb1);
        
                if (topCastDetailsMovie1) {
                    createSingleCastChart(topCastDetailsMovie1);
                }
            }

        }
        else{
            const filmsData = await fetchDetails();
            const type = document.querySelector('.selected[data-type="type"]').getAttribute("data-value");
            if(type =="movie"){
                createRuntimeByYearChart(groupFilmsByYearAndGenre(filmsData));

            }
            else{

                createSeriesSeasonsEpisodesChart(filmsData);
                
            }
            

        }




    };
};
window.changeGraphRevenu = function (number){
    if (number==changeGraphActive){
        return;
    }
    clearChart();
    changeGraphActive = number;
    if(number == 1){
        document.querySelector(".choix.contenu2").classList.remove("active");
        document.querySelector(".choix.contenu1").classList.add("active");
        const imdb1 = localStorage.getItem("imdb1");
        getRevenueData(imdb1);
    }
    else if(number == 2){
        document.querySelector(".choix.contenu1").classList.remove("active");
        document.querySelector(".choix.contenu2").classList.add("active");
        const imdb2 = localStorage.getItem("imdb2");
        getRevenueData(imdb2);
    }

}



// GESTION DU LANCEMENT / FERMETURE DES RECHERCHES - PAGE ANALYSE

window.backSearch = function (){

    document.querySelector(".analyseResult").classList.remove("active");
    document.querySelector(".analyse").classList.add("active");
    recreateAnalyseResultDiv();
}
window.closeGenre = function (){

    document.querySelector(".choixGenre").classList.remove("active");
    document.querySelector(".choixFilm.open").classList.remove("open")
}
window.openGenre = function (element){

    element.classList.add("open")
    document.querySelector(".choixGenre").classList.add("active");
}

window.activeSearch = async function (){
    
    const comparerbtnOn = document.querySelector('.comparerbtn').alt == "switch2";
    const containOn = document.querySelector('.option.contain.active');
    
    // Sélectionner les divs avec les classes spécifiées
    var div1 = document.querySelector('div.analyse-film-selection[data-selection="1"]');
    var div2 = document.querySelector('div.analyse-film-selection[data-selection="2"]');

    // Vérifier si chaque div contient une image avec la classe "affiche-selection"
    var div1ContainsImage = div1 && div1.querySelector('img.affiche-selection');
    var div2ContainsImage = div2 && div2.querySelector('img.affiche-selection');


    if(comparerbtnOn && containOn){

        const containOn = document.querySelector('.option.contain.active');
        if (!(div1ContainsImage && div2ContainsImage)) {
             alert("ZUT IL MANQUE UN FILM")
        }
        else{
            const tmdbId1 = localStorage.getItem("tmdbId1");
            const tmdbId2 = localStorage.getItem("tmdbId2");
            const imdb1 = localStorage.getItem("imdb1");
            const imdb2 = localStorage.getItem("imdb2");
            const type1 = localStorage.getItem("type1");
            const type2 = localStorage.getItem("type2");
            const img1 = div1.querySelector('img.affiche-selection').src;
            const img2 = div2.querySelector('img.affiche-selection').src;

            const title1 = localStorage.getItem("title1");
            const title2 = localStorage.getItem("title2");

            const contenu1 = document.querySelector('.contenu-text[data ="contenu 1"]');
            const contenu2 = document.querySelector('.contenu-text[data ="contenu 2"]');
            contenu1.textContent = title1;
            contenu2.textContent = title2;


            // AJOUT POSTER
            const newimg = document.querySelector(".choixFilm[data-choix='1']");
            const imageElement = document.createElement('img');
            imageElement.classList.add('affiche-selection');
            imageElement.src = img1;
            newimg.appendChild(imageElement);


            const newimg2 = document.querySelector(".choixFilm[data-choix='2']");
            const imageElement2 = document.createElement('img');
            imageElement2.classList.add('affiche-selection');
            imageElement2.src = img2;
            newimg2.appendChild(imageElement2);
            getCombinedVotesDetails(imdb1,imdb2);

            //RECUPERATION DES INDICATEURS
            getGlobalStats(tmdbId1, tmdbId2, imdb1, imdb2, type1, type2).catch(error => console.error("Une erreur est survenue :", error));







            document.querySelector(".analyse").classList.remove("active");
            document.querySelector(".analyseResult").classList.add("active");

        }


        

    }
    else if(!comparerbtnOn && containOn){
        const containOn = document.querySelector('.option.contain.active');
        if (!(div1ContainsImage )) {
             alert("ZUT IL FAUT METTRE UN FILM")
        }
        else{
            const tmdbId1 = localStorage.getItem("tmdbId1");
            const imdb1 = localStorage.getItem("imdb1");
            const type1 = localStorage.getItem("type1");
            const img1 = div1.querySelector('img.affiche-selection').src;

            document.querySelector(".choixFilm[data-choix='2']").style.display ="none";


            const title1 = localStorage.getItem("title1");

            const contenu1 = document.querySelector('.contenu-text[data ="contenu 1"]');
            document.querySelector('.contenu2').style.display = "none";
            document.querySelector('.versus').style.display = "none";
            console.log(document.querySelector('.contenu2'));
            contenu1.textContent = title1;


            // AJOUT POSTER
            const newimg = document.querySelector(".choixFilm[data-choix='1']");
            const imageElement = document.createElement('img');
            imageElement.classList.add('affiche-selection');
            imageElement.src = img1;
            newimg.appendChild(imageElement);

            getSingleMovieVotesDetails(imdb1);


            //RECUPERATION DES INDICATEURS
            getSingleGlobalStats(tmdbId1, imdb1, type1).catch(error => console.error("Une erreur est survenue :", error));







            document.querySelector(".analyse").classList.remove("active");
            document.querySelector(".analyseResult").classList.add("active");

        }

    }
    else if(!containOn && !comparerbtnOn){
        const filmsData = await fetchDetails();
        createFilmBubbleChart(filmsData);


        document.querySelector(".analyse").classList.remove("active");
        document.querySelector(".analyseResult").classList.add("active");

        // Création de la nouvelle div
        var newDiv1 = document.createElement("div");
        newDiv1.classList.add("choixFilmGenre");
        

        // Création du nouveau paragraphe
        var newParagraph1 = document.createElement("p");
        newParagraph1.classList.add("TextChoixFilmGenre");

        // Texte à ajouter au paragraphe
        var paragraphText1 = document.createTextNode("Choisis un genre");

        // Ajout du texte au paragraphe
        newParagraph1.appendChild(paragraphText1);

        // Ajout du paragraphe à la div
        newDiv1.appendChild(newParagraph1);

        // Recherche de l'élément où vous souhaitez insérer la nouvelle div
        var targetElement1 = document.querySelector(".choixFilm[data-choix='1']");

        // Insérer la nouvelle div avant l'élément ciblé
        if (targetElement1) {
            targetElement1.appendChild(newDiv1);
        } else {
            console.error("L'élément ciblé n'a pas été trouvé.");
        }

        // Création de la nouvelle div pour la deuxième insertion
        var newDiv2 = document.createElement("div");
        newDiv2.classList.add("choixFilmGenre");
        targetElement1.setAttribute("onclick", "openGenre(this)");
  

        // Création du nouveau paragraphe pour la deuxième insertion
        var newParagraph2 = document.createElement("p");
        newParagraph2.classList.add("TextChoixFilmGenre");

        // Texte à ajouter au paragraphe pour la deuxième insertion
        var paragraphText2 = document.createTextNode("Choisis un autre genre");

        // Ajout du texte au paragraphe pour la deuxième insertion
        newParagraph2.appendChild(paragraphText2);

        // Ajout du paragraphe à la div pour la deuxième insertion
        newDiv2.appendChild(newParagraph2);

        // Recherche de l'élément où vous souhaitez insérer la nouvelle div pour la deuxième insertion
        var targetElement2 = document.querySelector(".choixFilm[data-choix='2']");
        targetElement2.setAttribute("onclick", "openGenre(this)");

        // Insérer la nouvelle div avant l'élément ciblé pour la deuxième insertion
        if (targetElement2) {
            targetElement2.appendChild(newDiv2);
        } else {
            console.error("L'élément ciblé n'a pas été trouvé.");
        }

        // Création de la nouvelle div
        var newDiv3 = document.createElement("div");
        newDiv3.classList.add("choixGenre");

        var newDiv5 = document.createElement("div");
        newDiv5.classList.add("cardGenreGrid");
        
        var newH1 = document.createElement("h1");
        newH1.classList.add("cardGenreTitle");
        newH1.textContent = "Choisis ton Genre :";

        var closeBtn = document.createElement("img");
        closeBtn.src = "assets/images/close_black.png";
        closeBtn.classList.add("closeBtn");
        closeBtn.setAttribute("onclick", "closeGenre()");
        newDiv3.appendChild(closeBtn);

        newDiv3.appendChild(newH1);
        newDiv3.appendChild(newDiv5);
        document.querySelector(".analyseResultSubject").appendChild(newDiv3);
        loadGenresCard();
        document.querySelectorAll('.choixFilm').forEach(choixFilm => {
            choixFilm.setAttribute("filter", "no");
        });



    }
    else if(!containOn && comparerbtnOn){
        
    }







}
window.selectGenre = function(genreName, genreColor) {

    const canvas = document.querySelector('.chartGraph');
    const chartInstance = canvas.chartInstance;
    console.log(filmdetails)
    cleartChartGenre();
    

    if (genreName === "Tous") {
        document.querySelectorAll('.TextChoixFilmGenre').forEach(p => {
            p.textContent = "Tous";
        });

        if (chartInstance) {
            chartInstance.data.datasets = originalData.datasets;
            chartInstance.update();
        }

        // Réinitialiser les attributs filter à "no"
        document.querySelectorAll('.choixFilm').forEach(choixFilm => {
            choixFilm.setAttribute("filter", "no");
        });
        remplirStatsFilm1("","","");
        remplirStatsFilm2("","","");
    } else {
        // Mise à jour du genre sélectionné
        const type = document.querySelector('.dropdown:nth-child(1) .selected').getAttribute('data-value');
        const choixFilm = document.querySelector('.choixFilm.open');
        const dataChoix = choixFilm.getAttribute('data-choix');
        choixFilm.setAttribute("filter", genreName);

        // Calculer les moyennes en fonction du type (film ou série)
        let stats;
        if (type === 'movie') {
            stats = calculerMoyennesParGenreFilm(genreName, filmdetails); // Assurez-vous que filmsDetails est correctement défini et accessible
        } else if (type === 'tv') {
            stats = calculerMoyennesParGenreSerie(genreName, filmdetails); // Assurez-vous que seriesDetails est correctement défini et accessible
        }

        // Remplir les stats en fonction de data-choix et du type
        if (dataChoix === '1') {
            if (type === 'movie') {
                remplirStatsFilm1(stats.roundedMoyennePopularity, stats.roundedMoyenneRuntime, stats.roundedMoyenneVoteAverage);
            } else if (type === 'tv') {
                remplirStatsSerie1(stats.roundedMoyennePopularity, stats.roundedMoyenneEpisode, stats.roundedMoyenneVoteAverage);
            }
        } else if (dataChoix === '2') {
            if (type === 'movie') {
                remplirStatsFilm2(stats.roundedMoyennePopularity, stats.roundedMoyenneRuntime, stats.roundedMoyenneVoteAverage);
            } else if (type === 'tv') {
                remplirStatsSerie2(stats.roundedMoyennePopularity, stats.roundedMoyenneEpisode, stats.roundedMoyenneVoteAverage);
            }
        }
            // Vérifier si un autre genre est déjà sélectionné
            const choixFilms = document.querySelectorAll('.choixFilm:not(.open)');
            const autresChoixFilms = Array.from(choixFilms).filter(choixFilm => choixFilm.getAttribute("filter") && choixFilm.getAttribute("filter") !== "no");
        if (autresChoixFilms.length > 0) {
            // Un autre genre est sélectionné, récupérer son nom et calculer ses statistiques
            const autreGenreName = autresChoixFilms[0].getAttribute("filter");
            let stats2 = type === 'movie' ? calculerMoyennesParGenreFilm(autreGenreName, filmdetails) : calculerMoyennesParGenreSerie(autreGenreName, filmdetails);

            // Utiliser chartStats pour comparer deux genres
            if(dataChoix === '1'){
                chartStats("Popularity", stats.roundedMoyennePopularity, stats2.roundedMoyennePopularity, "chartPopularity");
                if(type === 'movie'){
                    chartStats("Budget", stats.roundedMoyenneRuntime, stats2.roundedMoyenneRuntime, "chartBudget");
                }
                else{
                    chartStats("Budget", stats.roundedMoyenneEpisode, stats2.roundedMoyenneEpisode, "chartBudget");
                }
                
                chartStats("Awards", stats.roundedMoyenneVoteAverage, stats2.roundedMoyenneVoteAverage, "chartNomination");
            }
            else{
                chartStats("Popularity", stats2.roundedMoyennePopularity, stats.roundedMoyennePopularity, "chartPopularity");
                if(type === 'movie'){
                    chartStats("Budget", stats2.roundedMoyenneRuntime, stats.roundedMoyenneRuntime, "chartBudget");
                }
                else{
                    chartStats("Budget", stats2.roundedMoyenneEpisode, stats.roundedMoyenneEpisode, "chartBudget");
                }
                
                chartStats("Awards", stats2.roundedMoyenneVoteAverage, stats.roundedMoyenneVoteAverage, "chartNomination");
            }

        } else {
            // Seul ce genre est sélectionné, utiliser chartSingleStat
            chartSingleStat("Popularity", stats.roundedMoyennePopularity, "chartPopularity");
            if(type === 'movie'){
                chartSingleStat("Budget", stats.roundedMoyenneRuntime, "chartBudget");
            }
            else{
                chartSingleStat("Budget", stats.roundedMoyenneEpisode, "chartBudget");
            }
            
            chartSingleStat("Awards", stats.roundedMoyenneVoteAverage, "chartNomination");
        }
        




        const textChoixFilmGenre = choixFilm.querySelector('.TextChoixFilmGenre');
        const choixFilmGenre = choixFilm.querySelector('.choixFilmGenre');
        textChoixFilmGenre.textContent = genreName;
        choixFilmGenre.style.background = genreColor;

        if (chartInstance) {
            const filters = Array.from(document.querySelectorAll('.choixFilm[filter]'))
                                 .map(el => el.getAttribute('filter'))
                                 .filter(filter => filter !== "no");

            const filteredData = filters.length > 0 
                                 ? originalData.datasets.filter(dataset => filters.includes(dataset.label))
                                 : originalData.datasets;

            chartInstance.data.datasets = filteredData;
            chartInstance.update();
        } else {
            console.log("Instance de graphique non trouvée.");
        }
    }
    closeGenre();
};





// STATS - PAGE  ANALYSE


    // RECUPERATION STATS



async function popularityStats(tmdb, type) {
    const apiKey = api_key; // Remplacez 'YOUR_API_KEY' par votre clé API TMDB
    const url = `https://api.themoviedb.org/3/${type}/${tmdb}?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            return data.popularity;
        } else {
            throw new Error(data.status_message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
        return null;
    }
}
async function budgetStats(tmdb, type) {
    const apiKey = api_key; // Remplacez 'YOUR_API_KEY' par votre clé API TMDB
    const url = `https://api.themoviedb.org/3/${type}/${tmdb}?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            return data.budget;
        } else {
            throw new Error(data.status_message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
        return null;
    }
}
async function getAwardsSummary(movieId) {
    const url = 'https://imdb8.p.rapidapi.com/title/v2/get-awards-summary?tconst=' + movieId;
    const headers = {
        'X-RapidAPI-Key': 'dd2c1605c6msh133a8e11ab6acc2p1cdf67jsn5b713979a5f4',
        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
    };

    try {
        const response = await fetch(url, { method: 'GET', headers });
        if (!response.ok) {
            throw new Error('Failed to fetch awards data for the movie with ID: ' + movieId);
        }

        const data = await response.json();
        if (data) {
            const totalNominations = data.data.title.totalWins.total;
            const totalWins = data.data.title.totalNominations.total;
            return [totalWins, totalNominations];
        } else {
            console.log("Aucune information sur les récompenses trouvée pour le film avec l'ID: " + movieId);
            return [null, null];
        }
    } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des données des récompenses pour le film avec l\'ID: ' + movieId);
        return [null, null];
    }
}

async function getGlobalStats(tmdbId1, tmdbId2, imdb1, imdb2, type1, type2) {
    const popularite1 = await popularityStats(tmdbId1, type1);
    const popularite2 = await popularityStats(tmdbId2, type2);

    const budget1 = await budgetStats(tmdbId1, type1);
    const budget2 = await budgetStats(tmdbId2, type2);

    const [nomi1, victoires1] = await getAwardsSummary(imdb1);
    const [nomi2, victoires2] = await getAwardsSummary(imdb2);

    chartStats("Popularity", popularite1, popularite2, "chartPopularity");
    chartStats("Budget", budget1, budget2, "chartBudget");
    chartStats("Awards", nomi1, nomi2, "chartNomination");

    remplirStatistiques1(popularite1, budget1, nomi1, victoires1);
    remplirStatistiques2(popularite2, budget2, nomi2, victoires2);
}
async function getSingleGlobalStats(tmdbId1, imdb1, type1) {
    const popularite1 = await popularityStats(tmdbId1, type1);


    const budget1 = await budgetStats(tmdbId1, type1);


    const [nomi1, victoires1] = await getAwardsSummary(imdb1);

    chartSingleStat("Popularity", popularite1, "chartPopularity");
    chartSingleStat("Budget", budget1, "chartBudget");
    chartSingleStat("Awards", nomi1, "chartNomination");

    remplirStatistiques1(popularite1, budget1, nomi1, victoires1);

}

function remplirStatistiques1(popularite, budget, nominations, victoires) {
    document.querySelector('.chartNumbers').setAttribute('data', 'contenu1');
    document.querySelector('.statsInfo[data="popularity1"]').textContent = popularite;
    document.querySelector('.statsInfo[data="nomi1"]').innerHTML = `${nominations} <br>(${victoires} win)`;

    // Conversion du budget en millions si nécessaire
    let budgetMillions = budget;
    if (typeof budget === 'number') {
        budgetMillions = (budget / 1000000).toFixed(1) + 'M';
    }

    document.querySelector('.statsInfo[data="budget1"]').textContent = budgetMillions;
}
function remplirStatsFilm1(popularite, runtime, vote) {
    document.querySelector('.chartNumbers').setAttribute('data', 'contenu1');
    document.querySelector('.statsInfo[data="popularity1"]').textContent = popularite;
    document.querySelector('.statsInfo[data="nomi1"]').textContent = runtime;

    document.querySelector('.statsInfo[data="budget1"]').textContent = vote;
}
function remplirStatsFilm2(popularite, runtime, vote) {
    document.querySelector('.chartNumbers').setAttribute('data', 'contenu1');
    document.querySelector('.statsInfo[data="popularity2"]').textContent = popularite;
    document.querySelector('.statsInfo[data="nomi2"]').textContent = runtime;

    document.querySelector('.statsInfo[data="budget2"]').textContent = vote;
}
function remplirStatsSerie1(popularite, episode, vote) {
    document.querySelector('.chartNumbers').setAttribute('data', 'contenu1');
    document.querySelector('.statsInfo[data="popularity1"]').textContent = popularite;
    document.querySelector('.statsInfo[data="nomi1"]').textContent = episode;

    document.querySelector('.statsInfo[data="budget1"]').textContent = vote;
}
function remplirStatsSerie2(popularite, episode, vote) {
    document.querySelector('.chartNumbers').setAttribute('data', 'contenu1');
    document.querySelector('.statsInfo[data="popularity2"]').textContent = popularite;
    document.querySelector('.statsInfo[data="nomi2"]').textContent = episode;

    document.querySelector('.statsInfo[data="budget2"]').textContent = vote;
}

    // AFFICJAGE STATS


function remplirStatistiques2(popularite, budget, nominations, victoires) {
    document.querySelector('.chartNumbers').setAttribute('data', 'contenu2');
    document.querySelector('.statsInfo[data="popularity2"]').textContent = popularite;
    document.querySelector('.statsInfo[data="nomi2"]').innerHTML = `${nominations} <br>(${victoires} win)`;

    // Conversion du budget en millions si nécessaire
    let budgetMillions = budget;
    if (typeof budget === 'number') {
        budgetMillions = (budget / 1000000).toFixed(1) + 'M';
    }

    document.querySelector('.statsInfo[data="budget2"]').textContent = budgetMillions;
}

function chartStats(name,stats1,stats2,canva){
    const ctx = document.querySelector("."+canva).getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [name],
            datasets: [{
                label: 'Contenu 1',
                data: [stats1],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderRadius: {
                    topLeft: 20,
                    bottomLeft:20
                }, // Arrondir les bords
                barPercentage: 0.25,
                categoryPercentage:0.5,
                borderSkipped: "right",
                datalabels: {
                    align: 'start',
                    anchor: 'start'
                }
            }, {
                label: 'Contenu 2',
                data: [stats2],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 20,
                barPercentage: 0.25,
                categoryPercentage:0.5,

                datalabels: {
                    align: 'end',
                    anchor: 'end'
                }
            }],
        },
        options: {
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false // Enlever la légende
                },
                datalabels: {
                    color: '#000',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    display: false,
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                    stacked: true,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function chartSingleStat(name, stats1, canva) {
    const ctx = document.querySelector("." + canva).getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [name],
            datasets: [{
                label: name,
                data: [stats1],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderRadius: 20,
                barPercentage: 0.5,
                categoryPercentage: 0.5,
                datalabels: {
                    align: 'center',
                    anchor: 'center'
                }
            }]
        },
        options: {
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false // Enlever la légende
                },
                datalabels: {
                    color: '#000',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    display: false,
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                    stacked: true,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// GRAPHIQUE - PAGE ANALYSE

    // RECHERCHE DONNEES NECESSAIRES

/**
 * Récupère l'ID IMDb pour un ID TMDb donné et un type de média spécifique.
 * Cette fonction effectue une requête HTTP à l'API de TMDb pour obtenir les identifiants externes liés à un élément média spécifique.
 *
 * @param {string} type - Le type de média ('movie' ou 'tv') à interroger.
 * @param {string} tmdbId - L'ID TMDb de l'élément média.
 * @returns {Promise<string|null>} Une promesse qui se résout avec l'ID IMDb si trouvé, 'IMDb ID not found' si non présent, ou null en cas d'erreur.
 */

async function fetchIMDbId(type, tmdbId) {
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



/**
 * Récupère les détails des principaux membres de la distribution pour un film donné à partir de l'API IMDb.
 * Cette fonction envoie une requête à l'API de IMDb pour obtenir les identifiants des cinq principaux acteurs d'un film.
 * Ensuite, elle récupère la popularité de chaque acteur via une autre fonction `getActorPopularity`.
 *
 * @param {string} movieId - L'identifiant IMDb du film pour lequel récupérer les acteurs principaux.
 * @returns {Promise<Object|null>} Une promesse qui renvoie un objet contenant les identifiants des acteurs et leurs données de popularité si la requête réussit, ou null en cas d'erreur ou de réponse invalide.
 */



async function getTopCastDetails(movieId) {
    const url = 'https://imdb8.p.rapidapi.com/title/get-top-cast?tconst=' + movieId;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4af10acecamsh208e06566c5c57dp183d71jsnd3b78c58d16e',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (Array.isArray(data)) {
            const castIds = data.slice(0, 5).map(id => id.replace('/name/', '').replace('/', ''));

            // Récupérer la popularité pour chaque acteur
            const popularityData = await Promise.all(castIds.map(id => getActorPopularity(id)));

            return { castIds, popularityData };
        } else {
            console.error('Invalid response structure for top cast details. Expected an array.');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}



/**
 * Récupère les détails d'un acteur spécifique en utilisant son ID, en particulier le département pour lequel il est le plus connu.
 * Cette fonction envoie une requête GET à l'API de TMDb pour obtenir des informations sur un acteur, en utilisant un token d'autorisation pour accéder à l'API.
 *
 * @param {string} actorId - L'identifiant de l'acteur sur TMDb.
 * @returns {Promise<string|null>} Une promesse qui renvoie le département pour lequel l'acteur est le plus connu si la requête est réussie, ou null en cas d'erreur.
 */


async function getActorDetails(actorId) {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
        }
    };

    try {
        const response = await fetch('https://api.themoviedb.org/3/person/' + actorId, options);
        const data = await response.json();
        return data.known_for_department;
    } catch (error) {
        console.error(error);
        return null;
    }
}


/**
 * Récupère la popularité d'un acteur spécifié par son ID IMDb.
 * Cette fonction effectue une requête GET vers l'API de TMDb pour obtenir des informations sur la popularité d'un acteur,
 * en utilisant un token d'autorisation pour accéder à l'API. Elle exploite le résultat pour extraire la valeur de popularité.
 *
 * @param {string} actorId - L'identifiant IMDb de l'acteur.
 * @returns {Promise<number|undefined>} Une promesse qui renvoie la popularité de l'acteur si la requête réussit, ou undefined en cas d'erreur.
 */


async function getActorPopularity(actorId) {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
        }
    };

    try {
        const response = await fetch('https://api.themoviedb.org/3/find/' + actorId + '?external_source=imdb_id', options);
        const data = await response.json();
        return data.person_results[0].popularity;
    } catch (error) {
        console.error(error);
    }
}



/**
 * Récupère les données de revenus d'un film spécifique à partir de l'API IMDb.
 * Cette fonction utilise une requête AJAX pour obtenir les informations commerciales d'un film, y compris ses recettes régionales.
 * Si les données sont disponibles, elle appelle une fonction `createRevenuePieChart` pour afficher un graphique en camembert des revenus.
 * En cas d'échec de la requête ou si les données sont incomplètes, des erreurs sont enregistrées dans la console.
 *
 * @param {string} movieId - L'identifiant IMDb du film pour lequel récupérer les données de revenus.
 */


function getRevenueData(movieId) {
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://imdb8.p.rapidapi.com/title/v2/get-business?tconst=' + movieId,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'dd2c1605c6msh133a8e11ab6acc2p1cdf67jsn5b713979a5f4',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    $.ajax(settings).done(function (response) {
        try {
            console.log('Raw Response:', response); 

            if (response && response.titleBoxOffice && response.titleBoxOffice.gross && response.titleBoxOffice.gross.regional) {
                const revenueData = response.titleBoxOffice.gross.regional;
                const movieName = response.title;

                createRevenuePieChart(revenueData, movieName);
            } else {
                console.error('Invalid or incomplete response structure.');
            }
        } catch (error) {
            console.error('Failed to process revenue data.', error);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Failed to fetch revenue data for the movie.');
        console.error('Status:', textStatus);
        console.error('Error:', errorThrown);
    });
}



/**
 * Récupère et combine les détails des votes de deux films spécifiés à partir de l'API IMDb.
 * Cette fonction envoie simultanément deux requêtes AJAX pour obtenir les histogrammes des notes des utilisateurs IMDb pour deux films.
 * Les données obtenues sont ensuite utilisées pour créer un graphique combiné avec la fonction `createCombinedChart`.
 * Le graphique affiche la comparaison des distributions des notes entre les deux films.
 * En cas d'échec de l'une des requêtes, un message d'erreur est affiché dans la console.
 *
 * @param {string} selectedMovieId - L'identifiant IMDb du premier film.
 * @param {string} selectedMovieId2 - L'identifiant IMDb du second film.
 */


function getCombinedVotesDetails(selectedMovieId, selectedMovieId2) {
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://imdb8.p.rapidapi.com/title/get-ratings?tconst=' + selectedMovieId,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'dd2c1605c6msh133a8e11ab6acc2p1cdf67jsn5b713979a5f4',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    const settings2 = {
        async: true,
        crossDomain: true,
        url: 'https://imdb8.p.rapidapi.com/title/get-ratings?tconst=' + selectedMovieId2,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'dd2c1605c6msh133a8e11ab6acc2p1cdf67jsn5b713979a5f4',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    $.when(
        $.ajax(settings),
        $.ajax(settings2)
    ).done(function (response1, response2) {
        const movieName1 = response1[0].title;
        const categories = Object.keys(response1[0].ratingsHistograms['IMDb Users'].histogram);
        const data1 = [
            Object.values(response1[0].ratingsHistograms['IMDb Users'].histogram),
        ];

        const movieName2 = response2[0].title;
        const data2 = [
            Object.values(response2[0].ratingsHistograms['IMDb Users'].histogram),
        ];

        createCombinedChart(data1, movieName1, data2, movieName2, categories);
    }).fail(function () {
        console.error('Failed to fetch data for one or both movies.');
    });
}

function getSingleMovieVotesDetails(selectedMovieId) {
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://imdb8.p.rapidapi.com/title/get-ratings?tconst=' + selectedMovieId,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'dd2c1605c6msh133a8e11ab6acc2p1cdf67jsn5b713979a5f4',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    $.ajax(settings).done(function (response) {
        const movieName = response.title;
        const categories = Object.keys(response.ratingsHistograms['IMDb Users'].histogram);
        const data = [
            Object.values(response.ratingsHistograms['IMDb Users'].histogram),
        ];

        createSingleChart(data, movieName, categories);
    }).fail(function () {
        console.error('Failed to fetch data for the selected movie.');
    });
}





    // CREATION DES CHARTS

/**
 * Crée un graphique comparatif de la popularité des membres de la distribution pour deux films sélectionnés.
 * Ce processus implique la récupération des noms et des données de popularité pour les acteurs des deux films,
 * suivi de l'organisation et de la création d'un graphique à barres qui montre visuellement ces données côte à côte.
 *
 * @param {Object} topCastDetailsMovie1 - Un objet contenant les identifiants des acteurs et les données de leur popularité pour le premier film.
 * @param {Object} topCastDetailsMovie2 - Un objet similaire pour le second film.
 */


async function createCombinedCastChart(topCastDetailsMovie1, topCastDetailsMovie2) {
    const castIds1 = topCastDetailsMovie1.castIds;
    const castNames1 = await getCastNames(castIds1);

    const popularityData1 = topCastDetailsMovie1.popularityData;

    const castIds2 = topCastDetailsMovie2.castIds;
    const castNames2 = await getCastNames(castIds2);

    const popularityData2 = topCastDetailsMovie2.popularityData;

    // Function to get the names of the cast members using TMDB API
    async function getCastNames(castIds) {
        const names = await Promise.all(castIds.map(async (id) => {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
                }
            };

            const response = await fetch('https://api.themoviedb.org/3/find/' + id + '?external_source=imdb_id', options);
            const data = await response.json();
            
            return data.person_results[0].name;
        }));

        return names;
    }

    // Fonction pour obtenir l'indice du maximum
    const getMaxIndex = (data) => {
        return data.map((_, i) => i).reduce((maxIndex, currentIndex) => data[currentIndex] > data[maxIndex] ? currentIndex : maxIndex, 0);
    };

    // Trier les données par popularité
    const sortedIndices1 = castIds1.map((_, i) => i).sort((a, b) => popularityData1[b] - popularityData1[a]);
    const sortedIndices2 = castIds2.map((_, i) => i).sort((a, b) => popularityData2[b] - popularityData2[a]);

    // Appliquer le tri aux données
    const sortedCastNames1 = sortedIndices1.map(index => castNames1[index]);
    const sortedPopularityData1 = sortedIndices1.map(index => popularityData1[index]);

    const sortedCastNames2 = sortedIndices2.map(index => castNames2[index]);
    const sortedPopularityData2 = sortedIndices2.map(index => popularityData2[index]);

    const ctx = document.querySelector('.chartGraph').getContext('2d');

    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [...sortedCastNames1, ...sortedCastNames2],
            datasets: [{
                label: 'Top 5 Cast - Movie 1',
                data: [...sortedPopularityData1, ...Array(5).fill(null)],
                backgroundColor: '#FF5733',
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }, {
                label: 'Top 5 Cast - Movie 2',
                data: [...Array(5).fill(null), ...sortedPopularityData2],
                backgroundColor: '#FC33FF',
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            tooltips: {
                callbacks: {
                    label: function (context) {
                        const castIndex = context.dataIndex;
                        const isMovie1 = castIndex < sortedCastNames1.length;

                        const castDetails = isMovie1 ? topCastDetailsMovie1 : topCastDetailsMovie2;
                        const castName = castDetails.castNames[castIndex];
                        const knownForDepartment = castDetails.knownForDepartments[castIndex];

                        return `${castName} - ${knownForDepartment}`;
                    }
                }
            }
        }
    });

    chartInstances.push(barChart);
}
async function createSingleCastChart(topCastDetailsMovie1) {
    const castIds1 = topCastDetailsMovie1.castIds;
    const castNames1 = await getCastNames(castIds1);

    const popularityData1 = topCastDetailsMovie1.popularityData;

    // Function to get the names of the cast members using TMDB API
    async function getCastNames(castIds) {
        const names = await Promise.all(castIds.map(async (id) => {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
                }
            };

            const response = await fetch('https://api.themoviedb.org/3/find/' + id + '?external_source=imdb_id', options);
            const data = await response.json();
            
            return data.person_results[0].name;
        }));

        return names;
    }

    // Fonction pour obtenir l'indice du maximum
    const getMaxIndex = (data) => {
        return data.map((_, i) => i).reduce((maxIndex, currentIndex) => data[currentIndex] > data[maxIndex] ? currentIndex : maxIndex, 0);
    };

    // Trier les données par popularité
    const sortedIndices1 = castIds1.map((_, i) => i).sort((a, b) => popularityData1[b] - popularityData1[a]);

    // Appliquer le tri aux données
    const sortedCastNames1 = sortedIndices1.map(index => castNames1[index]);
    const sortedPopularityData1 = sortedIndices1.map(index => popularityData1[index]);

    const ctx = document.querySelector('.chartGraph').getContext('2d');

    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedCastNames1,
            datasets: [{
                label: 'Top 5 Cast - Movie 1',
                data: sortedPopularityData1,
                backgroundColor: '#FF5733',
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            tooltips: {
                callbacks: {
                    label: function (context) {
                        const castIndex = context.dataIndex;
                        const castDetails = topCastDetailsMovie1;
                        const castName = castDetails.castNames[castIndex];
                        const knownForDepartment = castDetails.knownForDepartments[castIndex];

                        return `${castName} - ${knownForDepartment}`;
                    }
                }
            }
        }
    });

    chartInstances.push(barChart);
}



/**
 * Génère un tableau de couleurs aléatoires.
 * Cette fonction crée un tableau de couleurs, où chaque couleur est générée par une fonction `getRandomColor`.
 * La taille du tableau est déterminée par le paramètre `length`.
 *
 * @param {number} length - La taille du tableau à générer, correspondant au nombre de couleurs aléatoires souhaitées.
 * @returns {Array} Un tableau contenant des chaînes de couleurs aléatoires.
 */


function getRandomColorArray(length) {
    const colorArray = [];
    for (let i = 0; i < length; i++) {
        const randomColor = getRandomColor();
        colorArray.push(randomColor);
    }
    return colorArray;
}


/**
 * Génère une couleur aléatoire au format hexadécimal.
 * Cette fonction construit une chaîne représentant une couleur en hexadécimal (par exemple, "#1A2B3C").
 * Elle sélectionne aléatoirement six caractères parmi les chiffres de 0 à 9 et les lettres de A à F pour former la couleur.
 *
 * @returns {string} Une chaîne représentant une couleur hexadécimale aléatoire.
 */


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


/**
 * Crée un graphique radar combiné pour deux ensembles de données correspondant à deux films différents.
 * Ce graphique montre la comparaison visuelle des données (par exemple, votes ou popularité) sur des catégories spécifiques pour chaque film.
 * Les deux jeux de données sont présentés sur un graphique radar avec des couleurs et des bordures distinctes pour chaque film.
 *
 * @param {Array} data1 - Les données pour le premier film. Doit être un tableau d'entiers ou de nombres flottants.
 * @param {string} movieName1 - Le nom du premier film, utilisé comme étiquette dans le graphique.
 * @param {Array} data2 - Les données pour le second film, format identique à data1.
 * @param {string} movieName2 - Le nom du second film, utilisé comme étiquette dans le graphique.
 * @param {Array} categories - Les catégories utilisées pour les axes du graphique radar, typiquement des string.
 */


function createCombinedChart(data1, movieName1, data2, movieName2, categories) {
    const ctx = document.querySelector('.chartGraph').getContext('2d');
    const newChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [{
                    label: movieName1,
                    data: data1[0],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: movieName2,
                    data: data2[0],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 250000
                }
            }
        }
    });
    chartInstances.push(newChart);
}





function createSingleChart(data, movieName, categories) {
    const ctx = document.querySelector('.chartGraph').getContext('2d');
    const newChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [{
                label: movieName,
                data: data[0],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 250000
                }
            }
        }
    });
    chartInstances.push(newChart);
}



/**
 * Crée un graphique en camembert (pie chart) pour visualiser les revenus par région pour un film donné.
 * Les données sont filtrées pour exclure les revenus domestiques, triées par montant total décroissant, 
 * et limitées aux 20 premières régions. Les revenus des régions non incluses dans les 20 premières sont 
 * regroupés sous une catégorie "Autre".
 *
 * @param {Array} data - Les données de revenus, où chaque élément est un objet avec une région et un montant total.
 * @param {string} movieName - Le nom du film pour lequel les revenus sont présentés, utilisé comme étiquette dans le graphique.
 */


function createRevenuePieChart(data, movieName) {
    const filteredData = data.filter(region => region.regionName !== "Domestic");

    // Trier les données par ordre décroissant de revenus
    const sortedData = filteredData.sort((a, b) => b.total.amount - a.total.amount);

    // Sélectionner les 20 premières régions
    const top20Regions = sortedData.slice(0, 20);

    // Calculer le total des revenus pour les régions restantes
    const otherRegionsTotal = sortedData.slice(20).reduce((total, region) => total + region.total.amount, 0);

    // Créer un tableau avec les 20 régions principales et une entrée pour "autre"
    const finalData = [...top20Regions, { regionName: "Autre", total: { amount: otherRegionsTotal } }];

    const ctx = document.querySelector('.chartGraph').getContext('2d');

    const newChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: finalData.map(region => region.regionName),
            datasets: [{
                label: movieName,
                data: finalData.map(region => region.total.amount),
                backgroundColor: getRandomColorArray(finalData.length),
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    chartInstances.push(newChart);
}





// PARAMETRAGE DROPDOWN - PAGE ANALYSE PARTI FILTRE

        // Fonction pour charger les genres en fonction du type sélectionné (film ou série)
function loadGenres() {
    const type = document.querySelector('.dropdown:nth-child(1) .selected').getAttribute('data-value');
    const url = `https://api.themoviedb.org/3/genre/${type}/list?api_key=4bff542b068c0fff85589d72c363051d&language=fr-FR`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const menu = document.querySelector('.dropdown:nth-child(2) .menu');
        menu.innerHTML = ''; // Efface les anciennes options
        
        // Ajout d'une option par défaut
        const defaultOption = document.createElement('li');
        defaultOption.textContent = 'Sélectionner un genre';
        menu.appendChild(defaultOption);
  
        data.genres.forEach(genre => {
          const option = document.createElement('li');
          option.textContent = genre.name;
          option.setAttribute('data-value', genre.id);
          menu.appendChild(option);
        });
      })
      .catch(error => console.error('Erreur lors du chargement des genres :', error));
}

function loadGenresCard() {
    const type = document.querySelector('.dropdown:nth-child(1) .selected').getAttribute('data-value');
    const url = `https://api.themoviedb.org/3/genre/${type}/list?api_key=4bff542b068c0fff85589d72c363051d&language=en-EN`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const genreGrid = document.querySelector('.cardGenreGrid');
            genreGrid.innerHTML = ''; // Efface les anciennes cartes de genre

            // Ajouter l'option "Tous" au début de la liste des genres
            const allGenresOption = { id: 'all', name: 'Tous' };
            data.genres.unshift(allGenresOption); // Ajoute "Tous" au début du tableau des genres

            const genresPerPage = 8; // Nombre de genres par page
            const totalPages = Math.ceil(data.genres.length / genresPerPage); // Calcul du nombre total de pages

            let currentPage = 1;

            const genreColors = {
                1: 'linear-gradient(to right, rgba(239, 115, 0, 1), rgba(250, 240, 3, 0.53))',
                2: 'linear-gradient(to right, #1e5799, #2989d8)',
                3: 'linear-gradient(to right, #6a3093, #a044ff)',
                4: 'linear-gradient(to right, #00bfff, #87ceeb)',
                5: 'linear-gradient(to right, #ff6347, #d00000)',
                6: 'linear-gradient(to right, #800000, #ff0000)',
                7: 'linear-gradient(to right, #32cd32, #228b22)',
                8: 'linear-gradient(to right, #8b4513, #cd853f)',
                9: 'linear-gradient(to right, #deb887, #a0522d)',
                10: 'linear-gradient(to right, #483d8b, #9370db)',
                11: 'linear-gradient(to right, #2f4f4f, #008080)',
                12: 'linear-gradient(to right, #008000, #32cd32)',
                13: 'linear-gradient(to right, #000080, #4682b4)',
                14: 'linear-gradient(to right, #4b0082, #800080)',
                15: 'linear-gradient(to right, #9932cc, #8a2be2)',
                16: 'linear-gradient(to right, #ff69b4, #ff1493)',
                17: 'linear-gradient(to right, #daa520, #ffd700)',
                18: 'linear-gradient(to right, #b22222, #cd5c5c)',
                19: 'linear-gradient(to right, #ffc0cb, #ffb6c1)'
              };

            const displayGenres = (page) => {
                const start = (page - 1) * genresPerPage;
                const end = start + genresPerPage;
                const genres = data.genres.slice(start, end);

                genres.forEach((genre, index) => {

                    var i = Math.floor(Math.random() * 20);
                    const genreColor =genreColors[i] || 'linear-gradient(to right, #ff0000, #0000ff)';
                    const cardGenre = document.createElement('div');
                    cardGenre.classList.add('cardGenre');
                    cardGenre.style.background = genreColor;
                    cardGenre.setAttribute('onclick', `selectGenre('${genre.name}', '${genreColor}')`);

                    const cardGenreName = document.createElement('p');
                    cardGenreName.classList.add('cardGenreName');
                    cardGenreName.textContent = genre.name;

                    cardGenre.appendChild(cardGenreName);
                    genreGrid.appendChild(cardGenre);
                });
            };

            // Afficher la première page au chargement
            displayGenres(currentPage);

            // Ajouter des boutons pour permettre à l'utilisateur de naviguer entre les pages
            const paginationContainer = document.createElement('div');
            paginationContainer.classList.add('pagination');

            const prevButton = document.createElement('button');
            prevButton.textContent = 'Précédent';
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    genreGrid.innerHTML = ''; // Effacer les cartes actuelles
                    displayGenres(currentPage);
                }
            });
            paginationContainer.appendChild(prevButton);

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Suivant';
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    genreGrid.innerHTML = ''; // Effacer les cartes actuelles
                    displayGenres(currentPage);
                }
            });
            paginationContainer.appendChild(nextButton);

            document.querySelector('.choixGenre').appendChild(paginationContainer);
        })
        .catch(error => console.error('Erreur lors du chargement des genres :', error));
}





  
        // Fonction pour charger les pays depuis l'API TMDB
function loadCountries() {
    const url = 'https://api.themoviedb.org/3/configuration/countries?api_key=4bff542b068c0fff85589d72c363051d';
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const menu = document.querySelector('.dropdown:nth-child(3) .menu');
        menu.innerHTML = ''; // Efface les anciennes options
        
        // Ajout d'une option par défaut
        const defaultOption = document.createElement('li');
        defaultOption.textContent = 'Sélectionner un pays';
        menu.appendChild(defaultOption);
  
        data.forEach(country => {
          const option = document.createElement('li');
          option.textContent = country.english_name;
          option.setAttribute('data-value', country.iso_3166_1);
          menu.appendChild(option);
        });
      })
      .catch(error => console.error('Erreur lors du chargement des pays :', error));
}



function dropdown() {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {
        const select = dropdown.querySelector(".select");
        const caret = dropdown.querySelector(".caret");
        const selected = dropdown.querySelector(".selected");

        select.addEventListener("click", () => {
            const menu = dropdown.querySelector(".menu");
            const options = dropdown.querySelectorAll(".menu li");

            select.classList.toggle("select-clicked");
            caret.classList.toggle("caret-rotate");
            menu.classList.toggle("menu-open");

            options.forEach(option => {
                option.addEventListener("click", () => {
                    selected.innerText = option.innerText;
                    selected.setAttribute('data-value', option.getAttribute("data-value"));
                    select.classList.remove("select-clicked");
                    caret.classList.remove("caret-rotate");
                    menu.classList.remove("menu-open");

                    options.forEach(opt => {
                        opt.classList.remove("activedrop");
                    });
                    option.classList.add("activedrop");
                });
            });
        });
    });
}


  

// NETOYAGE DE DIVERS ESPACES  - PAGE ANALYSE

function clearChart(){
    // Sélectionner l'élément contenant le graphique
    const analyseResultGraphique = document.querySelector('.analyseResultGraphique');

    // Sélectionner le canvas existant s'il existe
    const existingCanvas = analyseResultGraphique.querySelector('.chartGraph');

    // Si un canvas existe déjà, le supprimer
    if (existingCanvas) {
        existingCanvas.remove();
    }

    // Créer un nouveau canvas
    const newCanvas = document.createElement('canvas');
    newCanvas.classList.add('chartGraph');

    // Ajouter le nouveau canvas à la div de classe analyseResultGraph
    analyseResultGraphique.appendChild(newCanvas);
    
}

function cleartChartGenre() {
    // Sélectionner tous les éléments canvas dans chartGlobal
    const canvasElements = document.querySelectorAll('.chartGlobal .chart');
  
    canvasElements.forEach(canvas => {
      const chartDiv = canvas.parentElement; // Obtenir le parent div de canvas
      const newCanvas = document.createElement('canvas'); // Créer un nouveau canvas
      newCanvas.className = canvas.className; // Copier la classe du canvas existant
  
      chartDiv.removeChild(canvas); // Supprimer l'ancien canvas
      chartDiv.appendChild(newCanvas); // Ajouter le nouveau canvas
    });
  }
  

function recreateAnalyseResultDiv() {
    // Supprimer la div analyseResult si elle existe déjà
    const existingDiv = document.querySelector('.analyseResult');
    if (existingDiv) {
        existingDiv.remove();
    }

    // Recréer la div analyseResult avec le contenu spécifié
    const analyseResultDiv = document.createElement('div');
    analyseResultDiv.classList.add('analyseResult');

    analyseResultDiv.innerHTML = `
        <button class="backSearch"><img src="assets/images/retour.png" alt="" style="width:100%; height:100%" onclick="backSearch()"></button>
        <div class="analyseResultPresent">
          <div class="analyseResultSubject">
            <div class="choixFilm" data-choix="1"></div>
            <img src="assets/images/vs.png" alt="" class="versus">
            <div class="choixFilm" data-choix="2"></div>
          </div>
          <div class="analyseResultChiffre">
            <div class="chartNumbers" data="contenu1">
              <p class="statsInfo" data="popularity1"></p>
              <p class="statsInfo" data="budget1"></p>
              <p class="statsInfo" data="nomi1"></p>
            </div>
            <div class="chartGlobal">
              <p class="statsInfo">Popularity</p>
              <div class="chartDiv">
                <canvas class="chart chartPopularity"></canvas>
              </div>
     
              <p class="statsInfo">Budget</p>
              <div class="chartDiv">
                <canvas class="chart chartBudget"></canvas>
              </div>
              <p class="statsInfo">Nomination</p>
              <div class="chartDiv">
                <canvas class="chart chartNomination"></canvas>
              </div>
            </div>
            <div class="chartNumbers" data="contenu1">
            <p class="statsInfo" data="popularity2"></p>
              <p class="statsInfo" data="budget2"></p>
              <p class="statsInfo" data="nomi2"></p>
            </div>
    
          </div>
        </div>
    
        <div class="analyseResultGraph">
          <div class="analyseResultExplain">
              <div class="choix-ovale" >
                <div class="choix votes active" onclick="changeStats(1)">
                  <p class="contenu-text">Votes</p>
                </div>
                <div class="choix revenus" onclick="changeStats(2)">
                  <p class="contenu-text">Revenus par région</p>
                </div>
                <div class="choix casting" onclick="changeStats(3)">
                  <p class="contenu-text">Casting</p>
                </div>
              </div>
              <div class="choix-ovale-revenu" >
                <div class="choix contenu1 active"  onclick="changeGraphRevenu(1)">
                  <p class="contenu-text" data="contenu 1">Contenu 1</p>
                </div>
                <div class="choix contenu2" onclick="changeGraphRevenu(2)">
                  <p class="contenu-text" data="contenu 2">Contenu 2</p>
                </div>
              </div>
              <p class="graph-ana">Il était une fois un super Graphique fait par Yacine</p>
          </div>
    
    
          <div class="analyseResultGraphique">
            <canvas class="chartGraph"></canvas>
    
            
          </div>
        </div>
    `;

    // Ajouter la div analyseResult au body
    section.appendChild(analyseResultDiv);
}







// PARTIE FILTRE - PAGE ANALYSE

function getFilterValues() {
    // Récupération du type (film ou série)
    const type = document.querySelector('.selected[data-type="type"]').getAttribute("data-value");
    
    // Récupération du genre
    const genre = document.querySelector('.selected[data-type="genre"]').getAttribute("data-value");
    
    // Récupération du pays
    const country = document.querySelector('.selected[data-type="pays"]').getAttribute("data-value");
    
    // Récupération des dates
    const startDate = document.getElementById('date_depart').value;
    const endDate = document.getElementById('date_fin').value;
  
    return { type, genre, country, startDate, endDate };
  }
async function fetchData() {
  const filterValues = getFilterValues();
  let allIds = [];
  const maxPages = 10; // Limite à 10 pages

  for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
    const requestUrl = buildRequestUrl({ ...filterValues, page: currentPage });

    try {
      const response = await fetch(requestUrl);
      const data = await response.json();

      // Vérifier si des résultats sont présents
      if (data && data.results && data.results.length > 0) {
        // Extraire les IDs et les ajouter au tableau
        const ids = data.results.map(item => item.id);
        allIds = allIds.concat(ids);
      } else {
        // Si pas de résultats, pas la peine de continuer à chercher les pages suivantes
        break;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      break; // Arrêter la boucle en cas d'erreur
    }
  }
  console.log(allIds);

  return allIds; // Faire quelque chose avec les IDs récupérés
}


function buildRequestUrl({ type, genre, country, startDate, endDate, page }) {
    const baseUrl = 'https://api.themoviedb.org/3/discover';
    const apiKey = api_key;
    let url = `${baseUrl}/${type}?api_key=${apiKey}`;
    
    // Ajouter conditionnellement chaque paramètre s'il est défini
    if (genre) {
      url += `&with_genres=${genre}`;
    }
    if (country) {
      url += `&region=${country}`;
    }
    if (startDate) {
      url += `&release_date.gte=${startDate}`;
    }
    if (endDate) {
      url += `&release_date.lte=${endDate}`;
    }
    if(page){
        url += `&page=${page}`
    }
    
    return url;
  }

async function fetchDetails() {
    const ids = await fetchData();
    const type = document.querySelector('.selected[data-type="type"]').getAttribute("data-value");
    const apiKey = api_key;
    const baseUrl = 'https://api.themoviedb.org/3';
    let details = [];


    // Limiter le nombre de requêtes simultanées pour éviter le rate limiting
    const MAX_SIMULTANEOUS_REQUESTS = 20;

    for (let i = 0; i < ids.length; i += MAX_SIMULTANEOUS_REQUESTS) {
        const slice = ids.slice(i, i + MAX_SIMULTANEOUS_REQUESTS);
        const promises = slice.map(id => {
        const url = `${baseUrl}/${type}/${id}?api_key=${apiKey}`;
        return fetch(url).then(response => response.json());
        });

        // Attendre que toutes les promesses dans le lot actuel soient résolues
        const results = await Promise.all(promises);

        // Traitement des résultats
        results.forEach(item => {
            let genre = null;
            if (item.genres && item.genres.length > 0) {
            // Exemple pour choisir le premier genre
            // genre = item.genres[0].name;

            // OU, pour choisir basé sur la priorité
            genre = determineGenrePriority(item.genres).name;

            }

            if (type === 'movie' && item.popularity && item.revenue !== undefined && item.budget !== undefined && item.vote_average && item.vote_count && item.runtime && item.release_date) {
            details.push({
                title: item.title,
                id: item.id,
                genre: genre, // Ajout du genre ici
                popularity: item.popularity,
                revenue: item.revenue,
                budget: item.budget,
                vote_average: item.vote_average,
                vote_count: item.vote_count,
                runtime: item.runtime,
                release_date: item.release_date
            });
            } else if (type === 'tv' && item.popularity && item.last_air_date && item.first_air_date && item.number_of_episodes && item.number_of_seasons && item.vote_average && item.vote_count) {
            details.push({
                name: item.name,
                id: item.id,
                genre: genre, // Ajout du genre ici
                popularity: item.popularity,
                last_air_date: item.last_air_date,
                first_air_date: item.first_air_date,
                number_of_episodes: item.number_of_episodes,
                number_of_seasons: item.number_of_seasons,
                vote_average: item.vote_average,
                vote_count: item.vote_count
            });
            }
        });
    }

return details;
}

function determineGenrePriority(genres) {
    const genrePriorities = ['Science Fiction', 'Drame', 'Comedy', 'Action',"Adventure","Horror", "Thriller" ]; // Définir selon les besoins
    for (let priority of genrePriorities) {
      const found = genres.find(g => g.name === priority);
      if (found) return found;
    }
    return genres[0]; // Retourne le premier genre par défaut si aucun match n'est trouvé
  }



function groupByGenreFilm(filmsData) {
    // Créer un objet pour stocker les points de chaque genre
    const genresMap = {};

    // Regrouper les points par genre
    filmsData.forEach(film => {
        if (!genresMap[film.genre]) {
            genresMap[film.genre] = [];
        }
      
        genresMap[film.genre].push({        
            data: {
                title: film.title || 'Inconnu',
                x: film.popularity,
                y: film.vote_average,
            }
        });
    });

    return genresMap;
}

function groupByGenreSerie(seriesData) {
    // Créer un objet pour stocker les points de chaque genre
    const genresMap = {};

    // Regrouper les points par genre
    seriesData.forEach(serie => {
        if (!genresMap[serie.genre]) {
            genresMap[serie.genre] = [];
        }
      
        genresMap[serie.genre].push({        
            data: {
                title: serie.name || 'Inconnu',
                x: serie.popularity,
                y: serie.vote_average,
            }
        });
    });

    return genresMap;
}
let originalData;

function createFilmBubbleChart(filmsData) {
    const ctx = document.querySelector('.chartGraph').getContext('2d');
    
    // Regrouper les points par genre
    const genresMap = groupByGenreFilm(filmsData);

    // Préparer les données pour chaque genre
    const datasets = Object.keys(genresMap).map(genre => ({
        label: genre || 'Inconnu',
        data: genresMap[genre].map(item => item.data), // Utiliser uniquement les données
        backgroundColor: getRandomColor(), // Couleur aléatoire pour chaque genre
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
    }));
    originalData = { datasets: datasets };
    filmdetails = filmsData;

    const myChart = new Chart(ctx, {
      type: 'bubble',
      data: { datasets },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const data = context.raw;
                return `${data.title}: Popularité - ${data.x}, Note Moyenne - ${data.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Popularité'
            },
            beginAtZero: false,
          },
          y: {
            title: {
              display: true,
              text: 'Note Moyenne'
            },
            beginAtZero: false,
          }
        }
      }
    });
    ctx.canvas.chartInstance = myChart;
}
function createSeriesBubbleChart(seriesData) {
    const ctx = document.querySelector('.chartGraph').getContext('2d');
    
    // Regrouper les points par genre
    const genresMap = groupByGenreFilm(seriesData);

    // Préparer les données pour chaque genre
    const datasets = Object.keys(genresMap).map(genre => ({
        label: genre || 'Inconnu',
        data: genresMap[genre].map(item => item.data), // Utiliser uniquement les données
        backgroundColor: getRandomColor(), // Couleur aléatoire pour chaque genre
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
    }));
    originalData = { datasets: datasets };
    filmdetails = filmsData;

    const myChart = new Chart(ctx, {
      type: 'bubble',
      data: { datasets },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const data = context.raw;
                return `${data.title}: Popularité - ${data.x}, Note Moyenne - ${data.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Popularité'
            },
            beginAtZero: false,
          },
          y: {
            title: {
              display: true,
              text: 'Note Moyenne'
            },
            beginAtZero: false,
          }
        }
      }
    });
    ctx.canvas.chartInstance = myChart;
}



function moyennesParGenre(data) {
const moyennes = {};
const countGenres = {};

data.forEach(movie => {
    const genre = movie.genre;
    const budget = movie.budget;
    const revenue = movie.revenue;
    
    if (!moyennes[genre]) {
        moyennes[genre] = { budgetTotal: 0, revenueTotal: 0, count: 0 };
    }
    
    if (budget !== 0) {
        moyennes[genre].budgetTotal += budget;
        moyennes[genre].count++;
    }
    
    if (revenue !== 0) {
        moyennes[genre].revenueTotal += revenue;
    }
    
    countGenres[genre] = (countGenres[genre] || 0) + 1;
});

for (const genre in moyennes) {
    const values = moyennes[genre];
    const count = values.count;
    
    if (count !== 0) {
        moyennes[genre].budgetMoyen = values.budgetTotal / count;
        moyennes[genre].revenueMoyen = values.revenueTotal / count;
    }
}

return moyennes;
}
  
function createFilmRevenueBudgetChart(filmsData) {
    const ctx = document.querySelector('.chartGraph').getContext('2d');
    const labels = Object.keys(filmsData); // Utiliser les genres comme labels
    const budgets = labels.map(genre => filmsData[genre].budgetMoyen || 0);
    const revenues = labels.map(genre => filmsData[genre].revenueMoyen || 0);
    
    const data = {
      labels: labels,
      datasets: [{
        label: 'Budget',
        data: budgets,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }, {
        label: 'Revenu',
        data: revenues,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }]
    };
    originalData = { datasets: data };
    filmdetails = filmsData;

  
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }
    });
    ctx.canvas.chartInstance = myChart;
}

function groupFilmsByYearAndGenre(filmsData) {
    const groupedData = {};
    filmdetails = filmsData;

    filmsData.forEach(film => {
        const releaseYear = new Date(film.release_date).getFullYear();
        const yearGroup = Math.floor(releaseYear / 5) * 5; // Groupe par tranche de 5 ans
        const genre = film.genre;

        if (!groupedData[yearGroup]) {
            groupedData[yearGroup] = {};
        }

        if (!groupedData[yearGroup][genre]) {
            groupedData[yearGroup][genre] = { totalRuntime: 0, count: 0 };
        }

        groupedData[yearGroup][genre].totalRuntime += film.runtime;
        groupedData[yearGroup][genre].count++;
    });

    // Remplir les données manquantes avec une durée moyenne de zéro
    const allGenres = new Set(filmsData.map(film => film.genre));
    for (const yearGroup in groupedData) {
        for (const genre of allGenres) {
            if (!groupedData[yearGroup][genre]) {
                groupedData[yearGroup][genre] = { totalRuntime: 0, count: 0 };
            }
        }
    }

    // Calcul de la moyenne pour chaque groupe
    for (const yearGroup in groupedData) {
        for (const genre in groupedData[yearGroup]) {
            groupedData[yearGroup][genre].averageRuntime =
                groupedData[yearGroup][genre].totalRuntime /
                groupedData[yearGroup][genre].count;
        }
    }

    return groupedData;
}



function createRuntimeByYearChart(groupedData) {
    const ctx = document.querySelector('.chartGraph').getContext('2d');
    const genres = Object.keys(groupedData[Object.keys(groupedData)[0]]); // Utiliser les genres comme séries de données

    const data = {
        labels: Object.keys(groupedData),
        datasets: genres.map(genre => ({
            label: genre,
            data: Object.values(groupedData).map(data => data[genre]?.averageRuntime || 0),
            fill: false,
            borderColor: getRandomColor(),
            tension: 0.4
        }))
    };
    originalData = { datasets: data.datasets };
 

    const myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Durée moyenne (en minutes)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Années'
                    }
                }
            }
        }
    });
    ctx.canvas.chartInstance = myChart;
}
  
function groupByGenreSerie2(seriesData) {
    // Créer un objet pour stocker les séries de chaque genre
    const genresMap = {};

    // Regrouper les séries par genre
    seriesData.forEach(serie => {
        if (!genresMap[serie.genre]) {
            genresMap[serie.genre] = [];
        }
      
        genresMap[serie.genre].push({
            data: {
                title: serie.name || 'Inconnu', // Nom de la série
                x: serie.number_of_seasons, // Nombre de saisons
                y: serie.number_of_episodes, // Nombre d'épisodes
                r: serie.vote_average*10 // Moyenne des votes
            }
        });
    });

    return genresMap;
}




function createSeriesSeasonsEpisodesChart(seriesData) {
    const ctx = document.querySelector('.chartGraph').getContext('2d');
    
    // Regrouper les séries par genre
    const genresMap = groupByGenreSerie2(seriesData);

    // Préparer les données pour chaque genre
    const datasets = Object.keys(genresMap).map(genre => ({
        label: genre || 'Inconnu',
        data: genresMap[genre].map(item => item.data), // Utiliser uniquement les données
        backgroundColor: getRandomColor(), // Couleur aléatoire pour chaque genre
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
    }));
    originalData = { datasets: datasets };
    filmdetails = seriesData;
    const myChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            console.log(context);
                            const data = context.raw;
                            return `${data.title}: Nombre de Saisons - ${data.x}, Nombre Moyen d’Épisodes - ${data.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Nombre de Saisons'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Nombre Moyen d’Épisodes'
                    }
                }
            }
        }
    });
    ctx.canvas.chartInstance = myChart;
}

function groupByGenreSerie3(seriesData) {
    const genresMap = {};

    seriesData.forEach(serie => {
        if (!genresMap[serie.genre]) {
            genresMap[serie.genre] = [];
        }
      
        genresMap[serie.genre].push(serie);
    });

    return genresMap;
}





function prepareDataForChart(seriesData) {
    const genreSeasonsData = {}; // { genre: { yearRange: totalSeasons, count: numberOfSeries }}
  
    seriesData.forEach(serie => {
      const startYear = new Date(serie.first_air_date).getFullYear();
      // Arrondir l'année de début à la tranche de 5 ans la plus proche
      const yearRange = startYear - (startYear % 5);
  
      if (!genreSeasonsData[serie.genre]) {
        genreSeasonsData[serie.genre] = {};
      }
      if (!genreSeasonsData[serie.genre][yearRange]) {
        genreSeasonsData[serie.genre][yearRange] = { totalSeasons: 0, count: 0 };
      }
  
      genreSeasonsData[serie.genre][yearRange].totalSeasons += serie.number_of_seasons;
      genreSeasonsData[serie.genre][yearRange].count += 1;
    });
  
    // Calculer les moyennes
    const averages = {}; // { genre: { yearRange: averageSeasons }}
  
    Object.keys(genreSeasonsData).forEach(genre => {
      averages[genre] = {};
      Object.keys(genreSeasonsData[genre]).forEach(yearRange => {
        const data = genreSeasonsData[genre][yearRange];
        averages[genre][yearRange] = data.totalSeasons / data.count;
      });
    });
  
    return averages;
  }

  function createGenreSeasonsChart(seriesData) {
    const ctx = document.querySelector('.chartGraph').getContext('2d');
    const averages = prepareDataForChart(seriesData);
  
    const datasets = Object.keys(averages).map(genre => {
      return {
        label: genre,
        data: Object.keys(averages[genre]).map(yearRange => {
          return { x: yearRange, y: averages[genre][yearRange] };
        }),
        fill: false,
        borderColor: getRandomColor(), // Fonction pour générer des couleurs aléatoires
        tension: 0.1
      };
    });
    originalData = { datasets: datasets };
    filmdetails = seriesData;

  
  
    const myChart = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Période'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Nombre Moyen de Saisons'
            }
          }
        }
      }
    });
    ctx.canvas.chartInstance = myChart;
  }
  
  function calculerMoyennesParGenreFilm(nomGenre, listeFilms) {
    // Filtrer les films par le nom de genre
    const filmsFiltres = listeFilms.filter(film =>
      film.genre === nomGenre // Comparaison directe du nom du genre
    );
  
    // Calculer les moyennes
    const totalFilms = filmsFiltres.length;
    const sommePopularity = filmsFiltres.reduce((acc, film) => acc + film.popularity, 0);
    const sommeRuntime = filmsFiltres.reduce((acc, film) => acc + film.runtime, 0);
    const sommeVoteAverage = filmsFiltres.reduce((acc, film) => acc + film.vote_average, 0);
  
    const moyennePopularity = totalFilms > 0 ? sommePopularity / totalFilms : 0;
    const moyenneRuntime = totalFilms > 0 ? sommeRuntime / totalFilms : 0;
    const moyenneVoteAverage = totalFilms > 0 ? sommeVoteAverage / totalFilms : 0;

    // Arrondir les moyennes à un chiffre après la virgule
    const roundedMoyennePopularity = parseFloat(moyennePopularity.toFixed(1));
    const roundedMoyenneRuntime = parseFloat(moyenneRuntime.toFixed(1));
    const roundedMoyenneVoteAverage = parseFloat(moyenneVoteAverage.toFixed(1));
   
  
    return {
      roundedMoyennePopularity,
      roundedMoyenneRuntime,
      roundedMoyenneVoteAverage
    };
  }
  function calculerMoyennesParGenreSerie(nomGenre, listeFilms) {
    // Filtrer les films par le nom de genre
    const filmsFiltres = listeFilms.filter(serie =>
      serie.genre === nomGenre // Comparaison directe du nom du genre
    );
  
    // Calculer les moyennes
    const totalFilms = filmsFiltres.length;
    const sommePopularity = filmsFiltres.reduce((acc, serie) => acc + serie.popularity, 0);
    const sommeRuntime = filmsFiltres.reduce((acc, serie) => acc + serie.number_of_episodes, 0);
    const sommeVoteAverage = filmsFiltres.reduce((acc, serie) => acc + serie.vote_average, 0);
  
    const moyennePopularity = totalFilms > 0 ? sommePopularity / totalFilms : 0;
    const moyenneEpisode = totalFilms > 0 ? sommeRuntime / totalFilms : 0;
    const moyenneVoteAverage = totalFilms > 0 ? sommeVoteAverage / totalFilms : 0;

    // Arrondir les moyennes à un chiffre après la virgule
    const roundedMoyennePopularity = moyennePopularity.toFixed(1);
    const roundedMoyenneEpisode = parseFloat(moyenneEpisode.toFixed(1));
    const roundedMoyenneVoteAverage = parseFloat(moyenneVoteAverage.toFixed(1));
    
  
    return {
      roundedMoyennePopularity,
      roundedMoyenneEpisode,
      roundedMoyenneVoteAverage
    };
  }
  
  
  

 


  
//--------------------------------Recupération des données-----------------------------


/**
 * Récupère les informations détaillées d'un film spécifique à partir de l'API de TMDb.
 * Cette fonction envoie une requête GET à l'API pour obtenir les détails d'un film, tels que le titre, 
 * le résumé, la date de sortie, les genres, etc. Les informations sont demandées en anglais.
 * En cas d'échec de la requête, une erreur est générée et propagée pour être traitée par la fonction appelante.
 *
 * @param {string} movieId - L'identifiant du film sur TMDb pour lequel les informations sont demandées.
 * @returns {Promise<Object>} Une promesse qui renvoie les données du film si la requête est réussie.
 */


async function getMovieInfo(movieId) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
        }
    };
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données du film');
        }
        const movieData = await response.json();
        return movieData;
    
    } catch (error) {
        console.error('Error fetching movie data:', error);
        throw error; // Propager l'erreur pour qu'elle soit capturée par l'appelant
    }
}

/**
 * Récupère les informations détaillées d'une série télévisée spécifique à partir de l'API de TMDb.
 * Cette fonction envoie une requête GET à l'API pour obtenir les détails d'une série, tels que le titre, 
 * le résumé, la date de première diffusion, les genres, etc. Les informations sont demandées en anglais.
 * En cas d'échec de la requête, une erreur est générée et propagée pour être traitée par la fonction appelante.
 *
 * @param {string} movieId - L'identifiant de la série sur TMDb pour laquelle les informations sont demandées.
 * @returns {Promise<Object>} Une promesse qui renvoie les données de la série si la requête est réussie.
 */


async function getSerieInfo(movieId) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
        }
    };
    const url = `https://api.themoviedb.org/3/tv/series_id?language=en-US', options`;
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données du film');
        }
        const movieData = await response.json();
        return movieData;
    
    } catch (error) {
        console.error('Error fetching movie data:', error);
        throw error; // Propager l'erreur pour qu'elle soit capturée par l'appelant
    }
}

async function fillData(var1, var2, type) {
    $('#dataBody').empty(); // Clear the current table content
    data = []; // Reset the data array
    for (const movieId of idTmdbList) {
        try {
            let movieData;
            let variables;
            
            if (type === 'movie') {
                movieData = await getMovieInfo(movieId);
                variables = {
                    title: movieData.original_title,
                    budget: movieData.budget,
                    revenue: movieData.revenue,
                    popularity: movieData.popularity,
                    runtime: movieData.runtime,
                    vote_count: movieData.vote_count
                };
            } else if (type === 'tv') {
                movieData = await getSerieInfo(movieId);
                variables = {
                    title: movieData.name,
                    numberOfSeasons: movieData.number_of_seasons,
                    numberOfEpisodes: movieData.number_of_episodes,
                    popularity: movieData.popularity,
                    vote_count: movieData.vote_count
                };
            } else {
                console.error('Type de contenu non reconnu:', type);
                continue;
            }

            if (Object.values(variables).some(value => value === 0)) {
                continue;
            }
            
            data.push(variables);
            $('#dataBody').append(`<tr><td>${variables.title}</td><td>${variables[var1]}</td><td>${variables[var2]}</td></tr>`);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}




//----------------------------------------------------------------------------------


//--------------------------------Calcul de Pearson---------------------------------


/**
 * Calcule le coefficient de corrélation de Pearson entre deux ensembles de données.
 * Ce coefficient est une mesure statistique du degré de corrélation linéaire entre deux variables.
 * Les données pour les deux variables sont passées sous forme de tableaux (x et y), et la fonction
 * calcule le coefficient à partir de ces valeurs.
 *
 * @param {Array<number>} x - Le premier ensemble de données.
 * @param {Array<number>} y - Le second ensemble de données.
 * @returns {number} Le coefficient de corrélation de Pearson entre les deux ensembles de données.
 */


function calculatePearsonCorrelation(x, y) {
    const n = x.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumX2 += x[i] ** 2;
        sumY2 += y[i] ** 2;
    }

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));

    return numerator / denominator;
}



/**
 * Affiche un graphique de dispersion (scatter plot) pour deux ensembles de données avec les titres associés.
 * Cette fonction crée un graphique de dispersion dans lequel chaque point est associé à un titre de film.
 * Les axes du graphique et les étiquettes de données sont dynamiquement mis à jour selon les sélections 
 * de l'utilisateur dans des menus déroulants sur la page web.
 *
 * @param {Array<number>} x - Les données pour l'axe des x.
 * @param {Array<number>} y - Les données pour l'axe des y.
 * @param {Array<string>} titles - Les titres associés à chaque paire de données (x, y).
 */


function displayScatterPlot(x, y, titles) {
// Préparer les données pour le graphique
var scatterData = x.map((value, index) => {
    return { x: value, y: y[index], title: titles[index] }; // Inclure le titre du film
});

var ctx = document.getElementById('correlationChart').getContext('2d');
if(window.scatterChart != undefined) {
    window.scatterChart.destroy();
}
window.scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: `Corrélation entre ${$('#variableSelect1 option:selected').text()} et ${$('#variableSelect2 option:selected').text()}`,
            data: scatterData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: $('#variableSelect1 option:selected').text()
                }
            },
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: $('#variableSelect2 option:selected').text()
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const dataPoint = context.raw;
                        // Afficher le titre, la valeur de x et la valeur de y
                        return `${dataPoint.title}: ${$('#variableSelect1 option:selected').text()} = ${dataPoint.x}, ${$('#variableSelect2 option:selected').text()} = ${dataPoint.y}`;
                    }
                }
            }
        }
    }
});
}




//--------------------------------------------------------------------------------


//--------------------------------------Regression Linéaire------------------------

/**
 * Effectue une régression linéaire sur deux ensembles de données et affiche un graphique de régression linéaire.
 * Cette fonction calcule la pente et l'ordonnée à l'origine pour la ligne de régression linéaire basée sur les ensembles de données x et y.
 * Les résultats sont ensuite utilisés pour créer un graphique qui montre la ligne de régression ainsi que les données ponctuelles.
 * Les noms des variables (par exemple, des caractéristiques du film) sont passés comme arguments pour étiqueter le graphique.
 *
 * @param {Array<number>} x - Les données pour la variable indépendante.
 * @param {Array<number>} y - Les données pour la variable dépendante.
 * @param {Array<string>} titles - Les titres associés à chaque paire de données (x, y), typiquement les titres de films.
 * @param {string} variable1 - Le nom de la variable indépendante pour l'étiquetage du graphique.
 * @param {string} variable2 - Le nom de la variable dépendante pour l'étiquetage du graphique.
 */

function performLinearRegression(x, y, titles, variable1, variable2) {
// Calculer les moyennes
const n = x.length;
const meanX = x.reduce((acc, val) => acc + val, 0) / n;
const meanY = y.reduce((acc, val) => acc + val, 0) / n;

// Calculer les coefficients de régression
let numerator = 0;
let denominator = 0;
for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += (x[i] - meanX) ** 2;
}
const slope = numerator / denominator;
const intercept = meanY - slope * meanX;

// Afficher le graphique de régression linéaire
displayLinearRegressionPlot(x, y, slope, intercept, titles, variable1, variable2);
}





/**
 * Affiche un graphique de dispersion avec une ligne de régression linéaire pour visualiser la relation entre deux variables.
 * Ce graphique intègre à la fois les points de données individuels et une ligne représentant la régression linéaire calculée.
 * La fonction prend en compte les valeurs des variables x et y, la pente, l'ordonnée à l'origine, les titres des points de données, 
 * et les noms des variables pour étiqueter correctement le graphique.
 *
 * @param {Array<number>} x - Les valeurs de la variable indépendante.
 * @param {Array<number>} y - Les valeurs de la variable dépendante.
 * @param {number} slope - La pente de la ligne de régression.
 * @param {number} intercept - L'ordonnée à l'origine de la ligne de régression.
 * @param {Array<string>} titles - Les titres associés à chaque paire de données, utilisés dans les infobulles.
 * @param {string} variable1 - Le nom de la variable indépendante pour l'étiquetage sur l'axe des x.
 * @param {string} variable2 - Le nom de la variable dépendante pour l'étiquetage sur l'axe des y.
 */

function displayLinearRegressionPlot(x, y, slope, intercept, titles, variable1, variable2) {
    var scatterData = data.map((row, index) => ({
        x: row[variable1],
        y: row[variable2],
        title: titles[index]
    }));

    var regressionLine = [
        { x: Math.min(...x), y: slope * Math.min(...x) + intercept },
        { x: Math.max(...x), y: slope * Math.max(...x) + intercept }
    ];

    var ctx = document.getElementById('correlationChart').getContext('2d');
    if (window.scatterChart !== undefined) {
        window.scatterChart.destroy();
    }
    window.scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Données',
                data: scatterData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }, {
                label: 'Régression linéaire',
                data: regressionLine,
                type: 'line',
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: variable1
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: variable2
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const dataPoint = context.raw;
                            return `${dataPoint.title}: ${variable1} = ${dataPoint.x}, ${variable2} = ${dataPoint.y}`;
                        }
                    }
                }
            }
        }
    });
}

//-------------------------------------------------------------------------------

//-------------------------------------Clustering-------------------------------

/**
* Effectue le clustering K-Means sur un ensemble de données.
* 
* @param {Array} data Un tableau d'objets, chaque objet représentant un point de données avec x et y comme variables à clusteriser.
* @param {number} numClusters Le nombre de clusters à former.
* @returns {Object} Un objet contenant deux propriétés: assignments (l'affectation de chaque point à un cluster) et centers (les centres des clusters).
*/
async function performClustering(data, numClusters) {
let centers = initializeCenters(data, numClusters);
let assignments = [];
let previousAssignments = [];
let maxIterations = 100;
let iteration = 0;

do {
    // Assignation des points aux clusters
    assignments = data.map(d => assignToClosestCenter(d, centers));

    // Vérification de la convergence
    if (arraysEqual(assignments, previousAssignments) || iteration >= maxIterations) {
        break;
    }

    // Mise à jour des centres
    centers = updateCenters(data, assignments, numClusters);

    previousAssignments = assignments.slice();
    iteration++;
} while (true);

return { assignments, centers };
}



/**
 * Initialise les centres pour un algorithme de clustering, tel que k-means, en sélectionnant aléatoirement des points de données.
 * Cette fonction mélange les données fournies et sélectionne les premiers 'numClusters' éléments du tableau mélangé pour servir de centres initiaux.
 *
 * @param {Array} data - Un tableau de points de données où chaque point est un objet ou un tableau représentant les coordonnées d'un point.
 * @param {number} numClusters - Le nombre de clusters à former, ce qui détermine le nombre de centres à initialiser.
 * @returns {Array} Un tableau contenant les 'numClusters' premiers points de données du tableau mélangé, utilisés comme centres initiaux.
 */


function initializeCenters(data, numClusters) {
    // Sélection aléatoire de points comme centres initiaux
    let shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numClusters);
    }



    /**
 * Attribue un point donné au centre le plus proche parmi un ensemble de centres.
 * Cette fonction calcule la distance euclidienne entre le point et chaque centre,
 * et détermine l'index du centre le plus proche au point.
 *
 * @param {Object} point - Un objet représentant un point avec des coordonnées 'x' et 'y'.
 * @param {Array} centers - Un tableau d'objets où chaque objet représente un centre avec des coordonnées 'x' et 'y'.
 * @returns {number} L'index du centre le plus proche dans le tableau des centres.
 */


function assignToClosestCenter(point, centers) {
    let minDistance = Infinity;
    let closestCenterIndex = -1;

    centers.forEach((center, index) => {
        let distance = Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            closestCenterIndex = index;
        }
    });

    return closestCenterIndex;
    }





    /**
 * Met à jour les centres des clusters basés sur les affectations actuelles des points de données à ces clusters.
 * Cette fonction calcule les nouvelles coordonnées de chaque centre en prenant la moyenne des points qui lui ont été assignés.
 * Si un centre n'a aucun point assigné, il reste à sa position actuelle.
 *
 * @param {Array} data - Un tableau contenant les points de données, chaque point étant un objet avec des coordonnées 'x' et 'y'.
 * @param {Array} assignments - Un tableau indiquant l'index du centre auquel chaque point de données a été assigné.
 * @param {number} numClusters - Le nombre total de clusters, qui est aussi le nombre de centres à mettre à jour.
 * @returns {Array} Un tableau des nouveaux centres, où chaque centre est un objet avec des coordonnées 'x', 'y'.
 */


function updateCenters(data, assignments, numClusters) {
    let centers = Array(numClusters).fill(null).map(() => ({ x: 0, y: 0, count: 0 }));

    // Accumuler les valeurs pour le calcul de la moyenne
    data.forEach((point, index) => {
        let clusterIndex = assignments[index];
        if (centers[clusterIndex]) { // Vérification de l'existence du centre
            centers[clusterIndex].x += point.x;
            centers[clusterIndex].y += point.y;
            centers[clusterIndex].count += 1;
        }
    });

    // Calculer la nouvelle position des centres
    return centers.map(center => center.count > 0 ? {
        x: center.x / center.count,
        y: center.y / center.count
    } : center); // Retourne le centre inchangé si aucun point ne lui est assigné
    }


/**
 * Vérifie si deux tableaux sont égaux en termes de longueur et de contenu correspondant à chaque index.
 * Cette fonction compare deux tableaux élément par élément et vérifie si chaque valeur dans le premier tableau
 * est strictement égale à la valeur correspondante dans le deuxième tableau.
 *
 * @param {Array} a - Le premier tableau à comparer.
 * @param {Array} b - Le second tableau à comparer.
 * @returns {boolean} Retourne true si les deux tableaux sont de même longueur et contiennent les mêmes éléments dans le même ordre; sinon, false.
 */

function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
    }



/**
 * Affiche un graphique des clusters pour visualiser les regroupements de données selon les affectations spécifiées.
 * Cette fonction utilise Plotly pour créer un graphique de dispersion où chaque point représente un élément de données,
 * coloré selon le cluster auquel il appartient. Les étiquettes des axes sont paramétrables pour s'adapter à différentes données.
 *
 * @param {Array} data - Un tableau d'objets contenant les données à afficher. Chaque objet doit avoir les propriétés 'x', 'y', et 'movieTitle'.
 * @param {Array} assignments - Un tableau indiquant le cluster auquel chaque point de données appartient, utilisé pour colorer les points.
 * @param {string} xAxisLabel - L'étiquette pour l'axe des X, indiquant la variable représentée sur cet axe.
 * @param {string} yAxisLabel - L'étiquette pour l'axe des Y, indiquant la variable représentée sur cet axe.
 */


function displayClusters(data, assignments, xAxisLabel, yAxisLabel) {
// Utilisez Plotly ou une autre bibliothèque de graphiques pour afficher les clusters
    var trace = {
        x: data.map(d => d.x), // Remplacez 'x' par la variable sélectionnée pour l'axe des X
        y: data.map(d => d.y), // Remplacez 'y' par la variable sélectionnée pour l'axe des Y
        mode: 'markers',
        type: 'scatter',
        marker: {color: assignments}, // Utilisez les affectations de cluster pour la couleur
        text: data.map(d => d.movieTitle) // Titres des films pour les tooltips
    };

    var layout = {
        title: 'Visualisation des Clusters',
        xaxis: {title: xAxisLabel}, // Mettez à jour selon la variable sélectionnée
        yaxis: {title: yAxisLabel}, // Mettez à jour selon la variable sélectionnée
        plot_bgcolor: 'rgba(0, 0, 0, 0)',
        paper_bgcolor: 'rgba(0, 0, 0, 0)',

    };

    Plotly.newPlot('myDiv', [trace], layout);
    }

//---------------------------------------------------------------------------------

  /**
 * Effectue un test statistique sélectionné sur un ensemble de données en utilisant diverses analyses comme la corrélation de Pearson,
 * la régression linéaire ou le clustering. Ce code utilise une barre de progression animée pendant le chargement des données et affiche
 * les résultats de manière appropriée.
 *
 * @param {string} selectedTest - Le type de test à effectuer ('pearson', 'regression', 'cluestering').
 * @param {string} var1 - La première variable pour les tests ou par défaut pour le clustering ('budget').
 * @param {string} var2 - La seconde variable pour les tests ou par défaut pour le clustering ('revenue').
 * @param {number} numClusters - Le nombre de clusters à utiliser si le test sélectionné est 'cluestering'.
 */


async function performSelectedTest(selectedTest, var1, var2, numClusters) {
    // Récupérez l'élément .barreStape
    const barreStape = document.querySelector(".loadingDiv").querySelector(".barreStape");

    // Créez une animation GSAP pour effectuer une rotation continue
    const rotationTween = gsap.to(barreStape, { rotation: 360, duration: 2, repeat: -1, ease: "none" });
    if(selectedTest === 'cluestering') {
        await fillData("budget", "revenue",);
    }
    else{
        await fillData(var1, var2,);
    }

    rotationTween.pause();
    document.querySelector(".loadingDiv").style.display = "none";
    document.querySelector(".testData").classList.add("active");
    document.querySelector(".testResum").classList.add("active");
    document.querySelector(".testExplain").classList.add("active")






    if (selectedTest === 'pearson') {
    const columnVar1 = data.map(row => row[var1]);
    const columnVar2 = data.map(row => row[var2]);
    const titles = data.map(row => row.title); // Récupérer les titres des films
    const correlation = calculatePearsonCorrelation(columnVar1, columnVar2);
    console.log('Corrélation de Pearson:', correlation);
    displayScatterPlot(columnVar1, columnVar2, titles); // Passer les titres ici
}  else if (selectedTest === 'regression') {
    const titles = data.map(row => row.title); // Récupérer les titres des films ici
    const x = data.map(row => row[var1]);
    const y = data.map(row => row[var2]);
    performLinearRegression(x, y, titles, var1, var2); // Inclure var1 et var2 comme arguments
}
else if (selectedTest === 'cluestering') {
        var1="budget";
        var2="revenue";
        // Assurez-vous que la fonction fillData a été appelée pour remplir 'data' avec les données correctes
        const variableData = data.map(d => ({x: d[var1], y: d[var2], movieTitle: d.title})); // Utilisez 'title' comme titre de film
        const clusteringResult = await performClustering(variableData, numClusters); // Attendre le résultat du clustering
        displayClusters(variableData, clusteringResult.assignments, $('#variableSelect1 option:selected').text(), $('#variableSelect2 option:selected').text()); // Utilisez les libellés des variables sélectionnées
    }
}
setTimeout(async () => {
    let imageBase64;
    // Vérifier si c'est un graphique Plotly
    if (document.querySelector('.plot-container')) {
        imageBase64 = await Plotly.toImage(document.querySelector('.plot-container'), {format: 'png'});
    } else {
        // Sinon, traiter comme un graphique Chart.js
        const canvas = document.getElementById('correlationChart');
        if (canvas) {
            imageBase64 = canvas.toDataURL('image/png');
        }
    }
    sendImageToAPI(imageBase64); // Envoyer l'image à l'API
}, 1000);

//--------------------------------------Partie Test----------------------------

window.verifyStape = async function(){
    // Récupérer la divStape active
    if (document.querySelector(".barreStape.active")) {
        document.querySelector(".barreStape.active").classList.remove("active");
    }
    var activeDivStape = document.querySelector('.divStape.active');
    var selection = document.querySelector('.option-prediction.active');


    // Si la divStape 1 est active
    if (activeDivStape.getAttribute('stape') === '1') {
        // Vérifier si une option est sélectionnée dans le premier dropdown
        var typeSelected = activeDivStape.querySelector('.selected[data-type="type"][data-value]');
        if (!typeSelected) {
            alert("Veuillez sélectionner un type de contenu.");
            return; // Arrêter la fonction si l'option n'est pas sélectionnée
        }


        // Activer la divStape 2
        document.querySelector('.divStape[stape="1"]').classList.remove('active');
        var divStape2 = document.querySelector('.divStape[stape="2"]');
        divStape2.classList.add('active');

        var btn = document.querySelector('.stape2');
        gsap.to(selection.querySelector(".barreStape"), { rotation: 360 });
        gsap.to(btn.querySelector(".barreStape"), { rotation: 180 });
        // Ajoutez la classe active au bouton
        selection.querySelector(".imgStape").src = "assets/images/stape1V.png";
        btn.classList.add('active');
        // Retirez la classe active de l'ancienne sélection
        selection.classList.remove('active');


        gsap.from(divStape2, { duration: 1, opacity: 0, ease: "power2.inOut" });
        
    }

    // Si la divStape 2 est active
    else if (activeDivStape.getAttribute('stape') === '2') {
        // Vérifier si un testStape est activé dans la deuxième divStape
        var testStapes = activeDivStape.querySelectorAll('.testStape.active');
        if (testStapes.length === 0) {
            alert("Veuillez choisir un test.");
            return; // Arrêter la fonction si aucun test n'est sélectionné
        }

        // Activer la divStape 3
        document.querySelector('.divStape[stape="2"]').classList.remove('active');
        var divStape3 = document.querySelector('.divStape[stape="3"]');
        divStape3.classList.add('active');

        var btn = document.querySelector('.stape3');
        gsap.to(selection.querySelector(".barreStape"), { rotation: 360 });
        gsap.to(btn.querySelector(".barreStape"), { rotation: 180 });
        // Ajoutez la classe active au bouton
        selection.querySelector(".imgStape").src = "assets/images/stape2V.png";
        btn.classList.add('active');
        // Retirez la classe active de l'ancienne sélection
        selection.classList.remove('active');



        gsap.from(divStape3, { duration: 1, opacity: 0, ease: "power2.inOut" });
        var activeTestStape = document.querySelector('.testStape.active');
        var testNumber = activeTestStape.getAttribute('test');
        
        if (testNumber == "cluestering"){
            if(document.querySelector(".variableStape[test='1']").classList.contains('active')){
                document.querySelector(".variableStape[test='1']").classList.remove('active');
            }
            document.querySelector(".variableStape[test='3']").classList.add('active');
        }
        else{
            if(document.querySelector(".variableStape[test='3']").classList.contains('active')){
                document.querySelector(".variableStape[test='3']").classList.remove('active');
            }
            document.querySelector(".variableStape[test='1']").classList.add('active');
        }

    }
    else if (activeDivStape.getAttribute('stape') === '3') {
        var activeTestStape = document.querySelector('.testStape.active');
        var testNumber = activeTestStape.getAttribute('test');
        if (testNumber == "cluestering"){
            var navVariableStapes = document.querySelectorAll('.variableStape[test="3"].navVariableStape');
                // Parcourir chaque navVariableStape
                var allNavVariableStapesHaveActiveVarStapes = true;
                navVariableStapes.forEach(function(navVariableStape) {
                    // Vérifier si au moins un varStape est actif dans chaque navVariableStape
                    var activeVarStape = navVariableStape.querySelector('.varStape.active');
                    if (!activeVarStape) {
                        alert("Veuillez choisir au moins une variable pour chaque groupe de variables.");
                        allNavVariableStapesHaveActiveVarStapes = false;
                        return; // Arrêter la boucle forEach si aucune variable n'est sélectionnée
                    }
                });
    
                // Si toutes les navVariableStapes contiennent au moins un varStape actif, alors continuer
                if (allNavVariableStapesHaveActiveVarStapes) {
                    await startTest();

                    // Activer la divStape suivante ou effectuer d'autres actions
                } else {
                    alert("Veuillez choisir au moins une variable pour chaque groupe de variables.");
                    // Arrêter la fonction si une ou plusieurs conditions ne sont pas remplies
                }


            

        }
        else{
            var navVariableStapes = document.querySelectorAll('.variableStape[test="1"].navVariableStape');

            // Parcourir chaque navVariableStape
            var allNavVariableStapesHaveActiveVarStapes = true;
            navVariableStapes.forEach(function(navVariableStape) {
                // Vérifier si au moins un varStape est actif dans chaque navVariableStape
                var activeVarStape = navVariableStape.querySelector('.varStape.active');
                if (!activeVarStape) {
                    alert("Veuillez choisir au moins une variable pour chaque groupe de variables.");
                    allNavVariableStapesHaveActiveVarStapes = false;
                    return; // Arrêter la boucle forEach si aucune variable n'est sélectionnée
                }
            });

            // Si toutes les navVariableStapes contiennent au moins un varStape actif, alors continuer
            if (allNavVariableStapesHaveActiveVarStapes) {
                await startTest();
                // Activer la divStape suivante ou effectuer d'autres actions
            } else {
                alert("Veuillez choisir au moins une variable pour chaque groupe de variables.");
                // Arrêter la fonction si une ou plusieurs conditions ne sont pas remplies
            }

        }


    }

    // Ajoutez des vérifications supplémentaires et activez les divStapes suivantes si nécessaire
}


window.changeState = function(btn) {
    var selection = document.querySelector('.option-prediction.active');
    
    // Retirez la classe active de l'élément ayant la classe "barreStape"
    if (document.querySelector(".barreStape.active")) {
        document.querySelector(".barreStape.active").classList.remove("active");
    }

    // Retirez la classe active de toutes les divStape
    document.querySelectorAll('.divStape').forEach(function(divStape) {
        divStape.classList.remove('active');
    });

    // Ajoutez la classe active à la divStape correspondante
    var stapeNumber = btn.classList[1].replace('stape', ''); // Obtenez le numéro de stape de la classe de bouton
    var correspondingDivStape = document.querySelector('.divStape[stape="' + stapeNumber + '"]');
    correspondingDivStape.classList.add('active');

    if (!(btn.classList.contains("active"))) {
        gsap.to(selection.querySelector(".barreStape"), { rotation: 360 });
        gsap.to(btn.querySelector(".barreStape"), { rotation: 180 });

        // Ajoutez la classe active au bouton
        btn.classList.add('active');

        // Retirez la classe active de l'ancienne sélection
        selection.classList.remove('active');
    }

    gsap.from(correspondingDivStape, { duration: 1, opacity: 0, ease: "power2.inOut" });
}
let numClusters;
let variable1;
let variable2;
let data = [];
let idTmdbListData;
let idTmdbList;
async function startTest(){
    const verif1 = document.querySelector(".stape1").querySelector(".imgStape").src.endsWith("stape1V.png");
    const verif2 = document.querySelector(".stape2").querySelector(".imgStape").src.endsWith("stape2V.png");
    if(!verif1){
        alert("Veuillez choisir la plage de donnée ou passez par Etape Suivante pour continuer")
        return;
    }
    if(!verif2){
        alert("Veuillez choisir le test ou passez par Etape Suivante pour continuer")
        return;
    }
    document.querySelector(".analyse").classList.remove('active');
    document.querySelector(".testResult").classList.add('active');
    idTmdbListData = await fetchData();
    idTmdbList = Object.values(idTmdbListData);
    const testStapeActive = document.querySelector(".testStape.active");
    const selectedTest = testStapeActive.getAttribute("test");
    console.log(selectedTest)
    if(selectedTest == "cluestering"){
        const navVariableStape = document.querySelector(".divStape[stape='3']").querySelector('.variableStape[test="3"]');
        const activeVarStape = navVariableStape.querySelector('.varStape.active');
        numClusters = parseInt(activeVarStape.getAttribute('var'));
        fillTestVariables(selectedTest, numClusters, null);
    
    }
    else{
        const navVariableStape = document.querySelector('.variableStape[test="1"]').querySelectorAll('.navVariableStape');
        const activeVarStape = navVariableStape[0].querySelector('.varStape.active');

        variable1 = activeVarStape.getAttribute('var');
        const activeVarStape2 = navVariableStape[1].querySelector('.varStape.active');
        variable2 = activeVarStape2.getAttribute('var');
        
        fillTestVariables(selectedTest, variable1, variable2);
    }
    console.log(variable1)
    console.log(variable2)
    console.log(numClusters)
    console.log(idTmdbList)


    await performSelectedTest(selectedTest, variable1, variable2, numClusters); // Ajoutez await ici

}
function fillTestVariables(test, var1, var2) {
    // Récupère tous les éléments avec la classe "testVar"
    const testVarElements = document.querySelectorAll('.testVar');

    // Vérifie si le nombre d'éléments trouvés correspond au nombre de variables à remplir
    if (testVarElements.length !== 3) {
        console.error('Le nombre d\'éléments avec la classe "testVar" doit être égal à 3.');
        return; // Arrête l'exécution de la fonction si le nombre d'éléments est incorrect
    }

    // Remplit chaque élément avec les valeurs fournies
    testVarElements[0].innerHTML = "<strong>Test:</strong> " + test;

    if (var2){
        testVarElements[1].innerHTML = "<strong>Variable 1:</strong> " + var1;
        testVarElements[2].innerHTML = "<strong>Variable 2:</strong> " + var2;
    }
    else{
        testVarElements[1].innerHTML = "<strong>Nombre de clusters:</strong> " + var1;
    }
}


window.backTest= function(){
    document.querySelector(".analyse").classList.add('active');
    document.querySelector(".testResult").classList.remove('active');
    clearTestResults();
}

function clearTestResults() {
    // Sélectionne la div testResult
    const testResultDiv = document.querySelector('.testResult');

    // Supprime tous les éléments enfants de la div testResult
    testResultDiv.innerHTML = '';

    // Recrée la structure de base
    testResultDiv.innerHTML = `
        <div class="loadingDiv">
            <div class="divImgStapeLoad">
                <img src="assets/images/loadingImg.png" alt="" class="imgStape">
                <img src="assets/images/barreStape.png" alt="" class="barreStape" >
            </div>
            <img src="assets/images/loadingTxt.png" alt="" class="textStapeLoad">
        </div>
        <div class="testResum">
            <h1 style="text-align:center">Recherche effectuée :</h1>
            <div class="divTestVar">
                <p class="testVar" type="test"></p>
                <p class="testVar" type="var1"></p>
                <p class="testVar" type="var2"></p>
            </div>
            <button class="backTest" onclick="backTest()">Nouvelle Recherche</button>
        </div>
        <div class="testExplain"></div>
        <div class="testData">
            <h2 class="dataText">Données récupérées</h2>
            <table id="dataTable">
                <thead>
                    <tr>
                        <th>Titre du film</th>
                        <th>Variable 1</th>
                        <th>Variable 2</th>
                    </tr>
                </thead>
                <tbody id="dataBody"></tbody>
            </table>
        </div>
        <div class="testGraph">
            <div id="myDiv">
                <canvas id="correlationChart" width="400" height="400"></canvas>
            </div>
        </div>
    `;
}


window.addEventListener('message', function(event) {
    // Vérifie si le message reçu est celui indiquant que le contenu de l'iframe a été modifié
    if (event.data === 'contenuModifie') {
        // Actualise l'iframe en rechargeant son contenu
        document.getElementById('iframe').contentWindow.location.reload();
    }
  }, false);
  
  window.onload = clearLocalStorageIfIframeNotActive;
  closeIframe();
  
  
  async function sendImageToAPI(imageBase64) {
    const requestData = {
        model: "gpt-4-turbo",
        messages: [{
            role: "user",
            content: [{
                    type: "text",
                    text: "Interprete le graphique en expliquant de manière claire le résultat obtenue sachant que l'on parle d'une analyse de correlation entre deux films selon deux variables ou bien d'un clustering selon l'image que tu reçois"
                },
                {
                    type: "image_url",
                    image_url: {
                        url: imageBase64
                    }
                }
            ]
        }],
        max_tokens: 300
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer `
        },
        body: JSON.stringify(requestData)
    });

    if (response.ok) {
    const responseData = await response.json();
    console.log('Response from OpenAI:', responseData);
    // Mettre à jour le contenu de la div avec la réponse
    const outputDiv = document.querySelector('.testExplain');
    if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
        outputDiv.innerHTML = responseData.choices[0].message.content;
    } else {
        outputDiv.innerHTML = 'Aucune réponse significative reçue.';
    }
} else {
    console.error('Failed to send image:', response.statusText);
    const outputDiv = document.querySelector('.testExplain');
    outputDiv.innerHTML = 'Erreur lors de l\'envoi de l\'image: ' + response.statusText;
}
}
$('#downloadButton').click(function() {
    const canvas = document.getElementById('correlationChart');
    if (canvas) {
        const imageUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'graphique.png';
        link.href = imageUrl;
        link.click();
    }
});  