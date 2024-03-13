document.addEventListener('DOMContentLoaded', function () {
    const chatBox = document.getElementById('chat-box');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');

    messageForm.addEventListener('submit', async function (e) {

      e.preventDefault();
      const userMessage = messageInput.value.trim();
      if (userMessage !== '') {
        appendMessage('left-msg', 'Utilisateur', userMessage);
        // Envoyer la requête Ajax pour obtenir la réponse de ChatGPT-3
        const botMessage = await sendToServer(userMessage);
        appendMessage('right-msg', 'PopCorn', botMessage);
        messageInput.value = '';
      }
    });

    function appendMessage(className, name, text) {
          const msgHTML = `
            <div class="msg ${className}">
              <div class="msg-img${className === 'left-msg' ? 'Utilisateur' : 'PopCorn'}"></div>
              <div class="msg-bubble">
                <div class="msg-info">
                  <div class="msg-info-name">${name}</div>
                  <div class="msg-info-time">${getCurrentTime()}</div>
                </div>
                <div class="msg-text">${text}</div>
              </div>
            </div>
          `;
          chatBox.insertAdjacentHTML('beforeend', msgHTML);
          chatBox.scrollTop = chatBox.scrollHeight;
        }

        async function sendToServer(message) {
  try {
    const response = await fetch('ton_serveur.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'message=' + encodeURIComponent(message),
    });

    const responseData = await response.json();
    
    console.log('Réponse du serveur :', responseData);  // Ajoutez cette ligne pour débogage

    if (responseData && responseData.bot_message !== undefined) {
      return responseData.bot_message;
    } else {
      console.error('Réponse invalide du serveur:', responseData);
      return 'Désolé, une réponse invalide a été reçue du serveur.';
    }
  } catch (error) {
    console.error('Erreur lors de la communication avec le serveur:', error);
    return 'Désolé, une erreur s\'est produite lors de la communication avec le serveur.';
  }
}

    function getCurrentTime() {
          const now = new Date();
          const hours = now.getHours().toString().padStart(2, '0');
          const minutes = now.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }

  });