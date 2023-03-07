import Ax from "axios";

/**
 * 按照axios规范，可以自己实现一个request
 */
export const request = Ax.create({ baseURL: "/" });


request.interceptors.request.use((req) => {
  return req;
});
request.interceptors.response.use((res) => {
  return res;
});
