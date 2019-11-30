'use strict';

const puppeteer = require('../modules/Puppeteer');
const config = require('../config');

module.exports = async (params) => {
  const { site, username, password, word } = params;
  if (!site || !username || !password || !word) {
    throw { code: config.RESPONSE_CODE.BAD_REQUEST, error: '不正なリクエストパラメータです' };
  }

  return await puppeteer(site, username, password, word);
};
