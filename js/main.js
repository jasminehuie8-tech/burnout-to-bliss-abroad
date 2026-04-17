/* ============================================================
   BURNOUT TO BLISS ABROAD — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---- NAV: hamburger toggle ----
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- NAV: highlight active page ----
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.style.color = 'var(--primary)';
      a.style.fontWeight = '700';
    }
  });

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (q) {
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
        const top  = el.getBoundingClientRect().top + window.scrollY - navH - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Opt-in / Contact form: simple validation + fake submit ----
  document.querySelectorAll('.js-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const nameEl  = form.querySelector('[name="name"]');
      const emailEl = form.querySelector('[name="email"]');
      if (!emailEl || !emailEl.value.trim()) {
        emailEl && emailEl.focus();
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Sending…';
      // Replace this fetch with your actual email service endpoint
      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align:center;padding:20px 0">
            <div style="font-size:3rem;margin-bottom:12px">🎉</div>
            <h3 style="color:var(--primary-dark);margin-bottom:8px">You are in!</h3>
            <p style="color:var(--text-light);font-size:.95rem">
              Check your inbox — your guide is on the way.<br>
              <small>(Check your spam folder just in case.)</small>
            </p>
          </div>`;
      }, 1200);
    });
  });

  // ---- Fade-in animation on scroll ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
    observer.observe(el);
  });

});
