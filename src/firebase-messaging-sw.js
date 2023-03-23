importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyClzKnPCsqH0wIpdRgA1-VNB-WSCQn73rk",
    authDomain: "red-center.firebaseapp.com",
    projectId: "red-center",
    storageBucket: "red-center.appspot.com",
    messagingSenderId: "880704583837",
    appId: "1:880704583837:web:312aec2438ff06a7017c74",
    measurementId: "G-NC095M4JX4"
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
    // console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const bc = new BroadcastChannel('background_notification');
    // console.log('[firebase-messaging-sw.js] Send payload data : ', payload.data);
    bc.postMessage(JSON.stringify(payload.data));
  });