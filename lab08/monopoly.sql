--
-- This SQL script builds a monopoly database, deleting any pre-existing version.
--
-- @author kvlinden
-- @version Summer, 2015
--

-- Drop previous versions of the tables if they they exist, in reverse order of foreign keys.

-- Extended schema:
-- Player(ID, emailAddress, name)
-- PlayerGame(gameID, playerID, score, cash, currPosition)
-- Game (ID, time)
-- Property(ID, name, position, price)
-- PlayerGameProperty(playerID, gameID, propertyID, houses, hotels)

DROP TABLE IF EXISTS PlayerGameProperty;
DROP TABLE IF EXISTS PlayerGame;
DROP TABLE IF EXISTS Property;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Player;

-- Create the schema.
CREATE TABLE Game (
	ID integer PRIMARY KEY,
	time timestamp
	);

CREATE TABLE Player (
	ID integer PRIMARY KEY, 
	emailAddress varchar(50) NOT NULL,
	name varchar(50)
	);

CREATE TABLE PlayerGame (
	gameID integer REFERENCES Game(ID), 
	playerID integer REFERENCES Player(ID),
	score integer,
	cash integer,
	currPosition integer NOT NULL
	);

CREATE TABLE Property (
	ID integer PRIMARY KEY,
	name varchar(50) NOT NULL,
	position integer NOT NULL,
	price integer NOT NULL
	);

CREATE TABLE PlayerGameProperty(
	gameID integer REFERENCES Game(ID), 
	playerID integer REFERENCES Player(ID),
	propertyID integer REFERENCES Property(ID),
	houses integer,
	hotels integer
);

GRANT SELECT ON Game TO PUBLIC;
GRANT SELECT ON Player TO PUBLIC;
GRANT SELECT ON PlayerGame TO PUBLIC;
GRANT SELECT ON Property TO PUBLIC;
GRANT SELECT ON PlayerGameProperty TO PUBLIC;

INSERT INTO Game VALUES (1, '2006-06-27 08:00:00');
INSERT INTO Game VALUES (2, '2006-06-28 13:20:00');
INSERT INTO Game VALUES (3, '2006-06-29 18:41:00');
INSERT INTO Game VALUES (4, '2025-10-30 12:00:00');
INSERT INTO Game VALUES (5, '2025-10-29 11:00:00');

INSERT INTO Player(ID, emailAddress) VALUES (1, 'me@calvin.edu');
INSERT INTO Player VALUES (2, 'king@gmail.edu', 'The King');
INSERT INTO Player VALUES (3, 'dog@gmail.edu', 'Dogbreath');

INSERT INTO PlayerGame VALUES (1, 1, 0, 200, 5);
INSERT INTO PlayerGame VALUES (1, 2, 0, 0, 1);
INSERT INTO PlayerGame VALUES (1, 3, 2350, 4000, 22);
INSERT INTO PlayerGame VALUES (2, 1, 1000, 1500, 10);
INSERT INTO PlayerGame VALUES (2, 2, 0, 0, 0);
INSERT INTO PlayerGame VALUES (2, 3, 500, 500, 15);
INSERT INTO PlayerGame VALUES (3, 2, 0, 0, 0);
INSERT INTO PlayerGame VALUES (3, 3, 5500, 10000, 50);

-- Property(ID, name, position, price)
INSERT INTO Property VALUES (1, 'Mediterranean Avenue', 1, 60);
INSERT INTO Property VALUES (2, 'East Avenue', 3, 100);

-- PlayerGameProperty(gameID, playerID, propertyID, houses, hotels)
INSERT INTO PlayerGameProperty VALUES (1, 1, 1, 2, 0);
INSERT INTO PlayerGameProperty VALUES (2, 1, 2, 1, 2);



-------------------------------------------------------------------------------------
-- Lab 8 SQL queries

-- 8.1 
-- a. Retrieve a list of all the games, ordered by date with the most recent game coming first. 
-- SELECT * FROM Game ORDER BY time;

-- b. Retrieve all the games that occurred in the past week.
-- SELECT * FROM Game WHERE time >= CURRENT_TIMESTAMP - INTERVAL '7 days';

-- c. Retrieve a list of players who have (non-NULL) names.
-- SELECT * FROM Player WHERE name IS NOT NULL;

-- d. Retrieve a list of IDs for players who have some game score larger than 2000.
-- SELECT PlayerID from PlayerGame WHERE score > 2000;

-- e. Retrieve a list of players who have GMail accounts.
--  SELECT * FROM Player WHERE emailAddress LIKE '%@gmail.%';


-- 8.2 
-- a. Retrieve all “The King”’s game scores in decreasing order.
-- SELECT PlayerGame.score FROM PlayerGame, Player WHERE Player.name LIKE '%The King%' AND Player.ID = PlayerGame.playerID ORDER BY PlayerGame.score DESC;

-- b. Retrieve the name of the winner of the game played on 2006-06-28 13:20:00.
-- SELECT Player.name FROM Player, PlayerGame, Game WHERE Player.ID = PlayerGame.playerID AND PlayerGame.gameID = game.ID AND Game.time = '2006-06-28 13:20:00';

-- c. So what does that P1.ID < P2.ID clause do in the last example query (i.e., the from SQL Examples)?
-- It prevents from comapring the same IDs and returns and keeps the results where the first player's ID is less than second player's ID.

-- d. The query that joined the Player table to itself seems rather contrived. Can you think of a realistic situation in which you’d want to join a table to itself?
-- A university database with a table that includes both students and employees. Join can be used to find people who are both students and employees on campus with part-time jobs.
-------------------------------------------------------------------------------------