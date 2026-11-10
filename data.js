/* Greece — Nov 11–16, 2026. Edit this file to change the itinerary.

   Each day has a `timeline`: an ordered list of stops and the legs between them.
     stop: { stop: "<key in PLACES>", k: icon, start, end, items: [...] }
     leg:  { leg: "car" | "walk" | "metro", title, start, end }  (or dur: "~10 min")
   Times are written "HH:MM" on a 24-hour clock here only so durations can be
   computed; the site always displays them as 12-hour AM/PM.
   approx: true puts a "~" in front. A stop with `open` instead of `end` has no
   end time (e.g. open: "overnight").
   icons: flight | car | stay | food | sight | view | walk | info | metro      */

const TRIP = { title: "Greece", dates: "Nov 11–16, 2026", tz: "Europe/Athens" };

/* ll = [latitude, longitude] for the pin. q = what "Open in Maps" searches for.
   approx: true means the pin is placed by street/village, not surveyed. */
const PLACES = {
  ath:        { name: "Athens Airport", q: "Athens International Airport Eleftherios Venizelos", ll: [37.9365, 23.9447] },
  alamo_ath:  { name: "Alamo return, ATH", q: "Alamo Rent A Car, Athens International Airport", ll: [37.9372, 23.9462] },
  syntagma:   { name: "Syntagma station", q: "Syntagma Metro Station, Athens", ll: [37.9755, 23.7352] },
  nefeli:     { name: "Nefeli Hotel", q: "Nefeli Hotel, Aggelikis Xatzimichali 2, Athens 10558", ll: [37.97298, 23.73138] },
  plaka:      { name: "Plaka", q: "Plaka, Athens", ll: [37.97285, 23.73006] },
  acropolis:  { name: "Acropolis", q: "Acropolis of Athens", ll: [37.9715, 23.72662] },
  enterprise: { name: "Alamo, Acropolis Station", q: "Enterprise Rent-A-Car, 19 Andrea Syggrou Avenue, Athens", ll: [37.9672, 23.7289], approx: true },
  tholos:     { name: "Tholos Hotel", q: "Tholos Hotel, Apollonos 31, Delphi 33054", ll: [38.47905, 22.49431] },
  arachova:   { name: "Arachova", q: "Arachova, Greece", ll: [38.48007, 22.5842] },
  kaplanis:   { name: "Kaplanis Taverna", q: "Kaplanis Taverna, Arachova", ll: [38.4797, 22.5858], approx: true },
  delphi:     { name: "Ancient Delphi", q: "Archaeological Site of Delphi", ll: [38.48115, 22.50055] },
  gargadouas: { name: "Taverna Gargadoyas", q: "Taverna Gargadouas, Dimou Fragkou 12, Delphi", ll: [38.47969, 22.49129] },
  doupiani:   { name: "Doupiani House", q: "Doupiani House Hotel, Kastraki, Kalabaka 42200", ll: [39.7202, 21.61698] },
  deck:       { name: "Meteora observation deck", q: "Main Observation Deck of Meteora", ll: [39.71931, 21.63705] },
  xarama:     { name: "Taverna Xarama", q: "Taverna Xarama, Patriarchou Dimitriou 39, Kastraki", ll: [39.7180, 21.6188], approx: true },
  meteoron:   { name: "Great Meteoron", q: "Holy Monastery of Great Meteoron", ll: [39.72638, 21.62649] },
  varlaam:    { name: "Varlaam", q: "Holy Monastery of Varlaam, Meteora", ll: [39.72507, 21.6298] },
  rousanou:   { name: "Rousanou", q: "Holy Monastery of Rousanou, Meteora", ll: [39.72165, 21.63222] },
  trinity:    { name: "Holy Trinity", q: "Holy Trinity Monastery, Meteora", ll: [39.71328, 21.63553] },
  gardenia:   { name: "Taverna Gardenia", q: "Taverna Gardenia, Kastraki", ll: [39.71648, 21.61989] },
  pnevma:     { name: "Holy Spirit Rock", q: "Holy Spirit Rock (Agio Pnevma), Kastraki", ll: [39.71823, 21.62389] },
  panellinion:{ name: "Taverna Panellinion", q: "Restaurant Panellinion, Vlachava 3, Kalambaka", ll: [39.7072, 21.62349] },
  leonidas:   { name: "Leonidas Monument", q: "Leonidas Monument, Thermopylae", ll: [38.79681, 22.53656] },
  archontissa:{ name: "Tavern Archontissa", q: "Tavern Archontissa, Thermopylae", ll: [38.79968, 22.54505], approx: true },
  anafiotika: { name: "Anafiotika", q: "Anafiotika, Athens", ll: [37.97241, 23.72813] },
  klimataria: { name: "Klimataria", q: "Klimataria, Plateia Theatrou 2, Athens", ll: [37.98058, 23.72453] },
  varvakios:  { name: "Varvakeios Market", q: "Varvakios Central Market, Athens", ll: [37.98037, 23.72762] },
};

