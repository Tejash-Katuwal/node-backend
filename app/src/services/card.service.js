// const fs = require(`fs`);
// const moment = require('moment');
// const { loadImage, createCanvas, registerFont, Image } = require(`canvas`);

// const nagarpalikaService = require('./nagarpalika.service');
// const administratorService = require('./administrator.servce');
// const qrCodeService = require('./qrCode.service');
// const calendarService = require('./calendar.service');

// const {
//   DISABILITYTYPE: { SIGNATUREMAP, COLORMAP, CHARMAP, CHARMAP_EN, ENGMAP },
//   GENDER: { ENGMAP: GENDERENGMAP },
//   ORGANDIABILITYTYPE: { ENGMAP: ORGANENGMAP },
// } = require('../config/enum');
// const { getOridinals_np, getOridinals_en } = require('../utils/getOridinals');
// const ApiError = require('../utils/ApiError');
// const httpStatus = require('http-status');

// const nepali = 'nepali';
// const nepaliBold = 'nepaliBold';
// const english = 'english';
// const englishBold = 'englishBold';

// registerFont(`${__dirname}/../assets/font/Mukta-Bold.ttf`, { family: nepaliBold });
// registerFont(`${__dirname}/../assets/font/Mukta-Regular.ttf`, { family: nepali });
// registerFont(`${__dirname}/../assets/font/roboto-bold.ttf`, { family: englishBold });
// registerFont(`${__dirname}/../assets/font/roboto.ttf`, { family: english });

// const multiplier = 5;
// let langMultiplier;
// const width = multiplier * 86 * 3.779527564;
// const height = multiplier * 54 * 3.779527564;

// let canvas;
// let ctx;
// let font;
// let fontBold;

// const title_elderly = {
//   number: 'परिचयपत्र नं :',
//   name: 'नाम, थर :',
//   state: 'ठेगाना :',
//   district: 'जिल्ला :',
//   municipalityName: 'पालिका :',
//   ward: 'वडा नं. :',
//   tole: 'टोल / गाउँ :',
//   dateOfBirth: 'जन्म मिति :',
//   citizenshipNo: 'नागरिकता प्रमाणपत्र नं :',
//   address: 'ठेगाना :',
//   age: 'उमेर :',
//   gender: 'लिङ्ग :',
//   benefit: 'उपलब्ध छुट तथा सुविधाहरु :',
//   spouse: 'पति/पत्नीको नाम :',
//   helphouse: 'हेरचाह केन्द्रमा बसेको भए सोको विवरण :',
// };

// const title_np = {
//   cardType: 'परिचय पत्रको प्रकार :',
//   number: 'प.प.नं. :',
//   name: 'नाम थर :',
//   fullAddress: 'ठेगाना :',
//   state: 'ठेगाना प्रदेश :',
//   district: 'जिल्ला :',
//   municipalityName: 'पालिका :',
//   ward: 'वडा नं. :',
//   dateOfBirth: 'जन्म मिति :',
//   citizenshipNo: 'नागरिकता नं. :',
//   gender: 'लिङ्ग :',
//   bloodGroup: 'रक्त समूह :',
//   disablilityType: 'अपाङ्गता प्रकृतिको आधारमा :',
//   disablilityIntensity: 'अपाङ्गतागम्भीरता :',
//   guardianName: 'बाबु आमा वा संरक्षकको नाम थर :',
//   verify: 'परिचय पत्र प्रमाणित गर्न :',
//   signature: {
//     name: ' नाम थर',
//     desingnation: 'पद',
//     signature: 'हस्ताक्षर',
//     issuedDate: 'जारी मिति',
//     copyDate: 'प्रतिलिपी मिती',
//   },
// };

// const title_en = {
//   cardType: 'ID Card Type :',
//   number: 'Card No. :',
//   name: 'Name of Card Holder :',
//   fullAddress: 'Address :',
//   dateOfBirth: 'Date of Birth :',
//   citizenshipNo: 'Citizenship No. :',
//   gender: 'Gender :',
//   bloodGroup: 'Blood Group :',
//   disablilityType: 'Disability type on the basis of nature :',
//   disablilityIntensity: 'On the basis of severity :',
//   guardianName: 'Father/Mother/Guardian :',
//   verify: 'ID Card Approved By :',
//   signature: {
//     name: 'Name',
//     desingnation: 'Designation',
//     signature: 'Signature',
//     issuedDate: 'Issue Date',
//     copyDate: 'Copy Date',
//   },
// };

// const title_elderly_back = {
//   elderlySignature: 'परिचय पत्र पाउने व्यक्तिको दस्तखत :',
//   contactPerson: 'सम्पर्क गर्नुपर्ने व्यक्तिको नाम :',
//   contactPersonPhone: 'सम्पर्क गर्नुपर्ने व्यक्तिको फोन नं. :',
//   bloodGroup: 'रक्त समूह :',
//   disease: 'रोग भए सोको नाम र सेवन गरिरहेको औषधीको नाम :',
//   verify: 'प्रमाणित गर्ने अधिकारी',

