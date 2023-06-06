/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/ moviesdb /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE moviesdb;

DROP TABLE IF EXISTS genres;
CREATE TABLE `genres` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `genre` varchar(255) DEFAULT NULL COMMENT 'Genre',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Genres table';

DROP TABLE IF EXISTS movies;
CREATE TABLE `movies` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `title` varchar(255) DEFAULT NULL COMMENT 'Title',
  `imdb_rating` varchar(255) DEFAULT NULL COMMENT 'IMDb rating',
  `release_year` varchar(255) DEFAULT NULL COMMENT 'Release Info: year',
  `genres_id` int(11) DEFAULT NULL COMMENT 'FK to genres',
  PRIMARY KEY (`id`),
  KEY `genres_id` (`genres_id`),
  CONSTRAINT `movies_ibfk_1` FOREIGN KEY (`genres_id`) REFERENCES `genres` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Movie table';