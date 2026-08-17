/* SACSA site scripts (no dependencies) */
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

  /* ----- Events page: upcoming-events calendar ----- */
  /* EDIT HERE to keep the calendar current. Dates are YYYY-MM-DD.
     Events that are not fully scheduled yet are fine to include; keep
     "TBA" in the detail text so the placeholder date isn't read as final. */
  var SACSA_EVENTS = [
    { date: "2026-09-19", title: "Stop the Spike", detail: "Spikeball tournament · exact date TBA" },
    { date: "2026-10-23", title: "Pumpkin painting night", detail: "Fall craft night · details TBA" },
    { date: "2027-04-16", title: "Take Back the Night", detail: "Annual march through campus · date TBA" }
  ];

  var calBody = document.getElementById("cal-body");
  var calTitle = document.getElementById("cal-title");
  var upcomingList = document.getElementById("upcoming-list");

  if (calBody && calTitle) {
    var MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    var MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // "YYYY-MM-DD" -> local-time Date (new Date(string) would parse as UTC
    // and shift the day for viewers west of Greenwich)
    var parseDay = function (s) {
      var p = s.split("-");
      return new Date(+p[0], +p[1] - 1, +p[2]);
    };

    var eventsByDay = {};
    SACSA_EVENTS.forEach(function (ev) {
      var d = parseDay(ev.date);
      var k = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
      (eventsByDay[k] = eventsByDay[k] || []).push(ev);
    });

    var now = new Date();
    var viewYear = now.getFullYear();
    var viewMonth = now.getMonth();

    var renderCalendar = function () {
      calTitle.textContent = MONTH_NAMES[viewMonth] + " " + viewYear;
      calBody.innerHTML = "";

      var emptyCell = function () {
        var td = document.createElement("td");
        td.className = "cal-empty";
        return td;
      };

      var firstDow = new Date(viewYear, viewMonth, 1).getDay();
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      var today = new Date();
      var row = document.createElement("tr");
      var i;

      for (i = 0; i < firstDow; i++) row.appendChild(emptyCell());

      for (var day = 1; day <= daysInMonth; day++) {
        if (row.children.length === 7) {
          calBody.appendChild(row);
          row = document.createElement("tr");
        }
        var td = document.createElement("td");
        var num = document.createElement("span");
        num.className = "cal-daynum";
        num.textContent = String(day);
        td.appendChild(num);

        if (day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
          td.className = "cal-today";
        }

        var dayEvents = eventsByDay[viewYear + "-" + viewMonth + "-" + day];
        if (dayEvents) {
          td.className += (td.className ? " " : "") + "cal-has-event";
          var dot = document.createElement("span");
          dot.className = "cal-dot";
          dot.setAttribute("aria-hidden", "true");
          td.appendChild(dot);
          dayEvents.forEach(function (ev) {
            var label = document.createElement("span");
            label.className = "cal-event-label";
            label.textContent = ev.title;
            td.appendChild(label);
          });
        }
        row.appendChild(td);
      }

      while (row.children.length < 7) row.appendChild(emptyCell());
      calBody.appendChild(row);
    };

    var prevBtn = document.getElementById("cal-prev");
    var nextBtn = document.getElementById("cal-next");
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        viewMonth -= 1;
        if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
        renderCalendar();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        viewMonth += 1;
        if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
        renderCalendar();
      });
    }

    renderCalendar();

    if (upcomingList) {
      var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var upcoming = SACSA_EVENTS
        .map(function (ev) { return { ev: ev, day: parseDay(ev.date) }; })
        .filter(function (x) { return x.day >= startOfToday; })
        .sort(function (a, b) { return a.day - b.day; });

      if (!upcoming.length) {
        var emptyItem = document.createElement("li");
        emptyItem.className = "upcoming-item";
        var emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Nothing on the calendar right now. Check back soon, or watch our newsletter and Instagram.";
        emptyItem.appendChild(emptyMsg);
        upcomingList.appendChild(emptyItem);
      } else {
        upcoming.forEach(function (x) {
          var li = document.createElement("li");
          li.className = "upcoming-item";

          var date = document.createElement("span");
          date.className = "upcoming-date";
          var month = document.createElement("span");
          month.className = "month";
          month.textContent = MONTH_ABBR[x.day.getMonth()];
          var dayNum = document.createElement("span");
          dayNum.className = "day";
          dayNum.textContent = String(x.day.getDate());
          date.appendChild(month);
          date.appendChild(dayNum);

          var body = document.createElement("div");
          var heading = document.createElement("h3");
          heading.textContent = x.ev.title;
          var detail = document.createElement("p");
          detail.textContent = MONTH_ABBR[x.day.getMonth()] + " " + x.day.getDate() + ", " + x.day.getFullYear() +
            (x.ev.detail ? " · " + x.ev.detail : "");
          body.appendChild(heading);
          body.appendChild(detail);

          li.appendChild(date);
          li.appendChild(body);
          upcomingList.appendChild(li);
        });
      }
    }
  }
})();
