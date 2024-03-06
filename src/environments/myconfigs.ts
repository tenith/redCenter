/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * This project has been implemented by Captain. Wutthichai R. TAA 1002048 based on Nebular.
 */

import { DBConfig } from "ngx-indexed-db";
import { NgxWatermarkOptions } from "ngx-watermark";

export const userLevel = {
  subscriber: "Subscriber",
  moderatore: "Moderator",
  admin: "Admin",
};

export const roleName = {
  pilot: "Pilot",
  seniorCabinCrew: "Senior_Cabin_Crew",
  cabinCrew: "Cabin_Crew",
  fltOPS: "Flight_Operations",
  training: "Training",
  engineer: "Engineer",
  ccd_team: "CCD_TEAM",
};

export const settings = {
  debug: false,
  onlyAirasiaLogin: true,
  redBookTMC: true,
};

export const firestoreCollection = {
  autoland_online: "/autoland_online",
  eTS1CollectionName: "/eTS1",
  userCollectionName: "/users",
  vrCollectionName: "/vr",
  announcementCollectionName: "/announcements",
  fileUploadCollectionName: "/fileUploadInformation",
  fileUploadHistoryCollectionName: "/fileUploadInformationHistory",
  groupTokenListCollectionName: "/groupTokenList",
  groupTokenDocumentName: "tokenDocument",
};

export const firebaseDB = {
  dbPathName: "/uploads",
  dbABSPathName: "gs://red-center.appspot.com",
};

export const localStorageCollection = {
  tabCollectionName: "tabLocalName",
  autoLandCardCollectionName: "AutoLandCardLocalDBName",
  firebaseUserStoreKeyCollectionName: "firebaseUserStoreKey",
  firestoreUserDBNameCollectionName: "firestoreUserDBName",
  newsLocalDBNameCollectionName: "NewsLocalDBName",
  sepLocalDBNameCollectionName: "SEPCardLocalDBName",
  sepHistoricalCollectionName: "SEPHistoricalDBName",
  manualLocalDBNameCollectionName: "ManualCardLocalDBName",
  vrLocalDBNameCollectionName: "VRLocalDBName",
};

export const localDB = {
  dbName: "my-notification-database",
  objectStoreName: "my-notification-object-store",
};

export const instructorList = [
  "wutthichair@airasia.com",
  "adisakh@airasia.com",
];

export const dbConfig: DBConfig = {
  name: "MyDb",
  version: 1,
  objectStoresMeta: [
    {
      store: "certificates",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "link", keypath: "link", options: { unique: true } },
        { name: "uri", keypath: "uri", options: { unique: false } },
      ],
    },
  ],
};

export const statusConfig = {
  success: { status: "success", icon: "checkmark-circle-2" },
  warning: { status: "warning", icon: "alert-triangle" },
  danger: { status: "danger", icon: "close-square" },
  pending: { status: "warning", icon: "question-mark-circle" },
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

export const httpOptions = {
  "Content-Type": "text/plain;charset=utf-8",
  mode: "no-cors",
};

export let ngxWaterMarkOptions: NgxWatermarkOptions = {
  text: "",
  color: "#999",
  width: 300,
  height: 300,
  alpha: 0.4,
  degree: -45,
  fontSize: "20px",
};

export const registration = [
  { value: "HS-ABA", label: "HS-ABA" },
  { value: "HS-ABB", label: "HS-ABB" },
];

export const vrPosOptions = [
  { value: "CP*", label: "CP*" },
  { value: "CP", label: "CP" },
  { value: "SFO", label: "SFO" },
  { value: "FO", label: "FO" },
  { value: "CCE", label: "CCE" },
  { value: "SC", label: "SC" },
  { value: "CC", label: "CC" },
  { value: "ENG", label: "ENG" },
];

export const roleOptions = [
  { value: "Pilot", label: "Pilot", icon: "assets/images/captain.png" },
  {
    value: "Senior_Cabin_Crew",
    label: "Senior Cabin Crew",
    icon: "assets/images/flight-attendant.png",
  },
  {
    value: "Cabin_Crew",
    label: "Cabin Crew",
    icon: "assets/images/flight-attendant.png",
  },
  // {
  //   value: "Flight_Operations",
  //   label: "Flight Operations",
  //   icon: "assets/images/operation.png",
  // },
  { value: "Training", label: "Training", icon: "assets/images/training.png" },
  { value: "Engineer", label: "Engineer", icon: "assets/images/engineer.png" },
  { value: "CCD_TEAM", label: "CCD Team", icon: "assets/images/operation.png" },
];

export const levelOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Moderator", label: "Moderator" },
  { value: "Subscriber", label: "Subscriber" },
];

