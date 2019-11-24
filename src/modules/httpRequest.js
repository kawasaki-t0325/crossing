import axios from 'axios';

class HttpRequest {
  static httpRequest = async (siteId, word, username, password) => {
    try {
      const result = await axios.post(`${process.env.REACT_APP_HOST}/crossing-39d56/asia-northeast1/searchItem`, {
        site: siteId,
        word: word,
        username: username,
        password: password,
      });

      console.log(result);
    } catch (e) {
    }
  }
}

export default HttpRequest;