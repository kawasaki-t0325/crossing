const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

const searchItem = require('./src/searchItem');

admin.initializeApp();

const runtimeOpts = {
  memory: '1GB',
};

exports.searchItem = functions.region('asia-northeast1').runWith(runtimeOpts).https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const result = await searchItem(request.body).catch(({ error, code }) => response.json({ code: code, message: error }));
    response.json({ code: 200, ...result });
  });
});
