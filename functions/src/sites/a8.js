module.exports = class A8 {
  constructor() {
    // ログインページURL
    this.loginUrl = 'https://www.a8.net/';
    // 入力項目
    this.usernameBox = 'input[name="login"]';
    this.passwordBox = 'input[name="passwd"]';
    this.searchBox = '#headerSearchKeyword';
    // ボタン
    this.loginButton = 'input[name="lgin_as_btn"]';
    this.searchButton = 'input[type="submit"]';
    // 取得項目
    this.selector = '.sumPage';
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