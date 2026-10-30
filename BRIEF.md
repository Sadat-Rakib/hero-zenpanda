# ZenPanda Header

A full-viewport zen/mindfulness hero header for the "Zen Garden" brand featuring a WebGL (Three.js) full-bleed looping panda video background with a real-time interactive water-ripple shader that responds to cursor movement and clicks.

## Tech stack
- React (client component, "use client").
- three (Three.js) — WebGL renderer, OrthographicCamera, PlaneGeometry, ShaderMaterial, VideoTexture.
- Plain scoped CSS injected via a `<style>` tag (no CSS framework required). No animation libraries; all motion is CSS keyframes + a custom GLSL shader.

## Fonts & global styles
- Font: Parkinsans (Google Fonts), weights 300/400/500. Load via `<link href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@300;400;500&display=swap" rel="stylesheet" />` and preconnect to fonts.googleapis.com / fonts.gstatic.com (crossOrigin anonymous).
- Section font stack: `'Parkinsans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
- All styles are scoped under a `.zen-hero-root` class so nothing leaks globally. `box-sizing: border-box` applied to all descendants.

## Section container
- Root `<section id="zen-garden-hero" class="zen-hero-root">`: `position: relative; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #0c0d12; overflow: hidden`.
- Two stacked layers: Layer 1 the WebGL canvas mount (`position: absolute; inset: 0; z-index: 1; cursor: crosshair`), Layer 2 the UI overlay (`position: absolute; inset: 0; pointer-events: none; z-index: 10`). Individual overlay elements re-enable `pointer-events: auto`.

