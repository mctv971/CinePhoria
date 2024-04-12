<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" type="text/css" href="chat.css">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap" rel="stylesheet">
  <script src="chat.js"></script>
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

  </div>
</body>

</html>