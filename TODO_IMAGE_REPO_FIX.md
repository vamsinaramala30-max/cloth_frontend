# TODO: image repo stability fixes

## Completed
- SafeImage fallback updated to `/images/vk/placeholder.png`
- Added `frontend/public/images/vk/placeholder.png`

## Next
- Fix ESLint config so `npm run lint` passes
- Scan repo for remaining image issues (unsplash/external URLs, broken placeholder references, raw <img>, next/image misuse)
- Ensure every dynamic image field uses SafeImage fallback
- Re-run: `npm run lint` and `npm run build`