export const aocOptions = [
  { value: "FD", label: "FD - Thai", icon: "assets/images/flags/thailand.png" },
  {
    value: "AK",
    label: "AK - Malaysia",
    icon: "assets/images/flags/malaysia.png",
  },
  {
    value: "QZ",
    label: "QZ - Indonesia",
    icon: "assets/images/flags/indonesia.png",
  },
];

export const sepMandatory = {
  Pilot: ["My Picture"],
  Senior_Cabin_Crew: ["My Picture", "Medical License"],
  Cabin_Crew: ["My Picture", "Medical License"],
};

export const requiredVerify = {
  Pilot: [],
  Senior_Cabin_Crew: ["Medical License"],
  Cabin_Crew: ["Medical License"],
};

export const strictVerify = {
  Pilot: [],
  Senior_Cabin_Crew: ["Medical License"],
  Cabin_Crew: ["Medical License"],
};

export const sepCourseOptions = {
  Pilot: [
    "OPC",
    "LINE CHECK",
    "SEP DOOR DRILL",
    "SEP WET DRILL",
    "SEP FIRE DRILL",
    "SEP SLIDE DRILL",
    "SEP FIRST AID",
    "DANGEROUS GOOD AWARENESS",
    "CREW RESOURCE MANAGEMENT",
    "SMS CLASS",
    "AVSEC",

    "ETOPS A320",
    "VVDN COMPETENCY",
    "VVCR COMPETENCY",
    "VNKT COMPETENCY",
    "RHS",
    "LVO",
    "AUTOLAND - SIMULATOR RECURRENT",
    "PBN (AR)",
  ],
  Senior_Cabin_Crew: [
    "SCC/ICC Recurrent Training",
    "SEP DOOR DRILL",
    "SEP WET DRILL",
    "SEP FIRE DRILL",
    "SEP SLIDE DRILL",
    "SEP FIRST AID",
    "DANGEROUS GOOD AWARENESS",
    "CREW RESOURCE MANAGEMENT",
    "SMS CLASS",
    "AVSEC",
    "Ground Check",
    "A321",
  ],
  Cabin_Crew: [
    "SEP DOOR DRILL",
    "SEP WET DRILL",
    "SEP FIRE DRILL",
    "SEP SLIDE DRILL",
    "SEP FIRST AID",
    "DANGEROUS GOOD AWARENESS",
    "CREW RESOURCE MANAGEMENT",
    "SMS CLASS",
    "AVSEC",
    "Ground Check",
    "A321",
  ],
};

