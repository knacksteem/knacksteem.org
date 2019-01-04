# Knacksteem v.1.0

## What is knackSteem?
Knacksteem is an open source platform on the Steem blockchain that seeks to reward talents on a much broader scale, which eradicates partiality, and infuses transparency, on the blockchain.

The project aimed to reward great and passionate article writers, hard-working individuals willing to promote their culture and interesting, original skills. It aims to remove the need for mediators and encourage cultural activities and sharing your passion with a wide audience, getting rewarded in the process.
Check out the project landing page for more info [here](https://join.knacksteem.org/) 

## Licence
This project is licensed under the [GNU General Public License v3.0](https://github.com/knacksteem/knacksteem.org/blob/develop/LICENSE). For more information, click [here](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Development Process
The **"develop"** branch is meant for the stable version of this project. Please see [contribution guideline](https://github.com/knacksteem/knacksteem.org/blob/develop/Contributing.md) for more indept information about the contribution process.


This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and [React App Rewined](https://github.com/timarney/react-app-rewired)
For any Steemconnect interactions we use [sc2-sdk](https://www.npmjs.com/package/sc2-sdk)


## How to Use

For now you just have to:

```

yarn install
yarn start

```

Make sure the Backend Server/API is running: https://github.com/knacksteem/knacksteem-api


## Dev server recompiling
If running the development server (`yarn start`) in a virtual machine or container environment (e.g. Docker), the changes made to the filesystem might not get picked up. If so, you can still use live-reloading by changing the configuration of the development server. Modify `config-overrides.js` to uncomment the line setting the `poll` property and the development server should then pick up your changes as you modify the files.
