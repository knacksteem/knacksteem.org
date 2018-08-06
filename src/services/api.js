import axios from 'axios';
import {message} from 'antd';
import Config from '../config';

//set some default settings for axios to handle backend api correctly
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//basic post request to backend api
export const apiPost = async (url, data) => {
  try {
    return await axios({
      method: 'post',
      url: `${Config.apiURL}${url}`,
      data: data,
      responseType: 'json'
    });
  } catch (error) {
    message.error(error.response.data.message);
    return false;
  }
};

//basic get request to backend api
export const apiGet = async (url, data) => {
  try {
    return await axios({
      method: 'get',
      url: `${Config.apiURL}${url}`,
      params: data,
      responseType: 'json'
    });
  } catch (error) {
    message.error(error.response.data.message);
    return false;
  }
};

//basic put (update) request to backend api
export const apiPut = async (url, data) => {
  try {
    return await axios({
      method: 'put',
      url: `${Config.apiURL}${url}`,
      data: data,
      responseType: 'json'
    });
  } catch (error) {
    message.error(error.response.data.message);
    return false;
  }
};
