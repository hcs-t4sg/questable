# HUDS 2.0 Wintersession Project

Welcome to the HUDS 2.0 project! Created by T4SG Wintersession 2023 Team 2.

## Setup

### Clone repository

`cd` into a desired destination folder, then clone the repo (preferably using SSH):

```shell
git clone git@github.com:hcs-t4sg/wintersession-huds.git
```

### Package installation and initial testing

1. Open the project folder in VSCode.

2. You should see a popup in the bottom right prompting you to install recommended extensions. Please install these, they'll be helpful for code formatting and developing the webapp. You can also view the recommended extensions in the extensions sidebar (`cmd + shift + X`.)

3. Open a terminal in the project folder by dragging up from the bottom of the code window or by going to `Terminal > New Terminal` in the menu bar.

4. Run: `npm install` (`npm i` for short)

   * You might get some sort of `ERESOLVE... dependency conflict` error. That's fine, just run `npm install -force` (`npm i -f` for short).
   * If you get something like "command not found", you might not have `npm` installed.

   * If successful you should see something like:

   ```bash
   added 1588 packages, and audited 1589 packages in 28s
   
   241 packages are looking for funding
     run `npm fund` for details
   
   6 high severity vulnerabilities
   
   To address all issues (including breaking changes), run:
     npm audit fix --force
   
   Run `npm audit` for details.
   ```

   * You don't have to do anything else with the output. Ignore the security vulnerabilities, they're not severe and usually just caused by poor maintenance by package developers.

5. Run `npm start` to start the webapp. You should be able to open and view the app in `localhost` without any bugs.

## Starter Pack

This is mostly just reading to help you get familiar with the tech stack we'll be using. You can skim through it briefly to get a sense of what's going on, and I'd recommend getting through at least the Javascript, React, and MUI sections and the very first entry in the HUDS API section. I'll try to explain most of this in team meetings, and certainly let me know if you have any questions!

#### Javascript

You should already have a basic understanding of Javascript, so just make sure you understand the following concepts:

* What a Javascript function looks like
* What a Javascript arrow function looks like
* The difference between `let` and `const`, when to use them, and why you shouldn't use `var`
* `For` loops, conditionals (`if`, `else`, ternary operator), booleans and logical operators (`&&`, `!`, `===`, `!==`)
* Indexing into and iterating over arrays and objects (`.map`, `.forEach`, chaining with `.`, optional chaining with `?.` )
* The spread operator (`...`)

#### React

Read through this basic [React tutorial](https://reactjs.org/docs/hello-world.html) through part 7: Conditional rendering.

Read through this explanation of [React hooks](https://reactjs.org/docs/hooks-intro.html) through part 4: Using the Effect Hook.

#### MUI (Material UI)

* Skim this [quick overview](https://mui.com/material-ui/getting-started/overview/) of MUI to get a sense of what it is.

* On the MUI website, browse through the list of components in the sidebar just to get a sense of what's available. You can do quite a lot with MUI!
  * Also note that you can click the `<>` icon to view example code for all components. That's why MUI is so helpful!

* Understanding how to define layout and positioning of page elements is one of the trickiest parts to frontend development, but will be extremely helpful far into the future if you learn it well now. Read through the documentation for the [MUI Grid v2 system](https://mui.com/material-ui/react-grid2/) to get a basic understanding of how MUI-designed webpages are laid out, and also take a look at this guide to [CSS flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/), which we can use in conjunction with MUI to easily align/position our page components.

#### HUDS API (and other REST API information)

* Read through this [overview/spec](overview/spec) of the HUDS API. The left sidebar lists the different endpoints you can hit and the kind of information that can be obtained. This will be helpful in deciding what specific information you want to display on the webapp.
* Helpful YouTube [video](https://www.youtube.com/watch?v=7YcW25PHnAA) explaining what REST APIs are (the HUDS API is one of them)
* [Tutorial from HUIT](https://portal.apis.huit.harvard.edu/using-postman#top) on how to access and test its APIs using Postman

#### Firebase

Our app will use a [Cloud Firestore database](https://firebase.google.com/docs/firestore). You can take a brief look through the documentation; the most important sections we'll certainly be using are:

* Data model
* Add data
* Delete data
* Get data

Additionally, ideas from these two sections are used in the webapp, but I've already taken care of those parts. You can look through them if you want some deeper understanding (also helpful for T4SG applications!).

* Get real-time updates
* Perform simple and compound queries

## Development Tips and Helpful Commands

Here are some helpful tips you should keep in mind when programming!

* You can use VSCode LiveShare (recommended extension) to work together/pair-program on the same files.
* Whenever you reach a good, non-buggy milestone in your work, make a commit and push your work! This is not only a good habit to keep track of your development timeline, but also so that if you mess up the code super badly you can `git reset` to a stable commit (just be careful when using `git reset` and ask me first)
* `npm install` installs necessary and/or new packages (you should have already done this). `npm start` starts the webapp, you can kill it with `Ctrl + C`. Whenever you save your work, the webapp should automatically update (React is awesome like that), so you don't need to kill the webapp to see your changes. Personally I prefer turning off autosave in VS Code as it gives me greater control/understanding of what's happening in the `localhost` webapp.
* Make sure you know how to use your developer tools to inspect the frontend HTML components. You can use them to get a visual understanding of how your components are arranged and important properties like margin, padding, height, etc.
* Errors can show up in two places: your VSCode terminal and the browser console (accessed through devtools). Make sure check both places when you get a bug. Reading error messages thoroughly generally gives you a good idea of what went wrong, but you can always ask me for help!
* When bugfixing, resist the urge to copy-paste solutions from Google or StackOverflow without taking the time to understand them. Doing that just opens you up to even worse bugs down the road. Having the patience to read and understand the documentation is also how you grow as a SWE! :)
