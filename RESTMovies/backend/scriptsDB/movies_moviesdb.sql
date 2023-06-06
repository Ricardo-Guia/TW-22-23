/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='Movie table';
INSERT INTO movies(id,title,imdb_rating,release_year,genres_id) VALUES(1,'Jumanji','7.0','1995',6),(2,'Jumanji: Welcome to the Jungle','6.9','2017',13),(3,'The Maze Runner','6.8','2014',13),(4,'The Martian','8.0','2015',6),(5,'Coco','8.4','2017',9),(6,'Knowing','6.2','2009',13),(7,'The Village','6.5','2004',4),(8,'Alien','8.4','1979',19);