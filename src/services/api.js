import axios from 'axios';
import Store from '../store';

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

const api = async (version, endpoint, data = {}, method = 'GET') => {
  if (method === 'GET') {
    return await basicGET(Config.server.url + version + '/' + endpoint);
  } else if (method === 'POST') {
    return await basicPOST(Config.server.url + version + '/' + endpoint, data);
  } else if (method === 'PUT') {
    return await basicPUT(Config.server.url + version + '/' + endpoint, data);
  } else if (method === 'DELETE') {
    return await basicDelete(Config.server.url + version + '/' + endpoint, data);
  }
};

const login = async (username, password) => {
  let cookies = new Cookies();
  cookies.set('username', username);
  cookies.set('password', password);

  return await basicPOST(Config.server.url + 'v1/auth/login');
};

const getLoginStatus = async () => {
  return await basicGET(Config.server.url + 'v1/auth');
};
