import axios from "axios";
import { ElLoading } from "element-plus";

import Message from "./Message";
import router from "@/router";

const responseTypeJson = "json";
const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";

let loading = null;
const instance = axios.create({
  baseURL: "/api",
  timeout: 10 * 1000,
});

instance.interceptors.request.use(
  (config) => {
    if (config.showLoading) {
      loading = ElLoading.service({
        lock: true,
        text: "加载中......",
        background: "rgba(0, 0, 0, 0.7)",
      });
    }
    return config;
  },
  (error) => {
    if (config.showLoading && loading) {
      loading.close();
    }
    Message.error("请求发送失败");
    return Promise.reject("请求发送失败");
  }
);

instance.interceptors.response.use(
  (response) => {
    const {
      showLoading,
      errorCallback,
      showError = true,
      responseType,
    } = response.config;
    if (showLoading && loading) {
      loading.close();
    }
    const responseData = response.data;
    if (responseType == "arraybuffer" || responseType == "blob") {
      return responseData;
    }
    if (responseData.code == 200) {
      return responseData;
    } else if (responseData.code == 901) {
      router.push(
        "/login?redirectUrl=" + encodeURI(router.currentRoute.value.path)
      );
      return Promide.reject({ showError: false, msg: "登陆超时" });
    } else {
      if (errorCallback) {
        errorCallback(responseData.info);
      }
      return Promise.reject({ showError: showError, msg: responseData.info });
    }
  },
  (error) => {
    if (error.config.showLoading && loading) {
      loading.close();
    }
    return Promise.reject({ showError: true, msg: "网络异常" });
  }
);

const request = (config) => {
  const {
    url,
    params,
    dataType,
    showLoading = true,
    responseType = responseTypeJson,
  } = config;
  let contentType = contentTypeForm;
  let formData = new FormData();
  for (let key in params) {
    formData.append(key, params[key] == undefined ? "" : params[key]);
  }
  if (dataType != null && dataType == "json") {
    contentType = contentTypeJson;
  }
  let headers = {
    "Content-Type": contentType,
    "X-Request-With": "XMLHttpRequest",
  };

  /* return new Promise((resolve,reject) => {
    instance
      .post(url, formData, {
        onUploadProgress: (event) => {
          if (config.uploadProgressCallback) {
            config.uploadProgressCallback(event);
          }
        },
        responseType: responseType,
        headers: headers,
        showLoading: showLoading,
        errorCallback: config.errorCallback,
        showError: config.showError,
      })
      .then((res)=>{
        resolve(res);
      })
      .catch((error) => {
        console.log(error);
        if (error.showError) {
          Message.error(error.msg);
        }
        reject(error);
      });
  }); */
  return instance.post(url, formData, {
    onUploadProgress: event => {
      if (config.uploadProgressCallback) {
        config.uploadProgressCallback(event);
      }
    },
    responseType: responseType,
    headers: headers,
    showLoading: showLoading,
    errorCallback: config.errorCallback,
    showError: config.showError
  }).catch(error => {
    console.log(error);
    if (error.showError) {
      if (error.showError) {
        Message.error(error.msg);
      }
      return null;
    }
  });
};

export default request;
