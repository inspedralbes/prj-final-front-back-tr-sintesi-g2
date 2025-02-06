INSERT INTO USERS (username, email, password, role, status, registration_date, last_login)
VALUES 
('admin1', 'admin1@example.com', 'password123', 'admin', 'active', NOW(), NOW()),
('admin2', 'admin2@example.com', 'password456', 'admin', 'inactive', NOW(), NULL);

-- Insertar en la tabla PLAYER
INSERT INTO PLAYER (nickname, creation_date, total_time_played, achievements_unlocked)
VALUES 
('player1', NOW(), 1200, 5),
('player2', NOW(), 3500, 10);

-- Insertar en la tabla ITEM
INSERT INTO ITEM (item_name, item_description, item_type, value, rarity)
VALUES 
('Sword of Power', 'A legendary sword with immense power.', 'weapon', 100, 'legendary'),
('Healing Potion', 'Restores 50 health points.', 'consumable', 20, 'common'),
('Iron Armor', 'A sturdy armor made of iron.', 'armor', 50, 'uncommon');

-- Insertar en la tabla INVENTORY
INSERT INTO INVENTORY (id_item, quantity)
VALUES 
(1, 1),  -- Sword of Power
(2, 5),  -- Healing Potion
(3, 2);  -- Iron Armor

-- Insertar en la tabla GAME
INSERT INTO GAME 
(id_player, id_inventory, game_name, game_status, total_progress, level_reached, last_save_date, position_x, position_y, health, coins, time_played) 
VALUES 
(1, 1, 'Adventure Quest', 'active', 20.00, 5, NOW(), 10.5, 3.2, 70, 50, 300),
(2, 2, 'Warrior’s Path', 'completed', 100.00, 10, NOW(), 15.0, 8.5, 80, 200, 1500);


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
