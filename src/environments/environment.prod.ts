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

export const API = {
  cloudFunctionAnnouncement: 'https://us-central1-red-center.cloudfunctions.net/sendNotification',
  cloudFunctionVRNotification: 'https://us-central1-red-center.cloudfunctions.net/sendVRNotification',
  cloudFunctionETS1Notification: 'https://us-central1-red-center.cloudfunctions.net/sendETS1Notification',
  cloudFunctionPersonalDocNotification: 'https://us-central1-red-center.cloudfunctions.net/sendPersonalDocNotification',
  cloudFunctionCCDTEAMPersonalDocNotification: 'https://us-central1-red-center.cloudfunctions.net/sendCCDPersonalDocNotification',
  
  // sepGoogleService: 'https://script.google.com/macros/s/AKfycbyxxKjMeBQgDOj1s1A78fK-xGpOQv-YIXNgaJxQTIWncsFYt4z-szGrbURz3sCCJv3I/exec',
  sepGoogleService: 'https://script.google.com/macros/s/AKfycbwmXXEWXuc9wgU-Wp579t5ssz3MIwZe7Zyz1qlOz-Ox99nIsrhWiHemkezY7T3ClY7N/exec',    
  autolandGoogleSerivce: 'https://script.google.com/macros/s/AKfycbyVqLFc02e78IYpjEZYg6YW67fEYQIBiYi9FKXrh1ze3SB8oDz53lCLyxriLmIT72uJ/exec',
  newsGoogleService: 'https://script.google.com/macros/s/AKfycby3jym8YGxvVAo4uOh6D5L1w_nwQzS7Mr_w3Tu-LS-xnkbJeUzvLPaz7Zbuo36mT2RL/exec',
  performanceGoogleService: 'https://script.google.com/macros/s/AKfycbyAPnu61zvXx0AJ1xP0P8pNN1rkq7wqFi09x31W6vXtR2Ze66AKXgaRx7oXUrz8iz57/exec',

  vrCommentGoogleService: 'https://script.google.com/macros/s/AKfycbxl0ej86EJ8E61Btz-3a86yzrd01nhEksxtxCvubM5P99QM3VGlvM-1HWfctRD76CCl/exec',
  vrGoogleService: 'https://script.google.com/macros/s/AKfycbzwDk-vZNTX4NGy7buN2wDFErz3MzBaFC8wniDIX9BVkOUVTeeXJXKhDTtpKXwJxGaz/exec',
  eTS1GoogleService: 'https://script.google.com/macros/s/AKfycbxW1rmS__ee8VXQsn35v-1URReJYWLCVe_1bOeyoft0wHTrWnDReX-aDg1MiNkJAnWc/exec',    

  // redBookTMC: 'https://red-u.thaiairasia.co.th/training-api-prelaunch/v1/Redbook/GetRedbook',
  // redBookTMC_X: '7eOOFH0SIRlp9HLlVAMo28YYm56cRZNQ',

  redBookTMC: 'https://red-u.thaiairasia.co.th/training-api/v1/Redbook/GetRedbook',
  redBookTMC_X: 'cbHBWdeRODn2f6H1xca52FYSIRc4WfC9',
};

export const baseURL = 'https://red-center.web.web.app/';

export const clickActionVR = 'https://red-center.web.app/pages/eVR/workspace?id=';

export const showMenu = ['Home', 'Authorization', 'Documents verification', 'SEP Card', 'Log out'];
