import axios from 'axios';

//set some default settings for axios to handle backend api correctly
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//basic post request to backend api
export const apiPost = async (url, data) => {
  try {
    return await axios({
      method: 'post',
      url: (process.env.NODE_ENV === 'development') ? `http://localhost:3030/v1${url}` : `https://knacksteem.org/v1${url}`,
      data: data,
      responseType: 'json'
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};

//basic get request to backend api
export const apiGet = async (url, data) => {
  try {
    return await axios({
      method: 'get',
      url: (process.env.NODE_ENV === 'development') ? `http://localhost:3030/v1${url}` : `https://knacksteem.org/v1${url}`,
      params: data,
      responseType: 'json'
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};

//basic put (update) request to backend api
export const apiPut = async (url, data) => {
  try {
    return await axios({
      method: 'put',
      url: (process.env.NODE_ENV === 'development') ? `http://localhost:3030/v1${url}` : `https://knacksteem.org/v1${url}`,
      data: data,
      responseType: 'json'
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};
