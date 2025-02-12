-- Insertar jugadores en la tabla PLAYER
INSERT INTO PLAYER (nickname, creation_date, total_time_played, achievements_unlocked) VALUES
('playerOne', NOW(), 0, 0),
('playerTwo', NOW(), 120, 1),
('playerThree', NOW(), 450, 3);

-- Insertar los ítems en la tabla ITEM
INSERT INTO ITEM (id_item, item_name, item_description, item_type, value, rarity, item_image) VALUES
(1, 'Llave Roja', 'Una llave misteriosa de color rojo.', 'llave', 100, 'rare', '/imagenes/llave-roja.png'),
(2, 'Poción de Vida', 'Una poción que restaura la salud del jugador.', 'pocion', 50, 'common', '/imagenes/pocionVida.png'),
(3, 'Poción de Maná', 'Una poción que restaura el maná del jugador.', 'pocion', 50, 'common', '/imagenes/pocionMana.png'),
(4, 'Llave Morada', 'Una llave misteriosa de color morado.', 'llave', 150, 'rare', '/imagenes/llave-morada.png'),
(5, 'Llave Dorada', 'Una llave de oro que abre cofres especiales.', 'llave', 200, 'epic', '/imagenes/llave-dorada.png'),
(6, 'Llave Esqueleto', 'Una llave antigua con forma de esqueleto.', 'llave', 150, 'rare', '/imagenes/llave-esqueleto.png'),
(7, 'Llave Lobo', 'Una llave decorada con la forma de un lobo.', 'llave', 100, 'uncommon', '/imagenes/llave-lobo.png'),
(8, 'Llave Dragón', 'Una llave poderosa con la figura de un dragón.', 'llave', 300, 'epic', '/imagenes/llave-dragon.png');

-- Insertar en INVENTORY asegurando que los jugadores existen
-- Asegúrate de que los jugadores tengan los ID correctos. Si usas auto incremento, se asignarán automáticamente
-- al insertar los jugadores. Por ejemplo, el primer jugador tendrá id_player = 1, el segundo id_player = 2, etc.
-- Insertar los ítems en el inventario de cada jugador

-- Suponiendo que el id_player es 1, 2, 3, etc., porque se insertaron con auto_increment
INSERT INTO INVENTORY (player_id, id_item, quantity) VALUES
(1, 1, 1),  -- Llave Roja para playerOne
(1, 2, 1),  -- Poción de Vida para playerOne
(1, 3, 1),  -- Poción de Maná para playerOne
(1, 4, 1),  -- Llave Morada para playerOne
(1, 5, 1),  -- Llave Dorada para playerOne
(1, 6, 1),  -- Llave Esqueleto para playerOne
(1, 7, 1),  -- Llave Lobo para playerOne
(1, 8, 1),  -- Llave Dragón para playerOne

(2, 1, 1),  -- Llave Roja para playerTwo
(2, 2, 1),  -- Poción de Vida para playerTwo
(2, 3, 1),  -- Poción de Maná para playerTwo
(2, 4, 1),  -- Llave Morada para playerTwo
(2, 5, 1),  -- Llave Dorada para playerTwo
(2, 6, 1),  -- Llave Esqueleto para playerTwo
(2, 7, 1),  -- Llave Lobo para playerTwo
(2, 8, 1),  -- Llave Dragón para playerTwo

(3, 1, 1),  -- Llave Roja para playerThree
(3, 2, 1),  -- Poción de Vida para playerThree
(3, 3, 1),  -- Poción de Maná para playerThree
(3, 4, 1),  -- Llave Morada para playerThree
(3, 5, 1),  -- Llave Dorada para playerThree
(3, 6, 1),  -- Llave Esqueleto para playerThree
(3, 7, 1),  -- Llave Lobo para playerThree
(3, 8, 1);  -- Llave Dragón para playerThree

INSERT INTO USERS (username, email, password, role, status, registration_date, last_login)
VALUES 
('admin1', 'admin1@example.com', 'password123', 'admin', 'active', NOW(), NOW()),
('admin2', 'admin2@example.com', 'password456', 'admin', 'inactive', NOW(), NULL);


-- Insertar en la tabla GAME
INSERT INTO GAME 
(id_player, id_inventory, game_name, game_status, total_progress, last_save_date, position_x, position_y, health, coins, time_played) 
VALUES 
(3, 1, 'Adventure Quest', 'active', 20.00, NOW(), 10.5, 3.2, 70, 50, 300),
(2, 2, 'Warrior’s Path', 'completed', 100.00, NOW(), 15.0, 8.5, 80, 200, 1500);


-- Insertar en la tabla ENEMY
INSERT INTO ENEMY (enemy_name, enemy_type, health, attack_power, defense, money_reward)
VALUES 
('Goblin', 'common', 50, 10, 5, 20),
('Dragon', 'elite', 500, 100, 50, 200),
('Dark Lord', 'boss', 1000, 150, 100, 500);

-- Insertar en la tabla INTERACTABLE_OBJECTS
INSERT INTO INTERACTABLE_OBJECTS (object_name, object_type, interaction_required, reward)
VALUES 
('Old Door', 'door', 'yes', NULL),
('Treasure Chest', 'chest', 'yes', 100),
('Wise NPC', 'npc', 'no', NULL),
('Poison Trap', 'trap', 'yes', -50);

-- Insertar en la tabla BOSSES
INSERT INTO BOSSES (boss_name, health, attack_power, defense, location, reward_item)
VALUES 
('King of the Forest', 800, 120, 80, 'Enchanted Forest', 1),  -- Reward: Sword of Power
('Guardian of the Abyss', 1200, 200, 150, 'Abyssal Depths', NULL); -- No reward item

-- Insertar en la tabla GAME_BOSSES
INSERT INTO GAME_BOSSES (id_game, id_boss, defeated_at)
VALUES 
(1, 1, NOW()),  -- Adventure Quest defeated King of the Forest
(2, 2, NOW());  -- Warrior's Path defeated Guardian of the Abyss
