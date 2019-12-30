import axios from 'axios';
import { RESPONSE_STATUS, MESSSGE, CODE } from '../config';

class HttpRequest {
  static httpRequest = async (siteId, word) => {
    if (!siteId || !word) return {};
    try {
      const instance = axios.create({ timeout: 50000 });
      const result = await instance.post(`${process.env.REACT_APP_HOST}/searchItem`, {
        site: siteId,
        word: word,
      });

      return result.data;
    } catch (e) {
      // TODO: logの仕組みを構築する（cloudfunctionsで作成？）
      if (e.code === CODE.TIMEOUT) {
        return { code: RESPONSE_STATUS.SERVER_ERROR, message: MESSSGE.TIMEOUT };
      }
      return { code: RESPONSE_STATUS.SERVER_ERROR, message: MESSSGE.SERVER_ERROR };
    }
  }
}

export default HttpRequest;