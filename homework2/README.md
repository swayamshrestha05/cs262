a.
An alternative to Context is Redux. In the case of this to-do app, it would be better to stay with context because it is relatively simple with only requiring deleteItem which is relatively straightforward. It would be better to use Redux when there is complex state management with many interconnected components and to avoid performance bottlenecks like re-rendering.

b.
The app loads the item data when the ItemProvider component is inserted into the DOM where the fetchItems() function is called. The useEffect hook is used to call fetchItems() and load the data.

c.
Copilot wasn't helpful in terms of writing the code as it was answering questions in terms of other projects in my directory evn with context provided. It was effective while answering these questions and better understanding the functions.
