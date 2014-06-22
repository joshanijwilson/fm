# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.17)
# Database: fleet_manager
# Generation Time: 2014-06-21 17:54:00 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table car_models
# ------------------------------------------------------------

LOCK TABLES `car_models` WRITE;
/*!40000 ALTER TABLE `car_models` DISABLE KEYS */;

INSERT INTO `car_models` (`id`, `name`)
VALUES
	(152,'V40 CC'),
	(153,'S80'),
	(154,'V60'),
	(155,'S60'),
	(156,'XC70'),
	(157,'XC60');

/*!40000 ALTER TABLE `car_models` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table cars
# ------------------------------------------------------------

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;

INSERT INTO `cars` (`id`, `vin`, `spz`, `model_id`, `model_year`, `name`, `engine_displacement`, `transmission`, `color`, `equipment`)
VALUES
	(8,'0','3SD3488',156,'2014','XC70 D4 DRIVE -E',0,'AUTO','',3),
	(9,'0','3SA9637',153,'2014','S80 D5 AWD',0,'AUTO','',3),
	(10,'0','2SV4407',152,'2014','V40 D2 CROSS COUNTRY',0,'MANUAL','',3),
	(11,'0','2SY1290',154,'2014','V60 D4 DRIVE -E',0,'AUTO','',3),
	(12,'0','3SA8339',155,'2014','S60 D4 DRIVE -E',0,'AUTO','',3),
	(13,'0','2SY1661',156,'2014','XC70 D5 AWD',0,'AUTO','',3),
	(14,'0','XXXXXXX',157,'2014','XC60 D4 DRIVE - E',0,'AUTO','',3);

/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`)
VALUES
	(1,'vojta.jina@gmail.com','Vojta','Jína'),
	(2,'ondrej.svingal@gmail.com','Ondřej','Švingal');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
