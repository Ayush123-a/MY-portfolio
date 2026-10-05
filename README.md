# Ayush Singh Rawat — Developer Portfolio & Interactive 3D Resume

A modern, high-performance developer portfolio and interactive 3D book-style resume for **Ayush Singh Rawat**, Full-Stack Web Developer and BCA student based in Bangalore, India.

---

## 🌟 Key Features

### 1. Modern Glassmorphic Portfolio (`index.html`)
- **Hero Section**: Dynamic typewriter animation, live availability status badge, glowing ambient mesh backdrop, floating interactive tech chips (React.js, JavaScript ES6+, BCA 2027), and direct call-to-action buttons.
- **Key Metrics Strip**: 5+ projects deployed, 3+ certifications, 1000+ lines of vanilla JS, and 100% commitment.
- **Interactive About Me**:
  - **Technical Skills**: Animated proficiency bars (JavaScript 90%, React 85%, HTML/CSS 92%, SQL 80%, Git 88%) and technology tags.
  - **Experience Timeline**: Journey from 2021 self-directed learning to active 2024–Present full-stack projects.
  - **Education**: Bachelor of Computer Applications (BCA) at City College, Bangalore (Expected 2027) with core computer science coursework.
- **Services Showcase**: Web Design, Full-Stack Software Development, and UI/UX Design with 3D tilt hover effects.
- **Featured Projects Grid**:
  - 🎮 **Treasure Hunt Game** (Vanilla JS, state management, timer logic, deployed on GitHub Pages)
  - 🧠 **Dynamic Quiz Platform** (Advanced DOM manipulation, score calculation, timed visual feedback)
  - 🌐 **Social Media Community App** (React.js, REST APIs, creator networking)
  - 🎵 **Music Discovery App** (Audio streaming UI, waveform visuals)
  - 🛍️ **Global Shopping App** (E-commerce catalog, responsive cart)
  - 📖 **3D Book Resume** (Interactive 3D book experience with page-turn transitions)
  - Category filters: All, Web Apps, Games & Logic, UI & Media.
- **Contact Section**: One-click email copy button, social links (GitHub, LinkedIn), direct contact form with instant validation and email drafting.

---

### 2. Interactive 3D Book-Style Resume (`resume.html`)
Inspired by and reproducing the interactive book experience from [my-resume-nbtq.vercel.app](https://my-resume-nbtq.vercel.app/):
- **Realistic 3D Book Experience**:
  - Desktop 2-page spread with central 3D leather spine, golden foil typography, and aged parchment paper texture.
  - Mobile-responsive single-page layout with touch swipe gestures.
  - Realistic synthesized paper-turn sound effects generated via Web Audio API (zero audio file dependencies).
- **Five Structured Spreads (10 Pages)**:
  - **Cover & Table of Contents**: Gold embossed laurels, personal quote, and interactive chapter jump links.
  - **Chapter I — About Me & Online Presence**: Bio, core technical traits, contact info, and clickable social profiles.
  - **Chapter II — Technical Skills**: Skill meters, frameworks & libraries, core programming languages, and SDLC methodologies.
  - **Chapter III — Development Projects**: In-depth breakdowns of Treasure Hunt Game, Dynamic Quiz Platform, and key architectural highlights.
  - **Chapter IV — Education, Certifications & Colophon**: BCA degree details, university coursework, official certifications, and thank you colophon.
- **Theme Switcher**: Cycle between **Vintage Leather**, **Midnight Dark**, and **Royal Emerald** themes.
- **ATS Printable Resume**: One-click "Print / ATS PDF" button and `@media print` styling that formats the resume into a clean, black-and-white, single/two-page ATS-compliant format.
- **Original PDF Download**: Direct download trigger for `Ayush_Singh_Rawat_Resume.pdf`.

---

## 📁 Project Structure

```
MY portfolio/
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   ├── background.png
│   │   ├── user.png
│   │   ├── work-1.png
│   │   ├── work-2.png
│   │   └── work-3.png
│   └── Ayush_Singh_Rawat_Resume.pdf
├── css/
│   ├── style.css             # Main portfolio glassmorphic design system
│   └── book-resume.css       # 3D book resume styles & ATS print layout
├── js/
│   ├── portfolio.js          # Typewriter, interactive tabs, filters, contact form
│   └── book-resume.js        # 3D book engine, audio synthesis, touch swipes
├── index.html                # Main portfolio landing page
├── resume.html               # Dedicated 3D book resume page
└── README.md
```

---

## 🚀 Running Locally

You can open `index.html` directly in any web browser, or run a local web server:

```bash
# Using Python
python3 -m http.server 3000

# Or using Node.js npx
npx serve .
```

Then visit:
- Portfolio: `http://localhost:3000/index.html`
- 3D Book Resume: `http://localhost:3000/resume.html`

---

## 🌐 Deployment

This project is 100% static and can be deployed in seconds to:
- **GitHub Pages**: Push this repository to GitHub and enable GitHub Pages under repository settings.
- **Vercel**: Run `vercel` or link your GitHub repo.
- **Render**: Create a Static Site pointing to this repository.
