-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : dim. 21 avr. 2024 à 20:03
-- Version du serveur : 5.7.39
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `Filmaxium2`
--

-- --------------------------------------------------------

--
-- Structure de la table `api_keys`
--

CREATE TABLE `api_keys` (
  `id` int(11) NOT NULL,
  `service` varchar(50) NOT NULL,
  `api_key` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `api_keys`
--

INSERT INTO `api_keys` (`id`, `service`, `api_key`) VALUES
(1, 'CHATGPT', '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'),
(2, 'TMDB', '4bff542b068c0fff85589d72c363051d'),
(3, 'IMDB', '4af10acecamsh208e06566c5c57dp183d71jsnd3b78c58d16e');

-- --------------------------------------------------------

--
-- Structure de la table `Commentaire`
--

CREATE TABLE `Commentaire` (
  `id_commentaire` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_commentaire_parent` int(11) NOT NULL,
  `id_type` int(11) NOT NULL,
  `imdb_id` varchar(20) NOT NULL,
  `contenu` text NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Favoris`
--

CREATE TABLE `Favoris` (
  `id_favoris` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_type` varchar(20) NOT NULL,
  `imdb_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Favoris`
--

INSERT INTO `Favoris` (`id_favoris`, `id_user`, `id_type`, `imdb_id`) VALUES
(14, 8, 'tv', '456'),
(23, 8, 'tv', '2692'),
(24, 8, 'tv', '2004'),
(25, 8, 'tv', '1668'),
(26, 8, 'tv', '110316'),
(27, 8, 'movie', '14160'),
(28, 8, 'movie', '10009'),
(29, 8, 'movie', '126963'),
(30, 8, 'movie', '3170'),
(31, 8, 'movie', '315162');

-- --------------------------------------------------------

--
-- Structure de la table `Note`
--

CREATE TABLE `Note` (
  `id_note` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_type` int(11) NOT NULL,
  `imdb_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Plateforme_Users`
--

CREATE TABLE `Plateforme_Users` (
  `id_enregistrement` int(11) NOT NULL,
  `plateforme_id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Plateforme_Users`
--

INSERT INTO `Plateforme_Users` (`id_enregistrement`, `plateforme_id`, `id_user`) VALUES
(1, 8, 39),
(2, 283, 39),
(3, 8, 40),
(4, 283, 40),
(5, 8, 41),
(6, 283, 41),
(7, 337, 42),
(8, 2, 42),
(9, 337, 43),
(10, 2, 43),
(11, 8, 44),
(12, 283, 44),
(13, 337, 45),
(14, 2, 45);

-- --------------------------------------------------------

--
-- Structure de la table `Recherche`
--

CREATE TABLE `Recherche` (
  `id_recherche` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_type` int(11) NOT NULL,
  `imdb_id` varchar(20) NOT NULL,
  `contenu` text NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Type`
--

CREATE TABLE `Type` (
  `id_type` int(11) NOT NULL,
  `nom_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `naissance` date NOT NULL,
  `mail` varchar(100) NOT NULL,
  `mdp` varchar(100) NOT NULL,
  `pays` varchar(50) NOT NULL,
  `demo` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Users`
--

INSERT INTO `Users` (`id_user`, `username`, `nom`, `prenom`, `naissance`, `mail`, `mdp`, `pays`, `demo`) VALUES
(2, 'LightAkabane', 'Akabane', 'Light', '2002-05-06', 'ya.benosmane@gmail.com', '$2y$10$Q1I9YKXk9FDRKvUJqBaoue4LWf.G/f1hivi/88yn7JPiNy4Yune0C', 'France', 0),
(7, 'LightBabanks', 'Karma', 'Akabane', '2024-04-01', 'li.aka@gmail.com', '$2y$10$4dNVK/8owPRV0xS7qkUt3eL.GBfv9fGFXi9JKGsttxciYjxzLd4ku ', 'Fr', 0),
(8, 'test', 'test', 'test', '2024-04-15', 'test.test@gmail.com', '$2y$10$Bc7gvjlqC15vmPJgQcbszegPZezePur0kZ3dYQpaphByB/6XkNtvu', 'France', 1),
(12, 'Light', 'zaezre', 'aezrtr', '2002-11-11', 'A.A@GMAIL.COM', '$2y$10$N5cVLnOWLsChpCYEwMkWKuxZuzDCOyXugehifQmat4J25BOgT4fPm', 'fr', 0),
(13, 'LILI', 'light', 'Akaba', '2001-11-11', 'li.li@gmail.com', '$2y$10$7elDyt0jjjeZ01QHKikqLO7vZZXAiXyFg/M17Wr0Z2f9gLwDSsXLO', 'fr', 0),
(23, 'Yacmenace', 'TYUI', 'TYUI', '2001-11-11', 'y.y@gmail.com', '$2y$10$Xj0moCKGSSTM7ok4GHMqqOCOl7T5OgmfIPKCEeAp3Vldrn7CdgS2.', 'fr', 0),
(26, 'Yacinou', 'rtyui', 'dfghjk', '2001-11-11', 'd.d@gmail.com', '$2y$10$okAXCJVyKxhY9hAxKcT1e.4rV7DyucgaZTjHjUZDIsuEcNpCBsrlS', 'fr', 0),
(29, 'ztendecr', 'RTY', 'RTYU', '2001-02-11', 'a.a@gmail.com', '$2y$10$gUfCmw.eGSKABJQQeEKEMu7os8AZ2/ePIfHkWGWTD47yaCiPWx5Na', 'fr', 0),
(30, 'fgyuyt', 'ertyu', 'ertyui', '2001-11-11', 't.t@gmail.com', '$2y$10$ZmiVcGtkukoraoyFC3c/nehOR7dag8eLOn2ZWwMIDi8nx/qs68xp2', 'fr', 0),
(31, 'dcfvgbhn', 'dfghj', 'fghj', '2001-11-11', 'y.y@gmail.com', '$2y$10$kHHnKSz12ww70a4PrlbpUeYPk10RygsRa8SkqRI/CggBYwsugZCLu', 'fr', 0),
(32, 'gzdhejf', 'erftyu', 'ertyu', '2001-11-11', 'y.u@gmail.com', '$2y$10$j17RU.HE6VkyZIBUyYT1su01DSq/4wPMpusUs01WCbGCwRYvXLmYy', 'fr', 0),
(33, 'Rde', 'sdfgh', 'fghj', '2001-11-11', 'y.t@gmail.com', '$2y$10$XXmlfzJUgU9PJK.sHWQ5jeJIcynYy.Z87sXTvU/X1ufhBw8kJmEDO', 'fr', 0),
(34, 'rtyu', 'fgh', 'rghj', '2001-11-11', 'd.d@gmail.com', '$2y$10$MQxJcPBlKhe4gXPx89yeT.WSInv194GkGSMASyg75WMZYqbCUwHaC', 'fr', 0),
(35, 'rtyu', 'vghde', 'gbdj', '2001-11-11', 'y.b@gmail.com', '$2y$10$EJ0hhC/6hfqta5eR3AmfB.JfLjV8mIJtm8pIZJ78M9oVFhAcCujbi', 'fr', 0),
(39, 'Light', 'FGHJ', 'FGHJ', '0001-11-11', 'a.a@gmail.com', '$2y$10$NIfNK.25dg9AcAt2IfOTWex62KxOnFdz2lXf7VmZdIcM73nLVGkre', 'fr', 0),
(40, 'Light', 'zderf', 'erre', '2012-12-11', 'a.a@gmail.com', '$2y$10$5siuRCOZsiQZEZ5zmc0wqOZOgLVAY4X3c0Xsur3gINrqVY295bdXK', 'fr', 0),
(41, 'Light', 'defr', 'zrfevrg', '2001-11-11', 'e.re@gmail.com', '$2y$10$YJ0kZONLL7Sf746Dn/cllO3MM6YQr9sgxd1Bg3Nw/rjj7NUDEpxxe', 'fr', 0),
(42, 'Light', 'zde', 'edzrf', '2001-11-11', 'a.a@gmail.com', '$2y$10$YYXGM5K4CXEpkTZQPDwyzuAvhwzeYBZBdFKMWJm9vimxqwdLdfULC', 'fr', 0),
(43, 'Light', 'azdefr', 'eqzre', '2001-11-11', 'ea.ea@gmail.com', '$2y$10$dsuK/s.ZQaL7Y23HNDebmeFlJHd4LFxAr0fFr1fS/DUr2uOH6wXeC', 'fr', 0),
(44, 'Light', 'Erty', 'RTY', '2001-11-11', 'y.y@gmail.com', '$2y$10$8CdvBPf8Ue/D5Qc8lD35IOTC4.2KjfBDscR7/L90zmZaADLAMGk1C', 'fr', 0),
(45, 'Yaclamenaceuh', 'erv', 'ezv', '2002-11-11', 'y.eby@gmail.com', '$2y$10$L8TgTLYpM.fr6fiK8YWUS.1UuqJQbAl0J3AEAxPOYyY6HxBal6y5y', 'fr', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `api_keys`
--
ALTER TABLE `api_keys`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Commentaire`
--
ALTER TABLE `Commentaire`
  ADD PRIMARY KEY (`id_commentaire`);

--
-- Index pour la table `Favoris`
--
ALTER TABLE `Favoris`
  ADD PRIMARY KEY (`id_favoris`);

--
-- Index pour la table `Note`
--
ALTER TABLE `Note`
  ADD PRIMARY KEY (`id_note`);

--
-- Index pour la table `Plateforme_Users`
--
ALTER TABLE `Plateforme_Users`
  ADD PRIMARY KEY (`id_enregistrement`);

--
-- Index pour la table `Recherche`
--
ALTER TABLE `Recherche`
  ADD PRIMARY KEY (`id_recherche`);

--
-- Index pour la table `Type`
--
ALTER TABLE `Type`
  ADD PRIMARY KEY (`id_type`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `api_keys`
--
ALTER TABLE `api_keys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `Commentaire`
--
ALTER TABLE `Commentaire`
  MODIFY `id_commentaire` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Favoris`
--
ALTER TABLE `Favoris`
  MODIFY `id_favoris` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pour la table `Note`
--
ALTER TABLE `Note`
  MODIFY `id_note` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Plateforme_Users`
--
ALTER TABLE `Plateforme_Users`
  MODIFY `id_enregistrement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `Recherche`
--
ALTER TABLE `Recherche`
  MODIFY `id_recherche` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
