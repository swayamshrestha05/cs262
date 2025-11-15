GET /

Returns a simple hello message confirming that the service is running.

Players Endpoints
GET /players

Returns the full list of players.

GET /players/:id

Returns the player with the given numeric ID.
Returns 404 if the player does not exist.

POST /players

Creates a new player.

PUT /players/:id

Updates an existing player’s name and email.

Returns the updated player ID, or 404 if the player does not exist.

DELETE /players/:id

Deletes the player with the given ID.
• Cascades delete through PlayerGame first.
• Returns the deleted player ID, or 404 if the player does not exist.

Games Endpoints
GET /games

Returns the full list of games.

GET /games/:id

Returns the game with the given ID.
Returns 404 if the game does not exist.

DELETE /games/:id

Deletes the game with the given ID.
• Cascades delete through PlayerGame first.
• Returns the deleted game ID, or 404 if the game does not exist.

Undefined Endpoints

Any unrecognized endpoint (e.g., /blob) returns:

HTTP 404 Not Found
