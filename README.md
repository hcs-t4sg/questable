# Questable

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can find an example live implementation [here](https://f22-deliv-public.vercel.app/).

After cloning the repo, you should `cd` into the repo directory and run:

### `npm install`

to install all necessary packages.

If you get an `npm: command not found` error or something similar, you probably haven't installed `npm` yet. Try [this](https://kinsta.com/blog/how-to-install-node-js/#how-to-install-nodejs-and-npm) link for help.

You may get a message like: `7 high severity vulnerabilities`. You can ignore this. If you have `critical` vulnerabilities you can run `npm audit fix`, which should lower the number of vulnerabilities.

If you get an `ERESOLVE` error mentioning an upstream dependency conflict, try `npm install --legacy-peer-deps`, and if that doesn't work, `npm install --force`.

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
