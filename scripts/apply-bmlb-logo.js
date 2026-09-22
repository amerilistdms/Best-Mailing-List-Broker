const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");
const brand =
  'class="brand-logo" src="images/bmlb-logo.png" alt="Best Mailing List Broker, powered by AmeriList" width="805" height="262"';
const footer =
  'class="footer-logo" src="images/bmlb-logo.png" alt="Best Mailing List Broker, powered by AmeriList" width="805" height="262"';

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  let t = fs.readFileSync(path.join(dir, file), "utf8");
  const n = t
    .replace(/class="brand-logo" src="images\/amerilist-logo\.png"[^/]*\/>/g, brand + " />")
    .replace(/class="footer-logo" src="images\/amerilist-logo\.png"[^/]*\/>/g, footer + " />");
  if (n !== t) fs.writeFileSync(path.join(dir, file), n);
}