const HOTELS = {
  nefeli: {
    name: "Nefeli Hotel", place: "nefeli",
    address: "Aggelikis Xatzimichali 2, Athens 10558",
    phone: "+30 210 322 8044",
    room: "Twin room · breakfast included",
    times: "Check-in from 3:00 PM · check-out by 11:00 AM",
    paid: "Paid in full (€68 per night)",
  },
  tholos: {
    name: "Tholos Hotel", place: "tholos",
    address: "31 Apollonos, Delphi 33054",
    phone: "+30 22650 82268",
    room: "Standard double · breakfast included",
    times: "Check-in 3:00–10:00 PM · check-out 8:00–11:00 AM",
    paid: "€56.58 — charged to the card by the hotel",
  },
  doupiani: {
    name: "Doupiani House", place: "doupiani",
    address: "Kastraki, Kalabaka 42200",
    phone: "+30 24320 75326",
    room: "Twin beds confirmed · breakfast included",
    times: "Check-in 3:00 PM–midnight · check-out 7:00–11:00 AM",
    paid: "Paid in full (€233 for 2 nights)",
  },
};

const DAYS = [
  /* ───────────────────────────── Day 1 ───────────────────────────── */
  {
    date: "2026-11-11", label: "Wed Nov 11",
    title: "Arriving in Athens",
    stay: { hotel: "nefeli", night: "Night 1 of 2 here" },
    timeline: [
      {
        stop: "ath", k: "flight", start: "16:00", end: "17:00", approx: true,
        items: [
          { start: "16:00", title: "Land — Emirates EK 210 from Newark",
            text: "Left Newark Tuesday at 11:45 PM; 9h 15m in the air.", booked: "Booked · Economy Saver" },
          { start: "16:00", end: "17:00", approx: true, title: "Passport control, bag, metro ticket",
            text: "EES biometric entry adds a few minutes at passport control. Collect the checked bag, then follow the “Trains” signs over the footbridge to the station. A metro ticket to the city is €9." },
        ],
      },
      { leg: "metro", title: "Metro Line 3 (blue) to Syntagma", start: "17:00", end: "17:40", approx: true,
        text: "Direct, no changes; trains run every 30 minutes. A taxi is the alternative, about €40." },
      {
        stop: "syntagma", k: "metro", start: "17:40", end: "17:45", approx: true,
        items: [
          { start: "17:40", approx: true, title: "Get off at Syntagma", text: "Exit to the square and head south into Plaka." },
        ],
      },
      { leg: "walk", title: "Walk to the hotel", start: "17:45", end: "17:55", approx: true, text: "About 600 m through Plaka." },
      {
        stop: "nefeli", k: "stay", start: "17:55", end: "21:00", approx: true,
        items: [
          { start: "17:55", approx: true, title: "Check in",
            text: "Give the reservation name at the desk — <strong>Yury Kaz</strong>. The hotel has OK'd the early arrival.", booked: "Booked · early check-in OK'd" },
          { start: "18:00", end: "21:00", approx: true, title: "Rest",
            text: "Shower, nap, keep it light — the jet lag is 7 hours." },
          { start: "19:15", title: "Yury lands", text: "British Airways BA 636 from London Heathrow." },
          { start: "20:00", title: "Yury picks up the rental car",
            text: "Alamo desk in the Arrivals Terminal, then a 40-minute drive in on the Attiki Odos motorway. Yury is the only driver until Thursday." },
          { start: "20:50", approx: true, title: "Yury arrives and parks",
            text: "Hotel or nearby garage, about €20–30 for the night. Twin beds were requested — the hotel will do its best on arrival." },
        ],
      },
      { leg: "walk", title: "Walk to dinner", dur: "~5 min" },
      {
        stop: "plaka", k: "food", title: "Dinner in Plaka", start: "21:00", end: "22:30", approx: true,
        items: [
          { start: "21:00", end: "22:30", approx: true, title: "Dinner together at a nearby taverna",
            text: "The one late dinner of the trip. Back to the hotel and in bed by about 11:00 PM — the Acropolis slot is at 8:00 AM." },
        ],
      },
    ],
  },

  /* ───────────────────────────── Day 2 ───────────────────────────── */
  {
    date: "2026-11-12", label: "Thu Nov 12",
    title: "Acropolis, then Delphi",
    stay: { hotel: "tholos", night: "One night" },
    timeline: [
      {
        stop: "nefeli", k: "stay", start: "07:00", end: "07:40", approx: true,
        items: [
          { start: "07:00", end: "07:40", approx: true, title: "Up early and check out",
            text: "Check-out is by 11:00 AM and you won't be back until noon, so settle up now and leave the bags at the desk or locked in the car. Breakfast comes after the Acropolis." },
        ],
      },
      { leg: "walk", title: "Walk to the Acropolis", start: "07:40", end: "08:00", approx: true, text: "About 1.2 km, uphill at the end." },
      {
        stop: "acropolis", k: "sight", start: "08:00", end: "11:30",
        items: [
          { start: "08:00", title: "Enter at opening",
            text: "The entry slot is 8:00–9:00 AM and last entry is 8:40 AM. Tickets are the QR codes in the confirmation email.", booked: "Booked · 2 adults · 8:00–9:00 AM entry" },
          { start: "08:00", end: "11:30", title: "Parthenon → Erechtheion → Propylaea → Areopagus",
            text: "Self-guided with the free Rick Steves audio tour. Finish on Mars Hill and leave by the south slope, before the cruise crowds." },
        ],
      },
      { leg: "walk", title: "Walk down into Plaka", dur: "~15 min" },
      {
        stop: "plaka", k: "food", title: "Breakfast in Plaka", start: "11:30", end: "12:00",
        items: [
          { start: "11:30", end: "12:00", title: "Late breakfast",
            text: "<em>Strapatsada</em> or eggs with feta — make it substantial; there's no lunch before the 6:00 PM dinner." },
        ],
      },
      { leg: "walk", title: "Walk back to the hotel", dur: "~3 min" },
      {
        stop: "nefeli", k: "car", start: "12:00", end: "12:10", approx: true,
        items: [
          { start: "12:00", end: "12:10", approx: true, title: "Collect the bags and the car", text: "From the hotel garage or wherever Yury parked last night." },
        ],
      },
      { leg: "car", title: "Drive to the Alamo branch", dur: "~10 min", text: "A short hop across the centre." },
      {
        stop: "enterprise", k: "car", start: "12:10", end: "12:35", approx: true,
        items: [
          { start: "12:10", end: "12:35", approx: true, title: "Add Sam as a driver",
            text: "Enterprise/Alamo Acropolis Station branch, 19 Andrea Syggrou Ave (open 9:00 AM–9:00 PM). Both of you there with the car; bring the US licence and passport. €4 a day plus VAT." },
        ],
      },
      { leg: "car", title: "Drive Athens → Delphi", start: "12:35", end: "15:30", approx: true,
        text: "About 180 km, tolls ~€5. Twenty minutes of city driving to reach Attiki Odos, then the A1/E75 and the EO48 mountain road. Arachova appears clinging to the cliff; Delphi is 12 km beyond it." },
      {
        stop: "tholos", k: "stay", start: "15:30", end: "17:00", approx: true,
        items: [
          { start: "15:30", approx: true, title: "Check in", text: "Luggage to the room.", booked: "Booked · 1 night" },
          { start: "15:30", end: "17:00", approx: true, title: "Rest", text: "Nap if the travel day demands it." },
        ],
      },
      { leg: "car", title: "Drive to Arachova", start: "17:00", end: "17:15", text: "12 km back along the gorge." },
      {
        stop: "arachova", k: "walk", start: "17:15", end: "17:45",
        items: [
          { start: "17:15", end: "17:45", title: "Old-town wander", text: "Optional — skip without guilt if tired." },
        ],
      },
      { leg: "walk", title: "Walk to dinner", dur: "~5 min" },
      {
        stop: "kaplanis", k: "food", start: "18:00", end: "19:00",
        items: [
          { start: "18:00", end: "19:00", title: "Dinner",
            text: "Plateia Tropaiou, Arachova (open Wed–Sun 1:00–11:00 PM). <em>Kontosouvli</em>, formaela saganaki, <em>horta</em>, lamb chops." },
        ],
      },
      { leg: "car", title: "Drive back to Delphi", start: "19:00", end: "19:15", text: "12 km." },
      {
        stop: "tholos", k: "stay", start: "19:15", open: "overnight",
        items: [ { start: "19:15", title: "Back at the hotel", text: "Early night — Delphi opens at 8:30 AM." } ],
      },
    ],
  },

  /* ───────────────────────────── Day 3 ───────────────────────────── */
  {
    date: "2026-11-13", label: "Fri Nov 13",
    title: "Delphi to Meteora",
    stay: { hotel: "doupiani", night: "Night 1 of 2 here" },
    timeline: [
      {
        stop: "tholos", k: "stay", start: "08:00", end: "08:20",
        items: [
          { start: "08:00", end: "08:15", title: "Hotel breakfast", text: "Ask for <em>tiganita avga</em> or <em>strapatsada</em> (scrambled eggs, tomato, feta)." },
          { start: "08:15", end: "08:20", title: "Check out", text: "Luggage to the car." },
        ],
      },
      { leg: "car", title: "Drive to the site", dur: "~5 min", text: "1.4 km — park at the entrance." },
      {
        stop: "delphi", k: "sight", start: "08:30", end: "12:30",
        items: [
          { start: "08:30", end: "11:00", approx: true, title: "The sanctuary",
            text: "Sanctuary of Apollo → Temple of Apollo → Ancient Theatre → Stadium. It's steep and layered, and the best light is in the morning." },
          { start: "11:00", end: "12:30", approx: true, title: "The museum", text: "Don't miss the Charioteer. The combined ticket is about €12; the site is open 8:30 AM–3:30 PM in winter." },
        ],
      },
      { leg: "car", title: "Drive into Delphi town", dur: "~5 min" },
      {
        stop: "gargadouas", k: "food", start: "12:30", end: "13:30",
        items: [
          { start: "12:30", end: "13:30", title: "Lunch",
            text: "Dimou Fragkou 12 (daily 11:00 AM–11:00 PM). The house specialty is <strong>grilled octopus</strong>; also pork souvlaki and kebabs. Skip the moussaka." },
        ],
      },
      { leg: "car", title: "Drive Delphi → Kastraki", start: "13:30", end: "16:20",
        text: "210 km, tolls ~€7. The winding Amfissa–Gravia mountain road first, then the E65/A3 motorway from Lamia to Trikala. Keep it unhurried — the pillars in low afternoon light are the payoff of the whole loop." },
      {
        stop: "doupiani", k: "stay", start: "16:20", end: "16:25",
        items: [
          { start: "16:20", end: "16:25", title: "Check in",
            text: "At the foot of the pillars. Two nights here — no checkout tomorrow. Free parking.", booked: "Booked · 2 nights · twin beds confirmed" },
        ],
      },
      { leg: "car", title: "Drive up to the viewpoint", dur: "~8 min" },
      {
        stop: "deck", k: "view", start: "16:30", end: "17:15",
        items: [
          { start: "16:30", end: "17:15", title: "Sunset over the pillars", text: "Sunset is about 5:11 PM. The first full view of the sandstone towers." },
        ],
      },
      { leg: "car", title: "Drive down to Kastraki", dur: "~8 min" },
      {
        stop: "xarama", k: "food", start: "18:00", end: "19:00",
        items: [
          { start: "18:00", end: "19:00", title: "Dinner",
            text: "Patriarchou Dimitriou 39, Kastraki. Grill specialist: pork <em>kontosouvli</em>, lamb ribs, charcoal chops, <em>horta</em>, <em>gigantes</em>." },
        ],
      },
    ],
  },

  /* ───────────────────────────── Day 4 ───────────────────────────── */
  {
    date: "2026-11-14", label: "Sat Nov 14",
    title: "The Meteora monasteries",
    stay: { hotel: "doupiani", night: "Night 2 of 2 here" },
    note: "All six monasteries are open today; four interiors is the cap, and Varlaam waits for Sunday. Dress code: long trousers, shoulders covered. Bring cash — €5 per monastery. If Rousanou's approach feels too steep, St. Stephen (9:00 AM–1:00 PM and 3:00–5:00 PM) can slot in at 3:00 PM instead.",
    timeline: [
      {
        stop: "doupiani", k: "stay", start: "08:00", end: "09:15",
        items: [
          { start: "08:00", end: "09:15", title: "Hotel breakfast", text: "Eggs and feta again, or a bakery <em>tyropita</em>. No checkout today." },
        ],
      },
      { leg: "car", title: "Drive up the loop road", dur: "~8 min", text: "The road winds between the pillars with the monasteries overhead." },
      {
        stop: "meteoron", k: "sight", start: "09:30", end: "11:30",
        items: [
          { start: "09:30", end: "11:30", title: "Visit the monastery",
            text: "Open 9:30 AM–2:00 PM. The largest and oldest house (14th century), with the manuscript museum and the sacristy." },
        ],
      },
      { leg: "car", title: "Drive to Rousanou", dur: "~5 min" },
      {
        stop: "rousanou", k: "sight", start: "11:45", end: "13:00",
        items: [
          { start: "11:45", end: "13:00", title: "Visit the monastery", text: "Open 9:30 AM–2:00 PM. Smaller and quieter, with a dramatic cliff-edge approach on foot." },
        ],
      },
      { leg: "car", title: "Drive down to Kastraki", dur: "~5 min" },
      {
        stop: "gardenia", k: "food", start: "13:00", end: "14:00",
        items: [
          { start: "13:00", end: "14:00", title: "Lunch", text: "Open daily noon–10:00 PM, since 1932. Charcoal-grilled meats and seasonal specials." },
        ],
      },
      { leg: "car", title: "Drive to Holy Trinity", dur: "~10 min" },
      {
        stop: "trinity", k: "sight", title: "Holy Trinity (Agia Triada)", start: "14:00", end: "15:30",
        items: [
          { start: "14:00", end: "15:30", title: "Visit the monastery", text: "Open 10:00 AM–4:00 PM. A steep footpath up to the classic “floating monastery” view." },
        ],
      },
      { leg: "car", title: "Drive back to Kastraki", dur: "~10 min" },
      {
        stop: "pnevma", k: "walk", start: "16:00", end: "17:10",
        items: [
          { start: "16:00", end: "17:10", title: "Hike the viewpoint loop",
            text: "The Agion Pneuma loop in late-afternoon light, finishing with the sunset at about 5:11 PM." },
        ],
      },
      { leg: "car", title: "Drive to Kalambaka", dur: "~5 min" },
      {
        stop: "panellinion", k: "food", start: "18:00", end: "19:00",
        items: [
          { start: "18:00", end: "19:00", title: "Dinner",
            text: "Vlachava 3, Kalambaka (daily noon–10:00 PM) — a stone room with a fireplace in winter. Order the mix-grill platter for two and boiled greens." },
        ],
      },
    ],
  },

  /* ───────────────────────────── Day 5 ───────────────────────────── */
  {
    date: "2026-11-15", label: "Sun Nov 15",
    title: "Varlaam, Thermopylae, Athens",
    stay: { hotel: "nefeli", night: "Night 2 of 2 here" },
    timeline: [
      {
        stop: "doupiani", k: "stay", start: "08:00", end: "08:50",
        items: [
          { start: "08:00", end: "08:40", title: "Hotel breakfast" },
          { start: "08:40", end: "08:50", title: "Check out", text: "Check-out is by 11:00 AM, but load the car now — you leave straight from Varlaam." },
        ],
      },
      { leg: "car", title: "Drive up to Varlaam", dur: "~8 min" },
      {
        stop: "varlaam", k: "sight", start: "09:00", end: "11:00",
        items: [
          { start: "09:00", end: "11:00", title: "Visit the monastery",
            text: "Open Sundays 9:00 AM–4:00 PM (closed Thursdays and Fridays in winter). The second-largest house: barrel-vaulted church and a museum of liturgical art." },
        ],
      },
      { leg: "car", title: "Drive Kastraki → Thermopylae", start: "11:15", end: "12:50",
        text: "145 km, tolls ~€8. E65/A3 down to Lamia, then the A1/E75 south to the Thermopylae exit." },
      {
        stop: "leonidas", k: "sight", title: "Thermopylae Pass", start: "12:50", end: "13:50",
        items: [
          { start: "12:50", end: "13:50", title: "Leonidas Monument and the battlefield",
            text: "Full version (an hour): the monument and ΜΟΛΩΝ ΛΑΒΕ wall, Kolonos Hill, the 700 Thespians monument, the sulfur hot springs. Tired version (20 minutes): a photo at the monument and keep driving." },
        ],
      },
      { leg: "car", title: "Drive to lunch", dur: "~2 min" },
      {
        stop: "archontissa", k: "food", start: "13:50", end: "14:30",
        items: [
          { start: "13:50", end: "14:30", title: "Lunch",
            text: "Family-run, in Thermopylae village. <em>Tis-oras</em> grilled chicken. Keep it quick — or skip it on the 20-minute version and eat in Athens." },
        ],
      },
      { leg: "car", title: "Drive Thermopylae → Athens", start: "14:30", end: "16:40",
        text: "About 200 km, tolls ~€11. Straight down the A1/E75. Sunday-afternoon traffic toward Athens is possible — leaving by 2:30 PM is the buffer." },
      {
        stop: "nefeli", k: "stay", start: "16:40", end: "16:45", approx: true,
        items: [
          { start: "16:40", end: "16:45", approx: true, title: "Check in and park",
            text: "Same hotel as the first night. Hotel garage or nearby, about €25.", booked: "Booked · 1 night" },
        ],
      },
      { leg: "walk", title: "Walk to Anafiotika", dur: "~6 min" },
      {
        stop: "anafiotika", k: "walk", start: "16:45", end: "17:30",
        items: [
          { start: "16:45", end: "17:30", title: "Sunset walk through Anafiotika and Plaka", text: "Free time, not a scheduled march." },
        ],
      },
      { leg: "walk", title: "Walk to dinner", dur: "~16 min", text: "About 1.2 km north through Monastiraki." },
      {
        stop: "klimataria", k: "food", start: "18:30", end: "19:30",
        items: [
          { start: "18:30", end: "19:30", title: "Dinner",
            text: "Plateia Theatrou 2 (since 1927; Sundays noon–1:00 AM). Grill platter, <em>soutzoukakia</em>, salads. Live rembetika isn't certain on Sundays. Reserve ahead." },
        ],
      },
    ],
  },

  /* ───────────────────────────── Day 6 ───────────────────────────── */
  {
    date: "2026-11-16", label: "Mon Nov 16",
    title: "Slow morning, flights home",
    timeline: [
      {
        stop: "nefeli", k: "stay", start: "09:00", end: "10:15", approx: true,
        items: [
          { start: "09:00", end: "10:00", approx: true, title: "Sleep in, hotel breakfast" },
          { start: "10:00", end: "10:15", approx: true, title: "Check out", text: "Check-out is by 11:00 AM. Put the bags in the car." },
        ],
      },
      { leg: "walk", title: "Walk to the market", dur: "~13 min", text: "About 1 km north." },
      {
        stop: "varvakios", k: "walk", start: "10:30", end: "11:30", approx: true,
        items: [
          { start: "10:30", end: "11:30", approx: true, title: "Wander the market halls",
            text: "The central market is open on Mondays — and so are the market tavernas, Oinomagireio Epirus and Diporto. Coffee and a bakery on the way." },
        ],
      },
      { leg: "walk", title: "Walk back to Plaka", dur: "~13 min" },
      {
        stop: "plaka", k: "food", title: "Lunch in Plaka", start: "12:00", end: "12:45",
        items: [
          { start: "12:00", end: "12:45", title: "Early lunch at a grill taverna",
            text: "<em>Lavraki</em> or <em>tsipoura</em>, grilled with lemon and oregano. Unhurried — you don't leave until 2:00 PM." },
        ],
      },
      { leg: "walk", title: "Walk back to the car", dur: "~3 min" },
      {
        stop: "nefeli", k: "car", start: "13:45", end: "14:00", approx: true,
        items: [ { start: "13:45", end: "14:00", approx: true, title: "Collect the car" } ],
      },
      { leg: "car", title: "Drive Plaka → airport", start: "14:00", end: "14:45", approx: true,
        text: "35 km, toll ~€3. Refuel near the airport — the car goes back full." },
      {
        stop: "alamo_ath", k: "car", start: "14:45", end: "15:10", approx: true,
        items: [
          { start: "14:45", end: "15:10", approx: true, title: "Return the car", text: "Due back by 3:00 PM.", booked: "Booked · due 3:00 PM" },
        ],
      },
      { leg: "walk", title: "Walk to the terminal", dur: "~5 min" },
      {
        stop: "ath", k: "flight", start: "15:10", end: "17:10",
        items: [
          { start: "15:10", approx: true, title: "Check in and drop the bags", text: "Two hours before both departures." },
          { start: "17:00", title: "Yury departs — British Airways BA 635", text: "To London Heathrow, landing 7:00 PM." },
          { start: "17:10", title: "Sam departs — Emirates EK 209", text: "To Newark, landing 9:10 PM; 11 hours. Two checked bags included.", booked: "Booked · Economy Flex" },
        ],
      },
    ],
  },
];
