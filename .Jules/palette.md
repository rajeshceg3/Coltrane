## 2024-05-23 - Security: XSS Mitigation
**Learning:**
Direct assignment of API data to `innerHTML` exposes the application to Stored XSS attacks, especially when displaying user-generated content like log messages or asset names.

**Action:**
Refactored `public/index.html` to use `document.createElement`, `textContent`, and `replaceChildren`. This ensures all dynamic content is treated as text, neutralizing any potential script injection.

## 2024-05-23 - Architecture: State Isolation
**Learning:**
Mixing administrative authentication tokens with public application state creates a high risk of credential leakage.

**Action:**
Implemented explicit property filtering in `TacticalSystem.updateStatus` to strip `auth` and `token` fields from update payloads before merging them into the state.
