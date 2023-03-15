/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  /*
    01 Mar 2023 wutthichair
      Add firebaseConfig
  */
  firebaseConfig : {
    apiKey: "AIzaSyClzKnPCsqH0wIpdRgA1-VNB-WSCQn73rk",
    authDomain: "red-center.firebaseapp.com",
    projectId: "red-center",
    storageBucket: "red-center.appspot.com",
    messagingSenderId: "880704583837",
    appId: "1:880704583837:web:312aec2438ff06a7017c74",
    measurementId: "G-NC095M4JX4"
  }
};
