const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");
const v = "20260322d";
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  let t = fs.readFileSync(path.join(dir, f), "utf8");
  let n = t.replace(/href="styles\.css(\?[^"]*)?"/g, `href="styles.css?v=${v}"`);
  n = n.replace(/href="form-123\.css(\?[^"]*)?"/g, `href="form-123.css?v=${v}"`);
  if (n !== t) fs.writeFileSync(path.join(dir, f), n);
}
