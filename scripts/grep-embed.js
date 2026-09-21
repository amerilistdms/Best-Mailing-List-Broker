fetch("https://form.123formbuilder.com/embed/6980522.js")
  .then((r) => r.text())
  .then((t) => {
    for (const word of ["customCss", "transparent", "shadow", "stylesheet"]) {
      let i = 0;
      let n = 0;
      while ((i = t.indexOf(word, i)) >= 0 && n < 3) {
        console.log(word, t.slice(i, i + 100));
        i += word.length;
        n++;
      }
    }
  });
