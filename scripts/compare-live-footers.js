const urls = [
  "https://bestmailinglistbroker.com/",
  "https://bestmailinglistbroker.com/contact",
  "https://bestmailinglistbroker.com/contact.html",
];
const re = /<footer class="site-footer">[\s\S]*?<\/footer>/;

(async () => {
  for (const url of urls) {
    const t = await fetch(url).then((r) => r.text());
    const m = t.match(re);
    const hash = m ? m[0].replace(/\s+/g, " ").trim() : "MISSING";
    console.log("\n===", url, "===");
    console.log("len", hash.length);
    console.log(hash.slice(0, 400));
  }
})();
