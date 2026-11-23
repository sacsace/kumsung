import { readFileSync, writeFileSync, existsSync } from "fs";

const path = process.env.CONTENT_PATH || "/data/content.json";
if (!existsSync(path)) {
  console.error("missing", path);
  process.exit(1);
}

const content = JSON.parse(readFileSync(path, "utf8"));
let changed = 0;

for (const locale of ["ko", "en"]) {
  const brands = content?.[locale]?.services?.brands || [];
  for (const brand of brands) {
    for (const product of brand.products || []) {
      if (product.file === undefined) {
        product.file = "";
        changed += 1;
      }
      if (product.fileName === undefined) {
        product.fileName = "";
        changed += 1;
      }
    }
  }
  const categories = content?.[locale]?.services?.categories || [];
  for (const category of categories) {
    if (category.file === undefined) {
      category.file = "";
      changed += 1;
    }
    if (category.fileName === undefined) {
      category.fileName = "";
      changed += 1;
    }
  }
}

if (changed) {
  writeFileSync(path, JSON.stringify(content, null, 2) + "\n", "utf8");
}

console.log(
  JSON.stringify({
    ok: true,
    path,
    fieldsAdded: changed,
    koBrands: content.ko?.services?.brands?.length || 0,
    enBrands: content.en?.services?.brands?.length || 0,
  }),
);
