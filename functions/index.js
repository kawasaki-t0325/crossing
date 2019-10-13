const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');

admin.initializeApp();

const runtimeOpts = {
  memory: '1GB',
};

exports.searchItem = functions.runWith(runtimeOpts).https.onRequest(async (request, response) => {
  const { username, password, word, selector } = request.body;

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto('https://www.a8.net/');
  await page.type('input[name="login"]', username);
  await page.type('input[name="passwd"]', password);
  await page.click('input[name="lgin_as_btn"]');
  await page.waitForNavigation();

  await page.type('#headerSearchKeyword', word);
  await page.click('input[type="submit"]');

  const item = await page.$(selector).textContent;

  const result = (item === '') ? '該当なし' : '見つかりました';

  return response.status(200).send(result);
});
