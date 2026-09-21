const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  const file = path.join(dir, f);
  let t = fs.readFileSync(file, "utf8");
  const n = t
    .replaceAll('class="brand-logo" src="favicon.svg"', 'class="brand-logo" src="images/logo.svg"')
    .replaceAll('class="footer-logo" src="favicon.svg"', 'class="footer-logo" src="images/logo.svg"');
  if (n !== t) fs.writeFileSync(file, n);
}
