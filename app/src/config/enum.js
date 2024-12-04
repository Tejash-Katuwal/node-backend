// sorted in an alphebetical orders
const enums = Object.freeze({
  FINGERPRINT: { ENUM: ['hand', 'leg', 'none'], DEFAULT: 'hand' },
  GENDER: {
    ENUM: ['पुरुष', 'महिला', 'अन्य'],
    ENGMAP: {
      पुरुष: 'male',
      महिला: 'female',
      अन्य: 'others',
    },
  },

  VERSION: { ENUM: ['ios', 'android'] },
  ORGANIZATIONTYPE: { ENUM: ['student', 'employee', 'teacher'] },
  DEVICEPLATFORM: {
    ENUM: ['ios', 'android', 'windows'],
    DEFAULT: 'android',
  },
  MONTHS: {
    '01': 'बैशाख',
    '02': 'जेठ',
    '03': 'असार',
    '04': 'श्रावण',
    '05': 'भाद्र',
    '06': 'आश्विन',
    '07': 'कार्तिक',
    '08': 'मङसिर',
    '09': 'पौष',
    10: 'माघ',
    11: 'फाल्गुन',
    12: 'चैत्र',
  },
});

module.exports = enums;
