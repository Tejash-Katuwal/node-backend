const isCi = process.env.INIT_CWD === '/usr/src/app';
if (!isCi) {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('husky').install('./app/.husky');
}
