const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccount.json');

/*
  Firebase initialize app
*/
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //   databaseURL: "https://optonome-7b3a6.firebaseio.com",
});

/*
  Send Notification to Device
*/
const sendFirebaseNotification = (token = [], payload = {}, options = {}) => {
  admin
    .messaging()
    .sendEachForMulticast({
      tokens: token,
      ...payload,
      ...options,
    })
    .then(() => console.log('success'))
    .catch((err) => console.log(err));
};

module.exports = {
  sendFirebaseNotification,
};
