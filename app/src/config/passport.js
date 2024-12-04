const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');
const redisClient = require('../redis-client');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.token_type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }

    let user;
    let cache = false;
    const userInfo = await redisClient.get(payload.user_email);
    if (userInfo) {
      user = JSON.parse(userInfo);
      cache = true;
    } else {
      user = await User.findOne({ email: payload.user_email });

      user = user.toJSON();
      await redisClient.set(payload.user_email, JSON.stringify(user), { EX: 60 });
    }
    if (!user) {
      return done(null, false);
    }
    user.cache = cache;
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
