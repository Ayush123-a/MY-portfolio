# design.md — Design System & UX

## 1. Design Principles
1. **Clarity first** — content over decoration.
2. **Fast to scan** — recruiters decide in seconds.
3. **Accessible by default** — contrast, focus states, keyboard navigation.
4. **Consistent** — every component comes from the system below.

## 2. Brand
- **Personality:** professional, modern, approachable.
- **Logo/Wordmark:** <describe or link>

## 3. Colour Tokens
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | #FFFFFF | #0B0F19 | Page background |
| `--surface` | #F5F7FA | #131A2A | Cards |
| `--text` | #111827 | #E5E7EB | Body text |
| `--muted` | #6B7280 | #9CA3AF | Secondary text |
| `--primary` | #4F46E5 | #818CF8 | Links, buttons |
| `--danger` | #DC2626 | #F87171 | Errors |

Contrast target: 4.5:1 for body text.

## 4. Typography
- **Headings:** <Font A>, 700
- **Body:** <Font B>, 400/500
- **Scale:** 12 / 14 / 16 / 20 / 24 / 32 / 48 px
- Line height: 1.5 body, 1.2 headings.

## 5. Spacing & Layout
- 4 px base unit (4, 8, 12, 16, 24, 32, 48, 64).
- Max content width: 1100 px.
- Breakpoints: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.

## 6. Components
| Component | Variants | Notes |
|---|---|---|
| Button | primary, secondary, ghost | Min 44 px touch target |
| Card | project, blog | Hover lift, focus ring |
| Tag/Badge | tech, status | |
| Navbar | desktop, mobile drawer | Sticky |
| Chat widget | collapsed, open | Floating bottom-right |
| Form field | text, textarea | Inline validation |

## 7. Pages & Wireframes
- **Home:** hero → featured projects → skills → CTA
- **Projects:** filter bar + grid
- **Project detail:** problem → approach → result → tech → links
- **About:** story, timeline, résumé
- **Contact:** form + socials

(Add Figma links or images in `/docs/assets/`.)

## 8. Motion
Subtle only: 150–250 ms ease-out; respect `prefers-reduced-motion`.

## 9. Accessibility Checklist
- [ ] Semantic HTML landmarks
- [ ] Alt text on images
- [ ] Visible focus styles
- [ ] Full keyboard navigation
- [ ] Colour is never the only signal
