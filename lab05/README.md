##a.
\*The original app couldn't delete items from the list because there was no shared state between index.tsx and details.tsx. Both screens independently loaded the data from the json file. So, when you try to delete an item from the details screen, there was no way to communicate the change to the index screen.

##b.
\*To allow users to add a new item, an add button indicated by "+" on the index page, and upon clicking the button, it would open a new screen add.tsx. An addItem dunction can be added to the context which appends new items to the index screen.

\*To update an existing item, an edit button can be added to the details scren. Pressing the button opens a new screen, edit.tsx. A new function updateItem can be added to the context which can update details about the item based on its ID.

##c.
\*The old version did not follow best practices because it passed entire objects as JSON in the parameter which created long URLs and lowers performance. However, the new version follows best practice by only passing in the item ID. It minimizes the URL size and is easier to maintain.

##d.
\*useCallback memoizes the function which prevents unnecessary re-renders of child components. For every renderm the same function reference is used which improves performance by reducing memory usage and unnecessary re-rendering.

##e.
\*Yes, the changes made to the app can be seen as refactoring because the internal code of the app was changed without affecting its external behavior. Through this I was able to:

1. move from prop drilling to context
2. changed from passing entire objects as JSON to only passing itemID
3. make the delete functionality work due to shared states between index.tsx and details.tsx.
