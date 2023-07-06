/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * This project has been implemented by Captain. Wutthichai R. TAA 1002048 based on Nebular.
 */

import { DBConfig } from "ngx-indexed-db";
import { NgxWatermarkOptions } from "ngx-watermark";

export const userLevel = {
    subscriber: 'Subscriber',
    moderatore: 'Moderator',
    admin: 'Admin',
};

export const roleName = {
    pilot: 'Pilot',
    cabinCrew: 'Cabin_Crew',
    fltOPS: 'Flight_Operations',
    training: 'Training',
    engineer: 'Engineer',
}

export const settings = {
    debug: false,
    onlyAirasiaLogin: true,
    redBookTMC: true
};

export const firestoreCollection = {
    eTS1CollectionName: '/eTS1',
    userCollectionName: '/users',
    vrCollectionName: '/vr',
    announcementCollectionName: '/announcements',
    fileUploadCollectionName: '/fileUploadInformation',
    groupTokenListCollectionName: '/groupTokenList',
    groupTokenDocumentName: 'tokenDocument',
};

export const firebaseDB = {
    dbPathName: '/uploads',
    dbABSPathName: 'gs://red-center.appspot.com',
};

export const localStorageCollection = {
    tabCollectionName: 'tabLocalName',
    autoLandCardCollectionName: 'AutoLandCardLocalDBName',
    firebaseUserStoreKeyCollectionName : 'firebaseUserStoreKey',
    firestoreUserDBNameCollectionName: 'firestoreUserDBName',
    newsLocalDBNameCollectionName: 'NewsLocalDBName',
    sepLocalDBNameCollectionName: 'SEPCardLocalDBName',
    manualLocalDBNameCollectionName: 'ManualCardLocalDBName',
    vrLocalDBNameCollectionName: 'VRLocalDBName'
};

export const localDB = {
    dbName: 'my-notification-database',
    objectStoreName: 'my-notification-object-store',
};

export const instructorList = [
    "wutthichair@airasia.com",
    "adisakh@airasia.com"
]

export const dbConfig: DBConfig  = {
    name: 'MyDb',
    version: 1,
    objectStoresMeta: [{
      store: 'certificates',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'link', keypath: 'link', options: { unique: true } },
        { name: 'uri', keypath: 'uri', options: { unique: false } }
      ]
    }]
};

export const statusConfig = {
    success: { status: 'success', icon: 'checkmark-circle-2'},
    warning: { status: 'warning', icon: 'alert-triangle'},
    danger: { status: 'danger', icon: 'close-square'},
};

// export const API = {
//     cloudFunctionAnnouncement: 'https://us-central1-red-center.cloudfunctions.net/sendNotification',
//     // sepGoogleService: 'https://script.google.com/macros/s/AKfycbyxxKjMeBQgDOj1s1A78fK-xGpOQv-YIXNgaJxQTIWncsFYt4z-szGrbURz3sCCJv3I/exec',
//     sepGoogleService: 'https://script.google.com/macros/s/AKfycbwmXXEWXuc9wgU-Wp579t5ssz3MIwZe7Zyz1qlOz-Ox99nIsrhWiHemkezY7T3ClY7N/exec',    
//     autolandGoogleSerivce: 'https://script.google.com/macros/s/AKfycbyVqLFc02e78IYpjEZYg6YW67fEYQIBiYi9FKXrh1ze3SB8oDz53lCLyxriLmIT72uJ/exec',
//     newsGoogleService: 'https://script.google.com/macros/s/AKfycby3jym8YGxvVAo4uOh6D5L1w_nwQzS7Mr_w3Tu-LS-xnkbJeUzvLPaz7Zbuo36mT2RL/exec',
//     performanceGoogleService: 'https://script.google.com/macros/s/AKfycbyAPnu61zvXx0AJ1xP0P8pNN1rkq7wqFi09x31W6vXtR2Ze66AKXgaRx7oXUrz8iz57/exec',

