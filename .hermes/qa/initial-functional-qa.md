# Initial functional QA — QR generator overflow

Date: 2026-05-08
Scope: `/tools/qr-barcode-generator` production-mode local smoke test at `http://127.0.0.1:3056`.

## Finding 1 — QR preview SVG overflowed its result container

- Severity: High
- Category: Functional / Visual regression
- URL: `http://127.0.0.1:3056/tools/qr-barcode-generator`
- Steps to reproduce:
  1. Open `/tools/qr-barcode-generator`.
  2. Keep default QR URL value `https://oh-my-zhs.com`.
  3. Keep default QR size `768`.
  4. Click `QR 생성`.
- Expected:
  - Generated QR preview remains inside the result card and is fully visible at preview size.
  - Downloaded SVG/PNG may remain high resolution, but on-page preview should be constrained.
- Actual before fix:
  - Generated inline SVG retained `width="768" height="768"` intrinsic dimensions and ignored the parent `max-w-[260px]`, causing the QR output to render/clamp as an oversized graphic.
- Evidence:
  - Screenshot before fix: `/Users/gabriel.k/Documents/Workspace/hermes/hermes-setup/home/cache/screenshots/browser_screenshot_41b0558fd9414b188162b8d3974d8ce7.png`
  - DOM inspection showed large SVG bounding boxes from unconstrained inline SVG output.
- Root cause:
  - The wrapper constrained only the parent width. The injected QR SVG itself had fixed width/height attributes and no CSS rule forcing nested SVG sizing.
- Fix applied:
  - Added Tailwind arbitrary descendant rules to constrain injected SVG: `[_svg]:w-full`, `[_svg]:max-w-full`, `[_svg]:h-auto`, `[_svg]:max-h-[260px]`.
  - Added explicit responsive sizing to the PNG preview as well.
- Suggested regression check:
  - Generate default QR and assert generated QR SVG/client preview bounding box width and height are <= 260px.
  - Generate QR at max size and verify preview remains contained while download remains available.

## Continuous QA/QC routine created

- QA scout cron: `b3b0ca32b86a`, every 6 hours at minute 0.
- Dev fixer cron: `3c5139c5be40`, every 6 hours at minute 30, consumes latest QA context.

## Verification after fix

- `npm run lint` passed.
- `npx tsc --noEmit --pretty false` passed.
- `npm run build` passed.
- `curl -I http://127.0.0.1:3056/tools/qr-barcode-generator` returned HTTP 200.
