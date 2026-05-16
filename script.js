/* ============================================
   CareNest – Elderly Nursing & Healthcare
   script.js
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. NAVBAR – scroll shrink & hamburger
  ───────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ─────────────────────────────────────────
     2. INTERSECTION OBSERVER – scroll reveals
  ───────────────────────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.service-card, .team-card'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────────────
     3. COUNTER ANIMATION – stats section
  ───────────────────────────────────────── */
  const statNums   = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step     = 16;
    const totalSteps = duration / step;
    let current = 0;

    const timer = setInterval(() => {
      current += target / totalSteps;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, step);
  }

  const statsSection = document.getElementById('stats');

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => animateCounter(el));
      statsObserver.disconnect();
    }
  }, { threshold: 0.25 });

  if (statsSection) statsObserver.observe(statsSection);


  /* ─────────────────────────────────────────
     4. TESTIMONIALS SLIDER
  ───────────────────────────────────────── */
  const testimonials = document.querySelectorAll('.testimonial');
  const dots         = document.querySelectorAll('.dot');
  let currentSlide   = 0;
  let autoSlide;

  function showSlide(index) {
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = (index + testimonials.length) % testimonials.length;
    testimonials[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(parseInt(dot.getAttribute('data-index'), 10));
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlide = setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  startAutoSlide();

  // Swipe support
  const slider = document.getElementById('testimonialSlider');
  let touchStartX = 0;

  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      showSlide(currentSlide + (diff > 0 ? 1 : -1));
      resetAutoSlide();
    }
  }, { passive: true });


  /* ─────────────────────────────────────────
     5. CONTACT FORM – validation & submit
  ───────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fields = {
        name:    document.getElementById('name'),
        phone:   document.getElementById('phone'),
        email:   document.getElementById('email'),
        service: document.getElementById('service'),
      };

      let valid = true;

      // Reset errors
      Object.values(fields).forEach(f => f.classList.remove('error'));

      // Validate
      if (!fields.name.value.trim())   { fields.name.classList.add('error');    valid = false; }
      if (!fields.phone.value.trim())  { fields.phone.classList.add('error');   valid = false; }
      if (!isValidEmail(fields.email.value)) { fields.email.classList.add('error');  valid = false; }
      if (!fields.service.value)       { fields.service.classList.add('error'); valid = false; }

      if (!valid) {
        shakeForm(contactForm);
        return;
      }

      // Simulate submission
      const btnText   = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');

      submitBtn.disabled = true;
      btnText.style.display   = 'none';
      btnLoader.style.display = 'inline';

      await delay(1600);

      contactForm.style.display     = 'none';
      formSuccess.style.display     = 'block';
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function shakeForm(form) {
    form.style.animation = 'none';
    requestAnimationFrame(() => {
      form.style.animation = 'shake .4s ease';
    });
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Inject shake keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-8px)}
      40%{transform:translateX(8px)}
      60%{transform:translateX(-6px)}
      80%{transform:translateX(6px)}
    }
  `;
  document.head.appendChild(style);


  /* ─────────────────────────────────────────
     6. SMOOTH ACTIVE NAV HIGHLIGHTING
  ───────────────────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allNavLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));


  /* ─────────────────────────────────────────
     7. REAL-TIME FORM INPUT FEEDBACK
  ───────────────────────────────────────── */
  document.querySelectorAll('.contact-form input, .contact-form select').forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.classList.remove('error');
      }
    });
  });


  /* ─────────────────────────────────────────
     8. PARALLAX – hero shapes subtle movement
  ───────────────────────────────────────── */
  const shapes = document.querySelectorAll('.shape');

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    shapes.forEach((shape, i) => {
      const factor = (i + 1) * 8;
      shape.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });


  /* ─────────────────────────────────────────
     9. HERO CARDS – subtle tilt on hover
  ───────────────────────────────────────── */
  document.querySelectorAll('.hero-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left - rect.width  / 2;
      const y     = e.clientY - rect.top  - rect.height / 2;
      card.style.transform = `
        rotateX(${(-y / rect.height) * 8}deg)
        rotateY(${( x / rect.width ) * 8}deg)
        translateY(0)
      `;
      card.style.boxShadow = '0 16px 40px rgba(44,62,53,.2)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
  });


  /* ─────────────────────────────────────────
     10. SERVICE CARDS – stagger on hover row
  ───────────────────────────────────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
    });
  });

});