//   signature: {
//     name: 'नाम थर :',
//     desingnation: 'दर्जा :',
//     signature: 'दस्तखत :',
//     issuedDate: 'जारी मिति :',
//     copyDate: 'प्रतिलिपी मिती :',
//   },
//   companySeal: 'कार्यालयको छाप :',
// };

// const imageLoader = async (path, hasRelativePath) => {
//   try {
//     let relativePath;
//     console.log(path);
//     if (path) {
//       const tempPath = path.split('/api/');
//       relativePath = tempPath[1];
//       console.log(relativePath, `${__dirname}/../../${relativePath}`);
//       if (relativePath && hasRelativePath) return path && (await loadImage(`${__dirname}/../../${relativePath}`));
//       else return await loadImage(path);
//     }
//   } catch (e) {}
// };

// const createDisabilityCard = async (data, lang, { format = 'png', amblem = true } = { format: 'png', amblem: true }) => {
//   canvas = format === 'svg' ? createCanvas(width, height, 'svg') : createCanvas(width, height);

//   ctx = canvas.getContext(`2d`);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   const title = lang === 'english' ? {...(title_en||{})} : {...(title_np||{})};
//   langMultiplier = lang === 'english' ? multiplier * 0.9 : multiplier;
//   font = lang === 'english' ? english : nepali;
//   fontBold = lang === 'english' ? englishBold : nepaliBold;

//   if(data.identifyFrom==='birthCertificate'){
//     if(lang==='english'){
//     title.citizenshipNo='Birth Certificate No. :'

//     }else{

//       title.citizenshipNo='जन्म दर्ता नं. :'
//     }

//   }

//   ctx.fillStyle = data.bgColor;
//   ctx.fillRect(0, 0, width, height);

//   const [img, campaign, pp, signature] = await Promise.all([
//     amblem && (await imageLoader(`${__dirname}/../assets/images/amblem.png`, false)),
//     data.campaignPath && (await imageLoader(data.campaignPath, true)),
//     data.ppPath && (await imageLoader(data.ppPath, true)),
//     data.signaturePath && (await imageLoader(data.signaturePath, true)),
//   ]);

//   if (img) ctx.drawImage(img, multiplier * 10, multiplier * 10, multiplier * 50, multiplier * 45);
//   if (campaign) ctx.drawImage(campaign, canvas.width - multiplier * 60, multiplier * 10, multiplier * 50, multiplier * 45);

//   try {
//     if (lang === 'english') {
//       if (data.qrCode) {
//         const img = new Image();
//         img.onload = () => {
//           ctx.drawImage(img, canvas.width - multiplier * 60, multiplier * (10 + 50), multiplier * 50, multiplier * 50);
//         };
//         img.onerror = (err) => {
//           console.log(err);
//         };
//         img.src = data.qrCode;
//       }
//     } else if (pp)
//       ctx.drawImage(pp, canvas.width - multiplier * 65, multiplier * (10 + 50), multiplier * 55, multiplier * 65);
//   } catch (e) {}

//   signature &&
//     lang !== 'english' &&
//     ctx.drawImage(signature, canvas.width - multiplier * 85, multiplier * (35 + 50), multiplier * 50, multiplier * 55);

//   createText({
//     x: width / 2,
//     y: 15,
//     text: data.municipality,
//   });
//   createText({
//     x: width / 2,
//     y: 30,
//     text: data.office,
//     font: ` ${langMultiplier * 12}px "${fontBold}"`,
//   });
//   createText({
//     x: width / 2,
//     y: 43,
//     text: data.address,
//     font: ` ${langMultiplier * 8}px "${font}"`,
//   });

//   const isRedBg = data.cardType === 'क' || data.cardType === 'KA';
//   const redBgColor = isRedBg ? '#ffffff' : `#dc3545`;
//   const redFontColor = isRedBg ? '#dc3545' : '#ffffff';

//   createBorderedText(data.cardKind, 10, redBgColor, 8, {
//     bold: true,
//     fontColor: redFontColor,
//   });

//   const disabilityType =
//     lang === 'english'
//       ? [
//           [
//             {
//               question: title.disablilityType,
//               answer: data.disablilityType,
//             },
//       { question: title.bloodGroup, answer: data.bloodGroup },
//           ],
//           [
//             {
//               question: title.disablilityIntensity,
//               answer: data.disablilityIntensity,
//             },
//           ],
//         ]
//       : [
//           [
//             {
//               question: title.disablilityType,
//               answer: data.disablilityType,
//             },
//             {
//               question: title.disablilityIntensity,
//               answer: data.disablilityIntensity,
//             },
//           ],
//         ];

//   const cardNumber = data.oridinal ? `${data.number} ( ${data.oridinal} )` : data.number;

