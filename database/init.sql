-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: pack_informatique_tgr
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `historique_affectations`
--

DROP TABLE IF EXISTS `historique_affectations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historique_affectations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `materiel_type` enum('pc','imprimante','scanner') NOT NULL,
  `materiel_id` int NOT NULL,
  `utilisateur_id` int NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `raison_fin` enum('changement','panne','reforme','autre') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `historique_affectations_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historique_affectations`
--

LOCK TABLES `historique_affectations` WRITE;
/*!40000 ALTER TABLE `historique_affectations` DISABLE KEYS */;
/*!40000 ALTER TABLE `historique_affectations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imprimantes`
--

DROP TABLE IF EXISTS `imprimantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imprimantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marque` varchar(100) NOT NULL,
  `modele` varchar(100) NOT NULL,
  `numero_serie` varchar(100) NOT NULL,
  `numero_inventaire` varchar(100) NOT NULL,
  `date_livraison` date NOT NULL,
  `date_achat` date DEFAULT NULL,
  `date_fin_contrat_maintenance` date DEFAULT NULL,
  `statut` enum('en_service','en_panne','en_maintenance','reforme') DEFAULT 'en_service',
  `perception_id` int NOT NULL,
  `utilisateur_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_serie` (`numero_serie`),
  UNIQUE KEY `numero_inventaire` (`numero_inventaire`),
  KEY `perception_id` (`perception_id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `imprimantes_ibfk_1` FOREIGN KEY (`perception_id`) REFERENCES `perceptions` (`id`),
  CONSTRAINT `imprimantes_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imprimantes`
--

