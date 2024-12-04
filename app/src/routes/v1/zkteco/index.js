const express = require('express');

const router = express.Router();
const zktecoRoute = require('./zkteco.route');

const defaultRoutes = [{ path: '/', route: zktecoRoute }];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
