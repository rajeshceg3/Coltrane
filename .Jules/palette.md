## 2026-01-05 - Utility Framework Extension
**Learning:** The existing `utils.css` was minimal and lacked layout primitives required for the new feature (e.g., `relative`, `absolute`).
**Action:** Extended `utils.css` with standard utility classes (`relative`, `absolute`, `border`, `w-2`, `h-2`, etc.) instead of creating a new stylesheet, adhering to the project's constraint of using the utility framework.

## 2026-01-05 - Frontend Verification Strategy
**Learning:** Verification of dynamic UI updates (like the map) requires waiting for polling intervals or manually triggered events.
**Action:** Used `page.wait_for_timeout` in the verification script to account for the 2-second polling interval in `index.html`.

## 2026-01-05 - Asset Visualization
**Learning:** Percentage-based positioning (`left: X%`) can cause elements to clip at the edges (100%).
**Action:** Implemented `calc(X% - 4px)` positioning to center the 8px (`w-2 h-2`) dots and ensure they remain fully visible within the container.
