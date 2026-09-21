const url = process.argv[2];
fetch(url)
  .then((r) => r.text())
  .then((t) => {
    const hrefs = t.match(/href="[^"]+\.css[^"]*"/g) || [];
    console.log("css hrefs:", [...new Set(hrefs)].slice(0, 20));
    const shadow = t.includes("box-shadow") ? "has box-shadow in html" : "no box-shadow string";
    console.log(shadow);
    const idx = t.indexOf("box-shadow");
    if (idx >= 0) console.log(t.slice(idx, idx + 120));
  });