//   contentGenerator(
//     [
//       [{ question: title.cardType, answer: data.cardType }],
//       [{ question: title.number, answer: cardNumber }],
//       [{ question: title.name, answer: data.name }],
//       [
//         {
//           question: title.guardianName,
//           answer: data.guardianName,
//         },
//       ],
//       [{ question: title.fullAddress, answer: `${data.municipalityName}-${data.ward}, ${data.district}` }],
//      lang==='english'?[
//       { question: title.dateOfBirth, answer: data.dateOfBirth },
//       { question: title.citizenshipNo, answer: data.citizenshipNo },
//       { question: title.gender, answer: data.gender },
//     ]: [
//         { question: title.dateOfBirth, answer: data.dateOfBirth },
//         { question: title.citizenshipNo, answer: data.citizenshipNo },
//         { question: title.gender, answer: data.gender },
//         { question: title.bloodGroup, answer: data.bloodGroup },
//       ],
//       ...disabilityType,
//       [
//         {
//           question: title.verify,
//           answer: data.verify,
//         },
//       ],
//       [
//         {
//           answer: data.signature.name,
//           question: title.signature.name,
//           type: 'name',
//           space: 30,
//           divider: '',
//         },
//         {
//           answer: '',
//           signature,
//           question: title.signature.signature,
//           type: `signature`,
//           space: 15,
//           divider: '',
//         },
//         {
//           answer: data.signature.desingnation,
//           question: title.signature.desingnation,
//           type: 'designation',
//           space: 35,
//           divider: '',
//         },
//         {
//           answer: data.signature.issuedDate,
//           question: data.verify ? title.signature.copyDate : title.signature.issuedDate,
//           space: 20,
//           divider: '',
//         },
//       ],
//     ],
//     { type: 'disabled', adder: lang === 'english' ? 10 : 11 }
//   );

//   createBorderedText(data.footer, 8, redBgColor, false, {
//     x: 0,
//     y: canvas.height - multiplier * 12,
//     fontColor: redFontColor,
//   });

//   if (format === 'svg') fs.writeFileSync('/out.svg', canvas.toBuffer());
//   else {
//     const buffer = canvas.toBuffer('image/png');
//     fs.writeFileSync(data.outputFileName, buffer);
//     fs.chownSync(data.outputFileName, 1000, 1000);
//     return data.url;
//   }
// };

// const createElderlyCardFront = async (data, format = 'png') => {
//   canvas = format === 'svg' ? createCanvas(width, height, 'svg') : createCanvas(width, height);

//   ctx = canvas.getContext(`2d`);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   const title = title_elderly;
//   langMultiplier = multiplier;
//   font = nepali;
//   fontBold = nepaliBold;

//   ctx.fillStyle = data.bgColor;
//   ctx.fillRect(0, 0, width, height);

//   const [img, campaign, pp, signature] = await Promise.all([
//     await imageLoader(`${__dirname}/../assets/images/amblem.png`, false),
//     await imageLoader(data.campaignPath, true),
//     await imageLoader(data.ppPath, true),
//     await imageLoader(data.signaturePath, true),
//   ]);

//   if (img) ctx.drawImage(img, multiplier * 10, multiplier * 10, multiplier * 50, multiplier * 40);

//   if (campaign) ctx.drawImage(campaign, canvas.width - multiplier * 65, multiplier * 10, multiplier * 50, multiplier * 45);

//   if (pp) ctx.drawImage(pp, canvas.width - multiplier * 65, multiplier * (10 + 50), multiplier * 55, multiplier * 65);

//   signature &&
//     ctx.drawImage(signature, canvas.width - multiplier * 85, multiplier * (35 + 50), multiplier * 55, multiplier * 65);

//   createText({
//     x: width / 2,
//     y: 10,
//     text: data.municipality,
//     font: ` ${langMultiplier * 9}px "${fontBold}"`,
//     color: '#EC3539',
//   });
//   createText({
//     x: width / 2,
//     y: 22,
//     text: data.office,
//     font: ` ${langMultiplier * 9}px "${fontBold}"`,
//     color: '#EC3539',
//   });
//   createText({
//     x: width / 2,
//     y: 34,
//     text: data.address1,
//     font: ` ${langMultiplier * 9}px "${fontBold}"`,
//     color: '#EC3539',
//   });
//   createText({
//     x: width / 2,
//     y: 46,
//     text: data.address2,
//     font: ` ${langMultiplier * 9}px "${fontBold}"`,
//     color: '#EC3539',
//   });

//   createBorderedText(data.cardKind, 10, `#2f77f7`, 8, { bold: true, y: multiplier * (60 - (10 * 1.5) / 2) });

//   const cardNumber = data.oridinal ? `${data.number} ( ${data.oridinal} )` : data.number;

