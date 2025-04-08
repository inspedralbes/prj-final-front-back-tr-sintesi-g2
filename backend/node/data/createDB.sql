-- CREAR TABLA USERS
CREATE TABLE USERS (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin') DEFAULT 'admin', -- Solo administradores
    status ENUM('active', 'inactive') DEFAULT 'active',
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- CREAR TABLA PLAYER
CREATE TABLE PLAYER (
    id_player INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_time_played INT DEFAULT 0, -- en segundos
    achievements_unlocked INT DEFAULT 0
);

-- CREAR TABLA ITEM
CREATE TABLE ITEM (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(50) NOT NULL,
    item_description TEXT,
    item_type ENUM('pocion', 'llave') NOT NULL,  -- Modificado a 'pocion' y 'llave'
    value INT DEFAULT 0,
    rarity ENUM('common', 'uncommon', 'rare', 'epic', 'legendary') DEFAULT 'common',
    item_image VARCHAR(255) DEFAULT NULL  -- Agregado para almacenar la imagen
);

-- CREAR TABLA INVENTORY
CREATE TABLE INVENTORY (
    id_inventory INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL, -- Relación con el jugador
    id_item INT NOT NULL, -- Relación con el ítem
    quantity INT DEFAULT 1, -- Cantidad del ítem
    FOREIGN KEY (player_id) REFERENCES PLAYER(id_player) ON DELETE CASCADE,  -- Relacionado con la tabla PLAYER
    FOREIGN KEY (id_item) REFERENCES ITEM(id_item) ON DELETE CASCADE  -- Relacionado con la tabla ITEM
);

-- CREAR TABLA GAME
CREATE TABLE GAME (
    id_game INT AUTO_INCREMENT PRIMARY KEY,
    id_player INT NOT NULL,
    id_inventory INT NOT NULL, -- Relación directa con el inventario
    game_name VARCHAR(50) NOT NULL,
    game_status ENUM('active', 'completed') DEFAULT 'active',
    total_progress DECIMAL(5, 2) DEFAULT 0.00, -- porcentaje de progreso
    last_save_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    position_x DECIMAL(10,2) DEFAULT 0,
    position_y DECIMAL(10,2) DEFAULT 0,
    health INT DEFAULT 70,
    coins INT DEFAULT 0,
    time_played INT DEFAULT 0, -- en segundos
    FOREIGN KEY (id_player) REFERENCES PLAYER(id_player) ON DELETE CASCADE,
    FOREIGN KEY (id_inventory) REFERENCES INVENTORY(id_inventory) ON DELETE CASCADE
);

-- CREAR TABLA ENEMY (MODIFICADA CON ESTADÍSTICAS SIN VALORES POR DEFECTO)
CREATE TABLE ENEMY (
    id_enemy INT AUTO_INCREMENT PRIMARY KEY,
    enemy_name VARCHAR(50) NOT NULL,
    move_speed FLOAT NOT NULL,
    enemy_max_health INT NOT NULL,
    follow_range FLOAT NOT NULL,
    attack_range FLOAT NOT NULL,
    hit_damage INT NOT NULL,
    attack_damage INT NOT NULL,
    second_attack_damage INT NOT NULL,
    block_chance FLOAT,
    reduced_damage INT,
    attack_cooldown FLOAT NOT NULL,
    coin_reward INT NOT NULL
);

-- CREAR TABLA BOSSES (CON ESTADÍSTICAS SIN VALORES POR DEFECTO)
CREATE TABLE BOSSES (
    id_boss INT AUTO_INCREMENT PRIMARY KEY,
    id_game INT NOT NULL,
    boss_name VARCHAR(50) NOT NULL,
    boss_max_health INT NOT NULL,
    move_speed FLOAT NOT NULL,
    attack_range FLOAT NOT NULL,
    attack_cooldown FLOAT NOT NULL,
    attack1_damage INT NOT NULL,
    attack2_damage INT NOT NULL,
    vision_range FLOAT NOT NULL,
    location VARCHAR(100),
    reward_item INT,
    is_defeated BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (reward_item) REFERENCES ITEM(id_item) ON DELETE SET NULL,
    FOREIGN KEY (id_game) REFERENCES GAME(id_game) ON DELETE CASCADE
);
