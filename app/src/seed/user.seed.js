const {
  admin: { email, password },
} = require('../config/config');

module.exports = [
  {
    username: email,
    password,
    role: 'admin',
    email,
    isEmailVerified: true,
    first_name: 'admin',
    last_name: 'admin',
    image: '',
    phone: '8911773344',
    userId: 9999,
    privilege: 'super_user',
    Passwd: '632526',
  },
];