//   contentGenerator(
//     [
//       [{ question: title.number, answer: cardNumber }],
//       [{ question: title.name, answer: data.name }],
//       [{ question: title.citizenshipNo, answer: data.citizenshipNo }],
//       [
//         { question: title.age, answer: data.age },
//         { question: title.gender, answer: data.gender },
//       ],
//       [
//         { question: title.state, answer: `${data.municipalityName} , ${data.district}` },
//         { question: title.ward, answer: data.ward },
//         { question: title.tole, answer: data.tole },
//       ],
//       [{ question: title.benefit, answer: data.benefit }],
//       [{ question: title.spouse, answer: data.spouse }],
//       [{ question: title.helphouse, answer: data.helphouse }],
//     ],
//     { type: 'elderly', adder: 15 }
//   );
//   drawLine({
//     startX: multiplier * 10,
//     startY: canvas.height - multiplier * 13,
//     endY: canvas.height - multiplier * 13,
//     endX: canvas.width - multiplier * 10,
//     lineWidth: 1,
//     color: '#000000',
//   });
//   createBorderedText(data.footer, 7, `#ffffff`, false, {
//     x: 0,
//     y: canvas.height - multiplier * 12,
//     fontColor: '#808080',
//   });

//   if (format === 'svg') fs.writeFileSync('/out.svg', canvas.toBuffer());
//   else {
//     const buffer = canvas.toBuffer('image/png');
//     fs.writeFileSync(data.outputFileName, buffer);
//     fs.chownSync(data.outputFileName, 1000, 1000);
//     return data.url;
//   }
// };

// const createElderlyCardBack = async (data, format = 'png') => {
//   canvas = format === 'svg' ? createCanvas(width, height, 'svg') : createCanvas(width, height);

//   ctx = canvas.getContext(`2d`);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   const title = title_elderly_back;
//   langMultiplier = multiplier;
//   font = nepali;
//   fontBold = nepaliBold;

//   ctx.fillStyle = data.bgColor;
//   ctx.fillRect(0, 0, width, height);

//   const [signature, companySeal] = await Promise.all([
//     await imageLoader(data.signaturePath, true),
//     await imageLoader(data.companySeal, true),
//     await imageLoader(data.ppPath, true),
//   ]);

//   companySeal &&
//     ctx.drawImage(
//       companySeal,
//       canvas.width - multiplier * 60,
//       canvas.height - multiplier * 60,
//       multiplier * 50,
//       multiplier * 50
//     );

//   try {
//     if (data.qrCode) {
//       const img = new Image();
//       img.onload = () => {
//         ctx.drawImage(img, canvas.width - multiplier * 60, multiplier * 10, multiplier * 50, multiplier * 50);
//       };
//       img.onerror = (err) => {
//         console.log(err);
//       };
//       img.src = data.qrCode;
//     }
//   } catch (e) {}

//   const lastPosY = contentGenerator(
//     [
//       [{ question: title.elderlySignature, answer: data.elderlySignature }],
//       [{ question: title.contactPerson, answer: data.contactPerson }],
//       [{ question: title.contactPersonPhone, answer: data.contactPersonPhone }],
//       [{ question: title.bloodGroup, answer: data.bloodGroup }],
//       [{ question: title.disease, answer: data.disease }],
//     ],
//     { type: 'elderly', startX: 10, startY: 20, adder: 15 }
//   );

//   createText({
//     x: multiplier * 10,
//     y: lastPosY + 10,
//     text: title.verify,
//     font: `${langMultiplier * 9}px "${fontBold}"`,
//     align: `start`,
//   });

//   const startY = lastPosY + 35;

//   createText({
//     x: canvas.width - multiplier * 10,
//     y: startY,
//     text: title.companySeal,
//     font: `${langMultiplier * 9}px "${fontBold}"`,
//     align: `end`,
//   });

//   // const copyDate = data.signature.copyDate
//   //   ? [[{ question: title.signature.copyDate, answer: data.signature.copyDate }]]
//   //   : [];

//   contentGenerator(
//     [
//       [{ question: title.signature.name, answer: data.signature.name }],
//       [{ question: title.signature.desingnation, answer: data.signature.contactPerson }],
//       [{ question: title.signature.signature, answer: signature, signature: true }],
//       [{ question: title.signature.issuedDate, answer: data.signature.issuedDate }],
//       // ...copyDate,
//     ],
//     { type: 'elderly', startX: 10, startY, adder: 15 }
//   );

//   if (format === 'svg') fs.writeFileSync('/out.svg', canvas.toBuffer());
//   else {
//     const buffer = canvas.toBuffer('image/png');
//     fs.writeFileSync(data.outputFileName, buffer);
//     fs.chownSync(data.outputFileName, 1000, 1000);
//     return data.url;
//   }
// };

// const contentGenerator = (data = [], { startX = 10, startY = 78, type, adder = 11 } = {}) => {
//   data.forEach((d, i) => {
//     type === 'disabled' && i === data.length - 1
//       ? createSignatury(startX, startY, d)
//       : questionAnswerSameLineGenerator(startX, startY, d, {
//           type,
//           fontSize: type === 'elderly' ? 9 : 8,
//         });
//     startY += adder;
//   });
//   return startY;
// };

