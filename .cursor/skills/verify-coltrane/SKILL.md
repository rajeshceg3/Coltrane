# Verify Coltrane
Coltrane - node server app with tactical/telemetry APIs.
## Launch
`npm install`, then `npm start` (node src/server.js).
## Doctor
`python3 .cursor/skills/verify-coltrane/verify.py`
## Drive
Runs the node --test suites (app: 6 tests, predictive: 4 tests) then boots the real server on an ephemeral port and asserts /api/health reports operational.
## Evidence
`.cursor/skills/verify-coltrane/evidence.json`
## Cleanup
Server terminated after the smoke check.
## Known boundaries
API behavior beyond health and the unit suites is not exercised.
