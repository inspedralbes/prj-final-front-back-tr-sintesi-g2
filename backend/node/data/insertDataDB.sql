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
