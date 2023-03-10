

export namespace apiCode {
    export namespace yapi {
        export interface YapiApiCatListRes {
            errcode: number;
            errmsg: string;
            data: {
                count: number;
                total: number;
                list: YapiApiCatListItem[];
            };
        }
        export interface YapiApiCatListItem {
            edit_uid: number;
            status: string;
            api_opened: boolean;
            tag: any[];
            _id: number;
            method: string;
            catid: number;
            title: string;
            path: string;
            project_id: number;
            uid: number;
            add_time: number;
            detail?: apiCode.yapi.YapiApiDetailRes;
        }
        export interface YapiApiDetailItem {
            query_path: {
                path: string;
                params: any[];
            };
            edit_uid: number;
            status: string;
            type: string;
            req_body_is_json_schema: boolean;
            res_body_is_json_schema: boolean;
            api_opened: boolean;
            index: number;
            tag: any[];
            _id: number;
            method: string;
            catid: number;
            title: string;
            path: string;
            project_id: number;
            req_params: any[];
            res_body_type: string;
            uid: number;
            add_time: number;
            up_time: number;
            req_query: any[];
            req_headers: {
                required: string;
                _id: string;
                name: string;
                value: string;
            }[];
            req_body_form: any[];
            __v: number;
            req_body_other: string;
            markdown: string;
            desc: string;
            res_body: string;
            req_body_type: string;
            username: string;
            req_detail?: any[];
            res_detail?: any[];
        }
        export interface YapiApiDesc {
            project_id: number;
            _id: 2196541;
            catid: number;
            add_time: number;
            api_opened: boolean;
            desc: string;
            edit_uid: number;
            method: string;
            path: string;
            status: "on" | "off";
            tag: string[];
            title: string;
            uid: number;
            up_time: number;
        }

        export interface YapiApiDetailRes {
            errcode: number;
            errmsg: string;
            data: YapiApiDetailItem[];
        }
    }

    //接口数据
    export interface APIDataBaseType {
        // 描述
        description?: string;
        // 是否必须
        required?: boolean;
        // 默认值
        defaultValue?: string;
        version?: string;
    }

    export interface APIDataSimpleType extends APIDataBaseType {
        type: "string" | "number" | "null" | "boolean" | "undefined";
    }
    export interface APIDataObjectType extends APIDataBaseType {
        type: "object";
        properties: Record<string, APIDataType>;
    }
    export interface APIDataArrayType extends APIDataBaseType {
        type: "array";
        items: APIDataType;
    }

    //接口数据，分为简单类型和复杂类型
    export type APIDataType =
        | APIDataSimpleType
        | APIDataArrayType
        | APIDataObjectType;

    // 描述接口的数据
    export interface APISchema {
        //接口来源
        origin: "yapi-input" | "yapi-soa" | "soa" | "json" | "bmp-yapi";
        //请求路径，不包含host
        path: string;
        // 是否formData数据
        formData?: boolean;
        method: string;
        // 请求体参数
        body?: APIDataType;
        // 请求url参数
        params?: APIDataType;
        //描述
        description?: string;
        title?: string;
        // 返回数据
        response?: APIDataType;
        request?: APIDataType;
        //接口后端联系人
        author?: string;

        yapi?: {
            // yapi有此字段
            projectId?: any;
            cat_id?: any;
        };
        soa?: {
            serviceName?: string;
            // git分支
            branch?: string;
        };
        create_time?: number;
        update_time?: number;
        // 名称，用于生成代码，函数名、类型名等
        name?: string;
    }
}
