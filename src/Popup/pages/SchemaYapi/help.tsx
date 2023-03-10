import { request } from "../request";

export async function getApiByIds(ids: string[]) {
  return request
    .post(`/thrift/api/v1/interface/get`, {
      ids: ids,
    })
    .then((res) => {
      return Array.isArray(res.data?.data) ? res.data.data : [];
    });
}

export async function getApiListByUrl(url: string) {
  const matchApi = url.match(/project\/(.*)\/interface\/api\/(\d*)/);
  const matchCat = url.match(/project\/(.*)\/interface\/api\/cat_(\d*)/);
  let catId = matchCat?.[2];
  const apiId = matchApi?.[2];

  if (apiId) {
    // 总单个接口获取分组信息
    const [data] = await getApiByIds([apiId]);
    catId = data?.catid;
  }
  if (!catId) {
    console.error("cat id not found");
    return [];
  }

  const options = await request
    .get(`/thrift/api/interface/list_cat?page=1&limit=50&catid=${catId}`)
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
