import axios from 'axios';

const basicDelete = async (url, data) => {
  let cookies = new Cookies();
  return await axios({
    method: 'delete',
    url: url,
    data: data,
    auth: {
      username: cookies.get('username') || '',
      password: cookies.get('password') || ''
    },
    timeout: 10000
  }).then(response => {
    return response;
  }).catch(error => {
    console.log(error);
  });
};

const basicPOST = async (url, data) => {
  let cookies = new Cookies();
  return await axios({
    method: 'post',
    url: url,
    data: data,
    auth: {
      username: cookies.get('username') || '',
      password: cookies.get('password') || ''
    },
    timeout: 10000
  }).then(response => {
    return response;
  }).catch(error => {
    console.log(error);
  });
};

const basicPUT = async (url, data) => {
  let cookies = new Cookies();
  return await axios({
    method: 'put',
    url: url,
    data: data,
    auth: {
      username: cookies.get('username') || '',
      password: cookies.get('password') || ''
    },
    timeout: 10000
  }).then(response => {
    return response;
  }).catch(error => {
    console.log(error);
  });
};

const basicGET = async (url, data) => {
  let cookies = new Cookies();
  //timestamp to avoid caching
  data = data || {};
  data.ts = Date.now();
  return await axios({
    method: 'get',
    url: url,
    responseType: 'json',
    params: data,
    auth: {
      username: cookies.get('username') || '',
      password: cookies.get('password') || ''
    },
    timeout: 10000
  }).then(response => {
    return response;
  }).catch(error => {
    console.log(error);
  });
};
