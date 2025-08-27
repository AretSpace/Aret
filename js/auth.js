/* ARET — Shared auth helpers (js/auth.js)
   - Attach this file on every auth page with `defer`.
   - Replace demo endpoints and demo flows with your real backend endpoints.
*/

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

})();
