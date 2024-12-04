const Mobile = require('../models/mobile.model');
const { sendFirebaseNotification } = require('./firebaseNotification.service');

const options = require('../config/fcmOptions');

const getDevices = async (user) => {
  return Mobile.find({ user: { $in: user } })
    .select('pushTokenId user -_id ')
    .lean();
};

const sendPushNotification = async (mobiles, payload) => {
  const token = mobiles.map((item) => {
    return item.pushTokenId;
  });
  /* Send Firebase Notification */
  if (token.length) sendFirebaseNotification(token, payload);
};

// const sendPushANM = async (anm, patient = {}, reason = {}) => {
//   // const anmData = await anmService.getANMUserIdById(anm);
//   const anmData = await anmService.getANMsByHealthPost(patient.healthpost);
//   if (!anmData) return;
//   const user = anmData.map((el) => {
//     return el.user.toString();
//   });
//   const mobiles = await getDevices(user);
//   const patientName = patient?.name || '';

//   const payload = {
//     notification: {
//       title: `Emergency Alert!`,
//       body: `${patientName} बाट आपतकालीन संकेत प्राप्त भयो । थप विवरण हेर्न तथा तत्काल आवश्यक कार्यको लागि यहाँ थिच्नुहोस् ।`,
//     },
//     data: {
//       reason: JSON.stringify({
//         ...reason,
//       }),
//       type: 'symptoms',
//     },
//     ...options,
//   };

//   if (mobiles && mobiles.length > 0) {
//     sendPushNotification(mobiles, payload);
//   }
// };

module.exports = {
  //   sendPushANM,
  getDevices,
  sendPushNotification,
};
