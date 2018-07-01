import axios from 'axios';

//set some default settings for axios to handle backend api correctly
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [(data, headers) => {
  let str = [];
  for(let p in data)
    if (data.hasOwnProperty(p) && data[p]) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(data[p])}`);
    }
  return str.join('&');
}];

//basic post request to backend api
export const apiPost = async (url, data) => {
  try {
    let response = await axios({
      method: 'post',
      url: (process.env.NODE_ENV === 'development') ? `http://localhost:3030/v1${url}` : `https://knacksteem.org/v1${url}`,
      data: data,
      responseType: 'json'
    });
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
};

//basic get request to backend api
export const apiGet = async (url, data) => {
  try {
    let response = await axios({
      method: 'get',
      url: (process.env.NODE_ENV === 'development') ? `http://localhost:3030/v1${url}` : `https://knacksteem.org/v1${url}`,
      data: data,
      responseType: 'json'
    });
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
};
