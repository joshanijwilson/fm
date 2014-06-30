# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.17)
# Database: fleet_manager
# Generation Time: 2014-06-18 04:50:05 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table attachments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `attachments`;

CREATE TABLE `attachments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) unsigned NOT NULL,
  `type` char(4) NOT NULL,
  `size` int(11) NOT NULL,
  `description` text,
  `content` mediumblob NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attachments_reservation_id` (`reservation_id`),
  CONSTRAINT `attachments_reservation_id` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table car_models
# ------------------------------------------------------------

DROP TABLE IF EXISTS `car_models`;

CREATE TABLE `car_models` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table cars
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cars`;

CREATE TABLE `cars` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `vin` char(17) NOT NULL,
  `spz` char(10) NOT NULL,
  `model_id` int(11) unsigned NOT NULL,
  `model_year` year(4) NOT NULL,
  `name` varchar(100) NOT NULL,
  `engine_displacement` int(11) NOT NULL,
  `transmission` enum('AUTO','MANUAL') NOT NULL DEFAULT 'AUTO',
  `color` char(30) NOT NULL DEFAULT '',
  `equipment` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cars_model_id` (`model_id`),
  CONSTRAINT `cars_model_id` FOREIGN KEY (`model_id`) REFERENCES `car_models` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table customers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL DEFAULT '',
  `last_name` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(12) DEFAULT NULL,
  `company` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table reservations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `reservations`;

CREATE TABLE `reservations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) unsigned NOT NULL,
  `car_id` int(11) unsigned NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `reason` int(10) unsigned NOT NULL DEFAULT '0',
  `note` text,
  `created_at` timestamp NOT NULL DEFAULT 0,
  `created_by` int(11) unsigned NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reservations_car_id` (`car_id`),
  KEY `reservations_created_by` (`created_by`),
  KEY `reservations_customer_id` (`customer_id`),
  CONSTRAINT `reservations_car_id` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  CONSTRAINT `reservations_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `reservations_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL DEFAULT '',
  `first_name` varchar(50) NOT NULL DEFAULT '',
  `last_name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
