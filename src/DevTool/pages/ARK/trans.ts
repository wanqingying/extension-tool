// import { name_trans } from "./data";

export function transSaddle(name_trans: wiki.DinoNm[]) {
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
          return t.en.some((en) => en.toLowerCase().includes(sp.toLowerCase()));
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

export function transDino(trans: wiki.DinoNm[]) {
  const t = Date.now().valueOf();
  const name_trans = new Map<string, string>();
  trans.forEach((t) => {
    t.en.forEach((en) => name_trans.set(en, t.cn));
  });
  function traverse(node: HTMLElement) {
    transNode(node);
    node.childNodes.forEach(transNode);

    if (node.hasChildNodes()) {
      Array.from(node.children).forEach(traverse);
    }
  }
  function transNode(node: ChildNode) {
    if (node.nodeType !== 3) return;
    // @ts-ignore

    const txt = node.data || "";

    if (name_trans.get(txt.trim().toLowerCase())) {
      // @ts-ignore

      node.data = name_trans.get(txt.trim().toLowerCase());
    }
  }
  traverse(document.body);
}
