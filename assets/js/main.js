/* SACSA site scripts — no dependencies */
(function () {
  "use strict";

  /* ----- Mobile navigation toggle ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ----- Quick exit: button click or pressing Esc twice ----- */
  function quickExit() {
    // Replace this page in history, then load a neutral site.
    window.location.replace("https://www.google.com/search?q=weather+forecast");
  }
  var exitBtn = document.querySelector(".quick-exit");
  if (exitBtn) exitBtn.addEventListener("click", quickExit);

  var lastEsc = 0;
  var dialogClosedAt = 0; // Esc also closes the lightbox; don't count those presses
  document.addEventListener("keyup", function (e) {
    if (e.key === "Escape") {
      var now = Date.now();
      if (now - dialogClosedAt < 1500) {
        lastEsc = 0;
        return;
      }
      if (now - lastEsc < 1200) quickExit();
      lastEsc = now;
    }
  });

  /* ----- Contact form: point FormSubmit back at our thank-you page ----- */
  var nextField = document.getElementById("form-next");
  if (nextField) {
    var base = window.location.href.replace(/[^/]*$/, "");
    nextField.value = base + "thanks.html";
  }

  /* ----- Footer year ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----- Gallery: filters ----- */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  if (filterBtns.length && items.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        var group = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var show = group === "all" || item.getAttribute("data-group") === group;
          if (show) {
            item.removeAttribute("hidden");
          } else {
            item.setAttribute("hidden", "");
          }
        });
      });
    });
  }

  /* ----- Gallery: lightbox ----- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox && items.length) {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector(".lightbox-caption");
    var lbClose = lightbox.querySelector(".lightbox-close");
    var supportsDialog = typeof lightbox.showModal === "function";

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        var full = item.getAttribute("data-full");
        var alt = item.querySelector("img").getAttribute("alt") || "";
        if (!supportsDialog) {
          window.open(full, "_blank", "noopener");
          return;
        }
        lbImg.setAttribute("src", full);
        lbImg.setAttribute("alt", alt);
        lbCaption.textContent = alt;
        lightbox.showModal();
      });
    });

    if (lbClose) {
      lbClose.addEventListener("click", function () {
        lightbox.close();
      });
    }
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", function () {
      dialogClosedAt = Date.now();
      lbImg.setAttribute("src", "");
    });
  }
})();
