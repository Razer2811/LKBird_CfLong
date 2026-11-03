-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: botchim
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Bột chim'),(2,'Lồng chim'),(3,'Phụ kiện lồng'),(4,'Thuốc chuyên dụng'),(5,'Bột cá');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` date DEFAULT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double NOT NULL,
  `sku` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `variant_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock` int NOT NULL,
  `weight_gram` int NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq935p2d1pbjm39n0063ghnfgn` (`sku`),
  KEY `FKosqitn4s405cynmhb87lkvuau` (`product_id`),
  CONSTRAINT `FKosqitn4s405cynmhb87lkvuau` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,'2027-12-31',NULL,120000,'CAM-VVA-01','CAM-VVA-01',50,200,1),(2,'2027-12-31',NULL,130000,'CAM-VVA-02','CAM-VVA-02',45,200,2),(3,'2027-10-15',NULL,110000,'CAM-VVA-03','CAM-VVA-03',30,200,3),(4,'2027-12-31',NULL,125000,'CAM-VVA-04','CAM-VVA-04',60,200,4),(5,'2028-01-10',NULL,150000,'CAM-HDN-01','CAM-HDN-01',40,200,5),(6,'2028-01-10',NULL,150000,'CAM-HDN-02','CAM-HDN-02',35,200,6),(7,'2028-02-20',NULL,160000,'CAM-HDN-03','CAM-HDN-03',50,200,7),(8,'2028-03-01',NULL,170000,'CAM-HDN-04','CAM-HDN-04',25,200,8),(9,'2028-03-01',NULL,175000,'CAM-HDN-05','CAM-HDN-05',20,200,9),(10,'2027-11-20',NULL,140000,'CAM-NDN-01','CAM-NDN-01',55,200,10),(11,'2028-05-12',NULL,145000,'CAM-NDN-02','CAM-NDN-02',60,200,11),(12,'2027-09-30',NULL,135000,'CAM-QH-01','CAM-QH-01',40,200,12),(13,'2028-04-15',NULL,150000,'CAM-TMDN-01','CAM-TMDN-01',45,200,13),(14,'2028-04-15',NULL,155000,'CAM-TMDN-02','CAM-TMDN-02',30,200,14),(15,'2028-06-01',NULL,180000,'CAM-BBPT-01','CAM-BBPT-01',25,200,15),(16,'2028-06-01',NULL,200000,'CAM-BBPT-02','CAM-BBPT-02',20,200,16),(17,'2028-06-01',NULL,180000,'CAM-BBPT-03','CAM-BBPT-03',30,200,17),(18,'2027-08-20',NULL,95000,'CAM-TANC-01','CAM-TANC-01',70,500,18),(19,'2028-04-20',NULL,160000,'CAM-TMDN-03','CAM-TMDN-03',35,200,19),(20,'2028-04-20',NULL,165000,'CAM-TMDN-04','CAM-TMDN-04',25,200,20),(21,'2028-08-27',NULL,5000,'BOTCA-SH-01','BOTCA-SH-01',40,200,21),(22,'2028-08-27',NULL,5000,'BOTCA-SH-02','BOTCA-SH-02',40,200,22),(23,'2027-12-31',NULL,120000,'CAM-VVA-CC-01','CAM-VVA-CC-01',50,200,23),(24,'2027-12-31',NULL,125000,'CAM-VVA-CC-02','CAM-VVA-CC-02',45,200,24),(25,'2028-01-15',NULL,135000,'CAM-VVA-CC-03','CAM-VVA-CC-03',40,500,25),(26,'2028-08-27',NULL,35000,'BOTCA-LT-HM01','BOTCA-LT-HM01',50,100,26),(27,'2028-08-27',NULL,40000,'BOTCA-LT-HM02','BOTCA-LT-HM02',30,100,27),(28,'2028-08-27',NULL,65000,'BOTCA-VVA-HM01','BOTCA-VVA-HM01',25,500,28),(29,'2028-08-27',NULL,85000,'BOTCA-VVA-HM02','BOTCA-VVA-HM02',20,500,29),(30,'2028-08-27',NULL,35000,'CAM-LT-01','CAM-LT-01',50,100,26),(31,'2028-08-27',NULL,40000,'CAM-LT-02','CAM-LT-02',30,100,27),(32,'2028-08-27',NULL,65000,'CAM-VVA-05','CAM-VVA-05',25,500,28),(33,'2028-08-27',NULL,85000,'CAM-VVA-06','CAM-VVA-06',20,500,29),(34,'2028-08-27',NULL,35000,'CAM-HT-01','CAM-HT-01',50,100,30),(35,'2028-08-27',NULL,40000,'CAM-HT-02','CAM-HT-02',40,100,31),(36,'2028-08-27',NULL,35000,'CAM-SNT-01','CAM-SNT-01',45,100,32),(37,'2028-08-27',NULL,35000,'CAM-NH-01','CAM-NH-01',35,100,33),(38,'2028-08-27',NULL,40000,'CAM-NH-02','CAM-NH-02',30,100,34),(39,'2030-01-01',NULL,650000,'CAM-LONG-CM01','CAM-LONG-CM01',10,2500,35),(40,'2030-01-01',NULL,2500000,'CAM-LONG-CM02','CAM-LONG-CM02',3,3500,36),(41,'2030-01-01',NULL,1800000,'CAM-LONG-CM03','CAM-LONG-CM03',5,3000,37),(42,'2030-01-01',NULL,1500000,'CAM-LONG-CM04','CAM-LONG-CM04',6,3000,38),(43,'2030-01-01',NULL,850000,'CAM-LONG-KH01','CAM-LONG-KH01',8,1500,39),(44,'2030-01-01',NULL,900000,'CAM-LONG-KH02','CAM-LONG-KH02',7,1500,40),(45,'2030-01-01',NULL,450000,'CAM-LONG-KH03','CAM-LONG-KH03',12,1200,41),(46,'2030-01-01',NULL,3500000,'CAM-LONG-VUA01','CAM-LONG-VUA01',2,4000,42),(47,'2030-01-01',NULL,150000,'CAM-TAM-01','CAM-TAM-01',20,1000,43),(48,'2030-01-01',NULL,120000,'CAM-TAM-02','CAM-TAM-02',25,1200,44),(49,'2030-01-01',NULL,120000,'CAM-PK-CGM01','CAM-PK-CGM01',15,200,45),(50,'2030-01-01',NULL,80000,'CAM-PK-CGT01','CAM-PK-CGT01',30,150,46),(51,'2030-01-01',NULL,30000,'CAM-PK-GYN01','CAM-PK-GYN01',50,500,47),(52,'2030-01-01',NULL,50000,'CAM-PK-GYT01','CAM-PK-GYT01',40,1000,48),(53,'2030-01-01',NULL,65000,'CAM-PK-ATL01','CAM-PK-ATL01',25,300,49),(54,'2030-01-01',NULL,180000,'CAM-PK-MOC01','CAM-PK-MOC01',10,400,50),(55,'2030-01-01',NULL,150000,'CAM-PK-CX01','CAM-PK-CX01',12,450,51),(56,'2030-01-01',NULL,150000,'CAM-PK-CX02','CAM-PK-CX02',12,450,52),(57,'2030-01-01',NULL,90000,'CAM-PK-NAMG01','CAM-PK-NAMG01',20,100,53),(58,'2030-01-01',NULL,75000,'CAM-PK-NAMT01','CAM-PK-NAMT01',20,100,54),(59,'2030-01-01',NULL,45000,'CAM-PK-ONG01','CAM-PK-ONG01',30,80,55),(60,'2030-01-01',NULL,50000,'CAM-PK-ONG02','CAM-PK-ONG02',25,90,56),(61,'2030-01-01',NULL,35000,'CAM-PK-ROCG01','CAM-PK-ROCG01',40,50,57),(62,'2030-01-01',NULL,30000,'CAM-PK-ROCN01','CAM-PK-ROCN01',50,40,58),(63,'2028-12-31',NULL,95000,'CAM-TC-A99330','CAM-TC-A99330',30,380,59);
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `brand` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_bulky` bit(1) NOT NULL,
  `is_fragile` bit(1) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pet_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Vương Việt Anh','Cám dành cho chim chào mào.','vva1.jpg',_binary '\0',_binary '\0','Cám chào mào Vương Việt Anh - Dưỡng','Chào mào',1),(2,'Vương Việt Anh','Cám trứng dành cho chim chào mào.','vva2.jpg',_binary '\0',_binary '\0','Cám trứng chim Chào Mào Vương Việt Anh','Chào mào',1),(3,'Vương Việt Anh','Cám trứng dành cho chim chào mào con.','vva3.jpg',_binary '\0',_binary '\0','Cám trứng - Chim chào mào con Vương Việt Anh','Chào mào',1),(4,'Vương Việt Anh','Cám dành cho chim chào mào.','vva4.jpg',_binary '\0',_binary '\0','Cám chào mào Vương Việt Anh - Đấu','Chào mào',1),(5,'Hiệp Đồng Nai','Sản phẩm chuyên nghiệp dùng cho chim thi đấu, chim đã xong lông 80% trở lên và chim thi đấu giải.','dongnai1.jpg',_binary '\0',_binary '\0','Cám Chào Mào Hiệp Đồng Nai - Cám Đấu','Chào mào',1),(6,'Hiệp Đồng Nai','Sản phẩm cám dưỡng dành cho chim thay lông - dưỡng lông.','dongnai2.jpg',_binary '\0',_binary '\0','Cám Chào Mào Hiệp Đồng Nai - Cám Dưỡng','Chào mào',1),(7,'Hiệp Đồng Nai','Sản phẩm chuyên nghiệp 2 trong 1 dùng quanh năm, dùng cho chim thay lông và thi đấu.','dongnai3.jpg',_binary '\0',_binary '\0','Cám Chào Mào Hiệp Đồng Nai - Dưỡng Đấu','Chào mào',1),(8,'Hiệp Đồng Nai','Hạt dinh dưỡng đậm đặc, hỗ trợ sắc tố lông và căng lửa tự nhiên, bền bỉ thi đấu.','dongnai4.jpg',_binary '\0',_binary '\0','Cám Chào Mào Dinh Hiệp Đồng Nai - Hạt Đậm Đặc','Chào mào',1),(9,'Hiệp Đồng Nai','Hạt dưỡng chất tạo sắc tố lông cho chào mào, giúp lông đỏ rực rỡ.','dongnai5.jpg',_binary '\0',_binary '\0','Cám Chào Mào Hiệp Đồng Nai - Hạt Dưỡng Chất Tạo Sắc Tố Lông','Chào mào',1),(10,'Nam Đà Nẵng','Được sản xuất từ ngũ cốc theo công thức đặc biệt, giúp chim nhanh đạt lửa, tăng độ bền và bóng mượt.','namdn1.jpg',_binary '\0',_binary '\0','Cám Chào Mào Nam Đà Nẵng','Chào mào',1),(11,'Nam Đà Nẵng','Ổn định đường ruột, nhanh căng - đấu bền bỉ, bổ sung tôm, khoáng chất, vitamin tổng hợp.','namdn2.jpg',_binary '\0',_binary '\0','Cám Chào Mào Nam Đà Nẵng New','Chào mào',1),(12,'Quốc Huế','Cám được sản xuất theo công thức đặc biệt, kết hợp khoáng và vitamin từ thiên nhiên giúp chim nhanh đạt lửa, đấu bền.','quochue1.jpg',_binary '\0',_binary '\0','Cám Chào Mào Đặc Biệt Quốc Huế','Chào mào',1),(13,'Thắng Mẹo Đà Nẵng','Sản phẩm dành để dưỡng chim (NEW), sản xuất trên dây chuyền hiện đại mới.','thangmeo1.jpg',_binary '\0',_binary '\0','Cám Thắng Mẹo Dưỡng','Chào mào',1),(14,'Thắng Mẹo Đà Nẵng','Sản phẩm cám khoáng dành để dưỡng chim, được Cục Sở Hữu Trí Tuệ và pháp luật bảo hộ.','thangmeo2.jpg',_binary '\0',_binary '\0','Cám Thắng Mẹo Khoáng','Chào mào',1),(15,'Bộ Ba Phép Thuật','Thức ăn hỗn hợp hoàn chỉnh cho chim cảnh, dinh dưỡng cao cấp chuyên dùng cho chim đấu.','bo31.jpg',_binary '\0',_binary '\0','Cám Chào Mào Bộ Ba Phép Thuật - Dưỡng Đấu','Chào mào',1),(16,'Bộ Ba Phép Thuật','Chuyên dùng cho chim đấu trường, dành cho chim phách cầu nhanh, tốc độ cao, tiêu hao năng lượng nhiều.','bo32.jpg',_binary '\0',_binary '\0','Cám Chào Mào Bộ Ba Phép Thuật - Cám Tăng Lực (Hũ)','Chào mào',1),(17,'Bộ Ba Phép Thuật','Thức ăn hỗn hợp hoàn chỉnh cho chim cảnh, sự kết hợp hoàn hảo để dưỡng lực cho chào mào.','bo33.jpg',_binary '\0',_binary '\0','Cám Chào Mào Bộ Ba Phép Thuật - Dưỡng Lực','Chào mào',1),(18,'Thức ăn nuôi chim','Thành phần gồm trứng gà, quả đậu chín, đậu tương, bột tôm, bột ngô, bột nhộng tằm, vitamin và khoáng tổng hợp.','camtonghop.jpg',_binary '\0',_binary '\0','Cám trứng Tổng hợp','Chào mào',1),(19,'Thắng Mẹo Đà Nẵng','Sản phẩm cám chuyên biệt dành cho chim thi đấu, thương hiệu đã được Cục Sở Hữu Trí Tuệ bảo hộ.','thangmeo3.jpg',_binary '\0',_binary '\0','Cám Thắng Mẹo Đấu','Chào mào',1),(20,'Thắng Mẹo Đà Nẵng','Sản phẩm cám khoáng sắc tố hạt màu đỏ, chuyên dành cho chim thay lông New.','thangmeo4.jpg',_binary '\0',_binary '\0','Cám Thắng Mẹo hạt sắc tố','Chào mào',1),(21,'Shanghai','Thức ăn cho các loại cá Kiểng','canho.jpg',_binary '\0',_binary '\0','Bột cá hạt nhỏ','Cá cảnh',5),(22,'Shanghai','Thức ăn cho các loại cá Kiểng','cato.jpg',_binary '\0',_binary '\0','Bột cá hạt to','Cá cảnh',5),(23,'Vương Việt Anh','Cám trứng siêu cao cấp dành cho chim chích chòe lửa và chích chòe than.','vvacc1.png',_binary '\0',_binary '\0','Cám trứng Vương Việt Anh - Chích chòe lửa, chòe than','Chích chòe',1),(24,'Vương Việt Anh','Cám chim chích chòe lửa và chích chòe than.','vvacc2.png',_binary '\0',_binary '\0','Cám chim Vương Việt Anh - Chích chòe lửa, chích chòe than','Chích chòe',1),(25,'Vương Việt Anh','Cám trứng cao cấp dành cho chim chích chòe lửa và chích chòe than.','vva3cc.png',_binary '\0',_binary '\0','Cám trứng Vương Việt Anh - Chích chòe lửa, chòe than','Chích chòe',1),(26,'Lê Thịnh','Cám Hút Mật & Ốc Mít cao cấp dưỡng hót, căng lửa.','lethinh.png',_binary '\0',_binary '\0','Cám Hút Mật Lê Thịnh - Dưỡng Hót','Hút mật',1),(27,'Lê Thịnh','Cám Hút Mật & Ốc Mít cao cấp VIP căng lửa, cung cấp lượng đạm cao và các loại thảo dược giúp chim bền lực.','lethinh2.jpg',_binary '\0',_binary '\0','Cám Hút Mật căng lửa Lê Thịnh','Hút mật',1),(28,'Vương Việt Anh','Cám chim cao cấp Vương Việt Anh - Khánh Long chuyên dùng cho chim Họa Mi và Khướu.','vvahm1.png',_binary '\0',_binary '\0','Cám chim Vương Việt Anh - Họa Mi, Khướu','Họa mi',1),(29,'Vương Việt Anh','Cám trứng siêu cao cấp dành cho chim Họa Mi và Khướu.','vvahm2.png',_binary '\0',_binary '\0','Cám trứng Vương Việt Anh - Họa Mi, Khướu','Họa mi ',1),(30,'Hùng Tạ','Cám chim cao cấp Vành Khuyên Hùng Tạ loại 1 - Dưỡng và thay lông, thành phần gạo, đậu xanh, lòng đỏ trứng gà kiến.','hungta1.jpg',_binary '\0',_binary '\0','Cám chim Vành Khuyên Hùng Tạ - Loại 1 (Dưỡng & Thay lông)','Vành khuyên',1),(31,'Hùng Tạ','Cám chim cao cấp Vành Khuyên Hùng Tạ loại 2 - Dành cho chim thi đấu và chịu nhiệt độ thấp.','hungta2.jpg',_binary '\0',_binary '\0','Cám chim Vành Khuyên Hùng Tạ - Loại 2 (Thi đấu)','Vành khuyên',1),(32,'Sơn Nhật Thành','Thức ăn hỗn hợp hoàn chỉnh cho chim cảnh - Cám chim Vành Khuyên cao cấp Líu số 1, phong độ ổn định.','liu.jpg',_binary '\0',_binary '\0','Cám chim Vành Khuyên Sơn Nhật Thành - Líu số 1','Vành khuyên',1),(33,'Nhàn Huế','Cám chim Nhàn Huế Special No.1 chuyên dùng chăm sóc lông cho chim Vành Khuyên.','nhan1.jpg',_binary '\0',_binary '\0','Cám chim Vành Khuyên Nhàn Huế - số 1','Vành khuyên',1),(34,'Nhàn Huế','Cám chim Nhàn Huế Special No.2 dành cho chim Vành Khuyên luyện líu và thi đấu.','nhan2.jpg',_binary '\0',_binary '\0','Cám chim Vành Khuyên Nhàn Huế - số 2','Vành khuyên',1),(35,'Thủ công','Lồng Chào Mào bo góc chất liệu tre tự nhiên, thiết kế chắc chắn, sang trọng.','chao mao bo goc (1).jpg',_binary '',_binary '','Lồng Chào Mào bo góc tre tự nhiên','Chào mào',2),(36,'Thủ công','Lồng Chào Mào làm từ gỗ mun sừng cao cấp, chạm trổ hoa văn tinh xảo.','chaomao2.jpg',_binary '',_binary '','Lồng Chào Mào gỗ mun sừng chạm khắc','Chào mào',2),(37,'Thủ công','Lồng Chào Mào vuông mẫu hoa mẫu đơn, chất liệu gỗ và tre già tuyển chọn.','chaomao3.png',_binary '',_binary '','Lồng Chào Mào vuông chạm hoa mẫu đơn','Chào mào',2),(38,'Thủ công','Lồng Chào Mào form vuông truyền thống, chi tiết đục tay thủ công sắc nét.','chaomao5.jpg',_binary '',_binary '','Lồng Chào Mào form vuông đục tay','Chào mào',2),(39,'Thủ công','Lồng Vành Khuyên tang chạm nổi hoa hồng thủ công cực đẹp.','khuyen1.jpg',_binary '\0',_binary '','Lồng Khuyên tre già tang chạm hoa hồng','Vành khuyên',2),(40,'Thủ công','Lồng Khuyên form dáng quả đào, tang lồng chạm khắc tỉ mỉ.','khuyen2.jpg',_binary '\0',_binary '','Lồng Khuyên quả đào tang đục kỹ','Vành khuyên',2),(41,'Thủ công','Lồng Vành Khuyên phom lùn tre trơn thanh lịch, gọn gàng.','khuyên3.jpeg',_binary '\0',_binary '','Lồng Khuyên tre trơn phom lùn','Vành khuyên',2),(42,'Thủ công','Lồng Vua chất liệu gỗ mun sừng đỉnh cao dành cho chim quý.','long-vuong-go-mun-sung8.jpg',_binary '',_binary '','Lồng Vua gỗ mun sừng cao cấp','Chim cảnh',2),(43,'Phụ kiện','Lồng tắm chuyên dụng cho chim cảnh, khung gỗ nan trắng kèm khay nhôm.','tam1.jpg',_binary '',_binary '\0','Lồng tắm chim gỗ nan trắng','Phụ kiện chim',2),(44,'Phụ kiện','Lồng tắm lưới sắt sơn tĩnh điện màu xanh, bền đẹp, dễ dàng vệ sinh.','tam2.jpg',_binary '',_binary '\0','Lồng tắm lưới sắt sơn tĩnh điện','Phụ kiện chim',2),(45,'Thủ công','Cầu góc gỗ mun đen cao cấp, thiết kế uốn cong tự nhiên giúp chim đứng vững và thoải mái.','CAU GOC MUN (2).jpg',_binary '\0',_binary '','Cầu góc gỗ mun cao cấp cho lồng chim','Chim cảnh',3),(46,'Thủ công','Cầu góc tre già uốn cong thủ công, bề mặt nhẵn mịn, bám chân tốt cho chim.','cầu góc tre (1).jpg',_binary '\0',_binary '','Cầu góc tre già uốn thủ công','Chim cảnh',3),(47,'Việt Nam','Giấy lót đáy lồng khổ nhỏ chuyên dụng, giúp vệ sinh lồng chim sạch sẽ, dễ dàng.','giaynho.jpg',_binary '\0',_binary '\0','Giấy lót đáy lồng chim khổ nhỏ','Chim cảnh',3),(48,'Việt Nam','Giấy lót đáy lồng chất lượng cao, thấm hút tốt, giữ cho lồng luôn khô ráo, sạch sẽ.','giayto (2).jpg',_binary '\0',_binary '\0','Giấy lót đáy lồng chim khổ lớn','Chim cảnh',3),(49,'Việt Nam','Áo trùm lồng chim nhiều màu sắc và họa tiết, bảo vệ chim khỏi gió lùa và côn trùng.','khantrum.jpg',_binary '\0',_binary '\0','Áo trùm lồng chim đa dạng họa tiết','Chim cảnh',3),(50,'Thủ công','Móc treo lồng chim bằng kim loại mạ vàng sang trọng, đầu móc chạm trổ tinh xảo.','moc1.jpg',_binary '\0',_binary '','Móc treo lồng chim mạ vàng cao cấp','Chim cảnh',3),(51,'Thủ công','Móc chống xoay inox sáng bóng, thiết kế chống xoay thông minh giúp lồng cố định hướng.','moc2.jpg',_binary '\0',_binary '','Móc chống xoay inox cao cấp','Chim cảnh',3),(52,'Thủ công','Móc treo lồng chim inox chống xoay chất liệu bền bỉ, không gỉ sét theo thời gian.','moc3.jpg',_binary '\0',_binary '','Móc chống xoay inox bền đẹp','Chim cảnh',3),(53,'Thủ công','Nấm đỉnh lồng làm từ gỗ tự nhiên tiện thủ công, tạo điểm nhấn trang trọng cho đỉnh lồng.','namgo.jpg',_binary '\0',_binary '','Nấm đỉnh lồng bằng gỗ tự nhiên','Chim cảnh',3),(54,'Thủ công','Nấm đỉnh lồng làm bằng tre già mây tre đan chạm tiện nghệ thuật, độc đáo.','namtre.jpg',_binary '\0',_binary '','Nấm đỉnh lồng tre già nghệ thuật','Chim cảnh',3),(55,'Thủ công','Ống nước thủy tinh cho chim uống dạng thẳng dài 15cm, thiết kế trong suốt dễ quan sát mực nước.','ong1.jpg',_binary '\0',_binary '','Ống nước thủy tinh cho chim dài 15cm (Mẫu 1)','Chim cảnh',3),(56,'Thủ công','Ống nước thủy tinh cao cấp dài 15cm kèm hộp xanh nghệ thuật, tiện lợi và thẩm mỹ cho lồng chim.','ong2.jpg',_binary '\0',_binary '','Ống nước thủy tinh cho chim dài 15cm (Mẫu hộp xanh)','Chim cảnh',3),(57,'Thủ công','Rọ cóng làm bằng tre tự nhiên đan thủ công chắc chắn, dùng để đựng thức ăn hoặc phụ kiện cho chim.','roccgo.jpg',_binary '\0',_binary '','Rọ cóng bằng tre đan thủ công','Chim cảnh',3),(58,'Thủ công','Rọ cóng chất liệu nhựa trong suốt kết hợp nan nhựa bền đẹp, thiết kế nhỏ gọn tiện dụng.','roccnhua.jpg',_binary '\0',_binary '','Rọ cóng nhựa trong suốt đựng thức ăn chim','Chim cảnh',3),(59,'Birdcare','Nước tắm chuyên dụng cho chim BIRDCARE A99 dung tích 330ml, giúp làm sạch lông, hỗ trợ diệt ký sinh trùng, rận mạt an toàn cho mọi loài chim cảnh.','thuoctam.jpg',_binary '\0',_binary '','Nước tắm chuyên dụng cho chim BIRDCARE A99 330ml','Chim cảnh',4);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `revoked` bit(1) NOT NULL,
  `token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKghpmfn23vmxfu3spu3lfg4r2d` (`token`),
  KEY `FK1lih5y2npsf8u5o3vhdb9y0os` (`user_id`),
  CONSTRAINT `FK1lih5y2npsf8u5o3vhdb9y0os` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,'2026-09-08 16:50:53.391254',_binary '\0','e72649cf-bda0-4a67-8e0c-344615a9f87d',5),(2,'2026-09-08 16:54:55.764374',_binary '\0','e141e001-2b69-4fb9-8a7b-c54635787ef7',5),(3,'2026-09-08 17:02:17.448392',_binary '','5e9e8325-38ad-4950-a6c0-79303d87e7fc',5),(4,'2026-09-09 08:36:00.474362',_binary '\0','34b7a088-bda7-4b87-b257-5935b4e13527',5),(5,'2026-09-09 10:00:41.388938',_binary '\0','21e8c515-a5a9-481e-a3c3-4e1e99816f80',5),(6,'2026-09-09 10:01:03.910352',_binary '\0','d98fc5e6-7b90-414c-a9c9-7e5a87de41de',3),(7,'2026-09-09 10:19:03.569025',_binary '\0','6c6e93be-cfa8-4ca0-9205-b724f0db3afa',6),(8,'2026-09-21 19:13:22.369660',_binary '','1449ab7b-72a1-417a-b6d4-d04886bfdfb7',5),(9,'2026-09-21 19:13:42.058077',_binary '','fdb0c0bf-6427-483a-9d5b-205704212e99',3),(10,'2026-09-21 19:15:10.326169',_binary '','68cb6d04-5380-4e44-9cfd-7fe85121dd2b',7);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'testsecurity@gmail.com','$2a$10$9x6S4eJl/729ElHBGbyq5.A4oilzjkAxVFpclJ8WVjxWb4l/wEgmO','testsecurity',1),(5,'testcustom@gmail.com','$2a$10$ShoDCyDFLG4/kBj8wmvaXefL0bXNcXE2fwC8brQpIajDt.f.bJbuq','testcustom',2),(6,'apitestuser@example.com','$2a$10$ePOJG8z.1WvxuX1Szdf7LeYDor7fYJ/xZzHurMAPQiybwsjo9i8.e','apitestuser',2),(7,'hihi12@gmail.com','$2a$10$8IWHcgz5rkWkNLyOGJlSMeE43h6Ci8C0rPrUIpHIiIL4lF7Q.Yy8e','minhkhanh',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-03 22:54:36
