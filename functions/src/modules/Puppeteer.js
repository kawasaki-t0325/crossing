const puppeteer = require('puppeteer');

const config = require('../config');
const a8 = require('../sites/a8');

module.exports = async (username, password, word) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto(a8.loginUrl);
    await page.type(a8.usernameBox, username);
    await page.type(a8.passwordBox, password);
    await page.click(a8.loginButton);
    // TODO: login失敗時の処理について考える
    await page.waitForNavigation();

    await page.type(a8.searchBox, word);
    await page.click(a8.searchButton);

    return await page.$(a8.selector).textContent;
  } catch (error) {
    throw { code: config.RESPONSE_CODE.INTERNAL_SERVER_ERROR, error: 'サーバーエラーが発生しました' };
  }
};