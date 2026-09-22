const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..");
const footer = fs.readFileSync(
  path.join(dir, "partials", "site-footer.html"),
  "utf8"
).trim();

const footerRe = /<footer class="site-footer">[\s\S]*?<\/footer>/;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  if (file === "404.html") continue;
  let html = fs.readFileSync(path.join(dir, file), "utf8");
  if (!footerRe.test(html)) {
    console.warn("skip (no footer):", file);
    continue;
  }
  const next = html.replace(footerRe, footer);
  if (next !== html) fs.writeFileSync(path.join(dir, file), next);
}
