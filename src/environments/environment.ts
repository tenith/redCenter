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
    apiKey: "AIzaSyBNzq0vOMsBXMCrwD5rZKXmwNjIYWs0ZLg",
    authDomain: "redbook-taa.firebaseapp.com",
    projectId: "redbook-taa",
    storageBucket: "redbook-taa.appspot.com",
    messagingSenderId: "826040339698",
    appId: "1:826040339698:web:e5781b8f67c7762402546b"
  }
};
