import axios from 'axios';
import qs from 'qs'
import router from '../router/index';
// import * as types from '../store/mutations';
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import api from '@/api/apiConfig'
axios.defaults.baseURL = api.baseURL;
// axios.defaults.baseURL = "http://propertyman.omnrj.com";
axios.defaults.timeout = 20000;

// require('es6-promise').polyfill() //axios是基于Promise 兼容低版本浏览器

function fetch(url, method = 'get', data = {}) {
  const instance = axios.create({
    // baseURL: 'https://api.omnrj.com',
    // timeout: 5000,
  });

  // http request 拦截器
  instance.interceptors.request.use((config) => {
    const res = config;
    // if (store.state.login.authorization) {
    //   config.headers["authorization"] = store.state.login.authorization;
    // }
    if (store.getters.token) {
      // let each request carry token
      // ['authorization'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['authorization'] = getToken()
    }
    return res;
  },
    (err) => {
      const error = err;
      return Promise.reject(error);
    },
  );
  // http response 拦截器
  instance.interceptors.response.use((response) => {
    const res = response;
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: 非法 token; 50012: 其他客户端登录; 50014: Token 过期;
      if (false) {  // res.code === 50008 || res.code === 50012 || res.code === 50014
        // to re-login
        MessageBox.confirm('您已注销，您可以取消停留在该页上，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
    (err) => {
      const error = err;
      console.log('err' + error) // for debug
      Message({
        message: error.message,  // Request failed with status code 404
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error); // 返回接口返回的错误信息
    },
  );
  switch (method) {
    case 'get':
      return instance.get(url, {
        params: data
      });
    case 'post':
      // axios.defaults.headers = {
      //   'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      // }
      // qs.stringify() 将对象 序列化成URL的形式,以&进行拼接
      // qs.parse()     将URL 解析成对象的形式
      // return instance.post(url, qs.stringify(data));

      return instance.post(url, data);
    case 'put':
      return instance.put(url, data);
    case 'delete':
      return instance.delete(url, data);
    default:
      return instance.get(url, {
        params: data
      });
  }
}


function request(url, method = 'get', data = {}) {
  return new Promise((resolve, reject) => {
    const resData = fetch(url, method, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    return resData;
  });
}
export default request;
