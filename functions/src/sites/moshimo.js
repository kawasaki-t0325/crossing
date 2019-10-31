module.exports = class Moshimo {
  constructor() {
    // ログインページURL
    this.loginUrl ='https://af.moshimo.com/af/shop/login';
    // 入力項目
    this.usernameBox = 'input[name="account"]';
    this.passwordBox = 'input[name="password"]';
    this.searchBox = 'input[name="words"]';
    // ボタン
    this.loginButton = 'input[name="login"]';
    this.searchButton = '.search-button > a';
    // 取得項目
    this.selector = 'span.found-rows';
  }

  /**
   * 取得できた件数を返す
   *
   * @param text
   * @returns int
   */
  formatForResponse(text) {
    return !!text ? parseInt(text.replace(/[^0-9]/g, '')) : 0;
  }
};