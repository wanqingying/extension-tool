declare interface Window {
  _yapi_cookie: any;
  _yapi_url: any;
  _yapi_host: any;
  _foo: any;
}
// declare var Window{
//
// }

declare namespace extension {
  export namespace yapi {
    export interface CatApiCell {
      edit_uid: number;
      status: string;
      api_opened: boolean;
      tag: Array<any>;
      desc: string;
      _id: number;
      method: string;
      catid: number;
      title: string;
      path: string;
      project_id: number;
      uid: number;
      add_time: number;
      serviceName: string;
      methodName: string;
    }
  }
}

declare namespace wiki {
  export interface DinoNm {
    en: string[];
    cn: string;
  }
}

declare namespace ext {
  export interface HttpRecord {
    url: string;
    method: string;
    version: number;
    timestamp: number;
    response: any;
    headersReq: Array<{ name: string; value: any }>;
    headersRes: Array<{ name: string; value: any }>;
    cookies: chrome.cookies.Cookie[];
    bodySize: number;
    status: any;
    _contentType: any;
  }
}
