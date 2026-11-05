(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fade the page in once loaded
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });
  // Fallback in case 'load' already fired
  if (document.readyState === "complete") {
    document.body.classList.add("loaded");
  }

  // Header shadow on scroll
  var header = document.getElementById("site-header");
  function updateHeaderShadow() {
    if (window.scrollY > 4) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  updateHeaderShadow();
  window.addEventListener("scroll", updateHeaderShadow, { passive: true });

  // Mobile nav toggle
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll with offset for sticky header
  function getHeaderOffset() {
    return header.offsetHeight + 16;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href").slice(1);
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  // Reveal sections on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Netlify form submission via fetch, with inline success message
  var form = document.getElementById("enquiry-form");
  var successMessage = document.getElementById("form-success");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var formData = new FormData(form);

      fetch("/", {
        method: "POST",
        body: formData,
      })
        .then(function () {
          form.hidden = true;
          successMessage.hidden = false;
          successMessage.setAttribute("tabindex", "-1");
          successMessage.focus();
        })
        .catch(function () {
          // Fall back to a normal form submission if fetch fails
          form.submit();
        });
    });
  }
})();