// const createText = ({ color, align, font, x, y, text }) => {
//   if (text) {
//     ctx.fillStyle = color || `#000000`;
//     ctx.textAlign = align || `center`;
//     ctx.font = font || `${langMultiplier * 10}px "${font}"`;
//     ctx.textBaseline = `middle`;
//     ctx.fillText(text, x, multiplier * y);
//   }
// };

// const getTextLength = (string, fontSize = 8) => {
//   let i = string ? string.length : 0;
//   i = i * fontSize * 0.62 * multiplier;
//   if (i > canvas.width) {
//     i = canvas.width;
//   }
//   return i;
// };

// const createSignatury = async (x, y, data = []) => {
//   let xAxisTemp = multiplier * x;
//   let xAxis = 0;

//   for (let i = 0; i < data.length; i++) {
//     const d = data[i];
//     // const questionVanswer = (d.answer || '').length > (d.question || '').length;
//     const space = (d.space / 100) * canvas.width;
//     xAxis = xAxisTemp + space / 2 - multiplier * x;
//     const sX = xAxisTemp - multiplier * x;
//     xAxisTemp += space;
//     // const xAxis = (canvas.width / data.length) * i + multiplier * x;

//     if (d.type === `signature`) {
//       d.signature && ctx.drawImage(d.signature, sX, multiplier * (y - 20), multiplier * 40, multiplier * 40);
//     } else {
//       createText({
//         x: xAxis,
//         y,
//         text: d.answer,
//         font: `${langMultiplier * 8}px "${font}"`,
//         align: `center`,
//       });
//     }
//     createText({
//       x: xAxis,
//       y: y + 5,
//       // text: `.`.repeat(questionVanswer ? (d.answer || '').length * 1.5 : (d.question || '').length * 1.5),
//       text: '.....................',
//       font: `${langMultiplier * 8}px "${font}"`,
//       align: `center`,
//     });
//     createText({
//       x: xAxis,
//       y: y + 15,
//       text: d.question,
//       font: `${langMultiplier * 8}px "${font}"`,
//       align: `center`,
//     });
//   }
// };

// const questionAnswerSameLineGenerator = (x, y, data = [], { type, fontSize = 8 } = {}) => {
//   let lastXPos = 0;
//   localFont =
//     type === 'elderly' ? `${langMultiplier * fontSize}px "${fontBold}"` : `${langMultiplier * fontSize}px "${font}"`;
//   data.forEach((d, index) => {
//     createText({
//       x: index === 0 ? multiplier * x : lastXPos,
//       y,
//       text: d.question,
//       font: localFont,
//       align: `start`,
//     });
//     lastXPos += ctx.measureText(d.question).width + ((multiplier * x + 5) * 1) / (index + 1);
//     if (d.signature) {
//       d.answer && ctx.drawImage(d.answer, lastXPos, multiplier * (y - 15 / 2), multiplier * 40, multiplier * 20);
//     } else {
//       createText({
//         x: lastXPos,
//         y,
//         text: d.answer,
//         font: `${langMultiplier * fontSize}px "${fontBold}"`,
//         align: `start`,
//       });
//     }
//     lastXPos += ctx.measureText(d.answer).width + ((multiplier * x + 5) * 1) / (index + 1);
//   });
// };

// const createBorderedText = (string, fontSize, color, border, { x, y, bold = false, fontColor = '#ffffff' } = {}) => {
//   const i = getTextLength(string, fontSize);
//   ctx.fillStyle = color;
//   ctx.strokeStyle = color;
//   ctx.beginPath();

//   ctx[border ? `roundRect` : `rect`](
//     x || canvas.width / 2 - i / 2,
//     y || multiplier * (58 - (fontSize * 1.5) / 2),
//     i,
//     multiplier * fontSize * 1.5,
//     multiplier * border
//   );

//   ctx.stroke();
//   ctx.fill();
//   ctx.font = `${(langMultiplier * fontSize).toString()}px ${bold ? `${fontBold}` : `${font}`}`;
//   ctx.fillStyle = fontColor;
//   ctx.textBaseline = `middle`;
//   ctx.textAlign = `center`;
//   ctx.fillText(string, x || canvas.width / 2, y ? y + multiplier * 7 : multiplier * 58);
// };

// const drawLine = ({ color = '#000000', startX, startY, endX, endY, lineWidth = '1' } = {}) => {
//   ctx.beginPath();
//   ctx.moveTo(startX, startY);
//   ctx.lineTo(endX, endY);
//   ctx.lineWidth = lineWidth;
//   ctx.fillStyle = color;
//   ctx.stroke();
//   ctx.fill();
// };

// const disabilityCardData = async ({ disabledProfile, url, isNew = true, isCopy = false, copiedDisabledProfile = {} }) => {
//   const [{ data: nagarpalika }, { data: administrator }] = await Promise.all([
//     await nagarpalikaService.getNagarpalika(),
//     await administratorService.getActiveAdministrator(),
//   ]);

