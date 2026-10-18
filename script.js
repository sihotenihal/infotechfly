(function () {
  var WA_NUMBER = "917225880469"; // verified from infotechfly.com
  var DEFAULT_MSG = "Hi Info Tech Fly, I'd like to discuss a web development project.";

  document.getElementById("year").textContent = new Date().getFullYear();

  // Direct CTAs
  document.querySelectorAll(".js-wa").forEach(function (a) {
    a.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(DEFAULT_MSG);
  });

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("open", open);
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); }
  });

  // Contact form → WhatsApp
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var rules = {
    name: function (v) { return v.length >= 2 ? "" : "Please enter your full name."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Please enter a valid email address."; },
    phone: function (v) { return /^\+?[\d\s\-()]{7,20}$/.test(v) && v.replace(/\D/g, "").length >= 7 ? "" : "Please enter a valid phone number."; },
    service: function (v) { return v ? "" : "Please select a service."; },
    requirements: function (v) { return v.length >= 10 ? "" : "Please describe your requirements (at least 10 characters)."; }
  };

  function validate() {
    var first = null;
    Object.keys(rules).forEach(function (k) {
      var el = form.elements[k];
      var msg = rules[k](el.value.trim());
      var errEl = document.getElementById("e-" + k);
      errEl.textContent = msg;
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) el.setAttribute("aria-describedby", errEl.id); else el.removeAttribute("aria-describedby");
      if (msg && !first) first = el;
    });
    return first;
  }

  function buildMessage() {
    var f = form.elements;
    var lines = [
      "Hi Info Tech Fly, I'd like to discuss a project.",
      "",
      "Name: " + f.name.value.trim(),
      "Email: " + f.email.value.trim(),
      "Phone: " + f.phone.value.trim()
    ];
    if (f.company.value.trim()) lines.push("Company/Agency: " + f.company.value.trim());
    lines.push("Service: " + f.service.value);
    if (f.budget.value.trim()) lines.push("Budget: " + f.budget.value.trim());
    lines.push("", "Requirements:", f.requirements.value.trim());
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = validate();
    if (bad) { status.textContent = "Please fix the highlighted fields."; bad.focus(); return; }
    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(buildMessage());
    var win = window.open(url, "_blank", "noopener");
    if (win === null && !/noopener/.test("")) {
      // window.open with noopener returns null in many browsers; fall back to a visible link.
    }
    status.innerHTML = "";
    status.append("Opening WhatsApp with your message prefilled — review and press send there. Your details are kept here. ");
    var link = document.createElement("a");
    link.href = url; link.target = "_blank"; link.rel = "noopener";
    link.textContent = "WhatsApp didn't open? Use this link.";
    status.append(link);
  });

  form.addEventListener("reset", function () {
    status.textContent = "Form cleared.";
    Object.keys(rules).forEach(function (k) {
      document.getElementById("e-" + k).textContent = "";
      form.elements[k].removeAttribute("aria-invalid");
    });
  });

  window.__buildWhatsAppMessage = buildMessage; // for testing only
})();
