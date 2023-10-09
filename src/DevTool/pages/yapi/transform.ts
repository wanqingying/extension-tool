import { set } from "lodash";
import { apiCode } from "./types";
import axios from "axios";

// 数据转换
export function transformYapi(data: apiCode.yapi.YapiApiDetailItem) {
  const apiSchema: apiCode.APISchema = schemaInit({
    path: data?.path,
    method: data?.method,
    //描述
    description: data?.desc,
    title: data?.title,
    //接口后端联系人
    author: data?.username,
    yapi: {
      projectId: data.project_id,
      cat_id: data.catid,
    },
    create_time: data.add_time,
    update_time: data.up_time,
  });
  if (Object.keys(data).length === 0) {
    return apiSchema;
  }
  if (data?.req_detail?.length || data?.res_detail?.length) {
    // yapi导入
    apiSchema.origin = "yapi-soa";
    apiSchema.request = transSoaData(data?.req_detail || []);
    apiSchema.response = transSoaData(data?.res_detail || []);
  } else {
    // YAPI 返回多种类型数据, 都得一一适配处理： 1. detail   2. mock 数据  3. scheme 数据
    const { req, res } = parseJsonString(data);
    // yapi手写
    apiSchema.origin = "yapi-input";
    apiSchema.request = transJsonData(req);
    apiSchema.response = transJsonData(res);
  }
  // 兼容处理
  let sc = apiSchema as any;
  if (sc.request?.properties?.properties) {
    sc.request = sc.request.properties;
  }
  if (sc.response?.properties?.properties) {
    sc.response = sc.response.properties;
  }
  return apiSchema;
}

export function schemaInit(data: Partial<apiCode.APISchema>): any {
  const defaultSchema: apiCode.APISchema = {
    origin: "yapi-input",
    //请求路径，不包含host
    path: "",
    // 是否formData数据
    formData: false,
    method: "",
    // 请求体参数
    body: { type: "object", properties: {} },
    // 请求url参数
    params: { type: "object", properties: {} },
    //描述
    description: "",
    title: "",
    // 返回数据
    response: { type: "object", properties: {} },
    request: { type: "object", properties: {} },
    //接口后端联系人
    author: "",
  };
  return { ...defaultSchema, ...data };
}

function getType(v: any): string {
  if (Array.isArray(v)) {
    return "array";
  }
  if (v === null) {
    return "undefined";
  }
  return typeof v;
}

const parseJsonString = (data: any) => {
  const jsonData = { req: {}, res: {} };
  const { req_mock_result, res_body, res_body_type, req_body_other } = data;
  if (req_mock_result) {
    jsonData.req = JSON.parse(req_mock_result);
  }
  if (req_body_other) {
    jsonData.req = JSON.parse(req_body_other);
  }
  if (res_body_type === "json" && res_body) {
    jsonData.res = JSON.parse(res_body);
  }
  return jsonData;
};

function transJsonData(jsonData: Object | any[]): any {
  let schema: any = {} as any;
  const type = getType(jsonData);
  switch (type) {
    case "string":
    case "number":
    case "null":
    case "undefined":
    case "boolean":
      schema = { type: type };
      break;
    case "array":
      schema = { type: type, items: transJsonData(jsonData[0]) };
      break;
    case "object":
      schema = {
        type: type,
        properties: Array.from(Object.entries(jsonData)).reduce(
          (obj, [k, v]) => {
            set(obj, k, v);
            return obj;
          },
          {}
        ),
      };
      break;
  }
  return schema;
}
function transSoaData(data: any[]): any {
  const schema: any = {
    type: "object",
    properties: {},
    version: "0.1.0",
  };
  if (!Array.isArray(data)) {
    return schema;
  }

  // 绝对路径处理
  const addProperties = (str: string): string => {
    const splitAry = str.split(".");
    if (splitAry.length > 1) {
      const temAry: any[] = [];
      splitAry.forEach((item, index) => {
        const isNumber = +item >= 0;
        if (isNumber && index > 0) {
          // TODO: 默认数字就是数组，不做父类型的判断, 减少遍历次数
          temAry.push("items");
          if (Number(item) === 0) {
            return;
          }
        }

        if (index > 0 && !isNumber) {
          temAry.push("properties");
        }

        temAry.push(item);
      });

      return temAry.join(".");
    } else {
      return str;
    }
  };

  // 第零次遍历：优化 key 的顺序， 因为生成 scheme 的时候， 父级值会覆盖已生成的值
  // eg: data 会覆盖 data.0.a
  data.sort((cur, next) => {
    return cur.path.split(".").length > next.path.split(".").length ? 1 : -1;
  });

  // 第一次遍历：生成基础 scheme
  data.forEach((item) => {
    // req.xxx
    // request.xxx
    const path = item.path?.replace(/^(req\.)/, "").replace(/^(request\.)/, "");
    if (["req", "request"].includes(path)) return;
    const realPath = addProperties(path);
    if (realPath) {
      set(schema, `properties.${realPath}`, {
        type: item?.type,
        description: item?.description,
        required: item?.requiredness === "是",
        defaultValue: item?.defaultValue,
      } as any);
    }
  });
  return schema;
}

