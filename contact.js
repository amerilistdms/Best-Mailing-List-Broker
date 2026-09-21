(function () {
  const mount = document.getElementById("contact-123");
  const pending = document.getElementById("contact-form-pending");
  const formId = String(window.FORM123?.contactFormId || "").trim();

  if (!mount) return;

  if (!formId) {
    if (pending) pending.hidden = false;
    return;
  }

  if (pending) pending.hidden = true;

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.defer = true;
  script.src = `https://form.123formbuilder.com/embed/${formId}.js`;
  script.dataset.role = "form";
  script.dataset.defaultWidth = "100%";
  mount.appendChild(script);
})();
