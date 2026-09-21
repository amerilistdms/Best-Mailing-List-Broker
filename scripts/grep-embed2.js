fetch("https://form.123formbuilder.com/embed/6980522.js")
  .then((r) => r.text())
  .then((t) => {
    const idx = t.indexOf("iframe");
    console.log(t.slice(idx, idx + 2500));
  });
