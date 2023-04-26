// import { name_trans } from "./data";

export function trans(name_trans) {
  const items = document.querySelectorAll(
    ".loottable .tabber--live .itemlist li"
  );
  //document.querySelector('.loottable').querySelector('.tabber__section').childNodes[0].dataset.title
  // gama  beta alpha
  // @ts-ignore
  const title = document.querySelector(".mw-page-title-main")?.innerText;
  const result = [];
  items.forEach((item) => {
    try {
      const childNodes = item.childNodes;
      // @ts-ignore
      const label: string = item.childNodes[3]?.innerText || "";

      if (label.includes("Saddle")) {
        const [sp, k] = label.split(" ");
        const trans = name_trans.find((t) => {
          return t.en.toLowerCase().includes(sp.toLowerCase());
        });
        console.log("trnas", trans);
        if (!trans) return;
        // @ts-ignore
        const rate: string = childNodes[0]?.data;
        const rateNum = Number(rate.replace("%", "").replace(" ", ""));
        // @ts-ignore
        item.childNodes[3]?.innerText = trans.cn + "鞍";
        if (rateNum > 1) {
          result.push({
            // @ts-ignore
            rate: rateNum,
            en: label,
            cn: trans.cn + "鞍",
            title: title,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  });
  console.log("items", result);
  return result;
}