//     vrGoogleService: 'https://script.google.com/macros/s/AKfycbzwDk-vZNTX4NGy7buN2wDFErz3MzBaFC8wniDIX9BVkOUVTeeXJXKhDTtpKXwJxGaz/exec',
//     eTS1GoogleService: 'https://script.google.com/macros/s/AKfycbxW1rmS__ee8VXQsn35v-1URReJYWLCVe_1bOeyoft0wHTrWnDReX-aDg1MiNkJAnWc/exec',    

//     // redBookTMC: 'https://red-u.thaiairasia.co.th/training-api-prelaunch/v1/Redbook/GetRedbook',
//     // redBookTMC_X: '7eOOFH0SIRlp9HLlVAMo28YYm56cRZNQ',

//     redBookTMC: 'https://red-u.thaiairasia.co.th/training-api/v1/Redbook/GetRedbook',
//     redBookTMC_X: 'cbHBWdeRODn2f6H1xca52FYSIRc4WfC9',
// };

export const httpOptions = { "Content-Type": "text/plain;charset=utf-8", "mode":"no-cors" };

export let ngxWaterMarkOptions: NgxWatermarkOptions = {
    text: '',
    color: '#999',
    width: 300,
    height: 300,
    alpha: 0.4,
    degree: -45,
    fontSize: '20px',
};

export const registration = [
    { value: 'HS-ABA', label: 'HS-ABA' },
    { value: 'HS-ABB', label: 'HS-ABB' },
]

export const vrPosOptions = [
    { value: 'CP*', label: 'CP*' },
    { value: 'CP', label: 'CP' },
    { value: 'SFO', label: 'SFO' },
    { value: 'FO', label: 'FO' },
    { value: 'CCE', label: 'CCE' },
    { value: 'SC', label: 'SC' },
    { value: 'CC', label: 'CC' },
    { value: 'ENG', label: 'ENG' },
]

export const roleOptions = [
    { value: 'Pilot', label: 'Pilot', icon: 'assets/images/captain.png'},
    { value: 'Cabin_Crew', label: 'Cabin Crew', icon: 'assets/images/flight-attendant.png' },
    { value: 'Flight_Operations', label: 'Flight Operations', icon: 'assets/images/operation.png' },
    { value: 'Training', label: 'Training', icon: 'assets/images/training.png'},
    { value: 'Engineer', label: 'Engineer', icon: 'assets/images/engineer.png' },
];

export const levelOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Moderator', label: 'Moderator' },
    { value: 'Subscriber', label: 'Subscriber' },
];

export const  aocOptions = [
    { value: 'FD', label: 'FD - Thai' , icon: 'assets/images/flags/thailand.png'},
    { value: 'AK', label: 'AK - Malaysia', icon: 'assets/images/flags/malaysia.png'},
    { value: 'QZ', label: 'QZ - Indonesia', icon: 'assets/images/flags/indonesia.png'},
];

export const sepMandatory = {
    Pilot: ["My Picture", "Pilot License", "Medical License", "Passport", "English Proficiency"],
    Cabin_Crew: ["My Picture", "Medical License", "Passport"],
}

export const sepCourseOptions = {
    Pilot: ["Group Check", "TCAS", "RNP/BRNAV", "RVSM", "ETOPS A320", "RHS", "UPRT", "VVDN COMPETENCY", "VVCR COMPETENCY", "LVO CAT II", "LVO CAT IIIA", "A321", "LINE CHECK", "SEP DOOR DRILL", "SEP WET DRILL", "SEP FIRE DRILL", "SEP SLIDE DRILL", "SEP FIRST AID", "DANGEROUS GOOD AWARENESS", "CREW RESOURCE MANAGEMENT", "SMS CLASS", "AVSEC"],
    Cabin_Crew: ["Group Check", "A321", "LINE CHECK", "SEP DOOR DRILL", "SEP WET DRILL", "SEP FIRE DRILL", "SEP SLIDE DRILL", "SEP FIRST AID", "DANGEROUS GOOD AWARENESS", "CREW RESOURCE MANAGEMENT", "SMS CLASS", "AVSEC"],
}

export const profileDBLink = 'myProfilePicture';
  