const fs = require("fs");
const path = require("path");
const htmlPath =
  process.argv[2] ||
  path.join(process.env.TEMP || "/tmp", "bmlb-form6980525.html");
const html = fs.readFileSync(htmlPath, "utf8");
const re =
  /\[(\d+),(\d{6,}),"([0-9a-f]{8})",\{"label":\{"labelText":"((?:\\.|[^"\\])*)"/g;
const seen = new Set();
const fields = [];
let m;
while ((m = re.exec(html))) {
  const id = +m[2];
  if (seen.has(id)) continue;
  seen.add(id);
  fields.push({
    typeId: +m[1],
    id,
    hash: m[3],
    label: m[4].replace(/\\"/g, '"').replace(/\\u([0-9a-f]{4})/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    ),
  });
}
fields.sort((a, b) => a.hash.localeCompare(b.hash));
for (const f of fields) console.log(JSON.stringify(f));