## Structure, section by section
1. WebGL background canvas — mounted into an absolutely positioned div (inset 0, full width/height, cursor crosshair). Renders the panda video with the ripple shader.
2. Logo (top-left) — inline SVG panda face inside `.logo-container` positioned `left: clamp(48px,5.2vw,110px); top: clamp(18px,2.8vh,40px); width: clamp(48px,3.8vw,68px); height: clamp(42px,3.2vw,56px)`. SVG viewBox 0 0 48 48, max 52x52. Panda colors: ears #111318 with inner #2d3139, white head fill #FFFFFF with #111318 stroke (strokeWidth 2.5), black eye patches #111318 (rotated ellipses), white sclera, black pupils with tiny white highlight, black nose ellipse, and a smiling mouth path `M21.5 33.5 Q24 35.5 26.5 33.5` stroke #111318. On click, smooth-scrolls window to top.
3. Mobile/tablet hamburger button (`.mobile-menu`) — hidden on desktop, shown at <=1024px, pure dark icon (#111318, strokeWidth 2.4), toggles between a 3-line menu and an X close icon. Positioned top-right.
4. Desktop top-center nav (`.desktop-nav`) — a centered row (`.desktop-nav-inner`, gap clamp(4px,0.4vw,8px)) of 5 pill buttons for `Home`, `Mindfulness`, `Nature`, `Journal`, `Community`. Each pill uses `.nav-item-white` (bg #111318, white text, border rgba(255,255,255,0.08), radius 8px, padding 5px 10px, font-size 15px/line-height 20px, weight 400), hover bg #262934 with border rgba(255,255,255,0.2). Each label uses a vertical text-slider that translates up 20px on hover (duplicated span stack, transition transform 0.4s cubic-bezier(0.76,0,0.24,1)).
5. Desktop CTA button (top-right, `.desktop-contact.nav-item-black`) — text "Get Started", black bg #000, border rgba(255,255,255,0.12), radius 8px, padding clamp(7px,0.9vh,12px) clamp(14px,1.2vw,24px), font-size clamp(15px,1.05vw,19px); hover bg #1f222d. Same slide-up text-slider micro-interaction.
6. Hero title (upper-left, `.hero-title`) — two lines: "Slower Living," then "Brighter Days." Positioned `top: clamp(110px,16vh,195px); left: clamp(48px,5.2vw,110px); width: clamp(520px,52vw,920px)`; font-size clamp(56px,4.44vw,72px), line-height clamp(66px,5.14vw,84px), weight 300, color #0c0d12, letter-spacing -0.02em. Each letter is its own inline-block `.title-char` span with a staggered blur-in animation.
7. Description block (bottom-right, `.hero-desc-wrapper`) — positioned `bottom: clamp(32px,5.8vh,76px); right: clamp(48px,5.2vw,110px); width: clamp(370px,33vw,560px)`, column layout gap clamp(14px,2.2vh,26px). Paragraph text verbatim: "A mindful space to reconnect with yourself. Discover simple habits, peaceful routines, and inspiration for a calmer, happier life." (`.hero-desc-text`: font-size clamp(16px,1.35vw,24px), line-height clamp(22px,1.75vw,32px), weight 500, color #FFFFFF). Below it an "Explore a Calmer Life" button (`.hero-btn-explore.nav-item-black`, radius 8px, padding clamp(10px,1.4vh,16px) clamp(14px,1.3vw,24px), font-size clamp(15px,1.15vw,20px)) with a 22px-tall text-slider variant.
8. Mobile/tablet dropdown drawer (`.mobile-drawer`, only when open) — positioned below hamburger, bg rgba(17,19,24,0.96), backdrop-filter blur(18px), border rgba(255,255,255,0.14), box-shadow 0 16px 36px rgba(0,0,0,0.45), radius 14px, padding 16px, column gap 10px, z-index 50. Lists the 5 nav items (each with a right chevron polyline `9 18 15 12 9 6` at opacity 0.5) and a final centered black "Get Started" item. Any item click closes the drawer.

## Assets — every URL
- Panda background video: `https://cdn.jiro.build/Jahid/Test/Panda%20catching%20fish%20on%20boat.mp4` (created via `document.createElement('video')`, crossOrigin anonymous, muted, loop, playsInline, autoplay, with webkit-playsinline). Multiple play() retries on loadedmetadata, canplay, and first pointerdown/touchstart to defeat autoplay blocking.
- Logo panda: inline SVG (no external asset).

## Animations
- Entrance reveal: `.reveal` uses `@keyframes revealUp` (opacity 0 -> 1, translateY 40px -> 0) over 1s cubic-bezier(0.2,0.8,0.2,1) forwards. Staggered with `.delay-1` (0.2s), `.delay-2` (0.4s), `.delay-3` (0.6s).
- Title letter-by-letter blur-in via `@keyframes charBlurFadeIn`:
```css
@keyframes charBlurFadeIn {
  0%   { opacity: 0; filter: blur(12px); transform: translateY(14px) scale(0.96); }
  60%  { filter: blur(2px); }
  100% { opacity: 1; filter: blur(0px); transform: translateY(0) scale(1); }
}
```
Each `.title-char` runs it 0.85s cubic-bezier(0.25,1,0.5,1) forwards; per-char delay = 0.35 + index*0.045 seconds (applied inline).
- Panda logo idle life: pupils wander (`pandaPupilGaze` 7s), eyes blink (`pandaBlink` 4.5s, scaleY 1 -> 0.08), ears wiggle (`pandaEarWiggle` 8s, rotate +/-3deg) — all ease-in-out infinite.
- Nav/CTA hover text-slider: inner span stack translates up 20px (22px for the large variant) with transition 0.4s cubic-bezier(0.76,0,0.24,1).
- Interactive water ripple (the signature effect): a Three.js OrthographicCamera + subdivided PlaneGeometry (128x128) rendered with a custom ShaderMaterial. A trail of 16 Vector3 points stores ripple origins (x, y, age). Pointer movement (>0.006 normalized distance) stamps new ripple points; click stamps two staggered points for a bigger splash. Ages advance 0.007 per frame; hover state lerps toward target at 0.04. The fragment shader restricts ripples to the water region (`smoothstep(0.38,0.31, coverUv.y)`), computes expanding concentric sine wave rings and distorts the cover-fit UVs of the video texture. Core fragment logic:
```glsl
float waterMask = smoothstep(0.38, 0.31, originalCoverUv.y);
float waveRadius = age * 0.28;
float ringDist = abs(dist - waveRadius);
float ringThickness = 0.052 + age * 0.088;
float ringEnvelope = smoothstep(ringThickness, 0.0, ringDist);
float wave = sin((dist - waveRadius) * 38.0);
float ageFade = smoothstep(0.98, 0.08, age) * smoothstep(0.0, 0.03, age);
totalDistortion += (dir / dist) * wave * ringEnvelope * ageFade * 0.024;
```
The video texture is fit with a cover-UV helper so it fills any aspect ratio without stretching. Renderer uses pixelRatio min(devicePixelRatio, 2), alpha + antialias true.

## Responsive behavior
- Desktop (>1024px): logo top-left, centered nav row, top-right CTA, hero title upper-left, description bottom-right; all sizes fluid via clamp().
- Tablet (769px-1024px): desktop nav and CTA hidden; hamburger shown (right 36px, top 28px); logo left/top 36px/28px; drawer left/right 36px, top 86px; hero title left 36px, top 180px, width calc(100% - 72px), font 50px/line 60px; desc wrapper right 36px, bottom 45px, width 480px.
- Mobile (<=768px): desktop nav/CTA hidden; hamburger right/top 20px; logo left/top 20px; drawer left/right 16px, top 74px; hero title left/top 20px/88px, width calc(100% - 40px), font 36px/line 46px; desc wrapper left/right 20px, bottom 24px, width auto, gap 14px; desc text 15px/line 21px; explore button padding 8px 14px, font 14px, radius 7px, slider height 18px.

## Key design principles
- Calm, editorial layout: dark near-black bg (#0c0d12) with a living video and soft interactive water surface.
- Fluid clamp()-based sizing keeps every element proportional across viewports.
- Micro-interactions (text sliders, blur-in title, blinking panda) add life without clutter.
- Fully self-contained and portable: scoped CSS, inline SVG, dynamically created video.
- Ripples are constrained to the water band so the boat/panda/sky stay crisp.

## Common mistakes to avoid
- Do not use styled-jsx or template literals for the shader/CSS; build GLSL and CSS as plain strings.
- Keep the video muted + playsInline + autoplay and add the pointerdown/touchstart fallback play() or it will be blocked on mobile.
- Always dispose geometry, material, texture, and renderer and remove all listeners on unmount to avoid WebGL context leaks.
- Keep ripple region masked to `smoothstep(0.38,0.31,...)` so distortion doesn't bleed into the boat/sky.
- Null-check the mount ref before appending the renderer canvas.

## Page title
Zen Garden — Slower Living, Brighter Days.

## Integration (build-safety — do not skip)
- Add this section as a **new** component file with a unique name. Don't edit or overwrite any existing file except to add its import and render it.
- Render it **after** all existing sections; keep every previously built section exactly as-is — never replace or remove them.
- If no project exists, create a minimal React + Tailwind app; if one exists, use it as-is — don't re-scaffold or change the Tailwind/build config or version.
- Keep it self-contained: scope its fonts and any resets to this section; never set global `body`/`html`/`*` styles or a global font.
- Install only the libraries this section names.