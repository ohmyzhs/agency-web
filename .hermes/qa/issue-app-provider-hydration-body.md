## Summary
Client interactivity never hydrates because `AppProvider` renders a server-compatible fallback shell but `useSyncExternalStore` reports `mounted=true` on the first client snapshot. React treats the first client render as a hydration mismatch against the fallback shell, so the provider context is never attached and client-only islands remain stuck in loading/static states.

This manifests in QA as Word Defense staying on `게임 로드 중…`; it also explains QR Generator clicks producing no output even though the server-rendered form is visible.

## Tested URLs
- `http://127.0.0.1:3000/typing/game/word-defense`
- `http://127.0.0.1:3000/tools/qr-barcode-generator`

## Steps to reproduce
1. Start the site locally and open `http://127.0.0.1:3000/typing/game/word-defense`.
2. Wait at least 3 seconds after navigation.
3. Inspect the game panel below the `워드 디펜스` heading.
4. Also open `http://127.0.0.1:3000/tools/qr-barcode-generator` and click **Generate QR**.

## Expected behavior
- Word Defense should finish loading and show its start/control UI.
- QR Generator should render a visible QR preview and download controls after Generate QR.

## Actual behavior
- Word Defense remains on `게임 로드 중…` with no playable UI.
- QR Generator button clicks do not produce a visible result.
- DOM inspection showed React event props were not attached to ordinary buttons, confirming a hydration/interactivity failure rather than isolated tool logic.

## QA evidence
- QA report: `.hermes/qa/2026-05-10-0001-qa-report.md`
- Word Defense issue body from QA: `.hermes/qa/issue-word-defense-stuck-body.md`
- Existing related QR issue: #12

## Root cause hypothesis
`getMountedClient` returned `true`, while `getMountedServer` returned `false`. The provider gates real context behind `mounted`, so the initial browser render does not match the server fallback. Make the initial client snapshot false, then flip `mounted` to true in an effect after hydration.
