import axios from "axios";

const MyHttpServer = {};
MyHttpServer.install = Vue => {
  // 添加请求拦截器
  axios.interceptors.request.use(
    function(config) {
    
    if(config.url !== 'login') {
        const AUTH_TOKEN = localStorage.getItem("token");
        config.headers["Authorization"] = AUTH_TOKEN;
    }

      // 在发送请求之前做些什么
      return config;
    },
    function(error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );

  // 添加响应拦截器
  axios.interceptors.response.use(
    function(response) {
      // 对响应数据做点什么
      return response;
    },
    function(error) {
      // 对响应错误做点什么
      return Promise.reject(error);
    }
  );
//   设置基准地址
  axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";
  Vue.prototype.$http = axios;
};

export default MyHttpServer;