//   if (nagarpalika.length === 0) throw new ApiError(httpStatus.NOT_FOUND, 'Nagarpalika Info भेटिएन । !');

//   if (!administrator) throw new ApiError(httpStatus.NOT_FOUND, 'Active administrator Info भेटिएन । !');

//   const newCard = disabledProfile.cardDetails && !disabledProfile.cardDetails.issued && isNew;

//   const fileName_np = `${disabledProfile.name_np}_${Date.now()}.png`;
//   const fileName_en = `${disabledProfile.name_en}_${Date.now()}.png`;
//   console.log('end 4')

//   // const fileName_np = `processing`;
//   // const fileName_en = `processing`;

//   // disabledProfile.cardDetails.cardUrl_en = `${url}/api/uploads/${fileName_en}`;
//   // disabledProfile.cardDetails.cardUrl_np = `${url}/api/uploads/${fileName_np}`;

//   disabledProfile.cardDetails.cardUrl_en = `processing`;
//   disabledProfile.cardDetails.cardUrl_np = `processing`;

//   if (!isCopy) {
//     disabledProfile.cardDetails.cardUrl_en = `processing`;
//     disabledProfile.cardDetails.cardUrl_np = `processing`;
//     if (newCard) {
//       disabledProfile.cardDetails.issuedBy_np = administrator.fullname_np;
//       disabledProfile.cardDetails.issuedBy_en = administrator.fullname_en;
//       disabledProfile.cardDetails.cardRecievedDate_ad = moment().format('YYYY-MM-DD');
//       disabledProfile.cardDetails.cardRecievedDate_bs = calendarService.getCurrentDate_np();
//       disabledProfile.cardDetails.issuedDesignation_np = administrator.designation_np;
//       disabledProfile.cardDetails.issuedDesignation_en = administrator.designation_en;
//       disabledProfile.cardDetails.administrator = administrator.id;
//       await new Promise((resolve, reject) => {
//         disabledProfile.setNext('card_number', (err, user) => {
//           if (err) reject();
//           else resolve();
//         });
//       });
//     } else {
//       // disabledProfile.cardDetails.newCardRecievedDate_ad = moment().format('YYYY-MM-DD');
//       // disabledProfile.cardDetails.newCardRecievedDate_bs = calendarService.getCurrentDate_np();

//       await disabledProfile.save();
//     }
//   } else {
//     copiedDisabledProfile.cardUrl_en = `processing`;
//     copiedDisabledProfile.cardUrl_np = `processing`;
//     await copiedDisabledProfile.save();
//   }

//   console.log('end 5')

//   const data_np = {
//     bgColor: COLORMAP[disabledProfile.disabilityType],
//     ppPath: disabledProfile.photo,
//     campaignPath: nagarpalika[0].campaign_logo,
//     signaturePath: administrator[SIGNATUREMAP[disabledProfile.disabilityType]],
//     municipality: nagarpalika[0].name_np,
//     office: 'नगर कार्यपालिकाको कार्यालय',
//     address: nagarpalika[0].address_np,
//     cardKind: 'अपाङ्गता प्रमाण पत्र',
//     cardType: CHARMAP[disabledProfile.disabilityType],
//     number: calendarService.getNepaliNumber(disabledProfile.cardDetails.cardNo, true),
//     name: disabledProfile.name_np,
//     state: disabledProfile.parmanentAddress.province,
//     district: disabledProfile.parmanentAddress.district,
//     municipalityName: disabledProfile.parmanentAddress.local,
//     ward: calendarService.getNepaliNumber(disabledProfile.parmanentAddress.ward, true),
//     dateOfBirth: disabledProfile.dateOfBirth_np,
//     gender: disabledProfile.gender,
//     bloodGroup: disabledProfile.bloodGroup,
//     disablilityType: disabledProfile.organDisabilityType,
//     disablilityIntensity: disabledProfile.disabilityType,
//     guardianName: disabledProfile.guardian.name_np,
//     verify: !isCopy
//       ? ''
//       : `${disabledProfile.cardDetails.issuedBy_np || ''}-${disabledProfile.cardDetails.issuedDesignation_np || ''}(${
//           disabledProfile.cardDetails.cardRecievedDate_bs
//         })`,
//     signature: {
//       name: administrator.fullname_np,
//       desingnation: administrator.designation_np,
//       issuedDate: !isCopy ? disabledProfile.cardDetails.cardRecievedDate_bs : copiedDisabledProfile.newCardRecievedDate_bs,
//     },
//     footer: 'यो प्रमाणपत्र कसैले पाएमा नजिकको प्रहरी कार्यालयमा वा स्थानीय निकायमा बुझाई दिनुहोला ',
//     outputFileName: `${__dirname}/../../uploads/${fileName_np}`,
//     url: `${url}/api/uploads/${fileName_np}`,
//     oridinal: isCopy ? getOridinals_np(copiedDisabledProfile.oridinal) : null,
//     identifyFrom:disabledProfile.identifyFrom
//   };

