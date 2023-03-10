import axios from "axios";
import Cookie = chrome.cookies.Cookie;

export const request = axios.create({});

request.interceptors.request.use((req) => {
  if (!req.baseURL) {
    req.baseURL = `http://${window._yapi_host}`;
  }
  return req;
});
