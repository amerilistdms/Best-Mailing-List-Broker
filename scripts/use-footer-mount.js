const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..");
const mount = '<div data-site-footer></div>';
const re = /<footer class="site-footer">[\s\S]*?<\/footer>/;
const footerScript = '<script src="footer.js"></script>';

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  let html = fs.readFileSync(path.join(dir, file), "utf8");
  if (!re.test(html)) continue;

  let next = html.replace(re, mount);
  if (!next.includes("footer.js")) {
    next = next.replace(/<script src="motion\.js"><\/script>/, footerScript + "\n  " + '<script src="motion.js"></script>');
    if (!next.includes("footer.js")) {
      next = next.replace("</body>", "  " + footerScript + "\n</body>");
    }
  }
  if (next !== html) fs.writeFileSync(path.join(dir, file), next);
}
