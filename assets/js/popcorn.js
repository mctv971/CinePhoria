export function popcorn(){

    const popcornImage = document.querySelector('.popcorn');
    const chatbotElement = document.querySelector('.chatbot');
    const closechat = document.querySelector('.close-chat');
    const popcornContainer = document.querySelector(".popcorn-container")

    // Ajouter un écouteur d'événement pour déclencher l'animation lorsque l'utilisateur survole l'image
    popcornImage.addEventListener('mouseenter', () => {
        gsap.to(popcornImage, { 
            x: -40, 
            opacity: 1,
            duration: 1,
            onComplete: function() {
                changerImage(popcornImage);
              }
        }); // Déplacement de l'image lorsqu'elle est survolée
    });

    // Ajouter un écouteur d'événement pour réinitialiser l'animation lorsque l'utilisateur quitte l'image
    popcornImage.addEventListener('mouseleave', () => {
        gsap.to(popcornImage, { 
            x: 0, 
            opacity: 0.3,
            duration: 1,
            onComplete: function() {
                changerImage2(popcornImage);
              }
        });
    });
    popcornImage.addEventListener('click', () => {
        chatbotElement.classList.add('active');
        popcornImage.classList.add("hidden");
    });
    closechat.addEventListener('click', () => {
        chatbotElement.classList.remove('active');
        popcornImage.classList.remove("hidden");
    });
}

function changerImage(image) {
    var nouvelleSource = "assets/images/popcorn.png";
    image.src = nouvelleSource;
    image.style.height = "200px";
    image.style.height = "200px";
}
function changerImage2(image) {
    var nouvelleSource = "assets/images/popcorn-vierge.png";
    image.src = nouvelleSource;
    image.style.height = "100px";
}