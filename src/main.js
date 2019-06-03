/* eslint-disable no-unused-vars */
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const ValidationError = require('./errors/ValidationError');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'todoman';

// eslint-disable-next-line no-use-before-define
main();

async function main() {
  const mongoClient = await MongoClient.connect(
    MONGODB_URI,
    { useNewUrlParser: true },
  );

  const db = mongoClient.db(MONGODB_DB);

  const app = express();

  app.use(bodyParser.json());

  app.use((req, res, next) => {
    req.db = db;

    next();
  });

  app.get('/', (req, res, next) => {
    res.status(200).json({ name: 'todoman-backend' });
  });

  // eslint-disable-next-line global-require
  app.use(require('./todos/routes'));

  // eslint-disable-next-line consistent-return
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err });
    }

    next(err);
  });

  app.listen(PORT, (err) => {
    if (err) {
      throw err;
    }
  });
  // eslint-disable-next-line no-console
  console.log(`api-server listening on port ${PORT}`);
}
