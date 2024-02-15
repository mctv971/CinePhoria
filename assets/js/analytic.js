let previousScene = 1;
let starField;

let mouseX = 0;
let mouseY = 0;
let scene, renderer, camera;
let section;
let cercleImg, cameramanImg;




document.addEventListener("DOMContentLoaded", function() {
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

}
function stopScene2(){

    // Sortis des élements de la scène 

}

function stopScene3(){

    // Sortis des élements de la scène 
   
}
function stopScene4(){
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


    gsap.to("#cercle", {
        duration: 3, // Durée de l'animation en secondes
        y: 20, // Déplacement vertical de l'image (de haut en bas)
        repeat: -1, // Répéter l'animation indéfiniment
        yoyo: true, // Faire rebondir l'image (aller-retour)
        ease: "power1.inOut" // Effet de lissage de l'animation
      });
    gsap.to("#cameraman", {
    duration: 3, // Durée de l'animation en secondes
    x: -200, // Déplacement vertical de l'image (de haut en bas)
    

    repeat: -1, // Répéter l'animation indéfiniment
    yoyo: true, // Faire rebondir l'image (aller-retour)
    ease: "power1.inOut" // Effet de lissage de l'animation
    });  
 


    
}


function initializeScene2(scene, renderer, camera) {

    // Element de la scène 

}
function initializeScene3(scene,renderer,camera){
// Element de la scène 

}

function initializeScene4(scene,renderer,camera){
// Element de la scène 
}
