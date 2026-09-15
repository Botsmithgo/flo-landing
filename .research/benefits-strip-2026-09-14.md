# Homepage reassurance strip — September 14, 2026

User supplied a homepage screenshot with a blank cream area below the studio hero and a reference showing a single rounded white strip divided into icon-and-text cards. Implement that pattern as three equal cards, not a new hero design.

Copy: 60-day money-back guarantee (user requested, existing site offer); Free U.S. shipping / On orders over $49 (preserves current published threshold); Installs in minutes / No tools. No plumber. (existing installation instructions).

Design: existing FLO fonts, cream background, navy text, muted gold line icons, pale dividers, subtle shadow. Three columns on desktop and tablet, stacked list on small phones. Static server component with no entrance animation or added client dependencies. Reduce the next section's excessive top padding for a cohesive transition. Existing hero/buttons and payment behavior stay as implemented.

Sources: user-provided screenshots dated September 14, 2026; current HomeHero and ShowerFAQ source; existing brand tokens; ui-ux-pro-max guidance in benefits-strip-design.md. Small scoped update reuses the established design system; no new competitor research needed.

ICP check: at 3 seconds buyers see the product; on the next glance they see return protection, a clearly qualified shipping offer, and low-effort installation. No unverified rating, certification, or numerical filtration claim is added.

Verification: clean production build and focused ESLint. Browser checked at actual CSS widths 375, 767 (tablet target 768 rounded by zoom), 1024 and 1440: document width equals viewport, all three cards fit, no card overflow. Desktop row height ~112px; tablet row ~141px where copy wraps; mobile cards ~94px each. Desktop and mobile visually reviewed. Original hero, shared buttons, navigation and checkout untouched. Existing email activation task remains pending.

Deployed commit 4b9c68e at 12:45 PM Pacific, September 14. Vercel deployment https://flo-landing-mvzuxjdeh-botsmithgos-projects.vercel.app Ready. Live www.feelslikeom.shop card copy and layout visually verified. Lighthouse homepage accessibility: 100. Rollback: revert 4b9c68e and push.
