const qr = require('qrcode');

const createQRCode = async (data) => {
  return new Promise((resolve, reject) => {
    qr.toDataURL(data, (err, src) => {
      if (err) console.log(err);
      else {
        // const base64Data = src.replace(/^data:image\/png;base64,/, '');
        resolve(src);
      }
    });
  });
};

module.exports = { createQRCode };