export const ETS1UserList = [
  "karns@airasia.com",
  "chayakorna@airasia.com",
  "anuwatu@airasia.com",
  "khoonlorp@airasia.com",
  "wutthichair@airasia.com",
  "tawatchaid@airasia.com",
  "manitb@airasia.com",
  "patdanaix@airasia.com",
  "vichewinm@airasia.com",
  "chamnanp@airasia.com",
  "surasaku@airasia.com",
  "kullavatl@airasia.com",
  "surapongh@airasia.com",
  "phuwadetp@airasia.com",
  "ronnarongt@airasia.com",
  "sirapobj@airasia.com",
  "gumpholj@airasia.com",
  "phuripantd@airasia.com",
  "santik@airasia.com",
  "teerasakp@airasia.com",
  "korakochk@airasia.com",
  "piyawits@airasia.com",
  "nathaporna@airasia.com",
  "monsidp@airasia.com",
  "theerasaks@airasia.com",
  "werachaij@airasia.com",
  "pakornm@airasia.com",
  "panupongp@airasia.com",
  "pholp@airasia.com",
  "termsitp@airasia.com",
  "visutp@airasia.com",
  "witoont@airasia.com",
  "worrayotp@airasia.com",
  "pipathc@airasia.com",
  "paraweev@airasia.com",
  "pravitt@airasia.com",
  "arkarat@airasia.com",
  "siripongs@airasia.com",
  "khanchais@airasia.com",
  "pornsaki@airasia.com",
  "suwatchaip@airasia.com",
  "nachita@airasia.com",
  "nakwanm@airasia.com",
  "kawees@airasia.com",
  "athawatr@airasia.com",
  "thitinopp@airasia.com",
  "kiattipoomk@airasia.com",
  "tirapongk@airasia.com",
  "sathapornb@airasia.com",
  "taviteea@airasia.com",
  "chaichanap@airasia.com",
  "theerasitc@airasia.com",
  "paradonk@airasia.com",
  "adisakh@airasia.com",
  "mathawaja@airasia.com",
  "kittinunp@airasia.com",
  "wuti@airasia.com",
  "achirawatt@airasia.com",
  "surapongh@airasia.com",
  "tanapols@airasia.com",
  "rachans@airasia.com",
  "tanuchab@airasia.com",
  "thatrik@airasia.com",
  "sarawootv@airasia.com",
  "parinyao@airasia.com",
  "watcharae@airasia.com",
  "kittiyuthh@airasia.com",
  "chetthar@airasia.com",
  "chatreek@airasia.com",
  "chettachaid@airasia.com",
  "narupholc@airasia.com",
  "jirapathrj@airasia.com",
  "nakornl@airasia.com",
  "manoonj@airasia.com",
  "prasitp@airasia.com",
  "panlopk@airasia.com",
  "surapunp@airasia.com",
  "manatr@airasia.com",
  "thanasako@airasia.com",
  "natisk@airasia.com",
  "stapornp@airasia.com",
  "yuthakarnp@airasia.com",
  "damrongp@airasia.com",
  "chirasakn@airasia.com",
  "chalermrits@airasia.com",
  "watcharadulk@airasia.com",
  "worwinp@airasia.com",
  "isaraw@airasia.com",
];

export const RHSEmailLists = [
  "manatr@airasia.com",
  "tanuchab@airasia.com",
  "surapongh@airasia.com",
  "ronnarongt@airasia.com",
  "werachaij@airasia.com",
  "manoonj@airasia.com",
  "panlopk@airasia.com",
  "paradonk@airasia.com",
  "damrongp@airasia.com",
  "narupholc@airasia.com",
  "surapunp@airasia.com",
  "adisakh@airasia.com",
  "mathawaja@airasia.com",
  "teerasakp@airasia.com",
  "chatreek@airasia.com",
  "tanapols@airasia.com",
  "thanasako@airasia.com",
  "tirapongk@airasia.com",
  "nakornl@airasia.com",
  "korakochk@airasia.com",
  "kiattipoomk@airasia.com",
  "theerasitc@airasia.com",
  "thitinopp@airasia.com",
  "natisk@airasia.com",
  "isaraw@airasia.com",
  "chetthar@airasia.com",
  "athawatr@airasia.com",
  "stapornp@airasia.com",
  "parinyao@airasia.com",
  "chaichanap@airasia.com",
  "jirapathrj@airasia.com",
  "kittiyuthh@airasia.com",
  "watcharae@airasia.com",
  "chirasakn@airasia.com",
  "rachans@airasia.com",
  "watcharadulk@airasia.com",
  "thatrik@airasia.com",
  "wuti@airasia.com",
  "nakwanm@airasia.com",
  "sarawootv@airasia.com",
  "taviteea@airasia.com",
  "kawees@airasia.com",
  "yuthakarnp@airasia.com",
  "prasitp@airasia.com",
  "chettachaid@airasia.com",
  "sathapornb@airasia.com",
  "kittinunp@airasia.com",
  "worwinp@airasia.com",
  "achirawatt@airasia.com",
  "chalermrits@airasia.com",

  "anuchai@airasia.com",
  "attapolt@airasia.com",
  "arthapola@airasia.com",
  "pittinuni@airasia.com",
  "nuchitk@airasia.com",
  "kitikunk@airasia.com",
  "kittia@airasia.com",
  "suthips@airasia.com",
  "panpiboony@airasia.com",
  "jaraspongr@airasia.com",
  "paranchaio@airasia.com",
  "sathapornu@airasia.com",
  "chatchavalt@airasia.com",
  "jarund@airasia.com",
  "kalacharnk@airasia.com",
  "phanpitik@airasia.com",
  "thasanb@airasia.com",
  "rapeeponp@airasia.com",
  "theerawatp@airasia.com",
  "toapongr@airasia.com",
  "somsakuls@airasia.com",
];

