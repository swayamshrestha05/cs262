### a.

1. Promises

- Promises handle asynchronour operations which use async/await.
- fetch() returns a promise when the HTTP request to the server is complete, and response.json() also returns a promise that parses the response into json.

2. JSON

- JSON is used to transfer data between the server and the app.
- response.json() converts the JSON string retrieved from the server into a javascript object which can be used in the app.

3. Hooks

- useState: It manages the component state for the loading status when retrieving items from the server
- useEffect: It runs the getItems() function once the components load

4. HTTP methods

- The app uses the GET method when executing fetch() to retrieve data from the server.

### b.

- When modifying the URL to an invalid value, the app still loads, but no data is retreived. It also throws a syntax error: JSON parse error: Unexpected character.
