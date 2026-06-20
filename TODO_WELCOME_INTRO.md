# TODO: Premium /welcome intro landing (RARE RAB IT)

## Step 1 — Analyze & design
- [x] Inspect current `/welcome` route (`frontend/src/app/welcome/page.tsx`) and component (`frontend/src/components/welcome/WelcomeLanding.tsx`).
- [x] Inspect global layout to ensure intro doesn’t break existing navbar/footer/particles/page transition.
- [ ] Confirm which parts of the existing WelcomeLanding should be replaced vs preserved.

## Step 2 — Implement cinematic intro component
- [ ] Update `WelcomeLanding.tsx`:
  - [ ] Animated futuristic city lights (GPU-friendly)
  - [ ] Aurora glow + glassmorphism overlays
  - [ ] Lazy-loaded luxury fashion video
  - [ ] Dynamic particles layer (lightweight)
  - [ ] Logo reveal sequence (darkness → gold neon glow → luxe reveal → burst)
  - [ ] Hero text + two CTA buttons
  - [ ] Features preview list (4 items)
  - [ ] Skip Intro button
  - [ ] Auto-redirect to homepage after 5 seconds
  - [ ] Cinematic transition into homepage (exit animation before navigation)
  - [ ] Framer Motion + GSAP choreography
  - [ ] Parallax scrolling within the intro
  - [ ] Performance: respects prefers-reduced-motion; transform/opacity only where possible

## Step 3 — Add sound effect toggle
- [ ] Add toggle UI
- [ ] Use short sound effect clip (lazy loaded)
- [ ] Respect user interaction policy (only play after toggle/click)

## Step 4 — Replace “repo DB to Supabase”
- [ ] Identify where repo/database currently feeds the welcome content (if any)
- [ ] If welcome uses local lists only, no DB migration needed.
- [ ] If welcome uses data fetched from an internal DB/repo, implement Supabase-backed fetch.

## Step 5 — Testing
- [ ] `cd frontend && npm run lint`
- [ ] `cd frontend && npm run build`
- [ ] Manual QA: /welcome intro flow + Lighthouse/perf checks

