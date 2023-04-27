declare interface Window {
  _yapi_cookie: any;
  _yapi_url: any;
  _yapi_host: any;
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
