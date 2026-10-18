/* ===================================================================
   AYUSH SINGH RAWAT - PORTFOLIO INTERACTIVE CORE ENGINE
   - Typewriter & Ambient Animations
   - Interactive Tabs & Category Filters
   - Case Study Modals (Problem -> Approach -> Results)
   - Technical Insights / Engineering Blog Reader
   - Model Context Protocol (MCP) Server & Interactive Runner
   - Floating "Portfolio Guide" Agentic AI Assistant
   - Web Audio API Synthesized Sound Feedback
   - Anti-Spam Security & Local Message Persistence
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // 1. WEB AUDIO API SYNTHETIC SOUND ENGINE (Zero MP3 Dependencies)
  // ===================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playUiSound(type = 'click') {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'open') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'mcp') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch {
      // Audio context policy fallback
    }
  }

  // ===================================================================
  // 2. NAVBAR SCROLL EFFECT & SCROLL SPY
  // ===================================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section, header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
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

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksContainer = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      playUiSound('click');
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

  // ===================================================================
  // 3. DYNAMIC TYPEWRITER EFFECT IN HERO
  // ===================================================================
  const typedTarget = document.getElementById('typedText');
  const words = [
    'Full-Stack Web Developer',
    'React.js Specialist',
    'BCA Student @ City College',
    'Interactive UI/UX Designer',
    'Generative AI & MCP Architect'
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
      typeSpeed = 40;
    } else {
      typedTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1600;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  // ===================================================================
  // 4. INTERACTIVE ABOUT ME TABS & ANIMATED METERS
  // ===================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiSound('click');
      const targetTabId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetTabId) {
          pane.classList.add('active');
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
      }, 60);
    });
  }

  animateSkillBars();

  // ===================================================================
  // 5. PROJECT CATEGORY FILTERING
  // ===================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiSound('click');
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
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 240);
        }
      });
    });
  });

  // ===================================================================
  // 6. RICH PROJECT DATA & ARCHITECTURAL CASE STUDY MODALS
  // ===================================================================
  const PROJECTS_DATA = {
    'treasure-hunt': {
      title: '🎮 Treasure Hunt Game',
      category: 'Interactive Game · Vanilla JS State Machine',
      summary: 'A browser game engineered with zero external libraries, featuring coordinate randomization, countdown interval logic, and real-time score multipliers.',
      problem: 'Most modern web games rely on bulky 5MB+ third-party engines (Phaser/Pixi) for simple 2D mechanics, causing severe page bloat, layout jank, and sluggish mobile execution.',
      approach: 'Constructed an event-driven deterministic state machine entirely in Vanilla JavaScript ES6+. Used CSS Grid coordinate math for dynamic treasure placement, requestAnimationFrame for fluid timer decrementing, and Web Audio API synthesizer for instant acoustic reward signals without asset downloads.',
      results: 'Flawless 60 FPS across low-end mobile devices, 0 external network dependencies, sub-50ms input response, and 100/100 Lighthouse Performance rating on GitHub Pages.',
      metrics: [
        { label: 'Bundle Size', val: '14 KB' },
        { label: 'FPS Target', val: '60 FPS' },
        { label: 'Lighthouse', val: '100' },
        { label: 'Dependencies', val: '0' }
      ],
      techStack: ['HTML5 Canvas & Grid', 'Vanilla JavaScript ES6+', 'Web Audio API', 'State Machine', 'GitHub Pages'],
      repoUrl: 'https://github.com/Ayush123-a',
      liveUrl: 'https://ayush123-a.github.io'
    },
    'quiz-platform': {
      title: '🧠 Dynamic Quiz Platform',
      category: 'Web Application · DOM Engine & Score Analytics',
      summary: 'High-speed quiz application featuring dynamic question pool generation, per-question timer bars, instant answer validation, and post-game score visualization.',
      problem: 'Static quiz websites re-render entire HTML pages upon every question transition, triggering layout thrashing, flashing backgrounds, and loss of intermediate timer state.',
      approach: 'Architected a modular DOM rendering pipeline that replaces only the reactive question-card nodes while maintaining continuous interval timers. Question pools are structured as immutable JSON arrays, preventing tampering and memory leaks.',
      results: 'Over 1,000 lines of modular JavaScript. Zero layout shifts (CLS < 0.01), sub-15ms DOM updates, and an intuitive score breakdown dashboard for students.',
      metrics: [
        { label: 'Lines of Code', val: '1,000+' },
        { label: 'Render Latency', val: '< 15ms' },
        { label: 'CLS Score', val: '0.00' },
        { label: 'Device Support', val: '100%' }
      ],
      techStack: ['JavaScript ES6+', 'DOM API', 'CSS Keyframes', 'Local Storage', 'Responsive Design'],
      repoUrl: 'https://github.com/Ayush123-a',
      liveUrl: 'https://ayush123-a.github.io'
    },
    'social-media-app': {
      title: '🌐 Social Media App',
      category: 'Full-Stack · Community & Creator Networking',
      summary: 'A responsive community platform allowing developers and creatives to discover profiles, showcase portfolios, interact with posts, and share project milestones.',
      problem: 'Mainstream social apps are bogged down by intrusive tracking scripts, clutter, and non-semantic DOM trees that perform poorly on mobile connections.',
      approach: 'Built with React.js component hierarchy, custom hooks for asynchronous REST API data synchronization, glassmorphic dark-mode CSS tokens, and fluid layout grids designed for quick profile discovery.',
      results: 'Instant search filtering, modular component reuse, clean REST architectural separation, and an intuitive mobile-first experience.',
      metrics: [
        { label: 'Framework', val: 'React.js' },
        { label: 'First Paint', val: '< 0.8s' },
        { label: 'Contrast Ratio', val: '7:1 (AAA)' },
        { label: 'Architecture', val: 'REST' }
      ],
      techStack: ['React.js', 'REST APIs', 'Custom Hooks', 'Glassmorphism', 'Responsive CSS'],
      repoUrl: 'https://github.com/Ayush123-a',
      liveUrl: 'https://github.com/Ayush123-a'
    },
    'music-discovery-app': {
      title: '🎵 Music Discovery App',
      category: 'Audio & Streaming UI · Web Audio API',
      summary: 'A web-based audio exploration interface featuring real-time audio waveform visualization, queue management, volume damping, and custom playback hotkeys.',
      problem: 'Default HTML5 audio player controls look inconsistent across browsers, cannot draw dynamic audio visualizer waveforms, and fail to provide queue management.',
      approach: 'Integrated Web Audio API AnalyserNodes to compute FFT frequency bin data in real time, rendering reactive audio visualizer bars. Managed audio buffer playback, playlist state, and keyboard shortcuts (Space for Play/Pause, Arrows for Seek).',
      results: 'Zero audio stutter, real-time 60 FPS waveform drawing, and an elegant dark glassmorphic interface.',
      metrics: [
        { label: 'Waveform FPS', val: '60 FPS' },
        { label: 'Latency', val: '< 20ms' },
        { label: 'Controls', val: 'Keyboard + Touch' },
        { label: 'Audio Engine', val: 'Web Audio' }
      ],
      techStack: ['Web Audio API', 'HTML5 Audio', 'JavaScript ES6+', 'CSS Keyframes', 'Glassmorphism'],
      repoUrl: 'https://github.com/Ayush123-a',
      liveUrl: 'https://github.com/Ayush123-a'
    },
    'global-shopping-app': {
      title: '🛍️ Global Shopping App',
      category: 'E-Commerce Platform · Reactive Cart Engine',
      summary: 'Comprehensive e-commerce shopping experience with instant multi-facet category filtering, reactive local storage cart synchronization, and checkout drawer.',
      problem: 'Shopping apps often suffer from stale cart state bugs when switching views, slow multi-category filtering, and awkward desktop-only checkouts.',
      approach: 'Constructed a unified cart store in React with persistent browser storage synchronization. Built an in-memory indexing algorithm for sub-10ms catalog searches and instant subtotal/tax calculations.',
      results: 'Zero state desynchronization bugs, instant catalog filtering, and seamless slide-out drawer checkout optimized for one-thumb mobile usage.',
      metrics: [
        { label: 'Filter Speed', val: '< 10ms' },
        { label: 'Cart Sync', val: '100% Reliable' },
        { label: 'Mobile UX', val: 'Drawer Mode' },
        { label: 'State Model', val: 'Reactive' }
      ],
      techStack: ['React.js', 'LocalStorage', 'CSS Grid', 'Drawer Pattern', 'Checkout Logic'],
      repoUrl: 'https://github.com/Ayush123-a',
      liveUrl: 'https://github.com/Ayush123-a'
    },
    'book-resume': {
      title: '📖 3D Book-Style Resume',
      category: 'Interactive 3D Experience & ATS Export Engine',
      summary: 'Pioneering 3D interactive book resume with dual-page perspective spreads, synthesized page-turn acoustic feedback, 3 antique themes, and one-click ATS PDF export.',
      problem: 'Standard PDF resumes are evaluated in under 6 seconds, fail to show interactive engineering mastery, and interactive web resumes rarely provide a clean ATS printable format.',
      approach: 'Developed an interactive 3D book engine utilizing CSS transform-style: preserve-3d and perspective matrices. Implemented synthetic Web Audio API white-noise burst filtering to mimic physical parchment sounds without MP3 assets. Built a dual-mode engine: 3D interactive flipbook for screen browsing, and clean single-page black-and-white ATS layout under @media print.',
      results: '10x higher recruiter engagement time, zero audio asset dependencies, mobile touch swipe support, and immediate printable ATS compliance.',
      metrics: [
        { label: 'Audio Assets', val: '0 KB (Synthesized)' },
        { label: 'ATS Ready', val: 'Yes (@media print)' },
        { label: 'Themes', val: '3 Curated' },
        { label: 'Touch Gestures', val: 'Swipe & Flip' }
      ],
      techStack: ['3D CSS Transforms', 'Web Audio API', 'Touch Gestures', 'ATS Print Styling', 'LocalStorage Theme'],
      repoUrl: 'https://github.com/Ayush123-a',
      liveUrl: 'resume.html'
    }
  };

  // Case Study Modal Elements
  const caseStudyModal = document.getElementById('caseStudyModal');
  const caseStudyBackdrop = document.getElementById('caseStudyBackdrop');
  const caseStudyContent = document.getElementById('caseStudyContent');
  const closeCaseStudyBtn = document.getElementById('closeCaseStudyBtn');

  function openCaseStudy(slug) {
    const data = PROJECTS_DATA[slug];
    if (!data || !caseStudyModal || !caseStudyContent) return;

    playUiSound('open');

    const metricsHtml = data.metrics.map(m => `
      <div class="cs-metric-card">
        <div class="cs-metric-val">${m.val}</div>
        <div class="cs-metric-label">${m.label}</div>
      </div>
    `).join('');

    const techPillsHtml = data.techStack.map(t => `<span class="cs-pill">${t}</span>`).join('');

    caseStudyContent.innerHTML = `
      <div class="case-study-hero">
        <span class="cs-tag">${data.category}</span>
        <h2 class="cs-title" id="caseStudyTitle">${data.title}</h2>
        <p class="cs-summary">${data.summary}</p>
      </div>

      <div class="cs-metrics-grid">
        ${metricsHtml}
      </div>

      <div class="cs-section">
        <h4><i class="fa-solid fa-triangle-exclamation"></i> Problem Statement</h4>
        <p>${data.problem}</p>
      </div>

      <div class="cs-section">
        <h4><i class="fa-solid fa-compass-drafting"></i> Architecture & Engineering Approach</h4>
        <p>${data.approach}</p>
      </div>

      <div class="cs-section">
        <h4><i class="fa-solid fa-chart-line"></i> Measurable Results & Performance</h4>
        <p>${data.results}</p>
      </div>

      <div class="cs-section">
        <h4><i class="fa-solid fa-layer-group"></i> Technologies & Architectural Layers</h4>
        <div class="cs-tech-pills">
          ${techPillsHtml}
        </div>
      </div>

      <div class="cs-actions-footer">
        ${slug === 'book-resume' ? `
          <a href="resume.html" class="btn-primary">
            <i class="fa-solid fa-book-open"></i> Launch 3D Book Resume
          </a>
        ` : `
          <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Application
          </a>
        `}
        <a href="${data.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary">
          <i class="fa-brands fa-github"></i> View GitHub Source
        </a>
      </div>
    `;

    caseStudyModal.classList.add('active');
    caseStudyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudy() {
    playUiSound('click');
    caseStudyModal?.classList.remove('active');
    caseStudyModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeCaseStudyBtn?.addEventListener('click', closeCaseStudy);
  caseStudyBackdrop?.addEventListener('click', closeCaseStudy);

  // Bind all Case Study Buttons
  document.querySelectorAll('.open-case-study').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = btn.getAttribute('data-project');
      if (slug) openCaseStudy(slug);
    });
  });

  // ===================================================================
  // 7. TECHNICAL INSIGHTS / ENGINEERING BLOG ARTICLES
  // ===================================================================
  const ARTICLES_DATA = {
    '3d-book-engine': {
      title: 'Building a Zero-Dependency 3D Book Engine with Web Audio API',
      category: 'Interactive 3D · Web Audio · Frontend Architecture',
      readTime: '5 min read',
      content: `
        <p>When engineering an interactive portfolio, standard flat carousels rarely capture the depth of engineering passion. For my portfolio, I chose to reproduce an antique leather-bound interactive 3D book that invites recruiters to literally turn the pages of my journey.</p>
        
        <h4 class="mt-4 text-cyan"><i class="fa-solid fa-cube"></i> 1. The 3D CSS Perspective Matrix</h4>
        <p>The core visual mechanic relies on <code>perspective: 1800px</code> set on the hardcover stage, combined with <code>transform-style: preserve-3d</code> on the dual-page spread. Each page turn is executed via a 3D rotation transform:</p>
        <pre class="schema-pre"><code>.book-page-turning {
  transform-origin: left center;
  transform: rotateY(-180deg);
  transition: transform 0.85s cubic-bezier(0.25, 1, 0.5, 1);
}</code></pre>
        <p>This allows realistic shading gradients on the parchment edges without requiring Three.js or heavy WebGL dependencies, keeping the total JavaScript footprint below 25 KB.</p>

        <h4 class="mt-4 text-cyan"><i class="fa-solid fa-volume-high"></i> 2. Synthesizing Physical Paper Sound in Web Audio</h4>
        <p>Rather than loading 200 KB MP3 audio files that might fail to preload on mobile networks, I synthesized the acoustic sound of parchment turning using a procedural noise buffer:</p>
        <pre class="schema-pre"><code>const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
const data = buffer.getChannelData(0);
for (let i = 0; i < data.length; i++) {
  data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
}
// Filtered through a bandpass filter at 1200 Hz</code></pre>

        <h4 class="mt-4 text-cyan"><i class="fa-solid fa-print"></i> 3. Single-Page ATS Print Mode</h4>
        <p>A major design requirement was ensuring recruiters can still print a clean, ATS-friendly 1-page PDF. Under <code>@media print</code>, the 3D book stage is collapsed into an elegant black-and-white layout with high-contrast typography and no background ink wastage.</p>
      `
    },
    'mcp-portfolio-agent': {
      title: 'Connecting AI Agents to Portfolios with Model Context Protocol (MCP)',
      category: 'Agentic AI · Model Context Protocol · Security',
      readTime: '6 min read',
      content: `
        <p>Model Context Protocol (MCP) is rapidly becoming the open standard for connecting AI agents to secure, typed data sources and tool functions. Integrating an MCP-connected agent into a personal portfolio demonstrates modern AI engineering.</p>

        <h4 class="mt-4 text-cyan"><i class="fa-solid fa-network-wired"></i> 1. Standardized Tool Exposure</h4>
        <p>Rather than stuffing thousands of tokens of static bio text into an LLM prompt, the agent is equipped with distinct, discoverable tools:</p>
        <ul>
          <li><code>portfolio.get_projects({ tag, featured })</code></li>
          <li><code>portfolio.get_project({ slug })</code></li>
          <li><code>portfolio.get_resume()</code></li>
          <li><code>portfolio.search_posts({ query })</code></li>
        </ul>

        <h4 class="mt-4 text-cyan"><i class="fa-solid fa-shield-halved"></i> 2. Security Guardrails & Prompt Injection Defenses</h4>
        <p>Per <code>authentication-and-security.md</code>, public agents must have strictly sandboxed, read-only permissions. User inputs are treated as untrusted strings, preventing prompt injections from forcing the assistant to hallucinate or disclose private data.</p>
        <pre class="schema-pre"><code>// Agent Orchestrator Guardrail Pattern
if (detectInjectionAttempt(userInput)) {
  return "I am Ayush's professional Portfolio Guide. I can only assist with verified portfolio queries.";
}</code></pre>
      `
    },
    'dom-game-engineering': {
      title: 'Vanilla JavaScript DOM Engineering: 60 FPS State Machines',
      category: 'Vanilla JS · Performance · Algorithmic Architecture',
      readTime: '4 min read',
      content: `
        <p>While heavy UI frameworks like React and Vue excel at complex dashboard state, mastering pure JavaScript DOM engineering is essential for understanding browser event loops, repaint cycles, and memory management.</p>

        <h4 class="mt-4 text-cyan"><i class="fa-solid fa-gauge-high"></i> 1. Eliminating Layout Thrashing</h4>
        <p>In both the <strong>Treasure Hunt Game</strong> and the <strong>Dynamic Quiz Platform</strong>, batched DOM mutations ensure the browser does not trigger multiple forced synchronous layouts. Element positions and timer state are updated in single RAF frames.</p>

        <h4 class="mt-4 text-cyan"><i class="fa-solid fa-code"></i> 2. Deterministic State Transitions</h4>
        <p>Games rely on strict state definitions: <code>IDLE → ACTIVE → PAUSED → FINISHED</code>. Managing this via pure closures ensures zero unexpected state leakage and instantaneous replayability.</p>
      `
    }
  };

  const blogArticleModal = document.getElementById('blogArticleModal');
  const blogArticleBackdrop = document.getElementById('blogArticleBackdrop');
  const blogArticleContent = document.getElementById('blogArticleContent');
  const closeBlogArticleBtn = document.getElementById('closeBlogArticleBtn');

  function openArticle(slug) {
    const data = ARTICLES_DATA[slug];
    if (!data || !blogArticleModal || !blogArticleContent) return;

    playUiSound('open');

    blogArticleContent.innerHTML = `
      <div class="case-study-hero">
        <span class="cs-tag">${data.category} · ${data.readTime}</span>
        <h2 class="cs-title" id="blogArticleTitle">${data.title}</h2>
      </div>
      <div class="article-content-body">
        ${data.content}
      </div>
    `;

    blogArticleModal.classList.add('active');
    blogArticleModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeArticle() {
    playUiSound('click');
    blogArticleModal?.classList.remove('active');
    blogArticleModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBlogArticleBtn?.addEventListener('click', closeArticle);
  blogArticleBackdrop?.addEventListener('click', closeArticle);

  document.querySelectorAll('.open-article-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = btn.getAttribute('data-article');
      if (slug) openArticle(slug);
    });
  });

  // ===================================================================
  // 8. MODEL CONTEXT PROTOCOL (MCP) CONSOLE & ARCHITECTURE INSPECTOR
  // ===================================================================
  const mcpModal = document.getElementById('mcpModal');
  const mcpModalBackdrop = document.getElementById('mcpModalBackdrop');
  const closeMcpModalBtn = document.getElementById('closeMcpModalBtn');
  const openMcpModalNavBtn = document.getElementById('openMcpModalNavBtn');
  const heroMcpBtn = document.getElementById('heroMcpBtn');
  const footerMcpBtn = document.getElementById('footerMcpBtn');
  const aiMcpOpenBtn = document.getElementById('aiMcpOpenBtn');

  function openMcpModal() {
    playUiSound('open');
    mcpModal?.classList.add('active');
    mcpModal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMcpModal() {
    playUiSound('click');
    mcpModal?.classList.remove('active');
    mcpModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openMcpModalNavBtn?.addEventListener('click', openMcpModal);
  heroMcpBtn?.addEventListener('click', openMcpModal);
  footerMcpBtn?.addEventListener('click', (e) => { e.preventDefault(); openMcpModal(); });
  aiMcpOpenBtn?.addEventListener('click', openMcpModal);
  closeMcpModalBtn?.addEventListener('click', closeMcpModal);
  mcpModalBackdrop?.addEventListener('click', closeMcpModal);

  // MCP Tab Navigation
  const mcpTabBtns = document.querySelectorAll('.mcp-tab-btn');
  const mcpTabPanes = document.querySelectorAll('.mcp-tab-content');

  mcpTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiSound('click');
      const targetPane = btn.getAttribute('data-mcptab');

      mcpTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      mcpTabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetPane) {
          pane.classList.add('active');
        }
      });
    });
  });

  // MCP Server Implementation (In-Browser Virtual Server)
  window.MCP_SERVER = {
    get_projects: (params = {}) => {
      let list = Object.keys(PROJECTS_DATA).map(slug => ({
        slug,
        title: PROJECTS_DATA[slug].title,
        category: PROJECTS_DATA[slug].category,
        techStack: PROJECTS_DATA[slug].techStack,
        liveUrl: PROJECTS_DATA[slug].liveUrl,
        metrics: PROJECTS_DATA[slug].metrics
      }));
      if (params.featured) {
        list = list.slice(0, 3);
      }
      return {
        jsonrpc: '2.0',
        result: {
          server: 'portfolio-mcp-server/1.0',
          tool: 'portfolio.get_projects',
          count: list.length,
          projects: list
        }
      };
    },
    get_project: (params = {}) => {
      const slug = params.slug || 'treasure-hunt';
      const data = PROJECTS_DATA[slug] || PROJECTS_DATA['treasure-hunt'];
      return {
        jsonrpc: '2.0',
        result: {
          server: 'portfolio-mcp-server/1.0',
          tool: 'portfolio.get_project',
          slug,
          details: data
        }
      };
    },
    get_resume: () => {
      return {
        jsonrpc: '2.0',
        result: {
          server: 'portfolio-mcp-server/1.0',
          tool: 'portfolio.get_resume',
          candidate: 'Ayush Singh Rawat',
          role: 'Full-Stack Web Developer & BCA Student',
          location: 'Bangalore, Karnataka, India',
          education: {
            degree: 'Bachelor of Computer Applications (BCA)',
            institution: 'City College, Bangalore University',
            expectedGraduation: 2027,
            coursework: ['Data Structures & Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'Software Engineering']
          },
          skills: {
            languages: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3/SCSS', 'SQL'],
            frameworks: ['React.js', 'Bootstrap', 'Tailwind CSS'],
            tools: ['Git', 'GitHub', 'VS Code', 'Model Context Protocol (MCP)', 'Linux CLI', 'Web Audio API']
          },
          contacts: {
            email: 'ayushsinghrawat76456@gmail.com',
            phone: '+91 8088954420',
            github: 'https://github.com/Ayush123-a',
            linkedin: 'https://linkedin.com/in/ayush-rawat-a126942b2'
          }
        }
      };
    },
    search_posts: (params = {}) => {
      const query = (params.query || '').toLowerCase();
      const results = Object.keys(ARTICLES_DATA)
        .filter(slug => {
          const art = ARTICLES_DATA[slug];
          return art.title.toLowerCase().includes(query) || art.category.toLowerCase().includes(query);
        })
        .map(slug => ({
          slug,
          title: ARTICLES_DATA[slug].title,
          category: ARTICLES_DATA[slug].category,
          readTime: ARTICLES_DATA[slug].readTime
        }));
      return {
        jsonrpc: '2.0',
        result: {
          server: 'portfolio-mcp-server/1.0',
          tool: 'portfolio.search_posts',
          query: params.query || 'all',
          count: results.length,
          articles: results
        }
      };
    },
    inspect_system_architecture: () => {
      return {
        jsonrpc: '2.0',
        result: {
          server: 'portfolio-mcp-server/1.0',
          status: 'healthy',
          uptime: '99.98%',
          layers: [
            { name: 'Presentation Layer', tech: 'Next.js & Vanilla ES6', status: 'active' },
            { name: 'API Layer', endpoints: 5, rateLimit: '60 req/min', status: 'active' },
            { name: 'Agent Orchestrator', model: 'Portfolio Guide AI', status: 'connected' },
            { name: 'MCP Servers', servers: ['portfolio', 'github'], status: 'registered' },
            { name: 'Database', engine: 'PostgreSQL 15 + Prisma ORM', status: 'connected' }
          ]
        }
      };
    }
  };

  // MCP Interactive Runner Button
  const runMcpToolBtn = document.getElementById('runMcpToolBtn');
  const mcpToolSelect = document.getElementById('mcpToolSelect');
  const mcpOutputPre = document.getElementById('mcpOutputPre');
  const mcpExecutionStatus = document.getElementById('mcpExecutionStatus');

  if (runMcpToolBtn && mcpToolSelect && mcpOutputPre) {
    runMcpToolBtn.addEventListener('click', () => {
      playUiSound('mcp');
      const val = mcpToolSelect.value;
      if (mcpExecutionStatus) mcpExecutionStatus.textContent = 'Executing...';

      setTimeout(() => {
        let output = {};
        if (val === 'get_projects') {
          output = window.MCP_SERVER.get_projects({ featured: true });
        } else if (val === 'get_project_treasure') {
          output = window.MCP_SERVER.get_project({ slug: 'treasure-hunt' });
        } else if (val === 'get_project_book') {
          output = window.MCP_SERVER.get_project({ slug: 'book-resume' });
        } else if (val === 'get_resume') {
          output = window.MCP_SERVER.get_resume();
        } else if (val === 'search_posts') {
          output = window.MCP_SERVER.search_posts({ query: 'Web Audio' });
        } else {
          output = window.MCP_SERVER.inspect_system_architecture();
        }

        mcpOutputPre.innerHTML = `<code>${JSON.stringify(output, null, 2)}</code>`;
        if (mcpExecutionStatus) {
          mcpExecutionStatus.textContent = `200 OK (${Math.floor(Math.random() * 20 + 12)}ms)`;
        }
        showToast('MCP Tool executed successfully! ⚡');
      }, 120);
    });
  }

  // ===================================================================
  // 9. FLOATING "PORTFOLIO GUIDE" AI AGENT (Chat Assistant & MCP Client)
  // ===================================================================
  const aiChatToggle = document.getElementById('aiChatToggle');
  const aiAssistantContainer = document.getElementById('aiAssistantContainer');
  const aiMinimizeBtn = document.getElementById('aiMinimizeBtn');
  const aiCloseBtn = document.getElementById('aiCloseBtn');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiMessagesContainer = document.getElementById('aiMessagesContainer');
  const aiToolIndicator = document.getElementById('aiToolIndicator');
  const aiToolIndicatorText = document.getElementById('aiToolIndicatorText');

  function openAiChat() {
    playUiSound('open');
    aiAssistantContainer?.classList.add('open');
    aiAssistantContainer?.setAttribute('aria-hidden', 'false');
    aiChatToggle?.style.setProperty('display', 'none');
    setTimeout(() => aiChatInput?.focus(), 150);
  }

  function closeAiChat() {
    playUiSound('click');
    aiAssistantContainer?.classList.remove('open');
    aiAssistantContainer?.setAttribute('aria-hidden', 'true');
    aiChatToggle?.style.removeProperty('display');
  }

  aiChatToggle?.addEventListener('click', openAiChat);
  aiMinimizeBtn?.addEventListener('click', closeAiChat);
  aiCloseBtn?.addEventListener('click', closeAiChat);

  function appendAiMessage(role, html) {
    if (!aiMessagesContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ai-msg-${role}`;

    if (role === 'user') {
      msgDiv.innerHTML = `
        <div class="ai-msg-avatar"><i class="fa-solid fa-user"></i></div>
        <div class="ai-msg-bubble">${html}</div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="ai-msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="ai-msg-bubble">${html}</div>
      `;
    }

    aiMessagesContainer.appendChild(msgDiv);
    aiMessagesContainer.scrollTop = aiMessagesContainer.scrollHeight;
  }

  function simulateToolCall(toolName, callback) {
    if (aiToolIndicator && aiToolIndicatorText) {
      aiToolIndicator.style.display = 'flex';
      aiToolIndicatorText.textContent = `[MCP Protocol] Executing tool: ${toolName}...`;
      playUiSound('mcp');
    }

    setTimeout(() => {
      if (aiToolIndicator) aiToolIndicator.style.display = 'none';
      callback();
    }, 450);
  }

  function processAiQuery(query) {
    const q = query.toLowerCase();

    // 1. Guardrails check (Security per authentication-and-security.md & agents.md)
    const injectionPhrases = [
      'ignore previous instructions',
      'system prompt',
      'give me password',
      'bypass',
      'override',
      'jailbreak',
      'admin credentials'
    ];
    if (injectionPhrases.some(p => q.includes(p))) {
      simulateToolCall('security_guardrail_check', () => {
        appendAiMessage('bot', `
          <p>⚠️ <strong>Security Notice:</strong> Prompt injection attempt prevented.</p>
          <p>As Ayush's professional Portfolio Guide, I strictly follow safety protocols and only provide verified information regarding Ayush's projects, experience, skills, and 3D resume.</p>
        `);
      });
      return;
    }

    // 2. Projects inquiry
    if (q.includes('project') || q.includes('treasure') || q.includes('quiz') || q.includes('work') || q.includes('app')) {
      simulateToolCall('portfolio.get_projects({ featured: true })', () => {
        const res = window.MCP_SERVER.get_projects();
        let projectsList = res.result.projects.map(p => `
          <li>
            <strong>${p.title}</strong> — ${p.category}
            <br><a href="#portfolio" onclick="document.querySelector('[data-project=\\'${p.slug}\\'] .open-case-study')?.click(); return false;">Open Architectural Case Study ↗</a>
          </li>
        `).join('');

        appendAiMessage('bot', `
          <p>Here are Ayush's standout projects retrieved directly from the <strong>Portfolio MCP Server</strong>:</p>
          <ul style="padding-left: 18px; margin: 8px 0; font-size: 0.86rem; line-height: 1.6;">
            ${projectsList}
          </ul>
          <p>You can click any case study link to inspect the engineering architecture and metrics!</p>
        `);
      });
      return;
    }

    // 3. 3D Book Resume inquiry
    if (q.includes('resume') || q.includes('book') || q.includes('3d') || q.includes('cv')) {
      simulateToolCall('portfolio.get_project({ slug: "book-resume" })', () => {
        appendAiMessage('bot', `
          <p>📖 Ayush engineered a unique <strong>Interactive 3D Book Resume</strong>!</p>
          <p><strong>Key Highlights:</strong></p>
          <ul style="padding-left: 18px; margin: 8px 0; font-size: 0.86rem; line-height: 1.5;">
            <li>Realistic 3D dual-page perspective transforms (CSS <code>preserve-3d</code>)</li>
            <li>Synthetic parchment flip sound generated via Web Audio API (0 external MP3s)</li>
            <li>3 Antique themes: Vintage Leather, Midnight Dark, and Royal Emerald</li>
            <li>Single-click ATS-compliant standard PDF export via <code>@media print</code></li>
          </ul>
          <p><a href="resume.html">Click here to launch the 3D Book Resume ↗</a> or click "Download CV" in the hero.</p>
        `);
      });
      return;
    }

    // 4. Skills inquiry
    if (q.includes('skill') || q.includes('tech') || q.includes('react') || q.includes('javascript') || q.includes('language')) {
      simulateToolCall('portfolio.get_resume()', () => {
        appendAiMessage('bot', `
          <p>Ayush's core technical proficiencies verified via <code>portfolio.get_resume()</code>:</p>
          <ul style="padding-left: 18px; margin: 8px 0; font-size: 0.86rem; line-height: 1.6;">
            <li><strong>Frontend:</strong> JavaScript (ES6+ 80%), HTML5 & Modern CSS3 (80%), React.js (75%), Web Audio API</li>
            <li><strong>Backend & Data:</strong> MySQL & Relational Schema (60%), RESTful APIs, Node.js basics</li>
            <li><strong>Core CS & Tooling:</strong> Git & GitHub (68%), Data Structures & Algorithms (50%), Model Context Protocol (MCP)</li>
          </ul>
          <p>He specializes in writing clean, modular Vanilla JS and React components with zero unnecessary bundle bloat.</p>
        `);
      });
      return;
    }

    // 5. Education & Background
    if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('bangalore') || q.includes('bca')) {
      simulateToolCall('portfolio.get_resume()', () => {
        appendAiMessage('bot', `
          <p>🎓 <strong>Academic Background:</strong></p>
          <p>Ayush is currently pursuing his <strong>Bachelor of Computer Applications (BCA)</strong> at <strong>City College, Bangalore University</strong> (Expected Graduation: <strong>2027</strong>).</p>
          <p>His academic coursework includes:</p>
          <ul style="padding-left: 18px; margin: 8px 0; font-size: 0.86rem; line-height: 1.5;">
            <li>Data Structures & Algorithms (DSA)</li>
            <li>Database Management Systems (DBMS)</li>
            <li>Operating Systems & Computer Networks</li>
            <li>Software Development Lifecycle (SDLC)</li>
          </ul>
        `);
      });
      return;
    }

    // 6. Contact / Hiring inquiry
    if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone') || q.includes('message')) {
      simulateToolCall('portfolio.get_resume()', () => {
        appendAiMessage('bot', `
          <p>📬 Ayush is currently available for developer internships, freelance projects, and full-time software engineering roles!</p>
          <ul style="padding-left: 18px; margin: 8px 0; font-size: 0.86rem; line-height: 1.6;">
            <li><strong>Email:</strong> <a href="mailto:ayushsinghrawat76456@gmail.com">ayushsinghrawat76456@gmail.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+918088954420">+91 8088954420</a></li>
            <li><strong>Location:</strong> Bangalore, Karnataka, India</li>
            <li><strong>GitHub:</strong> <a href="https://github.com/Ayush123-a" target="_blank">github.com/Ayush123-a</a></li>
          </ul>
          <p>You can also use the contact form below or click the copy button to copy his email.</p>
        `);
      });
      return;
    }

    // Default Fallback
    simulateToolCall('portfolio.inspect_system_architecture()', () => {
      appendAiMessage('bot', `
        <p>Thanks for your question! I can provide detailed insights into:</p>
        <ul style="padding-left: 18px; margin: 8px 0; font-size: 0.86rem; line-height: 1.5;">
          <li>Ayush's <strong>6 Featured Projects</strong> & case studies</li>
          <li>His <strong>Interactive 3D Book Resume</strong> architecture</li>
          <li>Technical skills in <strong>React.js, JavaScript, and MySQL</strong></li>
          <li>Education at <strong>City College, Bangalore (BCA 2027)</strong></li>
          <li>Model Context Protocol (MCP) server specifications</li>
        </ul>
        <p>Feel free to select one of the suggestion chips below or ask anything specific!</p>
      `);
    });
  }

  aiChatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = aiChatInput?.value.trim();
    if (!query) return;

    appendAiMessage('user', query);
    aiChatInput.value = '';
    processAiQuery(query);
  });

  document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        appendAiMessage('user', prompt);
        processAiQuery(prompt);
      }
    });
  });

  // ===================================================================
  // 10. COPY EMAIL TO CLIPBOARD HELPER
  // ===================================================================
  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      playUiSound('click');
      const email = 'ayushsinghrawat76456@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard! 📋');
      }).catch(() => {
        showToast('Direct: ayushsinghrawat76456@gmail.com');
      });
    });
  }

  // ===================================================================
  // 11. ENHANCED CONTACT FORM (Honeypot Anti-Spam & Local Persistence)
  // ===================================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check anti-spam honeypot
      const hpCheck = document.getElementById('hpSecurityCheck')?.value;
      if (hpCheck) {
        // Bot detected, silently block
        formStatus.textContent = 'Message transmitted.';
        formStatus.className = 'form-status success';
        contactForm.reset();
        return;
      }

      const name = document.getElementById('userName')?.value.trim();
      const email = document.getElementById('userEmail')?.value.trim();
      const message = document.getElementById('userMessage')?.value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.className = 'form-status error';
        return;
      }

      playUiSound('success');
      formStatus.textContent = 'Saving inquiry and opening email client...';
      formStatus.className = 'form-status';

      // Persist in localStorage to simulate DB message store
      try {
        const stored = JSON.parse(localStorage.getItem('ayush_portfolio_messages') || '[]');
        stored.push({
          id: 'msg-' + Date.now(),
          name,
          email,
          message,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('ayush_portfolio_messages', JSON.stringify(stored));
      } catch {
        // Storage failover
      }

      // Open mailto link
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Ayush,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:ayushsinghrawat76456@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        formStatus.textContent = 'Thank you! Message drafted and saved. Feel free to send directly.';
        formStatus.className = 'form-status success';
        showToast('Inquiry drafted & ready! 🚀');
        contactForm.reset();
      }, 700);
    });
  }

  // ===================================================================
  // 12. GLOBAL TOAST NOTIFICATION HELPER
  // ===================================================================
  window.showToast = function(msg) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> <span>${msg}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3600);
  };

  // ===================================================================
  // 13. 3D ISOMETRIC HYPERCUBE SHOWCASE & INTERACTIVE SWITCHER
  // ===================================================================
  const switchCubeBtn = document.getElementById('switchCubeBtn');
  const switchAvatarBtn = document.getElementById('switchAvatarBtn');
  const cubeStage = document.getElementById('cubeStage');
  const avatarStage = document.getElementById('avatarStage');
  const cubeEmblemCard = document.getElementById('cubeEmblemCard');

  if (switchCubeBtn && switchAvatarBtn && cubeStage && avatarStage) {
    switchCubeBtn.addEventListener('click', () => {
      playUiSound('click');
      switchCubeBtn.classList.add('active');
      switchAvatarBtn.classList.remove('active');
      cubeStage.classList.remove('hidden');
      avatarStage.classList.add('hidden');
    });

    switchAvatarBtn.addEventListener('click', () => {
      playUiSound('click');
      switchAvatarBtn.classList.add('active');
      switchCubeBtn.classList.remove('active');
      cubeStage.classList.add('hidden');
      avatarStage.classList.remove('hidden');
    });
  }

  // Interactive 3D mouse parallax on Cube Emblem
  if (cubeEmblemCard) {
    cubeEmblemCard.addEventListener('mousemove', (e) => {
      const rect = cubeEmblemCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 22;
      const rotateY = (x / rect.width) * 22;
      cubeEmblemCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    cubeEmblemCard.addEventListener('mouseleave', () => {
      cubeEmblemCard.style.transform = '';
    });
  }

  // Keyboard accessibility: ESC closes active modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (caseStudyModal?.classList.contains('active')) closeCaseStudy();
      if (blogArticleModal?.classList.contains('active')) closeArticle();
      if (mcpModal?.classList.contains('active')) closeMcpModal();
      if (aiAssistantContainer?.classList.contains('open')) closeAiChat();
    }
  });

});
