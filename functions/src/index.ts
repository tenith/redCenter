// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as cors from 'cors';
const corsHandler = cors({origin: true});

try{
    admin.initializeApp();
}
catch(error){
    console.log('Unable to initializeApp : ' + error);
}

export const sendNotification = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => { 
        //Your code here

        res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Methods', 'GET, POST');


  let announcementsID = req.query.announcementsID as string;
//   console.log('Server got Announcements ID: ' + announcementsID);
  announcementsID = encodeURIComponent(announcementsID);
                                                   
//   console.log('Server try to request: ');
//   console.log(`/announcements/${announcementsID}`);

  let announcementsSnapshot: any;
  await getAnnouncement(announcementsID)
    .then(doc=> {
            if(doc.exists){
                // console.log(JSON.stringify(doc.data()));
                announcementsSnapshot = doc.data();
            }
            else
            announcementsSnapshot = null;
        })
        .catch(error=> {
            announcementsSnapshot = null;
            res.status(500).send('ERROR' + error);
        });
//   console.log('Server got Announcements information: ' + JSON.stringify(announcementsSnapshot));

  // Set up the notification payload
  const payload: admin.messaging.MessagingPayload = {
    data: {
      owner: announcementsSnapshot.author,
      subject: 'New document amendment',
      short_subject: announcementsSnapshot.code,
      link: './pages/documents_amendment/document',
      acknowledgeRequired: announcementsSnapshot.acknowledge,
      icon: 'file-text-outline',
      type: 'document',
      uuid: '',
      code: announcementsSnapshot.code
    },
    notification: {
      title: 'New document amendment',
      body: 'This is a new document amendment for you',
      icon: 'https://cdn-icons-png.flaticon.com/512/9746/9746449.png',
      click_action: 'http://localhost:4200/pages/documents_amendment/dashboard',
      url: 'http://localhost:4200/pages/documents_amendment/dashboard'
    }
  };

  const audienceList = announcementsSnapshot.audience as string[];
  console.log('Audience Group: ' + JSON.stringify(audienceList));

  for(let j=0;j<audienceList.length;j++){
    let groupTokenSnapshot: any;
    await getGroupTokenList(audienceList[j])
    .then(doc=> {
            if(doc.exists){
                // console.log(JSON.stringify(doc.data()));
                groupTokenSnapshot = doc.data().tokenList as string[];
            }
            else
            groupTokenSnapshot = null;
        })
        .catch(error=> {
            groupTokenSnapshot = null;
            res.status(500).send('ERROR' + error);
        });

    console.log('Number of notifications: ' + groupTokenSnapshot.length);
    sendMessageUsingArray(groupTokenSnapshot,payload);
  }
  
  res.status(200).send('Notification sent');
      });
  
});

function sendMessageUsingArray(deviceToken: string[], payload: any): void{
    let tempPayload = payload;
    if(deviceToken.length <= 500){
        // tempPayload.tokens = deviceToken;
        // console.log('temp Payload : ' + JSON.stringify(tempPayload));
        sendMessage(deviceToken, payload);
        // admin.messaging().sendMulticast(payload);
    }
    else{
        tempPayload.tokens = deviceToken.slice(0,500);
        sendMessage(tempPayload, payload);
        // admin.messaging().sendMulticast(payload);

        sendMessageUsingArray(deviceToken.slice(500), payload);
    }
}

function sendMessage(deviceToken: string[], payload: any): void{
    admin.messaging().sendToDevice(deviceToken, payload)
    .then(response => {
        console.log(`FCM Message sent successfully: ${response.successCount} messages sent.`);
    })
    .catch(error => {
        console.error('Error sending FCM message:', error);
    });
}

async function getAnnouncement(announcementsID: string): Promise<any>{
    // console.log('function getAnnouncement :' + announcementsID);
    const db = admin.firestore();
    const announcementRef = db.collection('/announcements').doc(announcementsID);
    return announcementRef.get();
}

async function getGroupTokenList(group: string): Promise<any>{
    // console.log('function getGroupTokenList :' + group);
    const db = admin.firestore();
    const tokenDocumentRef = db.collection('/groupTokenList').doc('FD').collection(group).doc('tokenDocument');
    return tokenDocumentRef.get();
}