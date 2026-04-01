# Design System Specification: The Architectural Minimalist

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Estate."** 

In the world of B2B property management, software shouldn't feel like a spreadsheet; it should feel like the buildings it manages—structured, premium, and built to last. We are moving away from the "SaaS-template" look by embracing **Editorial Spatiality**. 

This system breaks the grid through intentional asymmetry and tonal depth. We use large, confident typography scales juxtaposed with expansive white space to create a sense of "quiet luxury." By layering surfaces instead of drawing lines, we mimic the physical experience of architectural blueprints and high-end interior design.

---

## 2. Colors: Tonal Depth vs. Structural Lines
Our palette is rooted in a sophisticated "Slate and Spruce" philosophy. We lead with soft neutrals and use a deep, muted primary tone to ground the experience.

### The Palette (Material Design Mapping)
*   **Primary (The Spruce):** `#545f73` (Primary) & `#485367` (Primary Dim). Use this for authoritative actions and brand moments.
*   **Surface Neutrals:** `#f7f9fb` (Surface), `#e8eff3` (Surface Container), `#ffffff` (Surface Container Lowest).
*   **Status Tones (The Muted Spectrum):**
    *   *Paid/Occupied:* Tertiary (`#2c6a55`) – A sophisticated forest green.
    *   *Pending/Vacant:* Secondary (`#506076`) – A muted, trustworthy blue-grey.
    *   *Overdue:* Error (`#9f403d`) – A desaturated brick red, never neon.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Boundaries must be defined solely through background color shifts.
*   *Implementation:* A property list (`surface-container-low`) should sit on the main background (`surface`) without a stroke. Use the `0.5rem` (8px) or `0.75rem` (12px) radius to define the shape, let the color transition do the work.

### Signature Textures & Glassmorphism
To add "soul," use a subtle linear gradient on primary CTAs: `linear-gradient(135deg, #545f73 0%, #485367 100%)`. For floating navigation or modal overlays, use **Glassmorphism**:
*   **Background:** `surface-container-lowest` at 80% opacity.
*   **Effect:** `backdrop-filter: blur(12px)`.
*   **Result:** A frosted glass effect that feels integrated into the architectural environment.

---

## 3. Typography: The Editorial Hierarchy
We utilize a dual-font pairing to balance character with utility. **Manrope** provides a geometric, modern strength for high-level data, while **Inter** ensures relentless legibility for property details.

*   **Display & Headlines (Manrope):** Use `display-lg` (3.5rem) and `headline-md` (1.75rem) for property names or total portfolio values. The tighter tracking of Manrope conveys professional authority.
*   **Titles & Body (Inter):** Use `title-md` (1.125rem) for card headers and `body-md` (0.875rem) for general interface text.
*   **The Power of Contrast:** High-end design lives in the gap. Pair a `display-sm` headline with `label-sm` metadata immediately below it to create an "Editorial Stack."

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often a crutch for poor spatial planning. In this system, depth is achieved through **Tonal Layering**.

*   **The Layering Principle:** 
    *   Level 0 (Base): `surface` (`#f7f9fb`)
    *   Level 1 (Sections): `surface-container-low` (`#f0f4f7`)
    *   Level 2 (Cards): `surface-container-lowest` (`#ffffff`)
*   **Ambient Shadows:** When a card must "float" (e.g., a dragged tenant file), use an extra-diffused shadow: `box-shadow: 0 12px 32px -4px rgba(42, 52, 57, 0.06)`. Note the color is a tint of our `on-surface` token, not pure black.
*   **The Ghost Border Fallback:** If accessibility requires a container edge, use the `outline-variant` (`#a9b4b9`) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Refined Utility

### Buttons & Actions
*   **Primary:** Solid `primary` with `on-primary` text. No border. `md` (0.75rem) roundedness.
*   **Secondary:** `primary-container` background with `on-primary-container` text.
*   **Tertiary (The Ghost):** No background. Text in `primary`. Use for low-emphasis actions like "Cancel" or "View All."

### Property Cards & Tables
*   **Forbid Dividers:** Do not use lines between table rows. Use a `1rem` (16px) vertical gap and a subtle hover state using `surface-container-high`.
*   **Card Layout:** Group related data (e.g., Rent Amount + Due Date) into clusters using `surface-container` nesting inside a `surface-container-lowest` card.

### Status Chips
*   **Style:** Small, `full` (pill) roundedness. 
*   **Coloration:** Use the "Muted Container" approach. For a "Paid" status, use `tertiary-container` background with `on-tertiary-container` text. This ensures high legibility without the jarring "traffic light" effect.

### Input Fields
*   **State:** Neutral background `surface-container-highest` with no border. 
*   **Focus:** A `2px` solid `primary` border is the only time a high-contrast line is permitted, signaling active intent.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins. For example, a property image can bleed to the left edge of a card while text is inset by `2rem` (spacing scale 8).
*   **Do** prioritize "Breathing Room." If you think a section needs more space, use the next level up on the Spacing Scale.
*   **Do** use `surface-bright` for hover states on neutral interactive elements.

### Don't:
*   **Don't** use pure black (`#000000`) for text. Use `on-surface` (`#2a3439`) for better tonal harmony.
*   **Don't** use 1px dividers to separate list items. Use white space or a subtle background shift.
*   **Don't** use standard "Blue" for links. Use the `primary` spruce tone to maintain the "Architectural" feel.
*   **Don't** use sharp 90-degree corners. Everything must feel approachable through the `DEFAULT` (8px) to `lg` (16px) roundedness scale.