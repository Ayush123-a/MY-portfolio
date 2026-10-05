/* ===================================================================
   AYUSH SINGH RAWAT - PORTFOLIO INTERACTIVITY SCRIPT
   Typewriter, Interactive Tabs, Project Filtering, Toast Notifications
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect & Active Section Tracker
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section, header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll Spy for nav links
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksContainer = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (navLinksContainer.classList.contains('open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close when clicking link
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 3. Dynamic Typewriter Effect in Hero
  const typedTarget = document.getElementById('typedText');
  const words = [
    'Full-Stack Web Developer',
    'React.js Specialist',
    'BCA Student @ City College',
    'Interactive UI/UX Designer',
    'Generative AI Enthusiast'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    if (!typedTarget) return;

    const currentWord = words[wordIndex];
    if (isDeleting) {
      typedTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typedTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 95;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1600; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400; // Pause before typing new word
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  // 4. Interactive Tabs in About Me
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update pane active state
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetTabId) {
          pane.classList.add('active');

          // Trigger skill progress animation if switching to skills tab
          if (targetTabId === 'tab-skills') {
            animateSkillBars();
          }
        }
      });
    });
  });

  function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    bars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = `${targetWidth}%`;
      }, 50);
    });
  }

  // Initial trigger of skills animation
  animateSkillBars();

  // 5. Portfolio Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category?.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 6. Copy Email to Clipboard Helper
  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'ayushsinghrawat76456@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard! 📋');
      }).catch(() => {
        showToast('Direct: ayushsinghrawat76456@gmail.com');
      });
    });
  }

  // 7. Interactive Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName')?.value;
      const email = document.getElementById('userEmail')?.value;
      const message = document.getElementById('userMessage')?.value;

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill out all fields.';
        formStatus.className = 'form-status error';
        return;
      }

      formStatus.textContent = 'Opening your email client...';
      formStatus.className = 'form-status';

      // Open mailto link
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Ayush,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:ayushsinghrawat76456@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        formStatus.textContent = 'Thank you! Message drafted. Feel free to send directly.';
        formStatus.className = 'form-status success';
        showToast('Email client opened! 🚀');
        contactForm.reset();
      }, 800);
    });
  }

  // Toast Function
  window.showToast = function(msg) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#00f2fe;"></i> <span>${msg}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };
});
