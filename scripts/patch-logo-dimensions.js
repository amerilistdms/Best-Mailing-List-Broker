const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  let t = fs.readFileSync(path.join(dir, f), "utf8");
  const n = t.replaceAll('width="805" height="262"', 'width="803" height="156"');
  if (n !== t) fs.writeFileSync(path.join(dir, f), n);
}