//   console.log('end 6')

//   const data_en = {
//     bgColor: COLORMAP[disabledProfile.disabilityType],
//     qrCode: await qrCodeService.createQRCode(
//       `Card no :- ${disabledProfile.cardDetails.cardNo} Card Type :- ${
//         CHARMAP_EN[disabledProfile.disabilityType]
//       } Card Category :- Disability Identity Card Municipality :- ${disabledProfile.parmanentAddress.local}`
//     ),
//     ppPath: disabledProfile.photo,
//     campaignPath: nagarpalika[0].campaign_logo,
//     signaturePath: administrator[SIGNATUREMAP[disabledProfile.disabilityType]],
//     municipality: nagarpalika[0].name_en,
//     office: 'OFFICE OF MUNICIPAL EXECUTIVE',
//     address: nagarpalika[0].address_en,
//     cardKind: 'Disability Identity Card',
//     cardType: CHARMAP_EN[disabledProfile.disabilityType],
//     number: disabledProfile.cardDetails.cardNo,
//     name: disabledProfile.name_en,
//     state: disabledProfile.parmanentAddress.province,
//     district: disabledProfile.parmanentAddress.district_en,
//     municipalityName: disabledProfile.parmanentAddress.local_en,
//     ward: calendarService.getEnglishNumber(disabledProfile.parmanentAddress.ward, true),
//     dateOfBirth: disabledProfile.dateOfBirth_en,
//     gender: GENDERENGMAP[disabledProfile.gender],
//     bloodGroup: disabledProfile.bloodGroup,
//     disablilityType: ORGANENGMAP[disabledProfile.organDisabilityType],
//     disablilityIntensity: ENGMAP[disabledProfile.disabilityType],
//     guardianName: disabledProfile.guardian.name_en,
//     verify: !isCopy
//       ? ''
//       : `${disabledProfile.cardDetails.issuedBy_en || ''}-${disabledProfile.cardDetails.issuedDesignation_en || ''}(${
//           disabledProfile.cardDetails.cardRecievedDate_ad
//         })`,
//     signature: {
//       name: administrator.fullname_en,
//       desingnation: administrator.designation_en,
//       issuedDate: !isCopy ? disabledProfile.cardDetails.cardRecievedDate_ad : copiedDisabledProfile.newCardRecievedDate_ad,
//     },
//     footer: 'If somebody finds this ID card, Please deposit this in the nearest police station or local level office. ',
//     outputFileName: `${__dirname}/../../uploads/${fileName_en}`,
//     url: `${url}/api/uploads/${fileName_en}`,
//     oridinal: isCopy ? getOridinals_en(copiedDisabledProfile.oridinal) : null,
//     identifyFrom:disabledProfile.identifyFrom
//   };

//   console.log('end 7')

//   if(disabledProfile.identifyFrom==='birthCertificate'){
//     data_en.citizenshipNo=calendarService.getEnglishNumber(disabledProfile.identityDetails.birthCertificate||'',true)
//     data_np.citizenshipNo=disabledProfile.identityDetails.birthCertificate||''

//   }else if(disabledProfile.identifyFrom==='citizenship'){
//     data_en.citizenshipNo=  calendarService.getEnglishNumber(disabledProfile.identityDetails.citizenshipNo||'',true)
//     data_np.citizenshipNo=  disabledProfile.identityDetails.citizenshipNo||''
//   }else{
//     data_np.citizenshipNo=  ''

//   }

//   return { data_np, data_en, _id: isCopy ? copiedDisabledProfile._id : disabledProfile._id, isCopy };
// };

// const elderlyCardData = async ({ elderlyProfile, url, isNew = true, isCopy, copiedElderlyProfile = {} }) => {
//   const [{ data: nagarpalika }, { data: administrator }] = await Promise.all([
//     await nagarpalikaService.getNagarpalika(),
//     await administratorService.getActiveAdministrator(),
//   ]);

//   if (nagarpalika.length === 0) throw new ApiError(httpStatus.NOT_FOUND, 'Nagarpalika Info भेटिएन । !');

//   if (!administrator) throw new ApiError(httpStatus.NOT_FOUND, 'Active administrator Info भेटिएन । !');

//   const newCard = !elderlyProfile.cardNo && isNew;

//   // const cardUrl_front = `${elderlyProfile.name_np}_${elderlyProfile.citizenshipNo}_elder_front.png`;
//   // const cardUrl_back = `${elderlyProfile.name_en}_${elderlyProfile.citizenshipNo}_elder_back.png`;

//   const cardUrl_front = `${elderlyProfile.name_np}_${Date.now()}_elder_front.png`;
//   const cardUrl_back = `${elderlyProfile.name_en}_${Date.now()}_elder_back.png`;

//   // elderlyProfile.cardUrl_front = `${url}/api/uploads/${cardUrl_front}`;
//   // elderlyProfile.cardUrl_back = `${url}/api/uploads/${cardUrl_back}`;