LOCK TABLES `imprimantes` WRITE;
/*!40000 ALTER TABLE `imprimantes` DISABLE KEYS */;
INSERT INTO `imprimantes` VALUES (1,'HP','LaserJet Pro M404dn','HPLJM4041111','INV-IMP-001','2023-01-20','2023-01-15','2025-01-15','en_service',1,NULL,'2025-10-20 00:31:42'),(2,'CANON','i-SENSYS MF644Cdw','CNMF6442222','INV-IMP-002','2023-02-25','2023-02-20','2025-02-20','en_service',2,NULL,'2025-10-20 00:31:42'),(3,'BROTHER','DCP-L2550DW','BRDCP2550333','INV-IMP-003','2023-03-15','2023-03-10','2025-03-10','reforme',3,NULL,'2025-10-20 00:31:42');
/*!40000 ALTER TABLE `imprimantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interventions`
--

DROP TABLE IF EXISTS `interventions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interventions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `materiel_type` enum('pc','imprimante','scanner') NOT NULL,
  `materiel_id` int NOT NULL,
  `type_intervention` enum('panne','maintenance','mise_a_jour') NOT NULL,
  `description` text,
  `date_intervention` date NOT NULL,
  `statut` enum('en_cours','resolu','en_attente') DEFAULT 'en_cours',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interventions`
--

LOCK TABLES `interventions` WRITE;
/*!40000 ALTER TABLE `interventions` DISABLE KEYS */;
/*!40000 ALTER TABLE `interventions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pc`
--

DROP TABLE IF EXISTS `pc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pc` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marque` varchar(100) NOT NULL,
  `modele` varchar(100) NOT NULL,
  `numero_serie` varchar(100) NOT NULL,
  `numero_inventaire` varchar(100) NOT NULL,
  `date_livraison` date NOT NULL,
  `date_achat` date DEFAULT NULL,
  `date_fin_contrat_maintenance` date DEFAULT NULL,
  `statut` enum('en_service','en_panne','en_maintenance','reforme') DEFAULT 'en_service',
  `perception_id` int NOT NULL,
  `utilisateur_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_serie` (`numero_serie`),
  UNIQUE KEY `numero_inventaire` (`numero_inventaire`),
  KEY `perception_id` (`perception_id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `pc_ibfk_1` FOREIGN KEY (`perception_id`) REFERENCES `perceptions` (`id`),
  CONSTRAINT `pc_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pc`
--

LOCK TABLES `pc` WRITE;
/*!40000 ALTER TABLE `pc` DISABLE KEYS */;
INSERT INTO `pc` VALUES (1,'DELL','OptiPlex 7070','DLX707012345','INV-PC-001','2023-01-15','2023-01-10','2025-01-10','en_service',1,1,'2025-10-20 00:31:42'),(2,'HP','ProDesk 600 G6','HPPD60067890','INV-PC-002','2023-02-20','2023-02-15','2025-02-15','en_service',1,2,'2025-10-20 00:31:42'),(3,'LENOVO','ThinkCentre M75s','LNTCM7598765','INV-PC-003','2023-03-10','2023-03-05','2025-03-05','en_panne',2,3,'2025-10-20 00:31:42'),(4,'DELL','Latitude 5420','DLL542043210','INV-PC-004','2023-04-05','2023-04-01','2025-04-01','en_maintenance',3,4,'2025-10-20 00:31:42');
/*!40000 ALTER TABLE `pc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perceptions`
--

DROP TABLE IF EXISTS `perceptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perceptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom` (`nom`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perceptions`
--

LOCK TABLES `perceptions` WRITE;
/*!40000 ALTER TABLE `perceptions` DISABLE KEYS */;
INSERT INTO `perceptions` VALUES (1,'Ouarzazate','OUA','Centre Ville, Ouarzazate','0524881234','2025-10-20 00:31:42'),(2,'Boumalne Dades','BMD','Centre Boumalne Dades','0524885678','2025-10-20 00:31:42'),(3,'Tinghir','TNG','Centre Tinghir','0524889012','2025-10-20 00:31:42'),(4,'Zagora','ZGR','Centre Zagora','0524883456','2025-10-20 00:31:42'),(5,'Trésorerie Provinciale Ouarzazate','TP_OUA','Hay Al Wahda, Ouarzazate','0524887890','2025-10-20 00:31:42');
/*!40000 ALTER TABLE `perceptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responsables`
--

DROP TABLE IF EXISTS `responsables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `responsables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super_admin','responsable_tgr') DEFAULT 'responsable_tgr',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responsables`
--

LOCK TABLES `responsables` WRITE;
/*!40000 ALTER TABLE `responsables` DISABLE KEYS */;
INSERT INTO `responsables` VALUES (1,'Admin','TGR','admin@tgr.ma','$2y$10$1YfHj58VKVKbVGUEzKjC0.Ma5fcFipPhdlOrK/2UTmEIjyTDlHu.O','super_admin','2025-10-20 00:31:42'),(2,'Responsable','Informatique','responsable@tgr.ma','$2y$10$PvNrZSwGt04OieMvppWfCOElhnXjC5BOi1mKZc3LJxyaxWJfxXukC','responsable_tgr','2025-10-20 00:31:42');
/*!40000 ALTER TABLE `responsables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scanners`
--

DROP TABLE IF EXISTS `scanners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scanners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marque` varchar(100) NOT NULL,
  `modele` varchar(100) NOT NULL,
  `numero_serie` varchar(100) DEFAULT NULL,
  `numero_inventaire` varchar(100) DEFAULT NULL,
  `date_livraison` date DEFAULT NULL,
  `date_achat` date DEFAULT NULL,
  `statut` enum('en_service','en_panne','en_maintenance','reforme') DEFAULT 'en_service',
  `perception_id` int NOT NULL,
  `utilisateur_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `perception_id` (`perception_id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `scanners_ibfk_1` FOREIGN KEY (`perception_id`) REFERENCES `perceptions` (`id`),
  CONSTRAINT `scanners_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scanners`
--

LOCK TABLES `scanners` WRITE;
/*!40000 ALTER TABLE `scanners` DISABLE KEYS */;
INSERT INTO `scanners` VALUES (1,'FUJITSU','fi-7160','FJFI71604444','INV-SCAN-001','2023-01-25','2023-01-20','en_service',1,1,'2025-10-20 00:34:52'),(2,'CANON','DR-C240','CNDRC2405555','INV-SCAN-002','2023-02-28','2023-02-25','en_service',2,3,'2025-10-20 00:34:52');
/*!40000 ALTER TABLE `scanners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fonction` varchar(100) DEFAULT NULL,
  `perception_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `perception_id` (`perception_id`),
  CONSTRAINT `utilisateurs_ibfk_1` FOREIGN KEY (`perception_id`) REFERENCES `perceptions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
INSERT INTO `utilisateurs` VALUES (1,'ALAOUI','Mohammed','0612345678','m.alaoui@tgr.ma','Agent comptable',1,'2025-10-20 00:31:42'),(2,'BENNANI','Fatima','0623456789','f.bennani@tgr.ma','Chef de service',1,'2025-10-20 00:31:42'),(3,'CHAKIR','Hassan','0634567890','h.chakir@tgr.ma','Agent administratif',2,'2025-10-20 00:31:42'),(4,'DAOUDI','Amina','0645678901','a.daoudi@tgr.ma','Secrétaire',3,'2025-10-20 00:31:42'),(5,'EL FASSI','Karim','0656789012','k.elfassi@tgr.ma','Responsable financier',4,'2025-10-20 00:31:42'),(6,'MOUTAOUAKIL','Samira','0667890123','s.moutaouakil@tgr.ma','Agent de saisie',5,'2025-10-20 00:31:42');
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-24 10:56:30
