const Nagarpalika = require('../models/nagarpalika.model');
const redisClient = require('../redis-client');

const updateNagarpalika = async (body) => {
  const nagarpalika = await Nagarpalika.findOne({});
  let newNagarpalika;
  if (!nagarpalika) {
    newNagarpalika = await Nagarpalika.create({ ...body });
    await redisClient.set('nagarpalika', JSON.stringify([newNagarpalika]));
    return { data: newNagarpalika, message: 'nagarpalika created' };
  }
  Object.assign(nagarpalika, { ...body });
  await nagarpalika.save();
  await redisClient.set('nagarpalika', JSON.stringify([nagarpalika]));
  return { data: nagarpalika, message: 'nagarpalika updated' };
};

const getNagarpalika = async () => {
  let cache = false;
  let nagarpalika;
  const nagarpalikaData = await redisClient.get('nagarpalika');
  if (nagarpalikaData) {
    nagarpalika = JSON.parse(nagarpalikaData);
    cache = true;
  } else {
    nagarpalika = await Nagarpalika.find({});
    await redisClient.set('nagarpalika', JSON.stringify(nagarpalika));
  }
  return { data: nagarpalika, cache };
};

module.exports = {
  updateNagarpalika,
  getNagarpalika,
};
