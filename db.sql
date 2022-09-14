ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'example';

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
                         `id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                         `password` varchar(128) NOT NULL,
                         `refresh_token` varchar(1024) NOT NULL,
                         `token` varchar(1024) NOT NULL,
                         UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
