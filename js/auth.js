

(function(){
  'use strict';

  // --- Password scoring utility ---
  function scorePassword(pw){
    let score = 0;
    if (!pw) return score;
    if (pw.length >= 8) score += 1;
    if (pw.length >= 12) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return Math.min(score, 5);
  }

  // --- Update password strength UI ---
  function updateStrengthUI(pwdEl){
    const meter = document.getElementById('strength');
    const text = document.getElementById('strengthText');
    if(!meter || !text) return;
    const s = scorePassword(pwdEl.value);
    meter.classList.remove('weak','medium','good');
    if (s <= 2) { meter.classList.add('weak'); text.textContent='Weak'; }
    else if (s <= 4) { meter.classList.add('medium'); text.textContent='Medium'; }
    else { meter.classList.add('good'); text.textContent='Strong'; }
  }

  // --- Toggle password visibility helper ---
  function wireToggle(button, input){
    if(!button || !input) return;
    button.addEventListener('click', function(){
      if (input.type === 'password') { input.type = 'text'; button.textContent = 'Hide'; button.setAttribute('aria-label','Hide password'); }
      else { input.type = 'password'; button.textContent = 'Show'; button.setAttribute('aria-label','Show password'); }
    });
  }

  // --- Show / hide error ---
  function showError(el, msg){ if(!el) return; el.textContent = msg; el.style.display='block'; }
  function hideError(el){ if(!el) return; el.textContent = ''; el.style.display='none'; }

  // --- Hook login form if present ---
  function hookLogin(){
    const form = document.getElementById('loginForm');
    if(!form) return;
    const errorEl = document.getElementById('error');
    const pwdToggle = form.querySelector('#togglePwd');
    const pwdInput = form.querySelector('#password');
    wireToggle(pwdToggle, pwdInput);

    form.addEventListener('submit', function(e){
      e.preventDefault(); hideError(errorEl);
      const fd = new FormData(form);
      const email = String(fd.get('email') || '').trim();
      const password = String(fd.get('password') || '').trim();
      if(!email || !password){ showError(errorEl,'Please provide both email/username and password.'); return; }

      // Loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const oldLabel = submitBtn.textContent; submitBtn.textContent = 'Signing in...'; submitBtn.disabled = true;

      // TODO: Replace with your backend POST endpoint. Example:
      // fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}) })
      //   .then(handle response ...)

      // Demo simulation
      setTimeout(()=>{
        submitBtn.textContent = oldLabel; submitBtn.disabled = false;
        if(email === 'user@example.com' && password === 'password'){
          window.location.href = 'dashboard.html';
        } else {
          showError(errorEl, 'Invalid credentials — for demo use user@example.com / password.');
        }
      }, 900);
    });
  }

  // --- Hook signup form if present ---
  function hookSignup(){
    const form = document.getElementById('signupForm');
    if(!form) return;
    const pwd = document.getElementById('password');
    const toggle = document.getElementById('togglePwd');
    const strengthEl = document.getElementById('strength');
    const errorEl = document.getElementById('error');
    const successEl = document.getElementById('success');

    wireToggle(toggle, pwd);
    if(pwd) pwd.addEventListener('input', function(){ updateStrengthUI(pwd); });

    form.addEventListener('submit', function(e){
      e.preventDefault(); hideError(errorEl); if(successEl) successEl.style.display='none';
      const fd = new FormData(form);
      const fullName = String(fd.get('fullName')||'').trim();
      const username = String(fd.get('username')||'').trim();
      const email = String(fd.get('email')||'').trim();
      const password = String(fd.get('password')||'');
      const confirm = String(fd.get('confirm')||'');
      const agree = !!fd.get('agree');

      if(!fullName || !username || !email || !password || !confirm){ showError(errorEl,'All fields are required.'); return; }
      if(!agree){ showError(errorEl,'You must agree to the Terms & Conditions.'); return; }
      if(password !== confirm){ showError(errorEl,'Passwords do not match.'); return; }
      if(scorePassword(password) < 2){ showError(errorEl,'Password is too weak.'); return; }

      const submitBtn = form.querySelector('button[type="submit"]');
      const oldLabel = submitBtn.textContent; submitBtn.textContent = 'Creating...'; submitBtn.disabled = true;

      // TODO: Replace with your backend POST endpoint. Example:
      // fetch('/api/signup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({fullName, username, email, password}) })
      //   .then(handle response ...)

      setTimeout(()=>{
        submitBtn.textContent = oldLabel; submitBtn.disabled = false;
        // Demo: basic duplicate check
        if(username.toLowerCase() === 'user' || email.toLowerCase() === 'user@example.com'){
          showError(errorEl,'Username or email already taken.'); return;
        }
        if(successEl) { successEl.textContent = 'Account created. Redirecting to sign-in...'; successEl.style.display='block'; }
        setTimeout(()=>{ window.location.href = 'login.html'; }, 900);
      }, 900);
    });
  }

  // --- Hook password recovery form if present (lightweight) ---
  function hookRecover(){
    const form = document.getElementById('recoverForm');
    if(!form) return;
    const result = document.getElementById('recoverResult');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(form);
      const email = String(fd.get('email')||'').trim();
      if(!email){ if(result) result.textContent = 'Please provide your email.'; return; }

      // Replace with your backend call to initiate reset
      if(result) result.textContent = 'If an account exists for that email, a recovery link has been sent.';
    });
  }

  // --- Initialize on DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', function(){
    hookLogin();
    hookSignup();
    hookRecover();
  });

  // Expose helpers for debugging (optional)
  window.ARETAuth = { scorePassword };

   /* Mobile nav toggle — add to js/auth.js or save as js/ui.js */
