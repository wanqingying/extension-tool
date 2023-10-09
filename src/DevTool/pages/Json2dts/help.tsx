export function string2dts(str: string) {
  try {
    const obj = JSON.parse(str);
    return `interface Example  ${parseObj(obj)}`;
  } catch (e) {
    console.error(e);
  }
}

function parseObj(obj: any): string {
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "Array<any>";
    return `Array<${parseObj(obj[0])}>`;
  }
  if (obj === null) {
    return `any`;
  }

  if (typeof obj === "object") {
    const ets = Array.from(Object.entries(obj));
    return `{
    ${ets
      .map(([k, v]) => {
        return `${k}:${parseObj(v)}`;
      })
      .join(";\n")}
      }`;
  }
  if (typeof obj === "function") return "Function";
  return typeof obj;
}
