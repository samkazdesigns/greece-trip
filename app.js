(() => {
  const $ = (id) => document.getElementById(id);
  const sheet = $("sheet"), head = $("sheetHead"), list = $("list"), card = $("card");

  /* ── icons ────────────────────────────────────────── */
  const ICONS = {
    flight: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    car: '<path d="M3 17v-4.5l2.2-5.2A2 2 0 0 1 7 6h10a2 2 0 0 1 1.8 1.3L21 12.5V17H3z"/><path d="M5.5 17v2M18.5 17v2M3.5 12.5h17"/><circle cx="7.5" cy="14.7" r=".6"/><circle cx="16.5" cy="14.7" r=".6"/>',
    stay: '<path d="M3 19V6M3 16h18M21 19v-6a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="12" r="2"/>',
    food: '<path d="M5 3v5a2.5 2.5 0 0 0 5 0V3M7.5 3v18M17 21v-8M17 13c-2 0-3-2-3-5s1.300-5 3-5v10z"/>',
    sight: '<path d="M3 9.5 12 4l9 5.5H3zM5.5 9.5V18M10 9.5V18M14 9.5V18M18.5 9.5V18M3 20.5h18"/>',
    view: '<path d="M2.5 19.5 9 8l4.5 7 2.5-3.5 5.5 8h-19z"/><circle cx="17.5" cy="6" r="2"/>',
    walk: '<circle cx="13" cy="4.5" r="1.800"/><path d="M9.5 21l2-6-2.5-2.5L10.5 8l3.5 1 2 3 3 1M10.5 8 7 9.5 6 13M13.5 14.5 15.5 21"/>',
    metro: '<rect x="5.5" y="3.5" width="13" height="13" rx="3"/><path d="M5.5 11h13M9 20l-2 1.5M15 20l2 1.5M8.5 16.500 7.500 20M15.5 16.500l1 3.500"/><circle cx="9" cy="13.700" r=".6"/><circle cx="15" cy="13.700" r=".6"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 7.800v.2"/>',
  };
  const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.500-5.600-6.500-10.500a6.500 6.500 0 0 1 13 0C18.500 15.400 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.200"/></svg>';
  const icon = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ICONS.info}</svg>`;
  const mapsUrl = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  const embedUrl = (q) => "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&z=15&output=embed";
  const mapsLink = (q, text, cls = "maps") =>
    `<a class="${cls}" href="${mapsUrl(q)}" target="_blank" rel="noopener">${PIN}${text}</a>`;

  /* ── time: stored 24h, always shown as 12-hour ────── */
  const mins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const f12 = (t, mer = true) => {
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")}${mer ? (h >= 12 ? " PM" : " AM") : ""}`;
  };
  const durTxt = (m) => m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}`;
  function when(o) {
    if (!o.start) return o.dur || "";
    const a = o.approx ? "~" : "";
    if (o.end) {
      const same = (mins(o.start) < 720) === (mins(o.end) < 720);
      return `${a}${f12(o.start, !same)} – ${f12(o.end)} · ${durTxt(mins(o.end) - mins(o.start))}`;
    }
    if (o.open) return `${a}From ${f12(o.start)} · ${o.open}`;
    return a + f12(o.start);
  }

  /* ── state ────────────────────────────────────────── */
  let dayIdx = 0;
  let sel = null;          // index into `stops`
  let stops = [];          // [{n, place, key, data, marker}]
  let legs = [];           // [{pts:[LatLng], kind}]
  let peekPx = 92;

  /* ── map ──────────────────────────────────────────── */
  const map = L.map("map", { zoomControl: false, attributionControl: false, zoomSnap: 0.25 });
  L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  map.createPane("arrows").style.zIndex = 450;
  map.getPane("arrows").style.pointerEvents = "none";
  const routeLayer = L.layerGroup().addTo(map);
  const arrowLayer = L.layerGroup().addTo(map);
  const pinLayer = L.layerGroup().addTo(map);

  function decode(str) {               // Google encoded polyline, precision 5
    const out = []; let i = 0, lat = 0, lng = 0;
    while (i < str.length) {
      for (const which of [0, 1]) {
        let shift = 0, result = 0, b;
        do { b = str.charCodeAt(i++) - 63; result |= (b & 31) << shift; shift += 5; } while (b >= 32);
        const d = result & 1 ? ~(result >> 1) : result >> 1;
        if (which === 0) lat += d; else lng += d;
      }
      out.push([lat / 1e5, lng / 1e5]);
    }
    return out;
  }

  const LINE = {
    car:   { color: "#C56F4A", weight: 4 },
    walk:  { color: "#C56F4A", weight: 4, dashArray: "1 8" },
    metro: { color: "#6F7A55", weight: 4, dashArray: "9 8" },
  };

  function drawMap(d) {
    routeLayer.clearLayers(); pinLayer.clearLayers(); arrowLayer.clearLayers();
    stops = []; legs = [];
    let pendingLeg = null;
    d.timeline.forEach((t) => {
      if (t.leg) { pendingLeg = t; return; }
      const place = PLACES[t.stop];
      const s = { n: stops.length, key: t.stop, place, data: t, ll: L.latLng(place.ll) };
      const prev = stops[stops.length - 1];
      if (prev && prev.key !== s.key) {
        const kind = pendingLeg ? pendingLeg.leg : "walk";
        const enc = ROUTES[`${prev.key}>${s.key}`];
        const pts = [prev.ll, ...(enc ? decode(enc).map((p) => L.latLng(p)) : []), s.ll];
        legs.push({ pts, kind });
        L.polyline(pts, { color: "#FFFDF8", weight: 8, opacity: 0.95, interactive: false }).addTo(routeLayer);
        L.polyline(pts, { ...LINE[kind], lineCap: "round", lineJoin: "round", interactive: false }).addTo(routeLayer);
      }
      pendingLeg = null;
      stops.push(s);
    });

    // one pin per distinct place; a place visited twice shows both numbers
    const groups = new Map();
    stops.forEach((s) => { (groups.get(s.key) || groups.set(s.key, []).get(s.key)).push(s); });
    groups.forEach((g) => {
      const nums = g.map((s) => s.n + 1).join("·");
      const marker = L.marker(g[0].ll, {
        icon: L.divIcon({
          className: "pin-wrap", iconSize: [34, 34], iconAnchor: [17, 17],
          html: `<div class="pin${g.length > 1 ? " multi" : ""}"><span class="num">${nums}</span><span class="pin-label">${g[0].place.name}</span></div>`,
        }),
        keyboard: false, riseOnHover: true,
      }).addTo(pinLayer);
      marker.on("click", () => {
        // a place visited more than once cycles through its visits
        const at = g.findIndex((s) => s.n === sel);
        select(g[(at + 1) % g.length].n, "map", g.length > 1);
      });
      g.forEach((s) => (s.marker = marker));
    });
  }

  /* arrows along each leg, pointing the way you travel */
  function drawArrows() {
    arrowLayer.clearLayers();
    const z = map.getZoom();
    legs.forEach((leg) => {
      const px = leg.pts.map((p) => map.project(p, z));
      const cum = [0];
      for (let i = 1; i < px.length; i++) cum[i] = cum[i - 1] + px[i].distanceTo(px[i - 1]);
      const total = cum[cum.length - 1];
      if (total < 70) return;
      const at = (dist) => {
        let i = 1;
        while (i < cum.length - 1 && cum[i] < dist) i++;
        const seg = cum[i] - cum[i - 1] || 1, f = (dist - cum[i - 1]) / seg;
        return L.point(px[i - 1].x + (px[i].x - px[i - 1].x) * f, px[i - 1].y + (px[i].y - px[i - 1].y) * f);
      };
      const count = Math.max(1, Math.round(total / 130) - 1);
      for (let j = 1; j <= count; j++) {
        const dist = (total * j) / (count + 1);
        const a = at(Math.max(0, dist - 7)), b = at(Math.min(total, dist + 7));
        const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        L.marker(map.unproject(at(dist), z), {
          pane: "arrows", interactive: false, keyboard: false,
          icon: L.divIcon({
            className: "arrow-wrap", iconSize: [22, 22], iconAnchor: [11, 11],
            html: `<svg viewBox="0 0 22 22" style="transform:rotate(${deg.toFixed(1)}deg)" class="${leg.kind}"><path d="M5 4.500 17.500 11 5 17.500 8 11z"/></svg>`,
          }),
        }).addTo(arrowLayer);
      }
    });
  }

  /* hide name labels that would sit on top of another pin or label */
  function declutter() {
    const pins = [...document.querySelectorAll(".pin")];
    const placed = pins.map((p) => p.querySelector(".num").getBoundingClientRect());
    const hit = (a, b) => a.left < b.right + 4 && a.right + 4 > b.left && a.top < b.bottom + 2 && a.bottom + 2 > b.top;
    pins.sort((a, b) => b.classList.contains("on") - a.classList.contains("on"));
    const box = map.getContainer().getBoundingClientRect();
    pins.forEach((p) => {
      const label = p.querySelector(".pin-label");
      label.style.visibility = "";
      const cx = p.getBoundingClientRect().left + 17 - box.left;
      p.classList.toggle("flip", cx > box.width * 0.6);      // label goes on the left near the right edge
      const own = p.querySelector(".num").getBoundingClientRect();
      const r = label.getBoundingClientRect();
      if (placed.some((o) => o !== own && !(o.left === own.left && o.top === own.top) && hit(r, o))) label.style.visibility = "hidden";
      else placed.push(r);
    });
  }
  map.on("zoomend", () => { drawArrows(); declutter(); });
  map.on("moveend", declutter);

  const topCover = () => document.querySelector(".top").offsetHeight;
  const sheetVisible = () => (sheet.classList.contains("open") ? sheet.offsetHeight : peekPx);
  function bottomCover() {
    if (sheet.classList.contains("open")) return sheet.offsetHeight;
    return peekPx + (card.hidden ? 0 : card.offsetHeight + 20);
  }
  function fitDay(animate = true) {
    const b = L.latLngBounds(stops.map((s) => s.ll));
    legs.forEach((l) => b.extend(L.latLngBounds(l.pts)));
    map.fitBounds(b, {
      paddingTopLeft: [44, topCover() + 26], paddingBottomRight: [44, sheetVisible() + 30],
      maxZoom: 16, animate,
    });
  }
  function flyToStop(s, zoomIn) {
    const z = zoomIn ? Math.max(map.getZoom(), 15) : map.getZoom();
    const shift = (bottomCover() - topCover()) / 2;      // centre it in the uncovered part of the map
    const target = map.unproject(map.project(s.ll, z).add([0, shift]), z);
    map.flyTo(target, z, { duration: 0.9 });
  }

  /* ── which day to open on ─────────────────────────── */
  function initialDay() {
    const m = location.hash.match(/day-(\d)/);
    if (m && DAYS[m[1] - 1]) return m[1] - 1;
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: TRIP.tz }).format(new Date());
    const i = DAYS.findIndex((d) => d.date === today);
    return i >= 0 ? i : 0;
  }

  /* ── render ───────────────────────────────────────── */
  function render() {
    const d = DAYS[dayIdx];
    sel = null;
    card.hidden = true;
    $("dots").innerHTML = DAYS.map((x, i) =>
      `<button data-day="${i}" aria-label="Day ${i + 1}, ${x.label}" aria-current="${i === dayIdx}"></button>`).join("");
    $("sheetEyebrow").textContent = `Day ${dayIdx + 1} · ${d.label}`;
    $("sheetName").textContent = d.title;
    $("prev").disabled = dayIdx === 0;
    $("next").disabled = dayIdx === DAYS.length - 1;

    drawMap(d);

    let n = -1;
    list.innerHTML = d.timeline.map((t) => {
      if (t.leg) {
        return `<div class="legrow">
          <span class="leg-ico">${icon(t.leg)}</span>
          <div><h4>${t.title}</h4><div class="when">${when(t)}</div>${t.text ? `<p>${t.text}</p>` : ""}</div>
        </div>`;
      }
      n++;
      const p = PLACES[t.stop];
      return `<section class="stop" data-s="${n}">
        <header class="stop-head" role="button" tabindex="0">
          <span class="num">${n + 1}</span>
          <div><h3>${t.title || p.name}</h3><div class="when">${when(t)}</div></div>
          <span class="kind">${icon(t.k)}</span>
        </header>
        <div class="slot"></div>
        <ul class="sub">${(t.items || []).map((it) => `<li>
          <h4>${it.title}</h4><div class="when">${when(it)}</div>
          ${it.text ? `<p>${it.text}</p>` : ""}
          ${it.booked ? `<div class="chips"><span class="booked">${it.booked}</span></div>` : ""}
        </li>`).join("")}</ul>
      </section>`;
    }).join("") + stayCard(d) + (d.note ? `<div class="card note"><div class="eyebrow">Good to know</div><p>${d.note}</p></div>` : "");

    list.scrollTop = 0;
    history.replaceState(null, "", "#day-" + (dayIdx + 1));
    fitDay(false);
    drawArrows();
    declutter();
  }

  function stayCard(d) {
    if (!d.stay) return "";
    const h = HOTELS[d.stay.hotel];
    return `<div class="card">
      <div class="eyebrow">Tonight's stay · ${d.stay.night}</div>
      <h3>${h.name}</h3>
      <p>${h.address}</p><p>${h.room}</p><p>${h.times}</p><p>${h.paid}</p>
      <div class="chips"><span class="booked">Booked</span>${mapsLink(PLACES[h.place].q, "Open in Maps")}
        <a class="maps" href="tel:${h.phone.replace(/\s/g, "")}">${h.phone}</a></div>
    </div>`;
  }

  /* map preview + "Open in Maps", used in the floating card and inside the list */
  function previewHTML(s) {
    const q = s.place.q;
    return `<a class="preview" href="${mapsUrl(q)}" target="_blank" rel="noopener" aria-label="Open ${s.place.name} in Google Maps">
        <iframe src="${embedUrl(q)}" title="" loading="lazy" tabindex="-1" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </a>`;
  }

  /* ── selection: map pin <-> list section ──────────── */
  function select(n, from, forceOn) {
    sel = sel === n && !forceOn ? null : n;
    document.querySelectorAll(".stop.on, .pin.on").forEach((e) => e.classList.remove("on"));
    document.querySelectorAll(".stop .slot").forEach((e) => (e.innerHTML = ""));
    if (sel === null) { card.hidden = true; declutter(); return; }

    const s = stops[sel];
    const pin = s.marker.getElement().querySelector(".pin");
    pin.classList.add("on");
    s.marker.setZIndexOffset(1000);
    stops.forEach((o) => o.marker !== s.marker && o.marker.setZIndexOffset(0));
    const section = list.querySelector(`.stop[data-s="${sel}"]`);
    section.classList.add("on");
    section.querySelector(".slot").innerHTML =
      previewHTML(s) + `<div class="chips">${mapsLink(s.place.q, "Open in Maps", "maps solid")}</div>`;

    card.innerHTML = `
      <button class="close" aria-label="Close">×</button>
      ${previewHTML(s)}
      <div class="pc-body">
        <div><div class="when">${when(s.data)}</div><h3>${s.data.title || s.place.name}</h3></div>
        ${mapsLink(s.place.q, "Open in Maps", "maps solid")}
      </div>`;
    card.hidden = sheet.classList.contains("open");

    flyToStop(s, true);
    if (from !== "list") scrollListTo(sel);
    declutter();
  }
  function scrollListTo(n) {
    const el = list.querySelector(`.stop[data-s="${n}"]`);
    if (el) list.scrollTo({ top: el.offsetTop - list.offsetTop - 8, behavior: "smooth" });
  }

  list.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    const st = e.target.closest(".stop");
    if (st) select(+st.dataset.s, "list");
  });
  list.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".stop-head")) {
      e.preventDefault(); select(+e.target.parentNode.dataset.s, "list");
    }
  });
  card.addEventListener("click", (e) => { if (e.target.closest(".close")) select(sel); });
  map.on("click", () => { if (sel !== null) select(sel); });
  $("fit").addEventListener("click", () => fitDay());

  /* ── day navigation ───────────────────────────────── */
  function go(delta, abs) {
    const n = abs ?? dayIdx + delta;
    if (n < 0 || n >= DAYS.length || n === dayIdx) return;
    dayIdx = n;
    render();
  }
  $("prev").addEventListener("click", () => go(-1));
  $("next").addEventListener("click", () => go(1));
  $("dots").addEventListener("click", (e) => {
    const b = e.target.closest("[data-day]");
    if (b) go(0, +b.dataset.day);
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.closest(".leaflet-container")) return;
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  /* ── bottom sheet: tap to toggle, drag to move ────── */
  function measurePeek() {
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;height:var(--peek)";
    sheet.appendChild(probe); peekPx = probe.offsetHeight || 92; probe.remove();
  }
  function setOpen(open) {
    sheet.classList.toggle("open", open);
    $("sheetTitle").setAttribute("aria-expanded", open);
    card.hidden = open || sel === null;
    if (sel !== null) { flyToStop(stops[sel], false); if (open) scrollListTo(sel); }
    else fitDay();
  }
  let drag = null;
  head.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".arrow")) return;
    const closedY = sheet.offsetHeight - peekPx;
    drag = { y: e.clientY, base: sheet.classList.contains("open") ? 0 : closedY, closedY, moved: 0, id: e.pointerId };
    head.setPointerCapture(e.pointerId);
  });
  head.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dy = e.clientY - drag.y;
    drag.moved = Math.max(drag.moved, Math.abs(dy));
    if (drag.moved < 6) return;
    sheet.classList.add("dragging");
    drag.pos = Math.min(drag.closedY, Math.max(0, drag.base + dy));
    sheet.style.transform = `translateY(${drag.pos}px)`;
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    sheet.classList.remove("dragging");
    sheet.style.transform = "";
    if (d.moved < 6) return setOpen(!sheet.classList.contains("open"));   // a tap
    const dy = e.clientY - d.y;
    setOpen(Math.abs(dy) > 50 ? dy < 0 : d.pos < d.closedY / 2);
  };
  head.addEventListener("pointerup", endDrag);
  head.addEventListener("pointercancel", endDrag);
  // keyboard / screen-reader activation of the title (pointer taps are handled above)
  $("sheetTitle").addEventListener("click", (e) => { if (e.detail === 0) setOpen(!sheet.classList.contains("open")); });

  /* ── boot ─────────────────────────────────────────── */
  dayIdx = initialDay();
  measurePeek();
  render();
  addEventListener("resize", () => { measurePeek(); map.invalidateSize(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(declutter);
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
