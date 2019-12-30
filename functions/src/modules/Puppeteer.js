const puppeteer = require('puppeteer');

const config = require('../config');
const A8 = require('../sites/a8');
const Moshimo = require('../sites/moshimo');
const Afb = require('../sites/afb');

module.exports = async (site, word) => {
  const siteInfo = fetchSiteInfo(site);
  try {
    const browser = await puppeteer.launch({
      // headless: false, NOTE: 開発時にはコメントアウトを外す
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '-–disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
      ]
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
      ['images', 'stylesheet', 'font'].includes(request.resourceType()) ? request.abort() : request.continue();
    });

    await page.goto(siteInfo.loginUrl, { waitUntil: "networkidle2" });
    await page.type(siteInfo.usernameBox, siteInfo.username);
    await page.type(siteInfo.passwordBox, siteInfo.password);
    await Promise.all([
      page.waitForNavigation({ timeout: 20000, waitUntil: "networkidle2" }),
      page.click(siteInfo.loginButton),
    ]).catch(() => {
      throw { code: config.RESPONSE_CODE.UNAUTHORIZED, error: '認証に失敗しました' }
    });

    await page.waitForSelector(siteInfo.searchButton, { timeout: 6000 }).catch(() => {
      throw { code: config.RESPONSE_CODE.UNAUTHORIZED, error: '認証に失敗しました' }
    });

    await page.type(siteInfo.searchBox, word).catch(() => {
      throw { code: config.RESPONSE_CODE.UNAUTHORIZED, error: '認証に失敗しました' }
    });
    Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(siteInfo.searchButton),
    ]);

    await page.waitForSelector(siteInfo.countSelector, { timeout: 20000 }).catch(() => {
      throw { code: config.RESPONSE_CODE.NOT_FOUND, error: '商品が見つかりませんでした' }
    });

    const countText = await page.$eval(siteInfo.countSelector, element => element.textContent);
    const count = siteInfo.formatForResponse(countText);
    if (count === 0) {
      throw { code: config.RESPONSE_CODE.NOT_FOUND, error: '商品が見つかりませんでした' }
    }

    return await page.evaluate((count, selector) => {
      const programs = Array.from(document.querySelectorAll(selector.program)).filter((content, index) => index < 5);
      const rewards = Array.from(document.querySelectorAll(selector.reward)).filter(content => !RegExp('-').test(content.textContent));
      const urls = Array.from(document.querySelectorAll(selector.url));
      const result = {
        count: count,
        message: '商品が見つかりました',
      };
      result.product = programs.map((program, index) => {
        return {
          name: program.textContent.trim(),
          url: urls[index].href,
          price: rewards[index].textContent.trim(),
        };
      });
      return result;
    }, count, siteInfo.dataSelector).catch(() => {
      throw { code: config.RESPONSE_CODE.SERVER_ERROR, error: 'サイト構成が変更された可能性があります。管理者にお問い合わせください。' }
    });
  } catch (error) {
    throw ('code' in error) ? error : { code: config.RESPONSE_CODE.SERVER_ERROR, error: 'サーバーエラーが発生しました' };
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
    case config.SITE.AFB:
      return new Afb();
    default:
      throw { code: config.RESPONSE_CODE.SERVER_ERROR, error: 'サーバーエラーが発生しました' };
  }
};