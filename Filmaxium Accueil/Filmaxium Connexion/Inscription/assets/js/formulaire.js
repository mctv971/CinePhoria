document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.icones img');
    console.log(icons.length + " icons found");  // This should match the number of your images

    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            icon.classList.toggle('selected');
            console.log(icon.id + " toggled. Selected: " + icon.classList.contains('selected')); // This logs every click
        });
    });

    // Handle platform selection

    // Form submission handling
    $('#inscriptionForm').submit(function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        var platforms = [];

        $('.icones img.selected').each(function() {
            platforms.push($(this).data('platform-id'));
            console.log("Selected platform ID: ", $(this).data('platform-id')); // Confirming selection
        });

        formData += '&platforms=' + platforms.join(',');

        console.log("Final formData: ", formData); // Debug output to check formData content

        $.ajax({
            type: 'POST',
            url: 'assets/php/enregistrement.php',
            data: formData,
            success: function (response) {
                console.log("Server response: ", response);
                alert('Registration successful!');
            },
            error: function () {
                alert('Registration failed. Please try again.');
            }
        });
    });
});
