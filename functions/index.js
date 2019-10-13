const functions = require('firebase-functions');
const admin = require('firebase-admin');

const searchItem = require('./src/searchItem');

admin.initializeApp();

const runtimeOpts = {
  memory: '1GB',
};

exports.searchItem = functions.region('asia-northeast1').runWith(runtimeOpts).https.onRequest(async (request, response) => {
  const result = await searchItem(request.body).catch(({ error, code }) => response.status(code).send(error));
  response.status(200).send(result);
});
