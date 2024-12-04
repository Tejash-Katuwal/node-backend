// db.collection.update(filter, update, { upsert: true });
const mongoose = require('mongoose');
const glob = require('glob');

const config = require('../config/config');

const seed = async () => {
  glob(`${__dirname}/**/*.seed.js`, { nodir: true }, async (err, files) => {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const fileContent = require(file);
      const modelName = file.toString().replace(__dirname, '').replace('.seed.', '.model.');
      const model = require(`../models${modelName}`);
      if (model) {
        console.log(fileContent);
        await model.insertMany(fileContent);
      }
      if (files.length - 1 === index) mongoose.connection.close();
    }
  });
};

const fresh = async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.drop();
  }
  seed();
};

const tableSpecific = async (arg) => {
  const model = require(`../models/${arg}.model`);
  if (!model) {
    return;
  }
  const seedingFile = require(`./${arg}.seed`);

  await model.insertMany(seedingFile);
};

async function seeder(type = 'seed', arg) {
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  console.log('Connected to MongoDB');

  switch (type) {
    case 'seed':
      await seed();
      break;

    case 'fresh':
      await fresh();
      break;

    case 'table':
      await tableSpecific(arg);
      break;

    default:
      break;
  }
}

const arg = process.argv[2];

seeder(!arg ? 'seed' : arg.startsWith('--') ? 'fresh' : 'table', arg)
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });
