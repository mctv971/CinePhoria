<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" type="text/css" href="chat.css">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap" rel="stylesheet">
  <title>Chat Bot</title>
  <link>
</head>

<body>
  <div class="msger">
    <header class="msger-header">
      <div class="msger-header-title">
        <i class="fas fa-comment-alt"></i> Chat avec Pop Corn
      </div>
      <div class="msger-header-options">
        <span><i class="fas fa-cog"></i></span>
      </div>
    </header>

    <main class="msger-chat" id="chat-box">
      <!-- Messages seront ajoutés ici par JavaScript -->
    </main>

    <form class="msger-inputarea" id="message-form">
      <input type="text" class="msger-input" id="message-input" placeholder="Saisissez votre message...">
      <button type="submit" class="msger-send-btn">Envoyer</button>
    </form>

    <!-- ... (le reste du code HTML) ... -->

<script>
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
        return responseData.bot_message;
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
</script>
  </div>
</body>

</html>