(function(){
  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function(){
    // If nav toggle button exists, wire it. If not, create one for compatibility.
    function ensureToggle() {
      const header = document.querySelector('.site-header') || document.querySelector('header');
      if (!header) return;
      let toggle = header.querySelector('.nav-toggle');
      const nav = header.querySelector('.nav');
      if (!toggle) {
        // create a toggle button (if header markup didn't include one)
        toggle = document.createElement('button');
        toggle.className = 'nav-toggle';
        toggle.id = 'navToggle';
        toggle.setAttribute('aria-label', 'Toggle navigation');
        toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d=\"M3 6h18M3 12h18M3 18h18\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>';
        header.insertBefore(toggle, nav || header.firstChild);
      }
      if (!nav) return;

      function closeNav() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
      function openNav() { nav.classList.add('open'); toggle.setAttribute('aria-expanded','true'); }

      toggle.addEventListener('click', function(e){
        e.stopPropagation();
        if (nav.classList.contains('open')) closeNav(); else openNav();
      });

      // Close nav when clicking a link (good UX)
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { closeNav(); }));

      // Close on outside click
      document.addEventListener('click', (ev) => {
        if (!nav.contains(ev.target) && !toggle.contains(ev.target)) closeNav();
      });

      // Close on escape
      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') closeNav();
      });
    }

    ensureToggle();
  });
})();
// Mobile nav UX polish (paste at end of js/auth.js)
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const header = document.querySelector('.site-header');
    const toggle = document.getElementById('navToggle');
    const nav = header ? header.querySelector('.nav') : null;
    if (!nav || !toggle) return;

    function openNav(){
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded','true');
      // Ensure nav is visible from top on small screens
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden'; // prevent background scroll while nav open
    }
    function closeNav(){
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      document.body.style.overflow = ''; // restore scroll
    }

    toggle.addEventListener('click', function(e){
      e.stopPropagation();
      if (nav.classList.contains('open')) closeNav(); else openNav();
    });

    // Close nav on outside click or Esc key
    document.addEventListener('click', (ev) => {
      if (!nav.contains(ev.target) && !toggle.contains(ev.target)) closeNav();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closeNav();
    });

    // Close nav when a link is tapped (good mobile UX)
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  });
})();
})();
