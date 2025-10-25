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
DROP TABLE IF EXISTS Property;
DROP TABLE IF EXISTS PlayerGame;
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

-- Allow users to select data from the tables.
GRANT SELECT ON Game TO PUBLIC;
GRANT SELECT ON Player TO PUBLIC;
GRANT SELECT ON PlayerGame TO PUBLIC;
GRANT SELECT ON Property TO PUBLIC;
GRANT SELECT ON PlayerGameProperty TO PUBLIC;

-- Add sample records.
INSERT INTO Game VALUES (1, '2006-06-27 08:00:00');
INSERT INTO Game VALUES (2, '2006-06-28 13:20:00');
INSERT INTO Game VALUES (3, '2006-06-29 18:41:00');

INSERT INTO Player(ID, emailAddress) VALUES (1, 'me@calvin.edu');
INSERT INTO Player VALUES (2, 'king@gmail.edu', 'The King');
INSERT INTO Player VALUES (3, 'dog@gmail.edu', 'Dogbreath');

INSERT INTO PlayerGame VALUES (1, 1, 0.00,200, 5);
INSERT INTO PlayerGame VALUES (1, 2, 0.00, 0, 1);
INSERT INTO PlayerGame VALUES (1, 3, 2350.00, 4000, 22);
INSERT INTO PlayerGame VALUES (2, 1, 1000.00, 1500, 10);
INSERT INTO PlayerGame VALUES (2, 2, 0.00, 0, 0);
INSERT INTO PlayerGame VALUES (2, 3, 500.00, 500, 15);
INSERT INTO PlayerGame VALUES (3, 2, 0.00, 0, 0);
INSERT INTO PlayerGame VALUES (3, 3, 5500.00, 10000, 50);

-- Property(ID, name, position, price)
INSERT INTO Property VALUES (1, 'Mediterranean Avenue', 1, 60);
INSERT INTO Property VALUES (2, 'East Avenue', 3, 100);

-- PlayerGameProperty(playerID, gameID, propertyID, houses, hotels)
INSERT INTO PlayerGameProperty VALUES (1, 1, 1, 2, 0);
INSERT INTO PlayerGameProperty VALUES (2, 1, 2, 1, 2);