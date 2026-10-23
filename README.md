# Student Task Manager

A beginner-friendly, responsive task manager for keeping track of schoolwork. It uses plain HTML, CSS, and JavaScript—no frontend framework or build step is required.

## Run the app

Open `index.html` in a modern web browser.

## Features

- Add tasks with a title, description, priority, and due date.
- Edit or delete tasks, and mark tasks as completed.
- Filter the list and view task totals.
- Save tasks in the browser with local storage.
- Use the interface on desktop and mobile screens.

## Browser console errors

The browser Console shows JavaScript errors and warnings, usually with a message and a file and line number. The message points to the kind of problem; the linked source location helps you find where it happened.

### How to investigate an error

1. Open the app, then open your browser's developer tools (usually **F12** or **Ctrl+Shift+J** on Windows).
2. Select the **Console** tab and reload the page.
3. Read the first red error and note its full message, file name, and line number. Fix the first error before investigating later ones, because later errors can be consequences of the first.
4. Check that `index.html`, `styles.css`, and `script.js` are together in the same folder and that the filenames and paths match the references in `index.html`.
5. Reload and repeat the app action that caused the error. If it persists, share the exact console message and source location; don't guess at a fix based only on a similar-looking error.

### Common error types

- **`SyntaxError`**: JavaScript could not be parsed. Check the named line and the code immediately before it for a typo, missing quote, bracket, or parenthesis.
- **`ReferenceError`**: Code refers to a variable or function that is not available in that scope. Check its spelling and where it is declared.
- **`TypeError`**: Code tried an operation that is not valid for the value it received. Check the value and the line identified in the console.
- **Failed file/resource load**: The browser could not find a referenced file. Check the filename, folder, and relative path.

### Verification for this project

I reloaded the app in a browser and exercised adding, editing, completing, and deleting a task. No console errors or uncaught page errors appeared during the fresh reload. This verifies those checks in that browser session; if you see a different error, use its exact message and line number to investigate it.
