# Greece · Nov 11–16, 2026

A mobile-first itinerary for six days in Greece: Athens → Delphi → Meteora → Thermopylae → Athens.

- The main screen is a map of the day's route, with numbered stops and arrows showing the direction of travel. Tap a stop for a Google Maps preview and an **Open in Maps** button.
- The bottom tab expands into the day's schedule, grouped by location with time ranges and time spent. Stops on the map and in the list highlight together.
- The arrows on the tab (or the dots up top) change the day.

Plain HTML, CSS and JavaScript — no build step. The whole itinerary lives in `data.js`; `routes.js` holds the road geometry (OpenStreetMap, via OSRM). Map tiles © OpenStreetMap contributors.

To preview locally, serve the folder (for example `python -m http.server`) and open it in a browser.
