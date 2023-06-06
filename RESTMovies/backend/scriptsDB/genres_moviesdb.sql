/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
DROP TABLE IF EXISTS genres;
CREATE TABLE `genres` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `genre` varchar(255) DEFAULT NULL COMMENT 'Genre',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COMMENT='Genres table';
INSERT INTO genres(id,genre) VALUES(1,'Comedy'),(2,'Fantasy'),(3,'Crime'),(4,'Drama'),(5,'Music'),(6,'Adventure'),(7,'History'),(8,'Thriller'),(9,'Animation'),(10,'Family'),(11,'Mystery'),(12,'Biography'),(13,'Action'),(14,'Film-Noir'),(15,'Romance'),(16,'Sci-Fi'),(17,'War'),(18,'Western'),(19,'Horror'),(20,'Musical'),(21,'Sport');