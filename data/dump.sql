-- Adminer 4.8.1 MySQL 9.2.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `forums`;
CREATE TABLE `forums` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `forums` (`id`, `name`, `description`) VALUES
(1,	'Forum de programmation',	'Discussions sur le développement de logiciels et la programmation informatique.'),
(2,	'Forum de jeux vidéo',	'Espace dédié aux discussions sur les jeux vidéo de tous genres.'),
(3,	'Forum de technologie',	'Pour parler des dernières innovations technologiques et des gadgets.'),
(4,	'Forum général',	'Discussions sur tout et n\'importe quoi.'),
(5,	'Forum de cinéma',	'Pour les fans de cinéma et de séries.');

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sujet_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` text,
  PRIMARY KEY (`id`),
  KEY `sujet_id` (`sujet_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sujet_id`) REFERENCES `sujets` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `messages` (`id`, `sujet_id`, `user_id`, `content`, `created_at`) VALUES
(1,	1,	2,	'JavaScript est un langage très populaire et facile à apprendre pour les débutants.',	'2025-04-27T10:15:00'),
(2,	1,	3,	'Oui, il est utilisé dans le développement web, mais aussi pour des applications mobiles avec React Native.',	'2025-04-27T10:20:00'),
(3,	2,	1,	'Je dirais \"Elden Ring\". Un jeu très acclamé par la critique en 2025.',	'2025-04-27T11:05:00'),
(4,	2,	2,	'Je pense que \"The Legend of Zelda: Tears of the Kingdom\" est encore le meilleur.',	'2025-04-27T11:10:00'),
(5,	3,	1,	'L\'IA évolue rapidement, c\'est incroyable de voir où ça va nous mener dans les prochaines années.',	'2025-04-27T12:05:00'),
(6,	3,	4,	'Oui, surtout avec l\'apprentissage automatique et les réseaux neuronaux.',	'2025-04-27T12:10:00'),
(7,	4,	2,	'Je trouve que le meilleur moyen d\'être plus productif est de définir des priorités et d\'organiser son temps.',	'2025-04-27T13:05:00'),
(8,	4,	3,	'Une bonne méthode est la technique Pomodoro, elle aide à se concentrer sur de courtes périodes avec des pauses régulières.',	'2025-04-27T13:15:00'),
(9,	5,	1,	'Je pense que \"Blade Runner 2049\" est l\'un des meilleurs films de science-fiction des dernières années.',	'2025-04-27T14:05:00'),
(10,	5,	4,	'Je recommande aussi \"Interstellar\". Un film fascinant sur l\'espace et le temps.',	'2025-04-27T14:10:00');

DROP TABLE IF EXISTS `sujets`;
CREATE TABLE `sujets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `forum_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` text,
  PRIMARY KEY (`id`),
  KEY `forum_id` (`forum_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sujets_ibfk_1` FOREIGN KEY (`forum_id`) REFERENCES `forums` (`id`),
  CONSTRAINT `sujets_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `sujets` (`id`, `content`, `forum_id`, `title`, `user_id`, `created_at`) VALUES
(1,	'Discussion sur les bases du langage JavaScript, variables, boucles, fonctions...',	1,	'Les bases de JavaScript',	1,	'2025-04-27T10:00:00'),
(2,	'Partagez vos jeux préférés de l\'année 2025.',	2,	'Quel est le meilleur jeu de l\'année 2025 ?',	2,	'2025-04-27T11:00:00'),
(3,	'Les dernières recherches et découvertes en Intelligence Artificielle.',	3,	'Les avancées en IA',	3,	'2025-04-27T12:00:00'),
(4,	'Astuces et conseils pour travailler plus efficacement.',	4,	'Comment améliorer sa productivité ?',	4,	'2025-04-27T13:00:00'),
(5,	'Quel est le meilleur film de science-fiction à voir ? Débattez ici !',	5,	'Les meilleurs films de science-fiction',	2,	'2025-04-27T14:00:00');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1,	'admin',	'$2b$10$NFf.tS1Sr3Ft/mhFE/oOTOHAMEm6zdzG9Hz8ZIMa8kcyT4EbmrT8a',	'admin'),
(2,	'victor',	'$2b$10$4huZWlKzkJpNA5xJodLBfeDiEc/a4Hi0bKz.a5ZIV94MxWTCiXfJO',	'user'),
(3,	'celie',	'$2b$10$rLIuf4t0XchKAwFcUHSnEeYubpYvQjrbpqiBaK5fbCvJTkMULKY5e',	'user'),
(4,	'nino',	'$2b$10$JGVydBqpZx14Wpa096gIu.pdTZsrfn6xT2DFqhHNwCjsPJ/X458I6',	'user'),
(5,	'jennah',	'$2b$10$teoZFExT78P7FDJGcbPK0OqefVDQfHeGb/YRyO9CjdDIFYbPp0bfq',	'user');

-- 2025-04-27 19:04:34
