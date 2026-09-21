(function () {
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = header.querySelector(".nav-toggle");
    const nav = header.querySelector(".header-nav");
    if (!toggle || !nav) return;
    const setOpen = (open) => {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-lock", open);
    };
    toggle.addEventListener("click", () => setOpen(!header.classList.contains("nav-open")));
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    const drop = header.querySelector(".nav-drop");
    const dropBtn = drop && drop.querySelector("button");
    const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    header.querySelectorAll(".nav-drop-menu a").forEach((link) => {
      const href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
      if (href && href === page) link.setAttribute("aria-current", "page");
    });

    if (drop && dropBtn) {
      dropBtn.addEventListener("click", (event) => {
        event.preventDefault();
        drop.classList.toggle("open");
        dropBtn.setAttribute("aria-expanded", String(drop.classList.contains("open")));
      });
      document.addEventListener("click", (event) => {
        if (!drop.contains(event.target)) {
          drop.classList.remove("open");
          dropBtn.setAttribute("aria-expanded", "false");
        }
      });
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initMotion() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof gsap === "undefined") return;
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

    gsap.defaults({ ease: "power3.out", duration: 0.7 });

    const heroBits = document.querySelectorAll(".hero-copy > *");
    if (heroBits.length) {
      gsap.from(heroBits, { y: 22, stagger: 0.07, duration: 0.75, clearProps: "transform" });
    }
    const photo = document.querySelector(".hero-photo");
    if (photo) {
      gsap.from(photo, { x: 36, duration: 0.9, clearProps: "transform" });
    }

    gsap.utils.toArray("main > section:not(.hero):not(.quiz)").forEach((section) => {
      const items = section.querySelectorAll("h2, .section-lead, .type-col, .channel-card, .funnel-row, .match-grid article, .funnel-layout img, .find-layout img, .process img, .geo-codes, .who-pills li, .price-factors div, .faq-list details");
      if (!items.length) return;
      gsap.from(items, {
        y: 24,
        stagger: 0.05,
        duration: 0.65,
        clearProps: "transform",
        scrollTrigger: {
          trigger: section,
          start: "top 84%",
          once: true,
        },
      });
    });
  }

  initHeader();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMotion);
  } else {
    initMotion();
  }
})();