//   const age = moment().diff(elderlyProfile.dateOfBirth_en, 'years');
//   if (!isCopy) {
//     elderlyProfile.cardUrl_front = `processing`;
//     elderlyProfile.cardUrl_back = `processing`;
//     if (newCard) {
//       elderlyProfile.issuedDate = calendarService.getCurrentDate_np();
//       elderlyProfile.issuedBy_np = administrator.fullname_np;
//       elderlyProfile.issuedDesignation_np = administrator.designation_np;
//       elderlyProfile.administrator = administrator.id;

//       await new Promise((resolve, reject) => {
//         elderlyProfile.setNext('card_number_elderly', (err, user) => {
//           if (err) reject();
//           else resolve();
//         });
//       });
//     } else {
//       // elderlyProfile.issuedDate_copy = calendarService.getCurrentDate_np();
//       await elderlyProfile.save();
//     }
//   } else {
//     copiedElderlyProfile.cardUrl_front = `processing`;
//     copiedElderlyProfile.cardUrl_back = `processing`;
//     await copiedElderlyProfile.save();
//   }

//   const data_np = {
//     bgColor: '#ffffff',
//     ppPath: elderlyProfile.photo,
//     campaignPath: nagarpalika[0].campaign_logo,
//     signaturePath: administrator.redSignature,
//     municipality: nagarpalika[0].name_np,
//     office: 'नगर कार्यपालिकाको कार्यालय',
//     address1: `${nagarpalika[0].name_np}, ${nagarpalika[0].district_np}`,
//     address2: `${nagarpalika[0].province_np}, नेपाल`,
//     cardKind: 'ज्येष्ठ नागरिक परिचयपत्र',
//     number: calendarService.getNepaliNumber(elderlyProfile.cardNo, true),
//     name: elderlyProfile.name_np,
//     state: elderlyProfile.address.province,
//     district: elderlyProfile.address.district,
//     municipalityName: elderlyProfile.address.local,
//     ward: elderlyProfile.address.ward,
//     age: calendarService.getNepaliNumber(age, true),
//     benefit: 'सार्वजनिक सवारी भाडा र स्वास्थ्य सेवामा ५०% छुट',
//     spouse: elderlyProfile.spouse_np,
//     helphouse: elderlyProfile.careHomeDetail_np,
//     citizenshipNo: calendarService.getNepaliNumber(elderlyProfile.citizenshipNo, true),
//     gender: elderlyProfile.gender,
//     footer: 'यो परिचयपत्र कसैले पाएमा नजिकको प्रहरी कार्यालयमा वा पुतलीबजार नगरपालिकामा बुझाई दिनु होला । ',
//     outputFileName: `${__dirname}/../../uploads/${cardUrl_front}`,
//     url: `${url}/api/uploads/${cardUrl_front}`,
//     oridinal: isCopy ? getOridinals_np(copiedElderlyProfile.oridinal) : null,
//   };

//   const data_np_back = {
//     bgColor: '#ffffff',
//     qrCode: await qrCodeService.createQRCode(
//       `Card no :- ${elderlyProfile.cardNo} Card Category :- ज्येष्ठ नागरिक परिचयपत्र Municipality :- ${elderlyProfile.address.local}`
//     ),
//     signaturePath: administrator.redSignature,
//     dateOfBirth: elderlyProfile.dateOfBirth_np,
//     bloodGroup: elderlyProfile.bloodGroup,
//     guardianName: elderlyProfile.guardian.name_np,
//     verify: '',

//     contactPerson: (elderlyProfile.contactPerson || {}).name_np,
//     contactPersonPhone: calendarService.getNepaliNumber((elderlyProfile.contactPerson || {}).phone, true),
//     disease:
//       elderlyProfile.disease &&
//       `${elderlyProfile.disease} ${elderlyProfile.medication ? `(${elderlyProfile.medication})` : ''}`,
//     signature: {
//       name: administrator.fullname_np,
//       desingnation: administrator.designation_np,
//       issuedDate: elderlyProfile.issuedDate,
//       copyDate: isCopy ? copiedElderlyProfile.newCardRecievedDate_bs : '',
//     },
//     outputFileName: `${__dirname}/../../uploads/${cardUrl_back}`,
//     companySeal: administrator.stamp,
//     url: `${url}/api/uploads/${cardUrl_back}`,
//     oridinal: isCopy ? getOridinals_en(copiedElderlyProfile.oridinal) : null,
//   };
//   return { data_np, data_np_back, _id: isCopy ? copiedElderlyProfile._id : elderlyProfile._id, isCopy };
//   // await Promise.all([await createElderlyCardFront(data_np), await createElderlyCardBack(data_np_back)]);
// };

// module.exports = {
//   createDisabilityCard,
//   createElderlyCardBack,
//   createElderlyCardFront,
//   disabilityCardData,
//   elderlyCardData,
// };
