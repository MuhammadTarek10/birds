---
name: Birds
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#4f4542'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#807471'
  outline-variant: '#d2c3c0'
  surface-tint: '#6b5b56'
  primary: '#6b5b56'
  on-primary: '#ffffff'
  primary-container: '#f8e1db'
  on-primary-container: '#74635e'
  inverse-primary: '#d8c2bc'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#7e5353'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffdedd'
  on-tertiary-container: '#875b5b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
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
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
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

The design style is **Romantic Minimalism** with a **Tactile** influence. It utilizes high-fidelity textures, soft-focus imagery, and graceful motion to evoke the feeling of a physical keepsake box or a high-end stationery set. The UI is intentionally breathable, prioritizing emotional resonance over information density.

**Target Audience:** Couples seeking a private, elevated space to document their relationship journey.
**Emotional Response:** Warmth, security, cherished nostalgia, and exclusivity.

## Colors

The palette is rooted in **Warm Blushes** and **Champagne Golds**, creating a sense of skin-tone warmth and luxury.

- **Primary (Blush):** Used for large surfaces, background tints, and soft call-to-actions. It provides the "glow" of the interface.
- **Secondary (Gold):** Reserved for high-value accents, iconic flourishes, and interactive states. It should be used sparingly to maintain its premium feel.
- **Tertiary (Dusty Rose/Mauve):** Used for deep contrast in text or supportive icons where readability is paramount.
- **Neutral (Cream/Alabaster):** Replaces harsh whites to provide a softer, more organic canvas that feels like premium paper.

## Typography

The typography strategy balances the expressive nature of a romantic script with the classic authority of a high-end serif.

- **Headlines:** Use _Playfair Display_. It carries an editorial, fashion-forward weight that feels both modern and historic. Use the Italic variant for pull-quotes or intimate sub-headers.
- **Body:** Use _EB Garamond_. This is a world-class reading serif that ensures long-form stories and private letters are comfortable to read.
- **Labels:** Use _Source Sans 3_ in uppercase with wide letter spacing. This provides a clean, functional counterpoint to the ornate serifs, ensuring that navigation and metadata remain clear without clashing with the romantic aesthetic.

## Layout & Spacing

This design system employs a **Fixed Centered Grid** for desktop and a **Generous Safe-Area Layout** for mobile.

- **Whitespace as Luxury:** Spacing is used aggressively to separate content "moments." Avoid cluttering the screen with multiple actions; prioritize one primary thought per view.
- **The "Letter" Model:** Layouts should mimic the composition of a physical letter or an art gallery wall. Elements are often centered or staggered to create a rhythmic, non-linear flow.
- **Breakpoints:**
  - **Mobile (<600px):** Single column, 32px side margins to create a "framed" effect.
  - **Tablet (600px - 1024px):** 8-column grid, centered content.
  - **Desktop (>1024px):** 12-column grid, max-width of 1140px.

## Elevation & Depth

Depth is conveyed through **Soft Ambient Shadows** and **Tonal Layering** rather than heavy shadows or sharp outlines.

- **Surfaces:** Use subtle shifts in cream and blush tints to define hierarchy. Backgrounds are the lightest, while cards or modals use a pure white surface with a very soft, diffused shadow (15% opacity of the Tertiary color).
- **Glassmorphism:** Use "Frosted Champagne" blurs for overlays and navigation bars. The backdrop filter should be strong (20px+) with a 40% translucent cream fill.
- **Delicate Borders:** Instead of dark strokes, use 1px borders in a metallic Gold hex at 30% opacity to "frame" content without boxing it in.

## Shapes

The shape language is organic and soft, avoiding harsh 90-degree angles.

- **Cards & Containers:** Use `rounded-lg` (1rem) as the standard. This feels substantial yet approachable.
- **Interactive Elements:** Buttons and input fields should utilize `rounded-xl` or full pill-shapes to invite touch and feel "squishy" and friendly.
- **Masking:** Use archival shapes—such as ovals or soft-arched tops—for featured imagery to enhance the "scrapbook" or "vault" feeling.

## Components

- **Buttons:** Primary buttons use a solid Gold-to-Champagne gradient with white text. Secondary buttons are "Ghost" style with a delicate gold border and Playfair Display medium-weight text.
- **Cards:** Cards should have no visible border; instead, use a soft outer glow and a slight vertical offset to appear as if they are resting on a plush surface.
- **Input Fields:** Use "Floating Label" inputs where the line is a subtle gold stroke. The focus state should involve a soft blush glow.
- **The "Vault" Item:** A unique component for this system. It is a media container that uses a thin metallic frame and a subtle "grain" overlay to make digital photos feel like physical prints.
- **Chips/Labels:** Small, pill-shaped tags in a semi-transparent Blush with Source Sans 3 uppercase text.
- **Navigation:** A bottom navigation bar on mobile using high-blur glassmorphism, ensuring the couple's shared background remains visible beneath the controls.
