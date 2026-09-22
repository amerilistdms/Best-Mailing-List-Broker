const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..");
const footer = fs.readFileSync(
  path.join(dir, "partials", "site-footer.html"),
  "utf8"
).trim();

const footerRe =
  /<footer class="site-footer">[\s\S]*?<\/footer>|<div data-site-footer><\/div>/;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  let html = fs.readFileSync(path.join(dir, file), "utf8");
  let next = html;

  if (footerRe.test(html)) {
    next = html.replace(footerRe, footer);
  } else if (file !== "404.html") {
    continue;
  } else {
    next = html.replace("</body>", `  ${footer}\n</body>`);
  }

  next = next.replace(/\n\s*<script src="footer\.js"><\/script>\n?/g, "\n");

  if (next !== html) fs.writeFileSync(path.join(dir, file), next);
}
