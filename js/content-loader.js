/**
 * Burnout to Bliss Abroad — Content Loader
 * Loads JSON data files and injects content into pages.
 * Elements with data-cms="key" get updated with matching JSON values.
 */

async function loadJSON(path) {
  try {
    const res = await fetch(path + '?v=' + Date.now());
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

function inject(key, value) {
  if (!value) return;
  const elements = document.querySelectorAll('[data-cms="' + key + '"]');
  elements.forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.value = value;
    } else if (el.tagName === 'A') {
      el.href = value;
      if (!el.dataset.cmsKeepText) el.textContent = value;
    } else if (el.tagName === 'IMG') {
      el.src = value;
    } else {
      el.textContent = value;
    }
  });
  // Also update href attributes for links with data-cms-href
  const links = document.querySelectorAll('[data-cms-href="' + key + '"]');
  links.forEach(el => { el.href = value; });
}

async function loadSiteData() {
  const site = await loadJSON('/_data/site.json');
  if (!site) return;
  inject('contact_email', site.contact_email);
  inject('calendly_clarity_call', site.calendly_clarity_call);
  inject('calendly_dfy_call', site.calendly_dfy_call);
  inject('instagram_url', site.instagram_url);
  inject('youtube_url', site.youtube_url);
  inject('skool_url', site.skool_url);
  inject('footer_tagline', site.footer_tagline);

  // Update all clarity call links
  document.querySelectorAll('[data-cms-href="calendly_clarity_call"]').forEach(el => {
    el.href = site.calendly_clarity_call;
  });
  // Update all DFY call links
  document.querySelectorAll('[data-cms-href="calendly_dfy_call"]').forEach(el => {
    el.href = site.calendly_dfy_call;
  });
  // Update all email links
  document.querySelectorAll('[data-cms-href="contact_email"]').forEach(el => {
    el.href = 'mailto:' + site.contact_email;
    if (!el.dataset.cmsKeepText) el.textContent = site.contact_email;
  });
  // Update social links
  document.querySelectorAll('[data-cms-href="instagram_url"]').forEach(el => {
    el.href = site.instagram_url;
  });
  document.querySelectorAll('[data-cms-href="youtube_url"]').forEach(el => {
    el.href = site.youtube_url;
  });
  document.querySelectorAll('[data-cms-href="skool_url"]').forEach(el => {
    el.href = site.skool_url;
  });
}

async function loadHomeData() {
  const home = await loadJSON('/_data/home.json');
  if (!home) return;
  Object.keys(home).forEach(key => inject(key, home[key]));
}

async function loadAboutData() {
  const about = await loadJSON('/_data/about.json');
  if (!about) return;
  Object.keys(about).forEach(key => inject(key, about[key]));
}

async function loadWorkWithMeData() {
  const wm = await loadJSON('/_data/work-with-me.json');
  if (!wm) return;
  Object.keys(wm).forEach(key => inject(key, wm[key]));
}

async function loadTestimonials() {
  const data = await loadJSON('/_data/testimonials.json');
  if (!data || !data.testimonials) return;
  const container = document.querySelector('[data-cms-testimonials]');
  if (!container) return;
  container.innerHTML = data.testimonials.map(t => `
    <div class="testimonial__card">
      ${t.photo ? `<img src="${t.photo}" alt="${t.name}" class="testimonial__photo">` : ''}
      <blockquote class="testimonial__quote">"${t.quote}"</blockquote>
      <div class="testimonial__author">
        <strong>${t.name}</strong>
        <span>${t.role}${t.location ? ' — ' + t.location : ''}</span>
      </div>
    </div>
  `).join('');
}

async function loadFAQ() {
  const data = await loadJSON('/_data/faq.json');
  if (!data || !data.faqs) return;
  const container = document.querySelector('[data-cms-faq]');
  if (!container) return;
  container.innerHTML = data.faqs.map(f => `
    <div class="faq__item">
      <button class="faq__question" aria-expanded="false">
        ${f.question}
        <span class="faq__icon">+</span>
      </button>
      <div class="faq__answer">
        <p>${f.answer}</p>
      </div>
    </div>
  `).join('');
  // Re-attach FAQ toggle listeners
  container.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      btn.querySelector('.faq__icon').textContent = expanded ? '+' : '−';
      btn.nextElementSibling.style.display = expanded ? 'none' : 'block';
    });
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.cmsPage;
  await loadSiteData();
  if (page === 'home') { await loadHomeData(); await loadTestimonials(); await loadFAQ(); }
  if (page === 'about') await loadAboutData();
  if (page === 'work-with-me') await loadWorkWithMeData();
});
