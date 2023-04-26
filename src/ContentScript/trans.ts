import { name_trans } from "./data";

console.log("start trans ok 22");
console.log("names", name_trans);

function trans() {
  const items = document.querySelectorAll(
    ".loottable .tabber--live .itemlist li"
  );
  items.forEach((item) => {
    try {
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
        item.childNodes[3]?.innerText = trans.cn + "鞍";
      }
    } catch (e) {
      console.log(e);
    }
  });
  console.log("items", items);
}

trans();
