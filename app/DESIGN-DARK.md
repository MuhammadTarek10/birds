---
name: Birds
colors:
  surface: '#121412'
  surface-dim: '#121412'
  surface-bright: '#383938'
  surface-container-lowest: '#0d0f0d'
  surface-container-low: '#1a1c1a'
  surface-container: '#1f201e'
  surface-container-high: '#292a29'
  surface-container-highest: '#343533'
  on-surface: '#e3e2e0'
  on-surface-variant: '#d2c3c0'
  inverse-surface: '#e3e2e0'
  inverse-on-surface: '#2f312f'
  outline: '#9b8e8b'
  outline-variant: '#4f4542'
  surface-tint: '#d8c2bc'
  primary: '#ffffff'
  on-primary: '#3b2d2a'
  primary-container: '#f4ded8'
  on-primary-container: '#72615c'
  inverse-primary: '#6b5b56'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#ffffff'
  on-tertiary: '#4a2627'
  tertiary-container: '#ffdad9'
  on-tertiary-container: '#855959'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f4ded8'
  primary-fixed-dim: '#d8c2bc'
  on-primary-fixed: '#251915'
  on-primary-fixed-variant: '#53433f'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdad9'
  tertiary-fixed-dim: '#f1b9b8'
  on-tertiary-fixed: '#311213'
  on-tertiary-fixed-variant: '#643c3c'
  background: '#121412'
  on-background: '#e3e2e0'
  surface-variant: '#343533'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: EB Garamond
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: EB Garamond
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 32px
  gutter: 24px
  section-gap: 64px
  stack-sm: 12px
  stack-md: 24px
---

## Brand & Style

This design system is built upon the concept of a "Memory Vault"—a private, digital sanctuary for couples to preserve their history and nurture their future. The brand personality is **Intimate, Sophisticated, and Timeless**. It rejects the cold, rapid-fire nature of social media in favor of a slow, intentional pace that honors the sanctity of a partnership.

The design style is **Romantic Minimalism** with a **Tactile** influence. In this dark mode expression, the interface shifts from a "stationery set" to a "private midnight gallery." It utilizes high-fidelity textures, soft-focus imagery, and graceful motion to evoke the feeling of a physical keepsake box viewed by candlelight. The UI is intentionally breathable, prioritizing emotional resonance over information density.

**Target Audience:** Couples seeking a private, elevated space to document their relationship journey.
**Emotional Response:** Warmth, security, cherished nostalgia, and exclusivity.

## Colors

The palette transition to dark mode emphasizes **Nocturnal Intimacy**, where deep, dark neutrals provide a canvas for glowing blushes and metallic accents.

- **Primary (Blush):** In dark mode, this functions as a soft glow. It is used for primary actions, active states, and subtle illumination of containers.
- **Secondary (Gold):** Reserved for high-value accents and iconic flourishes. Against the dark background, it achieves a jewel-like quality.
- **Tertiary (Dusty Rose/Mauve):** Used for supportive accents and semantic differentiation. It provides a deeper, sophisticated tonal counterpoint to the primary blush.
- **Neutral (Alabaster):** This light neutral is now used primarily for high-readability text (on-surface) and delicate strokes, acting like fine ink on a dark parchment.

## Typography

The typography strategy balances the expressive nature of a romantic script with the classic authority of a high-end serif, optimized for light-on-dark readability.

- **Headlines:** Use _Playfair Display_. It carries an editorial, fashion-forward weight that feels both modern and historic. The high contrast of the letterforms is particularly striking in white or gold against dark backgrounds.
- **Body:** Use _EB Garamond_. This is a world-class reading serif that ensures long-form stories and private letters are comfortable to read.
- **Labels:** Use _Source Sans 3_ in uppercase with wide letter spacing. This provides a clean, functional counterpoint to the ornate serifs, ensuring that navigation and metadata remain clear without clashing with the romantic aesthetic.

## Layout & Spacing

This design system employs a **Fixed Centered Grid** for desktop and a **Generous Safe-Area Layout** for mobile.

- **Whitespace as Luxury:** Even in dark mode, negative space is used aggressively to separate content "moments." Dark space creates a sense of focus and privacy.
- **The "Letter" Model:** Layouts should mimic the composition of a physical letter or an art gallery wall. Elements are often centered or staggered to create a rhythmic, non-linear flow.
- **Breakpoints:**
  - **Mobile (<600px):** Single column, 32px side margins to create a "framed" effect.
  - **Tablet (600px - 1024px):** 8-column grid, centered content.
  - **Desktop (>1024px):** 12-column grid, max-width of 1140px.

## Elevation & Depth

In dark mode, depth is conveyed through **Tonal Layering** and **Subtle Inner Glows** rather than traditional drop shadows.

- **Surfaces:** Use subtle shifts in the dark neutral spectrum to define hierarchy. Backgrounds are the darkest, while cards or modals use a slightly lighter container color to appear closer to the user.
- **Glassmorphism:** Use "Midnight Frosted" blurs for overlays and navigation bars. The backdrop filter should be strong (20px+) with a 40% translucent dark-neutral fill.
- **Delicate Borders:** Instead of dark strokes, use 1px borders in a metallic Gold hex at 20% opacity to "frame" content without boxing it in.

## Shapes

The shape language is organic and soft, avoiding harsh 90-degree angles to maintain the romantic, approachable feel.

- **Cards & Containers:** Use `rounded-lg` (1rem) as the standard. This feels substantial yet approachable.
- **Interactive Elements:** Buttons and input fields should utilize `rounded-xl` or full pill-shapes to invite touch and feel "squishy" and friendly.
- **Masking:** Use archival shapes—such as ovals or soft-arched tops—for featured imagery to enhance the "scrapbook" or "vault" feeling.

## Components

- **Buttons:** Primary buttons use a solid Gold-to-Blush gradient with dark text for high contrast. Secondary buttons are "Ghost" style with a delicate gold border and Playfair Display medium-weight text.
- **Cards:** Cards should have no visible outer shadow; instead, use a slightly lightened surface color and a subtle Blush top-border glow to appear as if they are resting on a plush surface.
- **Input Fields:** Use "Floating Label" inputs where the line is a subtle gold stroke. The focus state should involve a soft blush glow (bloom).
- **The "Vault" Item:** A unique component for this system. It is a media container that uses a thin metallic frame and a subtle "grain" overlay to make digital photos feel like physical prints.
- **Chips/Labels:** Small, pill-shaped tags in a semi-transparent Blush with Source Sans 3 uppercase text.
- **Navigation:** A bottom navigation bar on mobile using high-blur glassmorphism, ensuring the couple's shared background remains visible beneath the controls.
