const puppeteer = require('puppeteer');

const config = require('../config');
const A8 = require('../sites/a8');
const Moshimo = require('../sites/moshimo');

module.exports = async (site, username, password, word) => {
  const siteInfo = fetchSiteInfo(site);
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto(siteInfo.loginUrl);
    await page.type(siteInfo.usernameBox, username);
    await page.type(siteInfo.passwordBox, password);
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(siteInfo.loginButton),
    ]);

    // TODO: login失敗時の処理について考える
    await page.waitForSelector(siteInfo.searchButton);

    await page.type(siteInfo.searchBox, word);
    Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(siteInfo.searchButton),
    ]);

    await page.waitForSelector(siteInfo.selector);

    const result = await page.$eval(siteInfo.selector, element => element.textContent);
    return siteInfo.formatForResponse(result);
  } catch (error) {
    throw { code: config.RESPONSE_CODE.SERVER_ERROR, error: 'サーバーエラーが発生しました' };
  }
};

/**
 * サイト情報を取得して返す
 *
 * @param id
 * @returns {{searchButton, loginUrl, loginButton, selector, passwordBox, usernameBox, searchBox}|*}
 */
const fetchSiteInfo = id => {
  switch (parseInt(id)) {
    case config.SITE.A8:
      return new A8();
    case config.SITE.MOSHIMO:
      return new Moshimo();
    default:
      throw { code: config.RESPONSE_CODE.SERVER_ERROR, error: 'サーバーエラーが発生しました' };
  }
};