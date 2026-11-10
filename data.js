/* Greece — Nov 11–16, 2026. Edit this file to change the itinerary.
   Each item is one row of the day's list. Items with a `place` also become a
   point on the map timeline; items with `leg` become the label on the path
   between two points.
   kinds: flight | car | stay | food | sight | view | walk | info            */

const TRIP = {
  title: "Greece",
  dates: "Nov 11–16, 2026",
  tz: "Europe/Athens",
};

const HOTELS = {
  nefeli: {
    name: "Nefeli Hotel",
    area: "Plaka, Athens",
    address: "Aggelikis Xatzimichali 2, Athens 10558",
    phone: "+30 210 322 8044",
    q: "Nefeli Hotel, Aggelikis Xatzimichali 2, Athens 10558",
    room: "Twin room · breakfast included",
    times: "Check-in from 15:00 · check-out by 11:00",
    paid: "Paid in full (€68 per night)",
  },
  tholos: {
    name: "Tholos Hotel",
    area: "Delphi",
    address: "31 Apollonos, Delphi 33054",
    phone: "+30 22650 82268",
    q: "Tholos Hotel, Apollonos 31, Delphi 33054",
    room: "Standard double · breakfast included",
    times: "Check-in 15:00–22:00 · check-out 08:00–11:00",
    paid: "€56.58 — charged to the card by the hotel",
  },
  doupiani: {
    name: "Doupiani House",
    area: "Kastraki, Meteora",
    address: "Kastraki, Kalabaka 42200",
    phone: "+30 24320 75326",
    q: "Doupiani House Hotel, Kastraki, Kalabaka 42200",
    room: "Twin beds confirmed · breakfast included",
    times: "Check-in 15:00–00:00 · check-out 07:00–11:00",
    paid: "Paid in full (€233 for 2 nights)",
  },
};

