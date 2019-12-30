'use strict';

const puppeteer = require('../modules/Puppeteer');
const config = require('../config');

module.exports = async (params) => {
  const { site, word } = params;
  if (!site || !word) {
    throw { code: config.RESPONSE_CODE.BAD_REQUEST, error: '不正なリクエストパラメータです' };
  }

  return await puppeteer(site, word);
};