export const sepCourseBasicRequiredToOperate = {
  Pilot: [
    "OPC",
    "LINE CHECK",
    "SEP DOOR DRILL",
    "SEP WET DRILL",
    "SEP FIRE DRILL",
    "SEP SLIDE DRILL",
    "SEP FIRST AID",
    "DANGEROUS GOOD AWARENESS",
    "CREW RESOURCE MANAGEMENT",
    "SMS CLASS",
    "AVSEC",
  ],
  Senior_Cabin_Crew: [
    "SCC/ICC Recurrent Training",
    "SEP DOOR DRILL",
    "SEP WET DRILL",
    "SEP FIRE DRILL",
    "SEP SLIDE DRILL",
    "SEP FIRST AID",
    "DANGEROUS GOOD AWARENESS",
    "CREW RESOURCE MANAGEMENT",
    "SMS CLASS",
    "AVSEC",
  ],
  Cabin_Crew: [
    "SEP DOOR DRILL",
    "SEP WET DRILL",
    "SEP FIRE DRILL",
    "SEP SLIDE DRILL",
    "SEP FIRST AID",
    "DANGEROUS GOOD AWARENESS",
    "CREW RESOURCE MANAGEMENT",
    "SMS CLASS",
    "AVSEC",
  ],
};

export const sepCourseDisplayOptions = {
  // TCAS: { Initial: false, ShowHistory: false },
  // "RNP/BRNAV": { Initial: false, ShowHistory: false },
  // RVSM: { Initial: false, ShowHistory: false },
  "ETOPS A320": { Initial: false, ShowHistory: false },
  RHS: { Initial: true, ShowHistory: false },

  LVO: { Initial: false, ShowHistory: false },
  "AUTOLAND - SIMULATOR RECURRENT": { Initial: false, ShowHistory: false },
  "PBN (AR)": { Initial: false, ShowHistory: false },
  // UPRT: { Initial: false, ShowHistory: false },
  "VVDN COMPETENCY": { Initial: false, ShowHistory: false },
  "VVCR COMPETENCY": { Initial: false, ShowHistory: false },
  "VNKT COMPETENCY": { Initial: false, ShowHistory: false },
  // "LVO CAT II": { Initial: false, ShowHistory: false },

  // "LVO CAT IIIA": { Initial: false, ShowHistory: false },
  A321: { Initial: false, ShowHistory: false },
  "LINE CHECK": { Initial: false, ShowHistory: false },
  OPC: { Initial: false, ShowHistory: false },
  "SCC/ICC Recurrent Training": { Initial: true, ShowHistory: true },
  "SEP DOOR DRILL": { Initial: true, ShowHistory: false },
  "SEP WET DRILL": { Initial: true, ShowHistory: false },

  "SEP FIRE DRILL": { Initial: true, ShowHistory: false },
  "SEP SLIDE DRILL": { Initial: true, ShowHistory: false },
  "SEP FIRST AID": { Initial: true, ShowHistory: false },
  "DANGEROUS GOOD AWARENESS": { Initial: true, ShowHistory: true },
  "CREW RESOURCE MANAGEMENT": { Initial: true, ShowHistory: false },

  "SMS CLASS": { Initial: true, ShowHistory: false },
  AVSEC: { Initial: true, ShowHistory: true },
  "Ground Check": { Initial: false, ShowHistory: false },
};

export const profileDBLink = "myProfilePicture";

export const predefinedListOfIssueBy = {
  "Pilot License": ["THE CIVIL AVIATION AUTHORITY OF THAILAND"],
  "Medical License": [
    "BANGKOK HOSPITAL",
    "B. CARE MEDICAL CENTER HOSPITAL",
    "INSTITUE OF AVIATION MEDICINE, RTAF",
    "PAOLO CHOCKCHAI 4 HOSPITAL",
    "PAOLO KASET HOSPITAL",
    "SAMITIVEJ HOSPITAL",
  ],
  Passport: ["MINISTRY OF FOREIGN AFFAIRS OF THAILAND"],
  "English Proficiency": ["THE CIVIL AVIATION AUTHORITY OF THAILAND"],
};