const DAYS = [
  /* ───────────────────────────── Day 1 ───────────────────────────── */
  {
    date: "2026-11-11",
    label: "Wed Nov 11",
    title: "Arriving in Athens",
    blurb: "A positioning night. Sam lands first and settles into Plaka; Yury follows with the car.",
    stay: { hotel: "nefeli", night: "Night 1 of 2 here" },
    items: [
      {
        t: "Tue 23:45", k: "flight",
        title: "Sam departs Newark — Emirates EK 210",
        text: "EWR → ATH, 9h 15m overnight. Checked bag and carry-on included.",
        place: { name: "Newark Airport", q: "Newark Liberty International Airport" },
        booked: "Booked · Economy Saver",
      },
      {
        t: "13:25", k: "flight",
        title: "Yury departs Heathrow — British Airways BA 636",
        text: "LHR → ATH, 3h 50m. Carry-on only.",
        place: { name: "London Heathrow", q: "London Heathrow Airport" },
        booked: "Booked · Economy Basic",
      },
      {
        t: "16:00", k: "flight",
        title: "Sam lands at Athens (ATH)",
        text: "EES biometric entry adds a few minutes at passport control.",
        place: { name: "Athens Airport", q: "Athens International Airport Eleftherios Venizelos" },
      },
      {
        t: "After landing", k: "info", leg: "Metro Line 3 · ~40 min · €9",
        title: "Sam: airport → Plaka",
        text: "Metro Line 3 (blue) direct to Syntagma, ~40 min, €9 — or a taxi, ~€40.",
      },
      {
        t: "Afternoon", k: "stay",
        title: "Sam checks in at Nefeli Hotel",
        text: "Give the reservation name at the desk — <strong>Yury Kaz</strong>. The hotel has OK'd the early arrival. Keep the day light: the jet lag is 7 hours.",
        place: { name: "Nefeli Hotel", q: HOTELS.nefeli.q },
        booked: "Booked · early check-in OK'd",
      },
      {
        t: "19:15", k: "flight",
        title: "Yury lands at Athens (ATH)",
        text: "BA 636 arrives.",
        place: { name: "Athens Airport", q: "Athens International Airport Eleftherios Venizelos" },
      },
      {
        t: "20:00", k: "car",
        title: "Rental car pickup — Alamo",
        text: "Desk in the Arrivals Terminal (open 24h), <a href=\"tel:+302160024343\">+30 21 6002 4343</a>. Hyundai Bayon or similar, compact automatic, Wed 20:00 → Mon 15:00. Decline the desk CDW, confirm full-to-full fuel, and photograph every panel before leaving the lot. Yury is the only driver until Thursday.",
        place: { name: "Alamo desk, ATH Arrivals", q: "Alamo Rent A Car, Athens International Airport" },
        booked: "Booked · prepaid",
      },
      {
        t: "~20:10", k: "car", leg: "35 km · ~40 min · toll ~€3",
        title: "Drive ATH → Plaka",
        text: "Attiki Odos motorway, light traffic by 20:00. Only the last Plaka approach is fiddly — narrow one-way streets; follow the hotel's parking directions. Parking ~€20–30 for the night.",
      },
      {
        t: "~20:50", k: "stay",
        title: "Yury arrives at Nefeli Hotel",
        text: "Park at the hotel or a nearby garage. Twin beds were requested — the hotel will do its best on arrival.",
        place: { name: "Nefeli Hotel", q: HOTELS.nefeli.q },
      },
      {
        t: "~21:00", k: "food",
        title: "Dinner together at a nearby taverna",
        text: "The one late dinner of the trip. Bed by ~23:00 — the Acropolis slot is at 08:00.",
        place: { name: "Plaka", q: "Plaka, Athens" },
      },
    ],
  },

  /* ───────────────────────────── Day 2 ───────────────────────────── */
  {
    date: "2026-11-12",
    label: "Thu Nov 12",
    title: "Acropolis, then Delphi",
    blurb: "The Parthenon in empty morning light, then the climb into the Parnassus foothills.",
    stay: { hotel: "tholos", night: "One night" },
    items: [
      {
        t: "Early", k: "info",
        title: "Up and out",
        text: "The entry slot is 08:00–09:00 and last entry is 20 minutes before it ends — be at the gate by 08:40 at the latest. Breakfast comes after.",
      },
      {
        t: "08:00–11:30", k: "sight",
        title: "Acropolis",
        text: "Parthenon → Erechtheion → Propylaea → Areopagus (Mars Hill) → exit by the south slope. Self-guided with the free Rick Steves audio tour. Tickets are the QR codes in the confirmation email.",
        place: { name: "Acropolis", q: "Acropolis of Athens" },
        booked: "Booked · 2 adults · 08:00–09:00 entry",
      },
      {
        t: "11:30–12:00", k: "food",
        title: "Plaka breakfast",
        text: "<em>Strapatsada</em> or eggs with feta — make it substantial; there's no lunch before the 18:00 dinner.",
        place: { name: "Plaka", q: "Plaka, Athens" },
      },
      {
        t: "~12:00", k: "car",
        title: "Add Sam as a driver",
        text: "Collect the car, then stop at the Enterprise/Alamo Acropolis Station branch, 19 Andrea Syggrou Ave (open 09:00–21:00, ~10 min from Plaka). Both of you there with the car; Sam brings his US licence and passport. €4/day + VAT. Allow 20–30 minutes.",
        place: { name: "Alamo, Acropolis Station", q: "Enterprise Rent-A-Car, 19 Andrea Syggrou Avenue, Athens" },
      },
      {
        t: "~12:30–15:30", k: "car", leg: "~180 km · ~3h · tolls ~€5",
        title: "Drive Athens → Delphi",
        text: "About 20 minutes of city driving to reach Attiki Odos, then A1/E75 and the EO48 mountain road. Arachova appears clinging to the cliff; Delphi is 12 km beyond it.",
      },
      {
        t: "~15:30", k: "stay",
        title: "Check in — Tholos Hotel, Delphi",
        text: "Luggage to the room. Nap if the travel day demands it.",
        place: { name: "Tholos Hotel", q: HOTELS.tholos.q },
        booked: "Booked · 1 night",
      },
      {
        t: "17:15–17:45", k: "walk", leg: "12 km · ~15 min",
        title: "Arachova old-town wander",
        text: "Optional — skip without guilt if tired. Arachova is a 15-minute drive back along the gorge.",
        place: { name: "Arachova", q: "Arachova, Greece" },
      },
      {
        t: "18:00–19:00", k: "food",
        title: "Dinner — Kaplanis Taverna",
        text: "Plateia Tropaiou, Arachova (open Wed–Sun 13:00–23:00). <em>Kontosouvli</em>, formaela saganaki, <em>horta</em>, lamb chops. Then 15 minutes back to Delphi.",
        place: { name: "Kaplanis Taverna", q: "Kaplanis Taverna, Arachova" },
      },
    ],
  },

  /* ───────────────────────────── Day 3 ───────────────────────────── */
  {
    date: "2026-11-13",
    label: "Fri Nov 13",
    title: "Delphi to Meteora",
    blurb: "The sanctuary in morning light, then the drive north until the pillars rise out of the plain.",
    stay: { hotel: "doupiani", night: "Night 1 of 2 here" },
    items: [
      {
        t: "08:00", k: "food",
        title: "Hotel breakfast",
        text: "Ask for <em>tiganita avga</em> or <em>strapatsada</em> (scrambled eggs, tomato, feta).",
      },
      {
        t: "08:15", k: "stay",
        title: "Check out of Tholos Hotel",
        text: "Luggage to the car.",
        place: { name: "Tholos Hotel", q: HOTELS.tholos.q },
      },
      {
        t: "08:30–12:30", k: "sight",
        title: "Delphi archaeological site + museum",
        text: "Open 08:30–15:30 in winter; combined ticket ~€12. Sanctuary of Apollo → Temple of Apollo → Ancient Theatre → Stadium → museum (the Charioteer). Budget the full four hours — it's steep and layered.",
        place: { name: "Ancient Delphi", q: "Archaeological Site of Delphi" },
      },
      {
        t: "12:30–13:30", k: "food",
        title: "Lunch — Taverna Gargadoyas",
        text: "Dimou Fragkou 12, Delphi town (daily 11:00–23:00). The house specialty is <strong>grilled octopus</strong>; also pork souvlaki and kebabs. Skip the moussaka.",
        place: { name: "Taverna Gargadoyas", q: "Taverna Gargadouas, Dimou Fragkou 12, Delphi" },
      },
      {
        t: "13:30–16:20", k: "car", leg: "210 km · ~2h50 · tolls ~€7",
        title: "Drive Delphi → Kastraki",
        text: "The winding Amfissa–Gravia mountain road first, then the E65/A3 motorway from Lamia to Trikala. Keep it unhurried — the pillars in low 16:00 light are the payoff of the whole loop.",
      },
      {
        t: "16:20", k: "stay",
        title: "Check in — Doupiani House, Kastraki",
        text: "At the foot of the pillars. Two nights here — no checkout tomorrow. Free parking.",
        place: { name: "Doupiani House", q: HOTELS.doupiani.q },
        booked: "Booked · 2 nights · twin beds confirmed",
      },
      {
        t: "16:30–17:15", k: "view",
        title: "Sunset from the main observation deck",
        text: "Sunset is ~17:11. The first full view of the sandstone towers.",
        place: { name: "Meteora observation deck", q: "Main Observation Deck of Meteora" },
      },
      {
        t: "18:00–19:00", k: "food",
        title: "Dinner — Taverna Xarama",
        text: "Patriarchou Dimitriou 39, Kastraki. Grill specialist: pork <em>kontosouvli</em>, lamb ribs, charcoal chops, <em>horta</em>, <em>gigantes</em>.",
        place: { name: "Taverna Xarama", q: "Taverna Xarama, Patriarchou Dimitriou 39, Kastraki" },
      },
    ],
  },

  /* ───────────────────────────── Day 4 ───────────────────────────── */
  {
    date: "2026-11-14",
    label: "Sat Nov 14",
    title: "The Meteora monasteries",
    blurb: "All six houses are open today. Four interiors is the cap — Varlaam waits for Sunday.",
    stay: { hotel: "doupiani", night: "Night 2 of 2 here" },
    note: "Dress code: long trousers, shoulders covered. Bring cash — €5 per monastery. If Rousanou's approach feels too steep, St. Stephen (09:00–13:00 & 15:00–17:00) can slot in at 15:00 instead.",
    items: [
      {
        t: "08:00", k: "food",
        title: "Hotel breakfast",
        text: "Eggs and feta again, or a bakery <em>tyropita</em>. No checkout today.",
        place: { name: "Doupiani House", q: HOTELS.doupiani.q },
      },
      {
        t: "09:30–11:30", k: "sight", leg: "Loop road · ~10 min",
        title: "Great Meteoron",
        text: "Open 09:30–14:00. The largest and oldest house (14th century), with the manuscript museum and the sacristy.",
        place: { name: "Great Meteoron", q: "Holy Monastery of Great Meteoron" },
      },
      {
        t: "11:45–13:00", k: "sight",
        title: "Rousanou",
        text: "Open 09:30–14:00. Smaller and quieter, with a dramatic cliff-edge approach on foot.",
        place: { name: "Rousanou", q: "Holy Monastery of Rousanou, Meteora" },
      },
      {
        t: "13:00–14:00", k: "food",
        title: "Lunch — Taverna Gardenia",
        text: "Ag. Athanasiou, Kastraki (daily 12:00–22:00, since 1932). Charcoal-grilled meats and seasonal specials.",
        place: { name: "Taverna Gardenia", q: "Taverna Gardenia, Kastraki" },
      },
      {
        t: "14:00–15:30", k: "sight",
        title: "Holy Trinity (Agia Triada)",
        text: "Open 10:00–16:00. A steep footpath up to the classic “floating monastery” view.",
        place: { name: "Holy Trinity", q: "Holy Trinity Monastery, Meteora" },
      },
      {
        t: "16:00–17:10", k: "walk",
        title: "Holy Spirit Rock hike",
        text: "The Agion Pneuma viewpoint loop in late-afternoon light, back at the observation deck for the ~17:11 sunset.",
        place: { name: "Holy Spirit Rock", q: "Holy Spirit Rock (Agio Pnevma), Kastraki" },
      },
      {
        t: "18:00–19:00", k: "food",
        title: "Dinner — Taverna Panellinion",
        text: "Vlachava 3, Kalambaka (daily 12:00–22:00) — a stone room with a fireplace in winter. Order the mix-grill platter for two and boiled greens.",
        place: { name: "Taverna Panellinion", q: "Restaurant Panellinion, Vlachava 3, Kalambaka" },
      },
    ],
  },

  /* ───────────────────────────── Day 5 ───────────────────────────── */
  {
    date: "2026-11-15",
    label: "Sun Nov 15",
    title: "Varlaam, Thermopylae, Athens",
    blurb: "One last monastery, the pass where the 300 stood, and back to Plaka by sunset.",
    stay: { hotel: "nefeli", night: "Night 2 of 2 here" },
    items: [
      {
        t: "08:00", k: "stay",
        title: "Breakfast, then check out of Doupiani House",
        text: "Checkout is by 11:00 — load the car before Varlaam.",
        place: { name: "Doupiani House", q: HOTELS.doupiani.q },
      },
      {
        t: "09:00–11:00", k: "sight",
        title: "Varlaam",
        text: "Open Sundays 09:00–16:00 (closed Thu/Fri in winter). The second-largest house: barrel-vaulted church and a museum of liturgical art.",
        place: { name: "Varlaam", q: "Holy Monastery of Varlaam, Meteora" },
      },
      {
        t: "11:15–12:50", k: "car", leg: "145 km · ~1h35 · tolls ~€8",
        title: "Drive Kastraki → Thermopylae",
        text: "E65/A3 down to Lamia, then A1/E75 south to the Thermopylae exit.",
      },
      {
        t: "12:50–13:50", k: "sight",
        title: "Thermopylae Pass",
        text: "Full version (60 min): the Leonidas Monument and ΜΟΛΩΝ ΛΑΒΕ wall, Kolonos Hill, the 700 Thespians monument, the sulfur hot springs. Tired version (20 min): a photo at the monument and keep driving.",
        place: { name: "Leonidas Monument", q: "Leonidas Monument, Thermopylae" },
      },
      {
        t: "13:50–14:30", k: "food",
        title: "Lunch — Tavern Archontissa",
        text: "Family-run, in Thermopylae village. <em>Tis-oras</em> grilled chicken. Keep it quick — or skip it on the 20-minute version and eat in Athens.",
        place: { name: "Tavern Archontissa", q: "Tavern Archontissa, Thermopylae" },
      },
      {
        t: "14:30–16:40", k: "car", leg: "~200 km · ~2h10 · tolls ~€11",
        title: "Drive Thermopylae → Plaka",
        text: "Straight down the A1/E75. Sunday-afternoon traffic toward Athens is possible — leaving by 14:30 is the buffer.",
      },
      {
        t: "~16:40", k: "stay",
        title: "Check in — Nefeli Hotel",
        text: "Same hotel as the first night. Park in the hotel garage or nearby (~€25).",
        place: { name: "Nefeli Hotel", q: HOTELS.nefeli.q },
        booked: "Booked · 1 night",
      },
      {
        t: "16:45–17:30", k: "walk",
        title: "Anafiotika + Plaka sunset walk",
        text: "Free time, not a scheduled march.",
        place: { name: "Anafiotika", q: "Anafiotika, Athens" },
      },
      {
        t: "18:30–19:30", k: "food",
        title: "Dinner — Klimataria",
        text: "Plateia Theatrou 2 (since 1927; Sundays 12:00–01:00). Grill platter, <em>soutzoukakia</em>, salads. Live rembetika isn't certain on Sundays. Reserve ahead.",
        place: { name: "Klimataria", q: "Klimataria, Plateia Theatrou 2, Athens" },
      },
    ],
  },

  /* ───────────────────────────── Day 6 ───────────────────────────── */
  {
    date: "2026-11-16",
    label: "Mon Nov 16",
    title: "Slow morning, flights home",
    blurb: "The Acropolis is already done. One deadline today: the car goes back at 15:00.",
    items: [
      {
        t: "Morning", k: "walk",
        title: "Sleep in, then a Plaka wander",
        text: "Coffee, a bakery, no agenda. Check out of Nefeli by 11:00 and put the bags in the car.",
        place: { name: "Nefeli Hotel", q: HOTELS.nefeli.q },
      },
      {
        t: "Late morning", k: "walk",
        title: "Varvakeios Market",
        text: "The central market halls are open on Mondays — and so are the market tavernas, Oinomagireio Epirus and Diporto.",
        place: { name: "Varvakeios Market", q: "Varvakios Central Market, Athens" },
      },
      {
        t: "12:00–12:45", k: "food",
        title: "Early lunch in Plaka",
        text: "A grill taverna: <em>lavraki</em> or <em>tsipoura</em>, grilled with lemon and oregano. Unhurried.",
        place: { name: "Plaka", q: "Plaka, Athens" },
      },
      {
        t: "14:00", k: "car", leg: "35 km · ~40 min · toll ~€3",
        title: "Drive Plaka → ATH",
        text: "Refuel near the airport (full-to-full).",
      },
      {
        t: "~15:00", k: "car",
        title: "Return the car — Alamo",
        text: "Due back at 15:00. Allow 20–30 minutes for fuel and the return.",
        place: { name: "Alamo return, ATH", q: "Alamo Rent A Car, Athens International Airport" },
        booked: "Booked · due 15:00",
      },
      {
        t: "~15:10", k: "flight",
        title: "At the terminal",
        text: "About two hours before both departures.",
        place: { name: "Athens Airport", q: "Athens International Airport Eleftherios Venizelos" },
      },
      {
        t: "17:00", k: "flight",
        title: "Yury — British Airways BA 635 to London",
        text: "ATH 17:00 → LHR 19:00.",
        place: { name: "London Heathrow", q: "London Heathrow Airport Terminal 5" },
        booked: "Booked · Economy Basic",
      },
      {
        t: "17:10", k: "flight",
        title: "Sam — Emirates EK 209 to Newark",
        text: "ATH 17:10 → EWR 21:10, 11 hours. Two checked bags included.",
        place: { name: "Newark Airport", q: "Newark Liberty International Airport" },
        booked: "Booked · Economy Flex",
      },
    ],
  },
];
