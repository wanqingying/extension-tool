import axios from "axios";
import { transformYapi, write } from "./transform";
import * as path from "path";
import * as fs from "fs";
import * as prettier from "prettier";
import * as cp from "child_process";
// import * as inquirer from "inquirer";

let cooke = "";

function getApiSource() {
  // return inquirer
  //   .prompt([
  //     {
  //       type: "input",
  //       name: "url",
  //       message: "请输入接口文档链接",
  //     },
  //   ])
  //   .then((value) => value?.url);
  return Promise.resolve("");
}

async function getApiByIds(ids: string[]) {
  return axios
    .post(
      ``,
      {
        ids: ids,
      },
      {
        headers: { cookie: "" },
      }
    )
    .then((res) => {
      return Array.isArray(res.data?.data) ? res.data.data : [];
    });
}

async function getApiListByUrl(url: string) {
  const matchApi = url.match(/project\/(.*)\/interface\/api\/(\d*)/);
  const matchCat = url.match(/project\/(.*)\/interface\/api\/cat_(\d*)/);
  let catId = matchCat?.[2];
  const apiId = matchApi?.[2];

  if (apiId) {
    const [data] = await getApiByIds([apiId]);
    catId = data?.catid;
  }
  if (!catId) {
    return [];
  }

  const options = await axios
    .get(
      // cat_url
      ``,
      { headers: { cookie: cooke } }
    )
    .then((res) => {
      const data: any[] = res.data?.data?.list || [];
      return data.map((d) => {
        const p = d.path.split("/");
        const p1 = p.pop();
        const p2 = p.pop();
        const p3 = p.pop();
        return {
          name: `${d.title}(/${p3}/${p2}/${p1})`,
          path: d.path,
          value: d._id,
          checked: true,
        };
      });
    });

  console.log("opts", options);

  // return inquirer
  //     .prompt([
  //         {
  //             type: "checkbox",
  //             name: "ids",
  //             message: "请选择接口文档链接",
  //             choices: options,
  //         },
  //     ])
  //     .then((r) => r.ids);
  return options.map((p) => p.value);
}

const impStr = `import { request } from "../request";`;

async function main() {
  const url = await getApiSource();
  const ids: any[] = await getApiListByUrl(url);
  const data = (await getApiByIds(ids)) as any[];
  const results: Map<string, string[]> = new Map();
  const all = [];
  let dup = 1;
  for (let i = 0; i < data.length; i++) {
    const schema = transformYapi(data[i]);
    // debugger
    const names = schema.path.split("/");
    let funName = names.pop();
    const fileName = names.pop();
    const dirName = names.pop();
    const fp = path.resolve(process.cwd(), `./apis/${dirName}/${fileName}.ts`);
    const up = fp + funName;
    const d = results.get(fp) || [impStr];
    if (all.includes(up)) {
      dup++;
      funName = funName + "V" + dup;
    }
    const dataStr = await write(schema, funName);
    all.push(fp + funName);
    d.push(dataStr);
    results.set(fp, d);
  }
  const rList = Array.from(results.keys());
  for (let i = 0; i < rList.length; i++) {
    const ri = rList[i].split("/");
    ri.pop();
    const p = ri.join("/");
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
    const fi = results.get(rList[i]);
    await fs.writeFileSync(
      rList[i],
      prettier.format(fi.join("\r\n"), { parser: "typescript" })
    );
    console.log("生成接口文件: ", rList[i]);
  }
  try {
    await move();
    // await chmod();
  } catch (e) {
    console.error(e);
  }
}

async function move(target?: string) {
  const out = path.resolve(process.cwd(), "./apis/");
  console.log("out move", out);
  await cp.execSync(`cp ${path.resolve(__dirname, "./temp/*.ts")} ${out}`);
}
async function chmod(target?: string) {
  await cp.execSync(`chmod -R 777 ${path.resolve(process.cwd(), "./apis/*")}`);
}

main()
  .then((r) => {
    setTimeout(() => {
      chmod().then();
    }, 50);
    // return chmod();
  })
  .finally(() => {
    console.log("done");
  });
