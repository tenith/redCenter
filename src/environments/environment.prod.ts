/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  appVersion: require('../../package.json').version,
  production: true,
  /*
    01 Mar 2023 wutthichair
      Add firebaseConfig
  */
  firebaseConfig : {
    apiKey: "AIzaSyClzKnPCsqH0wIpdRgA1-VNB-WSCQn73rk",
    authDomain: "red-center.firebaseapp.com",
    projectId: "red-center",
    databaseURL: "red-center.firebaseio.com",
    storageBucket: "red-center.appspot.com",
    messagingSenderId: "880704583837",
    appId: "1:880704583837:web:312aec2438ff06a7017c74",
    measurementId: "G-NC095M4JX4",
    vapidKey: "BCuIfA9ISlQR9IMblIGlnwiLfuo71eJViwltkPuteEiRVKjw7pdRoUrbEiV1hVgPdr6qDpnO-iiE3Kq_x_8rCt8"
  }
};

export const showMenu = ['Home', 'Authorization', 'SEP Card', 'Log out'];
