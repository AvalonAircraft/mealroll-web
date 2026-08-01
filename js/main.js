(() => {
  "use strict";

  const config = window.MEALROLL_CONFIG || {};
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");
  const carousel = document.querySelector("[data-carousel]");
  const previousButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");

  const isAppleDevice = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const preferredStoreUrl = isAppleDevice
    ? config.appStoreUrl
    : config.googlePlayUrl;

  document.querySelectorAll("[data-store]").forEach((link) => {
    const store = link.dataset.store;
    const url = store === "appStore"
      ? config.appStoreUrl
      : store === "googlePlay"
        ? config.googlePlayUrl
        : preferredStoreUrl;

    if (url) {
      link.href = url;
      if (store !== "smart") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    }
  });

  const closeMenu = () => {
    if (!mobilePanel || !menuButton) return;
    mobilePanel.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
    menuButton.innerHTML = '<svg class="icon"><use href="#i-menu"/></svg>';
  };

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", () => {
      const open = !mobilePanel.classList.contains("is-open");
      mobilePanel.classList.toggle("is-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);
      menuButton.innerHTML = open
        ? '<svg class="icon"><use href="#i-close"/></svg>'
        : '<svg class="icon"><use href="#i-menu"/></svg>';
    });

    mobilePanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  if (carousel) {
    const scrollCarousel = (direction) => {
      const firstCard = carousel.querySelector(".screen-card");
      const cardWidth = firstCard?.getBoundingClientRect().width || 260;
      const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 18;
      carousel.scrollBy({
        left: direction * (cardWidth + gap) * 2,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    };

    previousButton?.addEventListener("click", () => scrollCarousel(-1));
    nextButton?.addEventListener("click", () => scrollCarousel(1));
  }

  // Keep FAQ interaction focused: opening one answer closes the others.
  const faqItems = [...document.querySelectorAll(".faq-list details")];
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
