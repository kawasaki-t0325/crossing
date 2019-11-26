module.exports = class Afb {
  constructor() {
    // ログインページURL
    this.loginUrl ='https://www.afi-b.com';
    // 入力項目
    this.usernameBox = 'input[name="login_name"]';
    this.passwordBox = 'input[name="password"]';
    this.searchBox = 'input[name="pm_search"]';
    // ボタン
    this.loginButton = '#pageTitle > aside.m-grid__itemOrder--01.m-gheader__loginForm > g-header-loginform > div.m-form__wrap > form > div > div.m-gLoginGlid__btn > m-btn > div > input';
    this.searchButton = 'input[type="submit"]';
    // 取得項目
    this.countSelector = '#pagination > div.pagination.clearFix > span > span';
    this.dataSelector = {
      program: '#pagination > form > div > div.promotion_head.clearFix > div > h5:last-of-type',
      url: '#pagination > form > div > div.promotion_head.clearFix > ul a[href^="/pa/promolist/?s"]',
      reward: '#pagination > form > div > div.promotion_contents > table:nth-child(1) > tbody > tr:nth-child(2) > td',
    };
  }

  /**
   * 取得できた件数を返す
   *
   * @param text
   * @returns int
   */
  formatForResponse(text) {
    return parseInt(text);
  }
};