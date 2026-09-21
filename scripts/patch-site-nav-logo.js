const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");

const logoSrc = "images/amerilist-logo.png";
const logoAttrs =
  'class="brand-logo" src="' +
  logoSrc +
  '" alt="AmeriList" width="177" height="39"';
const footerAttrs =
  'class="footer-logo" src="' +
  logoSrc +
  '" alt="AmeriList" width="177" height="39"';

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  let t = fs.readFileSync(path.join(dir, file), "utf8");
  let n = t;

  n = n.replace(
    /class="brand-logo" src="images\/logo\.svg"[^/]*\/>/g,
    logoAttrs + " />"
  );
  n = n.replace(
    /class="footer-logo" src="images\/logo\.svg"[^/]*\/>/g,
    footerAttrs + " />"
  );

  if (!n.includes('>Home</a>') && n.includes('<nav class="header-nav" id="site-nav">')) {
    const homeLink =
      file === "index.html"
        ? '<a href="#top" aria-current="page">Home</a>\n      '
        : '<a href="index.html">Home</a>\n      ';
    n = n.replace(
      '<nav class="header-nav" id="site-nav">',
      '<nav class="header-nav" id="site-nav">\n      ' + homeLink
    );
  }

  if (n !== t) fs.writeFileSync(path.join(dir, file), n);
}
