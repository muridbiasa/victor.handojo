/**
main.js — Portfolio Victor
MAINTENANCE: Semua logika interaksi terpusat di sini.
Struktur: Loader → Cursor → Navbar → MobileMenu →
      SmoothScroll → ScrollReveal → SkillBars →
      Counter → TextScramble → PortfolioFilter →
      FormValidation → BackToTop → FooterYear → Parallax
Dependensi: Tidak ada (Vanilla JS, no framework)
Kompatibel: Chrome, Firefox, Safari, Edge (modern)
*/
'use strict';

/* ========================================
PAGE LOADER
======================================== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.querySelectorAll('.hero .reveal, .hero .reveal-left, .hero .reveal-right')
      .forEach(el => el.classList.add('visible'));

    setTimeout(() => {
      document.querySelector('.hero__title .highlight')?.classList.add('animate');
    }, 500);
  }, 800);
});

/* ========================================
CUSTOM CURSOR
======================================== */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.14;
  followerY += (mouseY - followerY) * 0.14;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .service-card, .project-card, .filter-btn, .stat-card')
  .forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    });
  });

/* ========================================
NAVBAR
======================================== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ========================================
MOBILE MENU
======================================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const mobileLinks = document.querySelectorAll('[data-mobile-link]');

function openMenu() {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenuFn() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeMenuFn);
mobileLinks.forEach(l => l.addEventListener('click', closeMenuFn));

/* ========================================
SMOOTH SCROLL
======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ========================================
SCROLL REVEAL
======================================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ========================================
SKILL BARS ANIMATION
======================================== */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-item__fill').forEach(fill => {
        fill.style.width = fill.dataset.fill + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) skillObserver.observe(aboutSection);

/* ========================================
COUNTER ANIMATION
======================================== */
function animateCount(el, target, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (progress < 1 ? '' : '+');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + '+';
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        animateCount(el, parseInt(el.dataset.count));
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const clientsSection = document.getElementById('clients');
if (clientsSection) counterObserver.observe(clientsSection);

/* ========================================
TEXT SCRAMBLE EFFECT
======================================== */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const len = Math.max(oldText.length, newText.length);
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameReq);
    this.frame = 0;
    this.update();
    return new Promise(res => (this.resolve = res));
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="opacity:.4;color:var(--primary)">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameReq = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

const scrambleEl = document.querySelector('.scramble');
if (scrambleEl) {
  const fx = new TextScramble(scrambleEl);
  setTimeout(() => fx.setText(scrambleEl.dataset.text || scrambleEl.innerText), 1200);
}

/* ========================================
PORTFOLIO FILTER
======================================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.transition = 'opacity .3s, transform .3s';

      if (show) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'scale(.96)';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 20);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(.96)';
        setTimeout(() => card.classList.add('hidden'), 300);
      }
    });
  });
});

document.getElementById('loadMoreBtn')?.addEventListener('click', function() {
  this.innerHTML = 'Loading...';
  setTimeout(() => {
    this.innerHTML = 'All Projects Loaded!';
    this.disabled = true;
    this.style.opacity = '.6';
  }, 1500);
});

/* ========================================
CONTACT FORM - EMAILJS INTEGRATION
======================================== */
function validate(id, errId, checkFn) {
  const el = document.getElementById(id);
  const err = document.getElementById(errId);
  const ok = checkFn(el.value.trim());
  el.classList.toggle('error', !ok);
  err.classList.toggle('show', !ok);
  return ok;
}

// ✅ FIXED: Gunakan 'submit' di FORM, bukan 'click' di tombol
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameOk = validate('name', 'nameErr', v => v.length >= 2);
  const emailOk = validate('email', 'emailErr', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  const subjectOk = validate('subject', 'subjectErr', v => v.length >= 3);
  const messageOk = validate('message', 'messageErr', v => v.length >= 10);

  if (nameOk && emailOk && subjectOk && messageOk) {
    const btn = document.getElementById('submitBtn');
    const originalBtnText = btn.innerHTML;

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
    btn.disabled = true;

    const templateParams = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim(),
      time: new Date().toLocaleString('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short'
      })
    };

    // Kirim via EmailJS
    emailjs.send('service_e1e1a7s', 'template_15bvabj', templateParams)
      .then(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Terkirim!';
        btn.style.background = '#22c55e';

        document.getElementById('formSuccess').classList.add('show');

        ['name', 'email', 'subject', 'message'].forEach(id => {
          document.getElementById(id).value = '';
        });

        setTimeout(() => {
          btn.innerHTML = originalBtnText;
          btn.disabled = false;
          btn.style.background = '';
          document.getElementById('formSuccess').classList.remove('show');
        }, 5000);
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        btn.innerHTML = originalBtnText;
        btn.disabled = false;

        alert('⚠️ Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau kirim email langsung ke victorchristian0105@gmail.com');
      });
  }
});

// Hapus error saat user mengetik
['name', 'email', 'subject', 'message'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', function() {
    this.classList.remove('error');
    document.getElementById(id + 'Err')?.classList.remove('show');
  });
});

/* ========================================
BACK TO TOP
======================================== */
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========================================
FOOTER YEAR
======================================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ========================================
PARALLAX
======================================== */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelector('.hero__blob--1').style.transform = `translateY(${y * 0.18}px)`;
  document.querySelector('.hero__blob--2').style.transform = `translateY(${-y * 0.12}px)`;
}, { passive: true });

/* ========================================
KEYBOARD NAVIGATION
======================================== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenuFn();
});