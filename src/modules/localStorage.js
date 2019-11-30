import { COUNT_LIMIT_PER_DAY } from '../config';

class LocalStorage {
  static countUp = () => {
    const count = LocalStorage.getExpiredStorage('count');
    if (count === COUNT_LIMIT_PER_DAY) {
      return false;
    }

    const value = !!count ? count + 1 : 1;
    LocalStorage.updateExpiredStorage('count', value);
    return true;
  };

  /**
   * 有効期限情報を保有した値をlocalStorageに保存する
   *
   * @param key
   * @param value
   * @param expire
   */
  static setExpiredStorage = (key, value, expire = null) => {
    const date = new Date();
    expire = expire || date.setDate(date.getDate() + 1);
    const data = {
      expire: expire,
      value: value,
    };
    localStorage.setItem(key, JSON.stringify(data));
  };

  /**
   * localStorageに保存されているkeyを取得
   *
   * @param key
   * @returns string|int
   */
  static getExpiredStorage = key => {
    const data = localStorage.getItem(key) || '{}';
    const json = JSON.parse(data);
    if (Object.keys(json).length !== 0 && new Date(json.expire) > new Date()) {
      return json.value;
    }
    localStorage.removeItem(key);
    return '';
  };

  /**
   * 有効期限付きのlocalStorageに保存された値を更新処理する際の処理
   *
   * @param key
   * @param value
   */
  static updateExpiredStorage = (key, value) => {
    const data = localStorage.getItem(key) || '{}';
    const json = JSON.parse(data);
    if (Object.keys(json).length === 0) {
      LocalStorage.setExpiredStorage(key, value);
      return;
    }

    const updateValue = {
      expire: json.expire,
      value: value,
    };
    localStorage.setItem(key, JSON.stringify(updateValue));
  };
}

export default LocalStorage;