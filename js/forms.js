(function () {
  // ---------------------------------------------------------------------
  // CONFIG — paste the URL you get after deploying google-apps-script.gs
  // as a Web App (see README.md, step "Deploy the script"). Until you do,
  // both forms fall back to a local demo mode that shows a success
  // message but does not persist anywhere.
  // ---------------------------------------------------------------------
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwt3b2ziScXj1F-Udkn9NJSglDkXUwJ6_tjR7K0whgobaKzQ6SMMSVtQI0X1b_cg9-p/exec';

  function isConfigured() {
    return SCRIPT_URL && SCRIPT_URL.indexOf('https://script.google.com') === 0;
  }

  function submitToSheet(payload) {
    if (!isConfigured()) {
      // Demo fallback so the form is still fully clickable/testable
      // before the Apps Script URL is wired up.
      console.warn('EK forms: SCRIPT_URL not configured yet — payload logged instead of sent.', payload);
      return Promise.resolve({ demo: true });
    }
    var body = new URLSearchParams(payload);
    // Apps Script web apps don't return readable CORS responses from a
    // plain fetch, so we send with no-cors and treat a non-throwing
    // request as success (the Apps Script side still logs/validates it).
    return fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).then(function () { return { ok: true }; });
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function validPhone(v) {
    return /^[0-9+\-\s()]{7,16}$/.test(v);
  }

  // ---------------- Newsletter / email collector ----------------
  var subForm = document.getElementById('subscribeForm');
  if (subForm) {
    var subMsg = document.getElementById('subMsg');
    var subEmail = document.getElementById('subEmail');
    var subBtn = document.getElementById('subBtn');

    subForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = subEmail.value.trim();
      if (!validEmail(email)) {
        subMsg.textContent = 'Enter a valid email address.';
        subMsg.className = 'form-msg err';
        subEmail.focus();
        return;
      }
      subBtn.disabled = true;
      subBtn.textContent = 'Subscribing…';
      submitToSheet({
        form: 'newsletter',
        email: email,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      }).then(function (res) {
        subMsg.textContent = res.demo
          ? 'Saved locally (demo mode) — connect Google Sheets in js/forms.js to store this for real.'
          : "You're on the list — we'll email you when a new reel drops.";
        subMsg.className = 'form-msg ok';
        subForm.reset();
        window.EK_toast && window.EK_toast('Subscribed ✓');
      }).catch(function () {
        subMsg.textContent = 'Something went wrong. Please try again in a moment.';
        subMsg.className = 'form-msg err';
      }).finally(function () {
        subBtn.disabled = false;
        subBtn.textContent = 'Subscribe';
      });
    });
  }

  // ---------------- Contact form ----------------
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var cName = document.getElementById('cName');
    var cEmail = document.getElementById('cEmail');
    var cPhone = document.getElementById('cPhone');
    var cMessage = document.getElementById('cMessage');
    var cBtn = document.getElementById('cBtn');
    var cMsg = document.getElementById('cMsg');

    function setError(field, text) {
      var wrap = field.closest('.field');
      var errEl = wrap.querySelector('.err-text');
      wrap.classList.toggle('has-error', !!text);
      if (errEl) errEl.textContent = text || '';
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      if (cName.value.trim().length < 2) { setError(cName, 'Enter your full name.'); ok = false; }
      else setError(cName, '');

      if (!validEmail(cEmail.value.trim())) { setError(cEmail, 'Enter a valid email address.'); ok = false; }
      else setError(cEmail, '');

      if (!validPhone(cPhone.value.trim())) { setError(cPhone, 'Enter a valid phone number.'); ok = false; }
      else setError(cPhone, '');

      if (cMessage.value.trim().length < 10) { setError(cMessage, 'Tell us a bit more (10+ characters).'); ok = false; }
      else setError(cMessage, '');

      if (!ok) {
        cMsg.textContent = 'Please fix the highlighted fields.';
        cMsg.className = 'form-msg err';
        return;
      }

      cBtn.disabled = true;
      cBtn.textContent = 'Sending…';
      submitToSheet({
        form: 'contact',
        name: cName.value.trim(),
        email: cEmail.value.trim(),
        phone: cPhone.value.trim(),
        message: cMessage.value.trim(),
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      }).then(function (res) {
        cMsg.textContent = res.demo
          ? 'Saved locally (demo mode) — connect Google Sheets in js/forms.js to store this for real.'
          : "Message sent — we'll get back to you within one business day.";
        cMsg.className = 'form-msg ok';
        contactForm.reset();
        window.EK_toast && window.EK_toast('Message sent ✓');
      }).catch(function () {
        cMsg.textContent = 'Something went wrong. Please try again in a moment.';
        cMsg.className = 'form-msg err';
      }).finally(function () {
        cBtn.disabled = false;
        cBtn.textContent = 'Send message';
      });
    });
  }
})();
