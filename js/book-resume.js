/* ===================================================================
   INTERACTIVE 3D BOOK RESUME ENGINE
   Spreads, 3D Page Turns, Web Audio Sound, Touch Swipe, Theme Switcher
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const leftPageEl = document.getElementById('bookLeftPage');
  const rightPageEl = document.getElementById('bookRightPage');
  const singleMobilePageEl = document.getElementById('bookMobilePage');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const dotsContainer = document.getElementById('bookDots');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const printAtsBtn = document.getElementById('printAtsBtn');

  // Spreads Content Definition
  const spreads = [
    // Spread 0: Cover & Table of Contents
    {
      spreadIndex: 0,
      leftHtml: `
        <div class="page-corner-ornament corner-tl"></div>
        <div class="page-corner-ornament corner-tr"></div>
        <div class="page-corner-ornament corner-bl"></div>
        <div class="page-corner-ornament corner-br"></div>
        
        <div class="cover-page-box">
          <p class="cover-pretitle">The Professional Journey of</p>
          <h1 class="cover-main-name">AYUSH<br>SINGH RAWAT</h1>
          <p class="cover-role-subtitle">Full-Stack Web Developer</p>
          <p class="cover-status">— BCA Student · Expected 2027 —</p>
        </div>
        <div class="page-footer-num">♦ Volume I ♦</div>
      `,
      rightHtml: `
        <div class="page-corner-ornament corner-tl"></div>
        <div class="page-corner-ornament corner-tr"></div>
        <div class="page-corner-ornament corner-bl"></div>
        <div class="page-corner-ornament corner-br"></div>

        <div class="toc-quote-box">
          <p class="toc-quote-text">"Passionate about applying cutting-edge technology, including Generative AI, to real-world applications."</p>
          <p class="toc-quote-author">— Ayush Singh Rawat</p>
        </div>

        <div class="toc-list-wrapper">
          <h3 class="toc-heading">Table of Contents</h3>
          <ul class="toc-list">
            <li class="toc-item-link" data-jump="1">
              <span>I. About Me</span>
              <span class="toc-item-dotted"></span>
              <span class="toc-item-page">Page 2</span>
            </li>
            <li class="toc-item-link" data-jump="2">
              <span>II. Technical Skills</span>
              <span class="toc-item-dotted"></span>
              <span class="toc-item-page">Page 3</span>
            </li>
            <li class="toc-item-link" data-jump="3">
              <span>III. Development Projects</span>
              <span class="toc-item-dotted"></span>
              <span class="toc-item-page">Page 4</span>
            </li>
            <li class="toc-item-link" data-jump="4">
              <span>IV. Education & Certifications</span>
              <span class="toc-item-dotted"></span>
              <span class="toc-item-page">Page 5</span>
            </li>
          </ul>
        </div>
        <div class="page-footer-num">— 1 —</div>
      `
    },

    // Spread 1: About Me & Online Presence
    {
      spreadIndex: 1,
      leftHtml: `
        <p class="page-header-tag">Chapter I</p>
        <h2 class="page-chapter-title">About Me</h2>
        <p class="prose-text">
          Highly motivated and results-driven BCA student learning Full-Stack Web Development. Proficient in building dynamic, high-performance, and responsive user interfaces using React.js and modern JavaScript (ES6+).
        </p>
        <p class="prose-text">
          Possesses a strong foundation in Database Management (MySQL, MongoDB), computer science fundamentals (DSA, DBMS), and Agile development methodologies. Dedicated to clean code, seamless user experiences, and continuous learning.
        </p>
        <div class="contact-meta-group">
          <div class="meta-row">
            <span class="meta-label">Email:</span>
            <span class="meta-val">Ayushsinghrawat76456@gmail.com</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Phone:</span>
            <span class="meta-val">+91 8088954420</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Location:</span>
            <span class="meta-val">Bangalore, Karnataka, India</span>
          </div>
        </div>
        <div class="page-footer-num">— 2 —</div>
      `,
      rightHtml: `
        <p class="page-header-tag">Connect & Code</p>
        <h2 class="page-chapter-title">Online Presence</h2>
        <div class="online-card-row">
          <a href="https://www.linkedin.com/in/ayush-rawat-a126942b2/" target="_blank" rel="noopener noreferrer" class="online-item-box">
            <span class="online-item-title"><i class="fa-brands fa-linkedin" style="color:#0a66c2;"></i> LinkedIn</span>
            <span class="online-item-url">ayush-rawat-a126942b2/ ↗</span>
          </a>
          <a href="https://github.com/Ayush123-a" target="_blank" rel="noopener noreferrer" class="online-item-box">
            <span class="online-item-title"><i class="fa-brands fa-github"></i> GitHub</span>
            <span class="online-item-url">Ayush123-a ↗</span>
          </a>
          <a href="index.html" class="online-item-box">
            <span class="online-item-title"><i class="fa-solid fa-globe" style="color:var(--book-primary);"></i> Portfolio</span>
            <span class="online-item-url">ayush-singh-portfolio ↗</span>
          </a>
        </div>
        <p class="prose-text" style="font-size:0.9rem; text-align:center; font-style:italic; color:var(--book-ink-muted);">
          "Passionate about open-source collaboration, responsive engineering, and creating accessible software for global audiences."
        </p>
        <div class="page-footer-num">— 2 —</div>
      `
    },

    // Spread 2: Technical Skills
    {
      spreadIndex: 2,
      leftHtml: `
        <p class="page-header-tag">Chapter II</p>
        <h2 class="page-chapter-title">Core Skills</h2>
        <div class="book-skill-bars">
          <div class="b-skill-item">
            <div class="b-skill-top"><span class="b-skill-name">JavaScript (ES6+)</span><span class="b-skill-pct">60%</span></div>
            <div class="b-skill-track"><div class="b-skill-fill" style="width: 60%;"></div></div>
          </div>
          <div class="b-skill-item">
            <div class="b-skill-top"><span class="b-skill-name">HTML5 & Modern CSS3</span><span class="b-skill-pct">60%</span></div>
            <div class="b-skill-track"><div class="b-skill-fill" style="width: 60%;"></div></div>
          </div>
          <div class="b-skill-item">
            <div class="b-skill-top"><span class="b-skill-name">React.js (Hooks, Context)</span><span class="b-skill-pct">60%</span></div>
            <div class="b-skill-track"><div class="b-skill-fill" style="width: 60%;"></div></div>
          </div>
          <div class="b-skill-item">
            <div class="b-skill-top"><span class="b-skill-name">Git & GitHub Version Control</span><span class="b-skill-pct">60%</span></div>
            <div class="b-skill-track"><div class="b-skill-fill" style="width: 60%;"></div></div>
          </div>
          <div class="b-skill-item">
            <div class="b-skill-top"><span class="b-skill-name">SQL (MySQL & Queries)</span><span class="b-skill-pct">60%</span></div>
            <div class="b-skill-track"><div class="b-skill-fill" style="width: 60%;"></div></div>
          </div>
          <div class="b-skill-item">
            <div class="b-skill-top"><span class="b-skill-name">Data Structures & Algorithms</span><span class="b-skill-pct">60%</span></div>
            <div class="b-skill-track"><div class="b-skill-fill" style="width: 60%;"></div></div>
          </div>
        </div>
        <div class="page-footer-num">— 3 —</div>
      `,
      rightHtml: `
        <p class="page-header-tag">Stack & Ecosystem</p>
        <h2 class="page-chapter-title">Frameworks & Tools</h2>
        <div class="skills-badge-wrap">
          <span class="book-tag">React.js</span>
          <span class="book-tag">Bootstrap</span>
          <span class="book-tag">RESTful APIs</span>
          <span class="book-tag">DOM Manipulation</span>
          <span class="book-tag">MySQL</span>
          <span class="book-tag">MongoDB</span>
          <span class="book-tag">Context API</span>
          <span class="book-tag">React Hooks</span>
          <span class="book-tag">Responsive UI</span>
        </div>
        <p class="page-header-tag" style="margin-top:16px;">Core Languages</p>
        <div class="skills-badge-wrap">
          <span class="book-tag">JavaScript</span>
          <span class="book-tag">Python</span>
          <span class="book-tag">C</span>
          <span class="book-tag">C++</span>
          <span class="book-tag">Java</span>
          <span class="book-tag">HTML5</span>
          <span class="book-tag">CSS3</span>
          <span class="book-tag">SQL</span>
        </div>
        <div class="book-methodologies" style="margin-top:16px;">
          <p>✦ Agile / Scrum</p>
          <p>✦ Waterfall Model</p>
          <p>✦ SDLC Lifecycle</p>
          <p>✦ Performance Tuning</p>
        </div>
        <div class="page-footer-num">— 3 —</div>
      `
    },

    // Spread 3: Development Projects
    {
      spreadIndex: 3,
      leftHtml: `
        <p class="page-header-tag">Chapter III</p>
        <h2 class="page-chapter-title">Featured Projects</h2>
        <div class="book-project-card">
          <div class="b-project-head">
            <h3 class="b-project-name">🎮 Treasure Hunt Game</h3>
          </div>
          <p class="b-project-tech">Vanilla HTML5 · CSS3 · Modern JavaScript</p>
          <ul class="b-project-points">
            <li>Developed a fully interactive, browser-based game using vanilla HTML, CSS, and JavaScript.</li>
            <li>Implemented complex scoring, randomization algorithms, and countdown timer logic.</li>
            <li>Managed state transitions and UI flow for engaging, bug-free gameplay.</li>
            <li>Deployed and maintained on GitHub Pages with 100% browser compatibility.</li>
          </ul>
        </div>
        <div class="page-footer-num">— 4 —</div>
      `,
      rightHtml: `
        <div class="book-project-card">
          <div class="b-project-head">
            <h3 class="b-project-name">🧠 Dynamic Quiz Platform</h3>
          </div>
          <p class="b-project-tech">JavaScript · Advanced DOM Manipulation</p>
          <ul class="b-project-points">
            <li>Engineered a robust quiz application leveraging dynamic DOM rendering.</li>
            <li>Calculates scores in real-time with visual color feedback and time tracking.</li>
            <li>Modular structure capable of parsing variable question datasets cleanly.</li>
            <li>Optimized for mobile viewports and rapid responsiveness.</li>
          </ul>
        </div>
        <div class="key-highlights-box">
          <h4 class="key-highlights-title">Key Architectural Highlights</h4>
          <p class="key-highlight-point">✦ Pure Vanilla JS mastery without bloated runtime dependencies</p>
          <p class="key-highlight-point">✦ Resilient client-side state management patterns</p>
          <p class="key-highlight-point">✦ Zero layout shifts & high performance Core Web Vitals</p>
          <p class="key-highlight-point">✦ Production-tested GitHub Pages deployment</p>
        </div>
        <div class="page-footer-num">— 4 —</div>
      `
    },

    // Spread 4: Education, Certifications & Colophon
    {
      spreadIndex: 4,
      leftHtml: `
        <p class="page-header-tag">Chapter IV</p>
        <h2 class="page-chapter-title">Education & Certs</h2>
        <div class="edu-card-book">
          <h3 class="edu-degree">🎓 Bachelor of Computer Applications (BCA)</h3>
          <p class="edu-institution">City College, Bangalore University</p>
          <p class="edu-year">Expected Graduation: 2027</p>
          <p style="font-family:var(--font-elegant); font-size:0.88rem; font-weight:600; color:var(--book-primary); margin-top:6px;">Relevant Coursework:</p>
          <div class="coursework-grid">
            <p>• Data Structures (DSA)</p>
            <p>• DBMS & Relational SQL</p>
            <p>• Operating Systems</p>
            <p>• Computer Networks</p>
            <p>• SDLC & Agile Models</p>
            <p>• Object-Oriented Design</p>
          </div>
        </div>
        <p class="page-header-tag" style="margin-top:14px;">Certifications & Training</p>
        <ul class="cert-list-book">
          <li class="cert-item-book">📜 Generative AI Fundamentals</li>
          <li class="cert-item-book">📜 Agile Methodology & Waterfall Model</li>
          <li class="cert-item-book">📜 React.js Basics & Advanced Hooks Training</li>
        </ul>
        <div class="page-footer-num">— 5 —</div>
      `,
      rightHtml: `
        <div class="end-volume-colophon">
          <p class="colophon-sub">End of Volume</p>
          <h2 class="colophon-title">Thank You</h2>
          <p class="colophon-text">
            This story continues to be written, one line of clean code at a time.
          </p>
          <p class="colophon-quote">"Let's write the next chapter together."</p>
          <div style="font-family:var(--font-elegant); font-size:0.95rem; color:var(--book-ink-muted);">
            <p>Ayushsinghrawat76456@gmail.com</p>
            <p style="margin-top:4px;">+91 8088954420</p>
            <p style="margin-top:4px;">Bangalore, Karnataka, India</p>
          </div>
        </div>
        <div class="page-footer-num">— 5 —</div>
      `
    }
  ];

  let currentSpread = 0;
  let isMobile = window.innerWidth <= 860;
  let mobilePageSubIndex = 0; // 0 for left, 1 for right
  let soundEnabled = true;

  // Web Audio API Synthesizer for realistic page turn sound
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPageTurnSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const bufferSize = audioCtx.sampleRate * 0.18; // 180ms paper whoosh
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);

      // Generate soft pink/white noise with smooth fade in and out
      for (let i = 0; i < bufferSize; i++) {
        const progress = i / bufferSize;
        const envelope = Math.sin(progress * Math.PI); // Half sine curve
        output[i] = (Math.random() * 2 - 1) * envelope * 0.15;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter to sound like dry parchment paper
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1100;
      filter.Q.value = 1.2;

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  }

  // Render Spread
  function renderSpread(direction = 1) {
    const spread = spreads[currentSpread];
    if (!spread) return;

    isMobile = window.innerWidth <= 860;
    const desktopBookSpread = document.getElementById('desktopBookSpread');
    const mobileBookSpread = document.getElementById('mobileBookSpread');

    if (isMobile) {
      if (desktopBookSpread) desktopBookSpread.style.display = 'none';
      if (mobileBookSpread) mobileBookSpread.style.display = 'flex';

      // Mobile Single Page rendering
      const htmlToRender = mobilePageSubIndex === 0 ? spread.leftHtml : spread.rightHtml;
      if (singleMobilePageEl) {
        singleMobilePageEl.style.opacity = '0';
        singleMobilePageEl.style.transform = direction > 0 ? 'translateX(20px)' : 'translateX(-20px)';

        setTimeout(() => {
          singleMobilePageEl.innerHTML = htmlToRender;
          attachTocListeners();
          singleMobilePageEl.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          singleMobilePageEl.style.opacity = '1';
          singleMobilePageEl.style.transform = 'translateX(0)';
        }, 80);
      }
    } else {
      if (desktopBookSpread) desktopBookSpread.style.display = 'flex';
      if (mobileBookSpread) mobileBookSpread.style.display = 'none';

      // Desktop 2-page Spread rendering with 3D animation
      if (leftPageEl && rightPageEl) {
        leftPageEl.style.opacity = '0';
        rightPageEl.style.opacity = '0';
        leftPageEl.style.transform = direction > 0 ? 'rotateY(-25deg)' : 'rotateY(25deg)';
        rightPageEl.style.transform = direction > 0 ? 'rotateY(25deg)' : 'rotateY(-25deg)';

        setTimeout(() => {
          leftPageEl.innerHTML = spread.leftHtml;
          rightPageEl.innerHTML = spread.rightHtml;
          attachTocListeners();

          leftPageEl.style.transition = 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
          rightPageEl.style.transition = 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.05s';
          leftPageEl.style.opacity = '1';
          rightPageEl.style.opacity = '1';
          leftPageEl.style.transform = 'rotateY(0)';
          rightPageEl.style.transform = 'rotateY(0)';
        }, 90);
      }
    }

    updateControls();
  }

  function updateControls() {
    isMobile = window.innerWidth <= 860;

    if (isMobile) {
      const isFirst = currentSpread === 0 && mobilePageSubIndex === 0;
      const isLast = currentSpread === spreads.length - 1 && mobilePageSubIndex === 1;
      if (prevBtn) prevBtn.disabled = isFirst;
      if (nextBtn) nextBtn.disabled = isLast;
    } else {
      if (prevBtn) prevBtn.disabled = currentSpread === 0;
      if (nextBtn) nextBtn.disabled = currentSpread === spreads.length - 1;
    }

    // Update Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      spreads.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `book-dot ${idx === currentSpread ? 'active' : ''}`;
        dot.setAttribute('title', `Go to Spread ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSpread(idx);
        });
        dotsContainer.appendChild(dot);
      });
    }
  }

  function goToSpread(index) {
    if (index === currentSpread || index < 0 || index >= spreads.length) return;
    const dir = index > currentSpread ? 1 : -1;
    currentSpread = index;
    mobilePageSubIndex = 0;
    playPageTurnSound();
    renderSpread(dir);
  }

  function nextPage() {
    isMobile = window.innerWidth <= 860;
    if (isMobile) {
      if (mobilePageSubIndex === 0) {
        mobilePageSubIndex = 1;
        playPageTurnSound();
        renderSpread(1);
      } else if (currentSpread < spreads.length - 1) {
        currentSpread++;
        mobilePageSubIndex = 0;
        playPageTurnSound();
        renderSpread(1);
      }
    } else {
      if (currentSpread < spreads.length - 1) {
        currentSpread++;
        playPageTurnSound();
        renderSpread(1);
      }
    }
  }

  function prevPage() {
    isMobile = window.innerWidth <= 860;
    if (isMobile) {
      if (mobilePageSubIndex === 1) {
        mobilePageSubIndex = 0;
        playPageTurnSound();
        renderSpread(-1);
      } else if (currentSpread > 0) {
        currentSpread--;
        mobilePageSubIndex = 1;
        playPageTurnSound();
        renderSpread(-1);
      }
    } else {
      if (currentSpread > 0) {
        currentSpread--;
        playPageTurnSound();
        renderSpread(-1);
      }
    }
  }

  // Click Table of Contents Jumps
  function attachTocListeners() {
    const tocItems = document.querySelectorAll('.toc-item-link');
    tocItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSpread = parseInt(item.getAttribute('data-jump'), 10);
        if (!isNaN(targetSpread)) {
          goToSpread(targetSpread);
        }
      });
    });
  }

  // Button Listeners
  if (prevBtn) prevBtn.addEventListener('click', prevPage);
  if (nextBtn) nextBtn.addEventListener('click', nextPage);

  // Keyboard navigation (ArrowLeft, ArrowRight)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'KeyD') {
      nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
      prevPage();
    }
  });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
  }, { passive: true });

  // Theme Switcher: cycles between 'vintage', 'dark', 'emerald'
  const themes = ['vintage', 'dark', 'emerald'];
  let currentThemeIdx = 0;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      const newTheme = themes[currentThemeIdx];
      document.body.setAttribute('data-book-theme', newTheme);
      themeToggleBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-moon"></i> Midnight' :
                                 newTheme === 'emerald' ? '<i class="fa-solid fa-gem"></i> Emerald' :
                                 '<i class="fa-solid fa-book"></i> Vintage';
      if (window.showToast) window.showToast(`Theme switched to ${newTheme.toUpperCase()}`);
    });
  }

  // Sound Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.innerHTML = soundEnabled ?
        '<i class="fa-solid fa-volume-high"></i> Sound On' :
        '<i class="fa-solid fa-volume-xmark"></i> Sound Off';
      if (window.showToast) {
        window.showToast(soundEnabled ? 'Page Turn Audio: Enabled 🔊' : 'Page Turn Audio: Muted 🔇');
      }
    });
  }

  // Direct Resume PDF Download
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = 'assets/Ayush_Singh_Rawat_Resume.pdf';
      link.download = 'Ayush_Singh_Rawat_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (window.showToast) window.showToast('Downloading Ayush_Singh_Rawat_Resume.pdf... 📄');
    });
  }

  // ATS Resume Print Trigger
  if (printAtsBtn) {
    printAtsBtn.addEventListener('click', () => {
      if (window.showToast) window.showToast('Opening ATS Printable Resume layout... 🖨️');
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }

  // Handle window resizing (switch between desktop spreads & mobile single-page)
  window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 860;
    if (wasMobile !== isMobile) {
      renderSpread(0);
    }
  });

  // Initial render
  renderSpread(0);
});
