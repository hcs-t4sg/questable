# Questable

## Pinned Resources

* [Database diagram](https://lucid.app/lucidchart/84a5f8af-49fd-4dac-8bdf-e5359f23e7cd/edit?viewport_loc=1704%2C37%2C1192%2C625%2C0_0&invitationId=inv_266a2ab9-176a-48f3-a437-fe2826087282)
  * Contains the schema for the Firebase backend. At the moment this covers both present and yet-to-be-implemented functionality.
* [Figma](https://www.figma.com/files/project/69509974/Questable?fuid=893746170428728405)
  * Contains lo-fi and hi-fi designs for reference when implementing features
* [Project specification](https://docs.google.com/document/d/1zEYQ_8ralRbhlfwCbdIvLIlCnB7eBjLtU0hESD7DCA8/edit?usp=sharing)
  * High-level description of Questable's base features

## Setup

### Clone repository

`cd` into a desired destination folder, then clone the repo (preferably using SSH):

```shell
git clone git@github.com:hcs-t4sg/questable.git
```

### Package installation and initial testing

1. Open the project folder in VSCode.

2. You should see a popup in the bottom right prompting you to install recommended extensions. Please install these, they'll be helpful for code formatting and developing the webapp. You can also view the recommended extensions in the extensions sidebar (`cmd + shift + X`.) You will also get a prompt to use the workspace's Typescript version; accept it.

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

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Tech and Development Stack Overview + Resources

### Tech Stack

* Current stack:
  * Typescript
    * [Documentation](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
    * [TS in 100 seconds](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=video&cd=&cad=rja&uact=8&ved=2ahUKEwjN3cqGuY79AhWKE1kFHYtdAlkQtwJ6BAgJEAI&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DzQnBQ4tB3ZA&usg=AOvVaw1iy4LRy3OK_iN9zbe6MJKl)
  * React
    * [Beta documentation](https://beta.reactjs.org) is most helpful
    * Our frontend Javascript framework!
  * Firebase
    * [Cloud Firestore](https://firebase.google.com/docs/firestore): Our database
    * [Firebase Authentication](https://firebase.google.com/docs/auth): Our user authentication framework
  * MUI
    * [Documentation](https://mui.com/material-ui/getting-started/overview/) 
      * Make sure you're on v5 docs and not v4 docs!
      * Generally the condensed code snippets in the documentation are enough for understanding the components, but you can click `<>` to view detailed source code in Typescript and/or Javascript
    * Our current component library. We may at some point migrate out of this into a more streamlined, easy-to-use framework (see below)
* Future stack:
  * Next.js
    * [Documentation](https://nextjs.org)
    * An industry-grade "extension" of React with several optimizations for more performant webapps
  * Potentially [Chakra UI](https://chakra-ui.com) or [Mantine](https://mantine.dev) or even [Tailwind UI](https://tailwindui.com/components) with [Tailwind CSS](https://tailwindcss.com)

### Development Tools

* Linting and formatting tools:

  * ESLint: Our Javascript linter. Statically analyzes our code to detect issues in formatting/consistency
  * Prettier: Our automatic code formatter. Better formatting capabilities than ESLint but doesn't handle quality issues
  * EditorConfig: Helps VSCode conform to our formatting settings as we code. 

  * Husky: Git hooks that auto-lint and format our code when we make a `git commit`

* Misc:

  * Better Comments: Allows you to add different types of comments like `// TODO` (todo), `// !` (error), `// ?` (question), etc.
  * Git Blame: Shows who made the last commit to the current line of code in VS Code's bottom status bar
  * VS Code Liveshare: Allows you to share your codespace with a teammate for working on the same files

## Starter Project

Questable moved quite quickly in development last semester, but as a result of the rapid feature implementation there's a decent amount of repetition, redundancy, and inefficiency in our code. These issues will make the code tough to maintain/continue developing on if not addressed. The purpose of this starter project is to help you get familiarized with Questable's codebase and figure out ways we can make it more streamlined.

### Questable-related Reading (15 min)

* Read through the [project specification](https://docs.google.com/document/d/1zEYQ_8ralRbhlfwCbdIvLIlCnB7eBjLtU0hESD7DCA8/edit?usp=sharing) for Questable from last semester, specifically the **MVP0 features** and the **Stretch goals highlighted in green** (those are the ones we got to last semester).
* Read the [Guide for SWEs](https://t4sg-wiki.notion.site/Guide-for-SWEs-7701c0ae139b49cfa65f84156c329021) here!

### Technical Reading (30 min)

This reading contains info on the React/MUI functionality that will be extremely useful in streamlining our code.

* Read [Managing State](https://beta.reactjs.org/learn/reacting-to-input-with-state) in the React beta documentation, from "Reacting to Input with State" to "Scaling Up with Reducer and Context"
* Read about [custom hooks](https://beta.reactjs.org/learn/reusing-logic-with-custom-hooks) in the React beta documentation
* Read about [composition](https://reactjs.org/docs/composition-vs-inheritance.html) in React using the `children` prop
* Read about how [reusable custom components](https://mui.com/material-ui/customization/how-to-customize/#2-reusable-component) can be created in MUI

### Exercise (1 hour 15 min)

* Scan through the codebase of Questable starting from `app.tsx` and sketch out a "**file/component tree**" outlining parent-child relationships between components.
  * Ex: `App()` has 4 major children specified by the `Route` components: `Home()`, `Settings()`, `ClassroomPage()`, and `SignInScreen`.
* For each component in the tree, make quick annotations for:
  * What is the purpose of the component?
  * What `props` are being received from the parent, and what are passed down to children?
  * What `state` variables are maintained in the component and for what purpose?
  * What data is being requested/sent to the database, if any? Is it a one-time query like `getDoc` or a subscription like `onSnapshot`?
* Now considering your constructed component tree and reading through the codebase, think deeply about the following and write down your thoughts:
  * Are there any `props` passed down deep into the component tree that we could lift into global `context` and `reducers`?
  * Is data being queried repetitively from the Firestore database in many components, when it could instead be queried once in a common parent and passed down to children through `props` or `context`?
  * Can some data fetching processes be simplified by writing a custom `hook`?
  * Do any components have similar interfaces/MUI components that we could factor out using composition (`children`) into reusable components?

**Bring your notes + thoughts to our first team meeting** so that we can have a discussion on the specific steps we can take to refactor Questable's codebase! 

Hopefully this helps you get familiar with the present code and also put some thinking into programmatic design and writing maintainable code. Let me know if you have any questions!

## How to Debug

Bugs in our code can come from several places:

* ESlint: You have some formatting/quality issues. Reading the error message can help you figure out 
* Typescript (ts): You have some issues with incompatible or unspecified data types somewhere. These can often be super informative.
  * For instance, are you depending on a value that could possibly be `null`? Are you not passing in all `props` required to a component?
  * The type interfaces are specified in `types.ts`. These help enforce the kind of data we pass around the app and to/from the database, so use them extensively!
  * **Unless absolutely necessary, do not just escape typing errors by using the `any` type!** Typescript errors almost always expose some sort of bug that can arise in production. Avoiding typescript bugs by just using `any` significantly decreases the maintainability of the codebase and will lead to much more challenging bugs in the future.
* Firebase/React: These bugs pretty much cover everything else, and the error will typically show up in your browser console. Visit your browser console periodically through DevTools to check for bugs, and you can use `console.log` to log values and view them in console.
