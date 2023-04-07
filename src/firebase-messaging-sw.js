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

    saveDataToIndexedDB(payload.data);
});


function saveDataToIndexedDB(data) {
    // Open a connection to the database
    let request = self.indexedDB.open('my-notification-database', 1);
  
    // Handle errors
    request.onerror = function(event) {
    //   console.log('Database error:', event.target.error);
    };
  
    // Create the object store and save the data
    request.onupgradeneeded = function(event) {
      let db = event.target.result;
      let objectStore = db.createObjectStore('my-notification-object-store', { keyPath: 'code' });
      objectStore.transaction.oncomplete = function(event) {
        let objectStore = db.transaction('my-notification-object-store', 'readwrite').objectStore('my-notification-object-store');
        objectStore.add(data);
        // console.log('add data' + JSON.stringify(data));
      };
    };

    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction('my-notification-object-store', 'readwrite');
        let objectStore = transaction.objectStore('my-notification-object-store');
      
        let request = objectStore.add(data);
        request.onsuccess = function(event) {
            // console.log(JSON.stringify(data));
        //   console.log('Data saved to IndexedDB');
        };
      
        request.onerror = function(event) {
        //   console.log('Error saving data to IndexedDB');
        };
      };
  }
  