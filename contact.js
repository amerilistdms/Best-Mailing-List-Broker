document.getElementById("contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const btn = form.querySelector('[type="submit"]');
  if (btn) {
    btn.classList.add("is-loading");
    btn.disabled = true;
  }
  window.setTimeout(() => {
    form.hidden = true;
    const thanks = document.getElementById("contact-thanks");
    if (thanks) thanks.hidden = false;
  }, 700);
});
