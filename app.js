(() => {
  const $ = (id) => document.getElementById(id);
  const map = $("map"), hero = $("hero"), route = $("route"), spacer = $("spacer");
  const sheet = $("sheet"), head = $("sheetHead"), list = $("list");
  const SVG = "http://www.w3.org/2000/svg";

  const ICONS = {
    flight: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    car: '<path d="M3 17v-4.5l2.2-5.2A2 2 0 0 1 7 6h10a2 2 0 0 1 1.8 1.3L21 12.500V17H3z"/><path d="M5.500 17v2M18.500 17v2M3.500 12.500h17"/><circle cx="7.500" cy="14.700" r=".6"/><circle cx="16.500" cy="14.700" r=".6"/>',
    stay: '<path d="M3 19V6M3 16h18M21 19v-6a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="12" r="2"/>',
    food: '<path d="M5 3v5a2.500 2.500 0 0 0 5 0V3M7.500 3v18M17 21v-8M17 13c-2 0-3-2-3-5s1.300-5 3-5v10z"/>',
    sight: '<path d="M3 9.500 12 4l9 5.500H3zM5.500 9.500V18M10 9.500V18M14 9.500V18M18.500 9.500V18M3 20.500h18"/>',
    view: '<path d="M2.500 19.500 9 8l4.500 7 2.500-3.500 5.500 8h-19z"/><circle cx="17.500" cy="6" r="2"/>',
    walk: '<circle cx="13" cy="4.500" r="1.800"/><path d="M9.500 21l2-6-2.500-2.500L10.500 8l3.500 1 2 3 3 1M10.500 8 7 9.500 6 13M13.500 14.500 15.500 21"/>',
    info: '<circle cx="12" cy="12" r="8.500"/><path d="M12 11v5M12 7.800v.2"/>',
  };
  const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.500-5.600-6.500-10.500a6.500 6.500 0 0 1 13 0C18.500 15.400 12 21 12 21z"/><circle cx="12" cy="10.500" r="2.200"/></svg>';
  const icon = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ICONS.info}</svg>`;
  const mapsUrl = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  const mapsLink = (q, text = "Maps") =>
    `<a class="maps" href="${mapsUrl(q)}" target="_blank" rel="noopener">${PIN}${text}</a>`;

  let dayIdx = 0;
  let selected = null;   // index into the current day's items
  let stops = [];        // [{i, item, node, label, legEl, leg, air}]

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
    selected = null;
    const eyebrow = `Day ${dayIdx + 1} · ${d.label}`;

    $("dots").innerHTML = DAYS.map((x, i) =>
      `<button data-day="${i}" aria-label="Day ${i + 1}, ${x.label}" aria-current="${i === dayIdx}"></button>`).join("");
    $("sheetEyebrow").textContent = eyebrow;
    $("sheetName").textContent = d.title;
    $("prev").disabled = dayIdx === 0;
    $("next").disabled = dayIdx === DAYS.length - 1;

    hero.innerHTML = `<div class="eyebrow">${eyebrow}</div><h1>${d.title}</h1><p>${d.blurb}</p>`;

    // map timeline
    route.innerHTML = "";
    const svg = document.createElementNS(SVG, "svg");
    route.appendChild(svg);
    stops = [];
    let pending = null;
    d.items.forEach((item, i) => {
      if (!item.place) { if (item.leg) pending = item; return; }
      const leg = item.leg ? item : pending;
      pending = null;
      const s = { i, item, leg: stops.length && leg ? leg.leg : null, air: false };
      const prev = stops[stops.length - 1];
      s.air = !!prev && item.k === "flight" && prev.item.k === "flight" && !s.leg;

      s.node = el("button", "node", icon(item.k));
      s.node.setAttribute("aria-label", item.place.name);
      s.label = el("div", "label",
        `<div class="time">${item.t}</div><div class="place">${item.place.name}</div>${mapsLink(item.place.q, "Open in Maps")}`);
      s.node.dataset.i = s.label.dataset.i = i;
      if (s.leg) { s.legEl = el("div", "leg", s.leg); route.appendChild(s.legEl); }
      s.path = document.createElementNS(SVG, "path");
      if (s.air) s.path.setAttribute("class", "air");
      svg.appendChild(s.path);
      route.append(s.label, s.node);
      stops.push(s);
    });
    const end = el("div", "end", dayIdx < DAYS.length - 1
      ? `<button data-go="1">on to day ${dayIdx + 2} →</button>` : "safe travels home");
    route.appendChild(end);
    stops.end = end;

    // list
    list.innerHTML = d.items.map((item, i) => `
      <div class="row${item.place ? " has-place" : ""}" data-i="${i}">
        <div><div class="when">${item.t}</div><div class="ico">${icon(item.k)}</div></div>
        <div>
          <h3>${item.title}</h3>
          ${item.text ? `<p>${item.text}</p>` : ""}
          ${item.booked || item.place ? `<div class="chips">
            ${item.booked ? `<span class="booked">${item.booked}</span>` : ""}
            ${item.place ? mapsLink(item.place.q, item.place.name) : ""}</div>` : ""}
        </div>
      </div>`).join("") + stayCard(d) + (d.note ? `<div class="card note"><div class="eyebrow">Good to know</div><p>${d.note}</p></div>` : "");

    layout();
    map.scrollTop = 0;
    list.scrollTop = 0;
    history.replaceState(null, "", "#day-" + (dayIdx + 1));
  }

  function stayCard(d) {
    if (!d.stay) return "";
    const h = HOTELS[d.stay.hotel];
    return `<div class="card">
      <div class="eyebrow">Tonight's stay · ${d.stay.night}</div>
      <h3>${h.name}</h3>
      <p>${h.address}</p><p>${h.room}</p><p>${h.times}</p><p>${h.paid}</p>
      <div class="chips"><span class="booked">Booked</span>${mapsLink(h.q, "Open in Maps")}
        <a class="maps" href="tel:${h.phone.replace(/\s/g, "")}">${h.phone}</a></div>
    </div>`;
  }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    e.className = cls; e.innerHTML = html;
    return e;
  }

  /* ── serpentine layout ────────────────────────────── */
  function layout() {
    const W = route.clientWidth;
    if (!W || !stops.length) return;
    const xL = 46, xR = W - 46;
    let y = 36;
    stops.forEach((s, n) => {
      const left = n % 2 === 0;
      s.x = left ? xL : xR;
      s.label.classList.toggle("right", !left);
      s.label.style.left = left ? xL + 30 + "px" : "auto";
      s.label.style.right = left ? "auto" : W - xR + 30 + "px";
      const h = s.label.offsetHeight;
      if (n > 0) {
        const p = stops[n - 1];
        y += Math.max(118, (p.h + h) / 2 + 58) + (s.leg ? 30 : 0);
        const ym = (p.y + y) / 2;
        s.path.setAttribute("d", `M${p.x} ${p.y} C${p.x} ${ym} ${s.x} ${ym} ${s.x} ${y}`);
        if (s.legEl) { s.legEl.style.left = W / 2 + "px"; s.legEl.style.top = ym + "px"; }
      }
      s.y = y; s.h = h;
      s.node.style.left = s.x + "px"; s.node.style.top = y + "px";
      s.label.style.top = y + "px";
    });
    stops.end.style.top = y + 74 + "px";
    route.style.height = y + 110 + "px";
    syncSpacer();
  }

  function sheetVisible() {
    return sheet.classList.contains("open") ? sheet.offsetHeight : peekPx;
  }
  let peekPx = 92;
  function measurePeek() {
    // resolve calc(92px + safe-area) to pixels
    const probe = el("div", "", "");
    probe.style.cssText = "position:absolute;visibility:hidden;height:var(--peek)";
    sheet.appendChild(probe); peekPx = probe.offsetHeight || 92; probe.remove();
  }
  function syncSpacer() {
    spacer.style.height = sheetVisible() + 24 + "px";
  }

  /* ── selection: map point <-> list row ────────────── */
  function select(i, from) {
    selected = selected === i && from !== "nav" ? null : i;
    document.querySelectorAll(".on").forEach((e) => e.classList.remove("on"));
    if (selected === null) return;
    document.querySelectorAll(`[data-i="${selected}"]`).forEach((e) => e.classList.add("on"));
    if (from !== "map") scrollMapTo(selected);
    if (from !== "list") scrollListTo(selected);
  }
  function scrollMapTo(i) {
    const s = stops.find((s) => s.i === i);
    if (!s) return;
    const top = parseFloat(getComputedStyle(map).paddingTop);
    const visible = map.clientHeight - top - sheetVisible();
    const nodeY = route.offsetTop + s.y;
    map.scrollTo({ top: nodeY - top - Math.max(60, visible / 2), behavior: "smooth" });
  }
  function scrollListTo(i) {
    const row = list.querySelector(`.row[data-i="${i}"]`);
    if (row) list.scrollTo({ top: row.offsetTop - list.offsetTop - 10, behavior: "smooth" });
  }

  route.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;                 // Maps link: let it through
    if (e.target.closest("[data-go]")) return go(1);
    const t = e.target.closest("[data-i]");
    if (t) select(+t.dataset.i, "map");
  });
  list.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    const row = e.target.closest(".row.has-place");
    if (row) select(+row.dataset.i, "list");
  });

  /* ── day navigation ───────────────────────────────── */
  function go(delta, abs) {
    const n = abs ?? dayIdx + delta;
    if (n < 0 || n >= DAYS.length || n === dayIdx) return;
    dayIdx = n;
    map.classList.add("swap");
    setTimeout(() => { render(); map.classList.remove("swap"); }, 160);
  }
  $("prev").addEventListener("click", () => go(-1));
  $("next").addEventListener("click", () => go(1));
  $("dots").addEventListener("click", (e) => {
    const b = e.target.closest("[data-day]");
    if (b) go(0, +b.dataset.day);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });
  // swipe the map sideways to change day
  let sw = null;
  map.addEventListener("touchstart", (e) => { const t = e.touches[0]; sw = { x: t.clientX, y: t.clientY }; }, { passive: true });
  map.addEventListener("touchend", (e) => {
    if (!sw) return;
    const t = e.changedTouches[0], dx = t.clientX - sw.x, dy = t.clientY - sw.y;
    sw = null;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 45) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ── bottom sheet: tap to toggle, drag to move ────── */
  function setOpen(open) {
    sheet.classList.toggle("open", open);
    $("sheetTitle").setAttribute("aria-expanded", open);
    syncSpacer();
    if (open && selected !== null) { scrollListTo(selected); scrollMapTo(selected); }
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
  addEventListener("resize", () => { measurePeek(); layout(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
