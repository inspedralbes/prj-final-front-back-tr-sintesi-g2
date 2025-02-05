SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `bosses` (
  `id_boss` int(11) NOT NULL,
  `boss_name` varchar(50) NOT NULL,
  `health` int(11) NOT NULL,
  `attack_power` int(11) NOT NULL,
  `defense` int(11) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `reward_item` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `enemy` (
  `id_enemy` int(11) NOT NULL,
  `enemy_name` varchar(50) NOT NULL,
  `enemy_type` enum('common','elite','boss') DEFAULT 'common',
  `health` int(11) NOT NULL,
  `attack_power` int(11) NOT NULL,
  `defense` int(11) NOT NULL,
  `money_reward` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `game` (
  `id_game` int(11) NOT NULL,
  `id_player` int(11) NOT NULL,
  `game_name` varchar(50) NOT NULL,
  `game_status` enum('active','completed') DEFAULT 'active',
  `total_progress` decimal(5,2) DEFAULT 0.00,
  `level_reached` int(11) DEFAULT 1,
  `last_save_date` datetime DEFAULT current_timestamp(),
  `time_played` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `game_bosses` (
  `id_game_boss` int(11) NOT NULL,
  `id_game` int(11) NOT NULL,
  `id_boss` int(11) NOT NULL,
  `defeated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `interactable_objects` (
  `id_object` int(11) NOT NULL,
  `object_name` varchar(50) NOT NULL,
  `object_type` enum('door','chest','npc','trap') NOT NULL,
  `interaction_required` enum('yes','no') DEFAULT 'yes',
  `reward` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `item` (
  `id_item` int(11) NOT NULL,
  `item_name` varchar(50) NOT NULL,
  `item_description` text DEFAULT NULL,
  `item_type` enum('pocion','llave') NOT NULL,
  `value` int(11) DEFAULT 0,
  `rarity` enum('common','uncommon','rare','epic','legendary') DEFAULT 'common',
  `item_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `item` (`id_item`, `item_name`, `item_description`, `item_type`, `value`, `rarity`, `item_image`) VALUES
(1, 'Llave Roja', 'Una llave misteriosa de color rojo.', '', 100, 'rare', '/imagenes/llave.png'),
(2, 'Poción de Vida', 'Una poción que restaura la salud del jugador.', 'pocion', 50, 'common', '/imagenes/pocionVida.png'),
(3, 'Poción de Maná', 'Una poción que restaura el maná del jugador.', 'pocion', 50, 'common', '/imagenes/pocionMana.png');

CREATE TABLE `player` (
  `id_player` int(11) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `creation_date` datetime DEFAULT current_timestamp(),
  `total_time_played` int(11) DEFAULT 0,
  `achievements_unlocked` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `player` (`id_player`, `nickname`, `creation_date`, `total_time_played`, `achievements_unlocked`) VALUES
(1, 'Jugador1', '2025-02-04 08:15:51', 0, 0);

CREATE TABLE `player_inventory` (
  `id_inventory` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `id_item` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `player_inventory` (`id_inventory`, `player_id`, `id_item`, `quantity`) VALUES
(2, 1, 1, 1),  -- Llave Roja
(3, 1, 2, 1),  -- Poción de Vida
(4, 1, 3, 1);  -- Poción de Maná

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin') DEFAULT 'admin',
  `status` enum('active','inactive') DEFAULT 'active',
  `registration_date` datetime DEFAULT current_timestamp(),
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `bosses`
  ADD PRIMARY KEY (`id_boss`),
  ADD KEY `reward_item` (`reward_item`);

ALTER TABLE `enemy`
  ADD PRIMARY KEY (`id_enemy`);

ALTER TABLE `game`
  ADD PRIMARY KEY (`id_game`),
  ADD KEY `id_player` (`id_player`);

ALTER TABLE `game_bosses`
  ADD PRIMARY KEY (`id_game_boss`),
  ADD KEY `id_game` (`id_game`),
  ADD KEY `id_boss` (`id_boss`);

ALTER TABLE `interactable_objects`
  ADD PRIMARY KEY (`id_object`);

ALTER TABLE `item`
  ADD PRIMARY KEY (`id_item`);

ALTER TABLE `player`
  ADD PRIMARY KEY (`id_player`),
  ADD UNIQUE KEY `nickname` (`nickname`);

ALTER TABLE `player_inventory`
  ADD PRIMARY KEY (`id_inventory`),
  ADD KEY `player_id` (`player_id`),
  ADD KEY `id_item` (`id_item`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `bosses`
  MODIFY `id_boss` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `enemy`
  MODIFY `id_enemy` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `game`
  MODIFY `id_game` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `game_bosses`
  MODIFY `id_game_boss` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `interactable_objects`
  MODIFY `id_object` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `item`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `player`
  MODIFY `id_player` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `player_inventory`
  MODIFY `id_inventory` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `bosses`
  ADD CONSTRAINT `bosses_ibfk_1` FOREIGN KEY (`reward_item`) REFERENCES `item` (`id_item`) ON DELETE SET NULL;

ALTER TABLE `game`
  ADD CONSTRAINT `game_ibfk_1` FOREIGN KEY (`id_player`) REFERENCES `player` (`id_player`) ON DELETE CASCADE;

ALTER TABLE `game_bosses`
  ADD CONSTRAINT `game_bosses_ibfk_1` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE,
  ADD CONSTRAINT `game_bosses_ibfk_2` FOREIGN KEY (`id_boss`) REFERENCES `bosses` (`id_boss`) ON DELETE CASCADE;

ALTER TABLE `player_inventory`
  ADD CONSTRAINT `player_inventory_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`id_player`) ON DELETE CASCADE,
  ADD CONSTRAINT `player_inventory_ibfk_2` FOREIGN KEY (`id_item`) REFERENCES `item` (`id_item`) ON DELETE CASCADE;

COMMIT;
