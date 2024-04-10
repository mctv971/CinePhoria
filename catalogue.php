<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 
    - primary meta tags
  -->
  <title>Filmaxium</title>
  <meta name="title" content="Filmaxium">
  <meta name="description" content="Filmaxium is a popular movie app">

  <!-- 
    - favicon
  -->
  <link rel="shortcut icon" href="./favicon.svg" type="image/svg+xml">

  <!-- 
    - google font link
  -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap" rel="stylesheet">

  <!-- 
    - custom css link
  -->
  <link rel="stylesheet" href="./assets/css/style.css">

  <!-- 
    - custom js link
  -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="./assets/js/global.js" defer></script>
  <script src="./assets/js/catalogue.js" type="module"></script>

</head>

<body>

  <!-- 
    - #HEADER
  -->

  <header class="header">

    <a href="./index.php" class="logo">
      <img src="./assets/images/logo.png" width="140" height="32" alt="Filmaxium home">
    </a>


    <div class="search-box" search-box>
      <div class="search-wrapper" search-wrapper>
        <input type="text" name="search" aria-label="search movies" placeholder="Search any movies..."
          class="search-field" autocomplete="off" search-field>

        <img src="./assets/images/search.png" width="24" height="24" alt="search" class="leading-icon">
      </div>

      <button class="search-btn" search-toggler>
        <img src="./assets/images/close.png" width="24" height="24" alt="close search box">
      </button>
    </div>

    <button class="search-btn" search-toggler menu-close>
      <img src="./assets/images/search.png" width="24" height="24" alt="open search box">
    </button>

    <button class="menu-btn" menu-btn menu-toggler>
      <img src="./assets/images/menu.png" width="24" height="24" alt="open menu" class="menu">
      <img src="./assets/images/menu-close.png" width="24" height="24" alt="close menu" class="close">
    </button>
    <div class="logo-right">
      <a href="./catalogue.php">
        <img src="./assets/images/logo-catalogue.png" width="60" height="60" alt="Catalogue">
      </a>
      <a href="./index.php">
        <img src="./assets/images/logo-film.png" width="60" height="60" alt="Find Film">
      </a>
      <a href="analyse.php">
        <img src="./assets/images/logo-stats.png" width="60" height="60" alt="Analytics home">
      </a>
      <a href="./index.php">
        <img src="./assets/images/logo-profil.png" width="60" height="60" alt="Profil">
      </a>
    </div>

    

  </header>




  <main class="catalogue-main">
    <!-- 
      - #SIDEBAR
    -->

    <nav class="sidebar" sidebar>
    </nav>

    <div class="overlay" overlay menu-toggler></div>







    <article class="container" page-content>
      <!-- 
      - #SIDEBAR
    -->







      
    </article>
  </main>

</body>

</html>