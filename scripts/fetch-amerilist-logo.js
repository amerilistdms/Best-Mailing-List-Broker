const fs = require("fs");
const path = require("path");
const urls = [
  "https://www.amerilist.com/wp-content/themes/air-light/assets/logos/amerilist.png",
  "https://www.amerilist.com/staging/wp-content/themes/air-light/assets/logos/amerilist.png",
];
const out = path.join(__dirname, "..", "images", "amerilist-logo.png");

(async () => {
  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) {
      console.log("fail", url, res.status);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(out, buf);
    console.log("saved", out, "from", url, buf.length);
    return;
  }
  process.exit(1);
})();
