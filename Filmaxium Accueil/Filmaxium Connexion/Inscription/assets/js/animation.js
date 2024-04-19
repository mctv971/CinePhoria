function initPage() {
    document.getElementById('arrowButton').addEventListener('click', function() {
        var usernameInput = document.getElementById('usernameInput').value; 
        var usernameLink = document.querySelector('a[href="formulaire.php?username="]');
        
        usernameLink.href = "formulaire.php?username=" + encodeURIComponent(usernameInput);
        
        var usernamePrompt = document.getElementById('usernamePrompt');
        var arrowButton = document.getElementById('arrowButton');
        
        usernameInput.style.display = 'block';
        usernamePrompt.style.display = 'block';
        
        arrowButton.style.display = 'none';
    });

    var elements = [
        {id: 'inscriptionTextContainer', delay: 6000},
        {id: 'assistantText', delay: 6000},
        {id: 'guideText', delay: 6000},
        {id: 'Oups', delay: 6000},
        {id: 'usernameInput', delay: 999999},
        {id: 'arrowButton', delay: 999999},
       
    ];

    function displayElements(index) {
        if (index < elements.length) {
            var element = elements[index];
            document.getElementById(element.id).style.display = 'block';

            if (element.id === 'guideText') {
                var secondAnimation = document.getElementById('secondAnimation');
                
                document.getElementById('inscriptionAnimation').style.display = 'none';
                secondAnimation.style.display = 'block';

            } else if (element.id === 'Oups') {
                var thirdAnimation = document.getElementById('thirdAnimation');
                
                var secondAnimation = document.getElementById('secondAnimation');
                secondAnimation.style.display = 'none';
                thirdAnimation.style.display = 'block';
            }
            else if (element.id === 'usernameInput') {
                
                var finalAnimation = document.getElementById('finalAnimation');
                var button = document.getElementById('arrowButton')
                
                var thirdAnimation = document.getElementById('thirdAnimation');
                thirdAnimation.style.display = 'none';
                finalAnimation.style.display = 'block';
                button.style.display = 'block'
            }

            setTimeout(function() {
                document.getElementById(element.id).style.display = 'none';
                displayElements(index + 1);
            }, element.delay);
        }
    }

    document.getElementById('inscriptionTextContainer').style.display = 'block';
    displayElements(1);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé');
});