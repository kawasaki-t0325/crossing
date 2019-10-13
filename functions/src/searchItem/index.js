'use strict';

const puppeteer = require('../modules/Puppeteer');
const config = require('../config');

module.exports = async (params) => {
  const { username, password, word } = params;
  if (!username || !password || !word) {
    throw { code: config.RESPONSE_CODE.BAD_REQUEST, error: 'invalid request' };
  }

  const item = await puppeteer(username, password, word);

  return (item === '') ? '該当なし' : '見つかりました';
};