interface Request {
  definition: { list: Array<string> };
  active: boolean;
}

interface AnyOpt {
  name?: string;
  desc?: string;
}
function writeAny(data: apiCode.APIDataType, opt?: AnyOpt): string {
  const { name, desc } = opt;
  switch (data.type) {
    case "object":
      return writeObj(data, opt);
    case "array":
      return writeList(data, opt);
    case "boolean":
    case "number":
    case "string":
    case "undefined":
    case "null":
      return writeSimple(data);
    default:
      return "unknown";
  }
}
function writeObj(data: apiCode.APIDataObjectType, opt?: AnyOpt): string {
  if (typeof data.properties !== "object") {
    return "null";
  }
  const content = Array.from(Object.entries(data.properties))
    .map(([key, child]) => {
      return `${desc(child)}${key}:${writeAny(child, { desc: "false" })}`;
    })
    .join(";");

  return `${desc(data, opt)}{${content}}`;
}
function writeList(data: apiCode.APIDataArrayType, opt?: AnyOpt): string {
  const item = Array.isArray(data.items) ? data.items?.[0] : data.items;
  return `${desc(data, opt)}Array<${writeAny(item, { desc: "false" })}>`;
}
function desc(data: apiCode.APIDataType, opt?: AnyOpt) {
  if (data.description && opt?.desc !== "false") {
    return `\r\n/**${data.description}*/\r\n`;
  } else {
    return "";
  }
}

/** xx */
function writeSimple(data: apiCode.APIDataSimpleType, name?: string): string {
  switch (data.type) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
    case "null":
      return `${data.type}\r\n`;
    default:
      return "unknown";
  }
}

interface ResType<T> {
  data: T;
  msg?: string;
  code?: number;
}

export function create<D>(data: any): Promise<ResType<D>> {
  const path = "";
  return axios.post(path, data).then((res) => res.data);
}


export async function write(api: apiCode.APISchema, funName?: string) {
  const Fn = funName.substring(0, 1).toUpperCase() + funName.substring(1);
  const RequestStr = `interface Request${Fn} ${writeObj(api.request as any)}`;
  const ResponseStr = `interface Response${Fn} ${writeObj(
    api.response as any
  )}`;
  let result = RequestStr + "\r\n" + ResponseStr + "\r\n";
  if (api.method.toLowerCase() === "post") {
    result += ` \r\n /** ${api.description} */
    export function ${funName}(data: Request${Fn}): Promise<Response${Fn}> {
        const path = '${api.path}';
        return request.post(path, data)
    }
    `;
  } else if (api.method.toLowerCase() === "get") {
    result += ` \r\n /** ${api.description} */
    export function ${funName}(data?: Request${Fn}): Promise<Response${Fn}> {
        const path = '${api.path}';
        return request.get(path, {params: data})
    }
    `;
  } else {
    result += `/**unsupported method ${api.method}*/`;
  }

  return result;
}
