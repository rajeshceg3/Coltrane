## 2024-03-24 - Tactical Telemetry Implementation
**Learning:**
Implementing real-time spatial analysis (telemetry) directly in the state manager (`TacticalSystem`) allows for immediate feedback without client-side calculation overhead or complex database queries. The centroid calculation and "Force Posture" heuristic provide high-value strategic insight with minimal computational cost.

**Action:**
Added `telemetry` getter to `TacticalSystem` in `src/tactical.js`. This calculates the geometric centroid of all assets and their average dispersion. The frontend was updated to visualize this data, drawing a centroid marker on the map and displaying a "Force Posture" rating (CONCENTRATED vs DISPERSED). This transforms the application from a simple list to a situational awareness tool.
