const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");
const re = /<footer class="site-footer">[\s\S]*?<\/footer>/;

const footers = new Map();
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(dir, f), "utf8");
  const m = html.match(re);
  footers.set(f, m ? m[0] : null);
}

const byHash = new Map();
for (const [file, foot] of footers) {
  const key = foot || "MISSING";
  if (!byHash.has(key)) byHash.set(key, []);
  byHash.get(key).push(file);
}

console.log("Unique footer variants:", byHash.size);
for (const [foot, files] of byHash) {
  console.log("\n---", files.length, "files ---");
  console.log(files.join(", "));
  if (foot !== "MISSING") console.log(foot.slice(0, 300));
}
