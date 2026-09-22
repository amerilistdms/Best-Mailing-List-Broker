const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");

const logoBlock = `        <a class="footer-logo-wrap" href="index.html">
          <img class="footer-logo" src="images/bmlb-logo.png" alt="Best Mailing List Broker, powered by AmeriList" width="803" height="156" />
        </a>`;

const textBrand = `        <p class="brand-word footer-brand">
          <strong>Best Mailing List Broker</strong>
          <small>Powered by AmeriList</small>
        </p>`;

const kicker = `        <p class="kicker">BestMailingListBroker.com by AmeriList</p>\n`;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  let t = fs.readFileSync(path.join(dir, file), "utf8");
  let n = t;
  if (file === "index.html") {
    n = n.replace(textBrand, logoBlock.replace('href="index.html"', 'href="#top"'));
  } else {
    n = n.replace(textBrand, logoBlock);
  }
  n = n.replace(kicker, "");
  if (n !== t) fs.writeFileSync(path.join(dir, file), n);
}
