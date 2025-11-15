## a.

### i. In the lab, you forked your service repo rather than simply cloning it. Was this appropriate? Why or why not?

Forking the repository was appropriate because it created an independent copy of the repository which allowed me to update and push it without affecting the original copy.

### ii. Which of the endpoints implement actions that are idempotent? nullipotent?

Idempotent endpoints - GET, PUT, DELETE
Nullipotent endpoints - GET

### iii. Is the service RESTful? If not, why not? If so, what key features make it RESTful.

Yes, the service is restful because it is stateless, has directory structured URIs for the objects, and uses HTTP methods (GET, POST, PUT, DELETE)

### iv. Is there any evidence in your implementation of an impedance mismatch?

Yes, the database is modeled in a realational way with different tables, but the client app simply expects JSON objects.

## b.

### i. Would it be better to access the database using monopolyDirect.ts (simpler) rather than using this Web service (more complex)? Why or why not?

It is not recommended to access the database using monopolyDirect.ts because it would expose all of the database and its credentials. Accessing it through a web service might be more complex but it is secure, hides all the database structures and maintains access rules.

### ii. You implemented deleteGame and fetchPlayers using useCallBack. What good does this do?

useCallback prevents recreation of functions on every render and functions like useEffect, fetchPlayers don't trigger on every render.

## c. How effectively did Copilot work for you on this assignment? Include examples of things that it did correctly and/or incorrectly.

Co-pilot was effective in addressing connetivity issue with the backend. It correctly fixed my CORS issue which was preventing the app from loading all the game details.
