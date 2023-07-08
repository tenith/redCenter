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
  appVersion: require('../../package.json').version + '-dev',
  production: false,
  /*
    01 Mar 2023 wutthichair
      Add firebaseConfig
  */
  firebaseConfig : {
    
    apiKey: "AIzaSyAZXCFg_Kf4Gf9KsH7FhoFLIbXdCktjqSk",
    authDomain: "lightredcenter.firebaseapp.com",
    projectId: "lightredcenter",
    storageBucket: "lightredcenter.appspot.com",
    messagingSenderId: "440217947980",
    appId: "1:440217947980:web:ef214bf8ba4f75e41bc9e9",
    measurementId: "G-VG0B1NQLFY",

    // apiKey: "AIzaSyClzKnPCsqH0wIpdRgA1-VNB-WSCQn73rk",
    // authDomain: "red-center.firebaseapp.com",
    // projectId: "red-center",
    // databaseURL: "red-center.firebaseio.com",
    // storageBucket: "red-center.appspot.com",
    // messagingSenderId: "880704583837",
    // appId: "1:880704583837:web:312aec2438ff06a7017c74",
    // measurementId: "G-NC095M4JX4",
    vapidKey: "BOve8TKsfSKrRzdpsJy-cyKljdgWpbChZnnbCL_USVFzmvSwNMPUxchiH0_83O-jwNl5Z7XpX5g_V2t1XfKrdhE"
  }
};

export const API = {
  cloudFunctionAnnouncement: 'https://us-central1-lightredcenter.cloudfunctions.net/sendNotification',
  cloudFunctionVRNotification: 'https://us-central1-lightredcenter.cloudfunctions.net/sendVRNotification',
  cloudFunctionETS1Notification: 'https://us-central1-lightredcenter.cloudfunctions.net/sendETS1Notification',
  
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

export const clickActionVR = 'https://lightredcenter.web.app/pages/eVR/workspace?id=';

export const showMenu = ['Home', 'Authorization', 'Documents Amendment', 'Personal document(s)', 'E-VR', 'My performance', 'E-TS1', 'SEP Card', 'Log out'];
