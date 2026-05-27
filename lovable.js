/* ==============================================
   SIMON PARSALAT LENGERPEI — PORTFOLIO JS
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- CUSTOM CURSOR ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .project-card, .info-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });


  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightNav();
  });

  function highlightNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }


  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });


  /* ---- REVEAL ON SCROLL ---- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        // Trigger skill bars if inside skills section
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObserver.observe(el));


  /* ---- ANIMATED COUNTERS ---- */
  const countEls = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let start = 0;
        const duration = 1800;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { el.textContent = target; clearInterval(timer); }
          else el.textContent = Math.floor(start);
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => counterObserver.observe(el));


  /* ---- SKILL BARS (also triggered on tab switch) ---- */
  function triggerSkillBars(container) {
    container.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 100);
    });
  }


  /* ---- SKILLS TABS ---- */
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      target.classList.add('active');
      triggerSkillBars(target);
    });
  });
  // Trigger for initially visible tab
  triggerSkillBars(document.querySelector('.tab-content.active'));


  /* ---- PROJECT FILTER ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96) translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ---- SMOOTH SCROLL OFFSET (for fixed nav) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });


  /* ---- CONTACT FORM ---- */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(input) {
    const group = input.closest('.form-group');
    const error = group.querySelector('.field-error');
    const valid  = input.checkValidity();
    input.classList.toggle('error', !valid);
    error.classList.toggle('visible', !valid);
    return valid;
  }

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input, textarea')];
    const allValid = fields.every(f => validateField(f));
    if (!allValid) return;

    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate async send (replace with actual fetch to backend.php)
    await new Promise(res => setTimeout(res, 1800));

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    form.reset();
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  });


  /* ---- TYPING EFFECT (hero subtitle alternator) ---- */
  const phrases = [
    'Fullstack Developer',
    'CS Student @ Karatina',
    'PHP & SQL Engineer',
    'Open for Freelance'
  ];
  const statusBadge = document.querySelector('.status-badge');
  const dot = statusBadge ? statusBadge.querySelector('.status-dot') : null;
  let phraseIndex = 0;

  if (statusBadge && dot) {
    function cyclePhrase() {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      statusBadge.style.opacity = '0';
      statusBadge.style.transform = 'translateY(4px)';
      setTimeout(() => {
        statusBadge.innerHTML = '';
        statusBadge.appendChild(dot);
        statusBadge.append(' ' + phrases[phraseIndex]);
        statusBadge.style.opacity = '1';
        statusBadge.style.transform = 'translateY(0)';
      }, 400);
    }
    statusBadge.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setInterval(cyclePhrase, 3000);
  }


  /* ---- PARALLAX ORBS ---- */
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    document.querySelectorAll('.orb').forEach((orb, i) => {
      const depth = (i + 1) * 0.4;
      orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });


  /* ---- WHATSAPP WIDGET ---- */
  const waFab     = document.getElementById('waFab');
  const waTooltip = document.getElementById('waTooltip');
  const waClose   = document.getElementById('waClose');
  const waBadge   = document.querySelector('.wa-badge');

  // Auto-open tooltip after 4 seconds
  setTimeout(() => {
    waTooltip.classList.add('open');
  }, 4000);

  // Toggle on FAB click (prevent link navigation when opening)
  waFab.addEventListener('click', e => {
    if (!waTooltip.classList.contains('open')) {
      e.preventDefault();
      waTooltip.classList.add('open');
      if (waBadge) waBadge.style.display = 'none';
    }
    // If already open, allow the href (WhatsApp link) to fire
  });

  waClose.addEventListener('click', () => {
    waTooltip.classList.remove('open');
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.wa-widget')) {
      waTooltip.classList.remove('open');
    }
  });

  // Hide badge when tooltip first opens
  if (waBadge) {
    waFab.addEventListener('click', () => {
      waBadge.style.display = 'none';
    });
  }

});