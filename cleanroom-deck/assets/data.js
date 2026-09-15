/* =====================================================================
   CLEANROOM & GMP TRAINING DECK — CONTENT
   Edit this file to change wording; the app renders whatever is here.
   Layout keys: intro | points | cards | table | flow | split | stats |
                callout | quiz | end
   ===================================================================== */

const TOPICS_A = [

/* ----------------------------- 1. DESIGN ---------------------------- */
{
  id: "design",
  n: 1,
  title: "Cleanroom & Facility Design",
  icon: "🏗️",
  accent: "#00d4ff",
  tagline: "Grades, zoning, flow, surfaces and barrier technology",
  refs: ["EU GMP Annex 1 (2022) §4", "ISO 14644-1:2015 / -4", "PIC/S PI 007 Ch.5"],
  slides: [
    {
      k: "intro",
      t: "Cleanroom & Facility Design",
      lead: "A cleanroom is not a very clean room. It is an engineered system that keeps a defined grade of air quality around exposed product — while people, machines and materials keep trying to contaminate it.",
      objectives: [
        "Read and apply the EU GMP grade limits for classification",
        "Design zoning, flow and pressure cascade that protect the critical zone",
        "Specify surfaces, airlocks and transfers that can be cleaned and disinfected",
        "Choose between open technology, RABS and isolators with a documented rationale",
        "Spot the design flaws that inspectors and audits find most often"
      ]
    },
    {
      k: "points",
      t: "What the design must actually achieve",
      sub: "Every requirement in Annex 1 §4 serves one of these six goals",
      ref: "Annex 1 §2.2 · §4.5–4.20",
      items: [
        ["Stop introduction", "Air, people, materials and equipment must not carry particles or microbes into the critical zone."],
        ["Stop generation", "Non-shedding, impervious, unbroken surfaces; minimal projecting ledges; no unnecessary movement of hands and objects."],
        ["Stop retention", "Smooth, coved, sealable; no dead legs, no uncleanable recesses; drains and sinks prohibited in Grade A and B."],
        ["Maintain the grade in operation", "Classification is proven at rest AND in simulated operation — a room that is only clean when empty is not a cleanroom."],
        ["Flush and recover", "Filtered air must flush the area and restore the grade within a defined clean-up period (guidance <20 min)."],
        ["Be operable and maintainable", "Observation windows or cameras, maintenance outside the cleanroom where practicable, and space for validated cleaning."]
      ]
    },
    {
      k: "table",
      t: "Grade limits for classification",
      sub: "Annex 1 (2022) Table 1 — maximum permitted total particle concentration, particles per m³",
      ref: "Annex 1 §4.27 Table 1",
      cols: ["Grade", "≥0.5 µm at rest", "≥0.5 µm in operation", "≥5 µm at rest", "≥5 µm in operation"],
      rows: [
        ["A", "3 520", "3 520", "not specified (a)", "not specified (a)"],
        ["B", "3 520", "352 000", "not specified (a)", "2 930"],
        ["C", "352 000", "3 520 000", "2 930", "29 300"],
        ["D", "3 520 000", "not predetermined (b)", "29 300", "not predetermined (b)"]
      ],
      note: "(a) Measure 5 µm where your CCS or historical trend says it is informative. (b) Grade D in-operation limits are set by the manufacturer from risk assessment and routine data. The 2022 revision aligned Grade A/B with ISO Class 5 (3 520/m³ at ≥0.5 µm) — the old 3 520 000 figure no longer applies."
    },
    {
      k: "flow",
      t: "Zoning: the room follows the process, not the calendar",
      sub: "Clean-side to product to dirty side — flow never doubles back",
      ref: "Annex 1 §4.1–4.13",
      steps: [
        ["Goods in", "Unpack / outer decontamination, material airlock, approved-item list"],
        ["Wash & prep", "Component washing, depyrogenation / autoclave loading, double-door steriliser sealed into the wall"],
        ["Gown", "Personnel airlock with increasing cleanliness; final stage of the airlock equals the grade it leads into"],
        ["Aseptic core", "Grade A under UDAF inside RABS or isolator, Grade B background; no drains, no sinks"],
        ["Sterilise & close", "Terminal sterilisation or filter sterilisation, crimping, CCIT"],
        ["Inspect & finish", "Visual inspection, labelling, packaging, controlled-store dispatch"]
      ],
      note: "Removal of waste and environmental samples out of Grade A/B uses a separate unidirectional route — or documented time-based separation if one route is unavoidable."
    },
    {
      k: "cards",
      t: "Fabrication details that decide the outcome",
      items: [
        ["🧱", "Walls & ceilings", "Sealed, smooth, impervious panels; joints sealed and coved; ceilings sealed so nothing drops from the plenum."],
        ["🦶", "Floors", "Seamless resin, coved skirting, no open joints; resistant to sporicidal agents and hot-water washing."],
        ["🚪", "Doors", "Full-height, flush, no recesses; sliding doors are undesirable; interlocked for Grade A/B airlocks, visual or audible warning minimum for C/D."],
        ["💡", "Lighting & services", "Sealed LED panels, switches and sensors flush or outside; all penetrations sealed; minimal surface-mounted pipework."],
        ["🪟", "Observation", "Windows or cameras giving a full view of Grade A/B activity so supervision does not need entry (§4.17)."],
        ["🧯", "Furniture & equipment", "Non-shedding, cleanable, no wooden or painted items; equipment maintained outside the cleanroom where practicable."]
      ]
    },
    {
      k: "points",
      t: "Pressure cascade, airlocks and transfers",
      ref: "Annex 1 §4.11–4.16",
      items: [
        ["10 Pa minimum difference", "Adjacent rooms of different grades: ≥10 Pa is the guidance value. Direction of flow is as important as magnitude."],
        ["Critical ΔP is continuously monitored", "Recorded, alarmed, and the alarm may not be overridden without assessment; the response steps are in a written procedure."],
        ["Airlocks flush effectively", "Filtered air purge, doors never open simultaneously, interlock plus time delay where needed to hold the cascade."],
        ["Airlock grades match the destination", "The final change-room / airlock stage is the same grade (viable and total particle) as the room it leads into, at rest."],
        ["Materials enter sterilised", "Double-ended autoclave or depyrogenation tunnel sealed into the wall; otherwise a validated transfer-disinfection, RTS or sterilising filter."],
        ["Containment inverts the cascade", "Potent, toxic, pathogenic or radioactive work may need negative pressure and dedicated air; the incoming air must then be of the same or higher grade."]
      ]
    },
    {
      k: "split",
      t: "Open room, RABS or isolator?",
      sub: "Barrier technology is a CCS decision — alternatives to RABS/isolators must be justified (§4.3)",
      ref: "Annex 1 §4.18–4.22",
      left: {
        h: "RABS",
        tone: "info",
        items: [
          "Background must be minimum Grade B",
          "Grade A UDAF with first air over the critical zone; positive airflow out of the barrier",
          "Gloves sterilised before installation and before each campaign; disinfected after any exposure to the room",
          "Direct intervention is a deviation — restricted to defined aseptic interventions",
          "Airflow visualisation must prove no ingress during door openings and interventions"
        ]
      },
      right: {
        h: "Isolator",
        tone: "good",
        items: [
          "Open isolator background minimum Grade C; closed isolator minimum Grade D — risk-based and justified in the CCS",
          "Automated, validated bio-decontamination with a sporicidal agent (e.g. VHP); gloves extended with fingers separated",
          "Glove and enclosure leak testing at least at the beginning and end of each batch or campaign",
          "Transfer by validated RTP, rapid transfer ports or double-door steriliser",
          "Negative-pressure isolators only when containment is essential, with extra protection of the critical zone"
        ]
      }
    },
    {
      k: "points",
      t: "Design flaws that audits keep finding",
      sub: "Each of these is cheaper to fix on paper than after qualification",
      items: [
        ["Grades assumed, never proven", "No in-operation classification, no airflow visualisation video retained, no recovery test."],
        ["Return air paths blocked", "Low-level grilles covered by trolleys, bins or line parts — the cascade quietly reverses."],
        ["Unsealed penetrations", "Cable glands, service drops and ceiling tiles left open above Grade A; contamination falls into first air."],
        ["Hand-wash in the wrong room", "Sinks or hand-washing in a change room leading straight into Grade B."],
        ["Emergency egress defeats the design", "Panic hardware that leaves doors ajar and no alarm on the pressure loss — the site trades safety for compliance; design both."],
        ["No capacity for the real crew", "Gowning rooms sized for average, not for shift change peak, causing crowding and breaches."]
      ]
    },
    {
      k: "quiz",
      t: "Knowledge check — Cleanroom & Facility Design",
      questions: [
        {
          q: "Minimum recommended air pressure difference between adjacent cleanrooms of different grades?",
          opts: ["1 Pa", "10 Pa", "50 Pa", "No minimum, only airflow direction matters"],
          a: 1,
          why: "Annex 1 §4.14 gives 10 Pa as the guidance value, with direction of airflow verified by visualisation studies."
        },
        {
          q: "Under Annex 1 (2022), the maximum permitted ≥0.5 µm particle count for Grade A is:",
          opts: ["3 520 per m³", "352 000 per m³", "3 520 000 per m³", "35 200 000 per m³"],
          a: 0,
          why: "Table 1 aligns Grade A at rest and in operation with 3 520 particles ≥0.5 µm per m³ (ISO Class 5 level). The 3 520 000 figure belongs to the pre-2022 table and to Grade B in operation as an ISO-8 type limit."
        },
        {
          q: "Sinks and floor drains in the cleanroom are:",
          opts: ["Allowed in Grade B if trapped", "Prohibited in Grade A and B", "Allowed everywhere with a water seal", "Required for cleaning"],
          a: 1,
          why: "§4.9: sinks and drains are prohibited in Grade A and B. In lower grades, air breaks and traps prevent back-flow and they must be cleaned and disinfected regularly."
        }
      ]
    },
    {
      k: "end",
      t: "Design topic — what to remember",
      items: [
        ["Protect the critical zone first", "Grade A conditions and first air over every exposed product surface; everything else supports that."],
        ["Prove it in operation", "Classification, visualisation and recovery at rest AND with the maximum number of operators simulated."],
        ["Cascade, then doors, then behaviour", "10 Pa, interlocked airlocks and monitored ΔP are the physical controls; people defeat them all."],
        ["Barrier technology is a choice you must defend", "RABS or isolators with a risk assessment in the CCS; justify any alternative."],
        ["Design for cleaning and maintenance", "If it cannot be cleaned, disinfected and repaired to grade, it does not belong inside."]
      ]
    }
  ]
},

/* --------------------------- 2. QUALIFICATION ----------------------- */
{
  id: "qual",
  n: 2,
  title: "Qualification & Validation",
  icon: "🧪",
  accent: "#00ff88",
  tagline: "DQ / IQ / OQ / PQ, requalification, sterilisation, APS and CSV",
  refs: ["EU GMP Annex 15", "Annex 1 §4.23–4.32", "GAMP 5 (2nd ed.)"],
  slides: [
    {
      k: "intro",
      t: "Qualification & Validation",
      lead: "Qualification says the equipment and facility do what they are designed to do. Validation says the process reliably makes good product. Both are lifecycle activities — not a binder produced once.",
      objectives: [
        "Map the V-model from URS to periodic review",
        "Know which tests qualify a cleanroom and to what acceptance criteria",
        "Set requalification intervals and trigger events",
        "Validate sterilisation, cleaning and computerised systems",
        "Use APS / media fill as evidence of an aseptic process in control"
      ]
    },
    {
      k: "flow",
      t: "The lifecycle, in order",
      sub: "Each stage has a protocol, acceptance criteria and a traceable link back to the requirement it satisfies",
      ref: "Annex 15 §1–3",
      steps: [
        ["URS", "What is needed, including GMP, safety, data and grade requirements"],
        ["DQ", "Design reviewed against URS + risk assessment (FMEA); construction and cleanliness verified"],
        ["FAT / SAT", "Factory and site acceptance of the as-built system"],
        ["IQ", "Documentation, materials certificates, calibration certificates, as-built drawings, filter records"],
        ["OQ", "Challenge each function and alarm across its operating range, at rest and in operation"],
        ["PQ / classification", "Worst-case, maximum personnel, simulated operations, ≥3 days where required"],
        ["Requalification", "Periodic and event-driven; feeding the CCS and the annual product quality review"]
      ]
    },
    {
      k: "cards",
      t: "Everything that needs a qualification package",
      items: [
        ["🌀", "HVAC & cleanrooms", "Classification, airflow, ΔP, recovery, visualisation, filter integrity (§4.25 i–ix)."],
        ["💧", "Utilities", "PW / WFI loops, clean steam, compressed gases and HVAC steam: bioburden, endotoxin, TOC, dead-leg and sanitisation studies."],
        ["⚙️", "Process equipment", "Autoclave, depyrogenation tunnel, filler, lyophiliser, milling and mixing — including distribution and penetration studies."],
        ["🧫", "Cleaning & decontamination", "Cleaning validation, VHP or fumigation cycles, sporicidal programme, residue and inactivation studies."],
        ["🖥️", "Computerised systems", "BMS/EMS, SCADA, PLC, eBR, LIMS: Annex 11 / 21 CFR Part 11, GAMP 5, CSA approach."],
        ["🧤", "Barriers & gloves", "Isolator and RABS integrity, glove leak testing, material compatibility with the decontamination agent."]
      ]
    },
    {
      k: "table",
      t: "Cleanroom qualification test matrix",
      sub: "The Annex 1 §4.25 list, with the method and a typical acceptance criterion",
      ref: "Annex 1 §4.25 · ISO 14644-3",
      cols: ["Test", "Method", "Typical acceptance"],
      rows: [
        ["Final filter integrity", "Aerosol scan (PAO/DOP or DOPS)", "≤0.01 % local, ≤0.005 % average penetration"],
        ["Airflow velocity & uniformity", "Thermal anemometer, UDAF grid plane", "0.36–0.54 m/s at the working position"],
        ["Air volume / air-change rate", "Balance hoods at inlets and outlets", "Design value ± 10 % (justify in protocol)"],
        ["Pressure difference", "Calibrated manometers, BMS trend", "≥10 Pa between grades; alarms function"],
        ["Airflow direction & visualisation", "Smoke study, video retained", "No ingress from lower grade; no flow over operators into first air"],
        ["Recovery (clean-down)", "ISO 14644-3, contaminate and count", "100:1 recovery achieved; <20 min clean-up"],
        ["Classification", "Laser particle counter, ≥0.5 and ≥5 µm", "Table 1 limits, at rest and in simulated operation"],
        ["Microbial contamination", "Air, settle, contact plates", "Table 2 limits (Grade A: no growth)"],
        ["Temperature & RH", "Calibrated sensors, mapped", "Set-point ± band defined in the URS"]
      ]
    },
    {
      k: "stats",
      t: "Requalification: clocks and triggers",
      sub: "Intervals are ceilings, not targets — plus event-driven requalification",
      ref: "Annex 1 §4.32",
      items: [
        ["6 months", "Maximum interval, Grade A and B", "classification, filter integrity, air volume, ΔP, velocity"],
        ["12 months", "Maximum interval, Grade C and D", "velocity test may be risk-based; recovery test replaces it for NUDAF"],
        ["1 change", "Any trigger = requalify", "HVAC setting change, final filter change, interrupted air supply, remedial work, deviation"],
        ["100 %", "Failures escalated", "a failed test is a deviation with a batch and product impact assessment"]
      ]
    },
    {
      k: "split",
      t: "Sterilisation and aseptic process validation",
      left: {
        h: "Sterilisation",
        tone: "info",
        items: [
          "Terminal: heat-distribution and heat-penetration studies, F0 concept, biological indicators, load patterns and worst-case loading",
          "Depyrogenation: endotoxin log-reduction demonstrated (typ. ≥3 log for glass, ≥4 log for equipment surfaces)",
          "Sterilising-grade filtration: 0.22 µm with pre- and post-use integrity (bubble point / diffusion), bacterial retention study",
          "Lyophiliser: steam-in-place or other validated cycle, chamber leak test, loading path sterilisation in Grade A/B without barrier (from 25 Aug 2024)",
          "Every cycle is documented: parameters, chart records, and the deviation route for a failed run"
        ]
      },
      right: {
        h: "Aseptic process simulation",
        tone: "good",
        items: [
          "At introduction of each line and process, then at least twice a year — every shift, every aseptic line",
          "Three consecutive successful runs to qualify a new line; ≥4 h per run, extending to the longest realistic campaign",
          "Worst case: maximum operators, all defined interventions, aseptic connection changes, line clearances",
          "5 000–10 000 units per run is the usual expectation to make the statistics meaningful",
          "Any contaminated unit = failed APS: investigate, correct, then three consecutive successful runs",
          "Read at 20–25 °C and 30–35 °C; false negatives are a bigger risk than false acceptance"
        ]
      }
    },
    {
      k: "points",
      t: "Cleaning validation and computerised systems",
      items: [
        ["Cleaning limits: justified, not guessed", "MACO from PDE/ADE, maximum daily dose, batch size and safety factor; plus visual cleanliness, TOC or conductivity for the analytical method."],
        ["Worst case drives the study", "Most difficult product, hardest-to-clean surface, longest dirty hold time, shortest drying, lowest soil solubility; ≥3 consecutive successful runs."],
        ["Recovery has to be proven", "Swab and rinse recovery studies (commonly ≥50 %) on the actual surface material; neutralisation demonstrated."],
        ["Annex 11 = lifecycle, not paperwork", "User requirement traceability, risk-based testing, configuration control, security and audit trail, then ongoing verification of changes."],
        ["Data integrity is designed in", "No shared logins, audit trail always on and reviewed, original raw data retained, time sources synchronised, spreadsheets controlled or eliminated."],
        ["A validated state that drifts is invalid", "Change control feeds the validation master plan; retired systems get a documented data-migration and retention plan."]
      ],
      ref: "Annex 15 · Annex 11 · 21 CFR Part 11 · GAMP 5"
    },
    {
      k: "quiz",
      t: "Knowledge check — Qualification & Validation",
      questions: [
        {
          q: "Maximum requalification interval for a Grade B cleanroom?",
          opts: ["12 months", "6 months", "24 months", "Only after a deviation"],
          a: 1,
          why: "Annex 1 §4.32: Grade A and B at least every 6 months, Grade C and D every 12 months — plus requalification after changes, maintenance or interruption of air supply."
        },
        {
          q: "A single contaminated unit in an APS / media fill run means:",
          opts: ["Acceptable if under 0.1 %", "Repeat once and continue", "Failed APS: investigate, correct, then three consecutive successful runs", "Only a trend observation"],
          a: 2,
          why: "Annex 1 (2022) removed numeric acceptance counts: any growth triggers an investigation, corrective actions and three consecutive successful APS to demonstrate the process is back in control."
        },
        {
          q: "Final HEPA filter integrity is normally challenged by:",
          opts: ["Bubble point test", "Aerosol upstream/downstream scan with ≤0.01 % local penetration", "Settle plates downstream", "Differential pressure reading only"],
          a: 1,
          why: "Filter scanning (PAO/DOP or DOPS) proves no local leak >0.01 % and no average >0.005 % penetration; ΔP alone says nothing about leaks."
        }
      ]
    },
    {
      k: "end",
      t: "Validation topic — what to remember",
      items: [
        ["Traceability is the proof", "URS → design → test → result: if a requirement has no test, the qualification is incomplete."],
        ["Challenge it at the limits", "OQ/PQ at the extremes of the operating range and with the worst-case crew, not the best day."],
        ["Qualification ≠ routine monitoring", "Proving a room is ISO/GMP grade is a different exercise from the EM programme that keeps watching it (§4.24)."],
        ["Events requalify, not the calendar", "Filter changes, HVAC rework, shutdowns and failures all restart the clock."],
        ["Software is part of the validated system", "BMS, EMS, eBR and LIMS fail audits as often as equipment does."]
      ]
    }
  ]
},

/* ---------------------------- 3. GOWNING ---------------------------- */
{
  id: "gowning",
  n: 3,
  title: "Personnel Entry & Gowning",
  icon: "🧍",
  accent: "#ffd166",
  tagline: "The human source, gowning sequences, behaviour and qualification",
  refs: ["EU GMP Annex 1 §4.12, §5, §9.4–9.6", "PIC/S PI 007"],
  slides: [
    {
      k: "intro",
      t: "Personnel Entry & Gowning",
      lead: "In an occupied Grade A/B environment, the dominant contamination source walks in on two legs, breathes, sheds skin and thinks it is being careful. Gowning and behaviour are the controls.",
      objectives: [
        "Quantify why personnel dominate the contamination risk",
        "Run a compliant entry and gowning sequence, first step and second step",
        "Judge garment selection, sterilisation and change-out frequency",
        "Coach aseptic behaviour and the exit strategy",
        "Qualify and re-qualify people, and monitor gloved fingertips"
      ]
    },
    {
      k: "stats",
      t: "Why the person is the problem",
      sub: "Illustrative literature values — the point is the order of magnitude, not the decimal",
      items: [
        ["~80 %", "of contamination in an occupied cleanroom is personnel-related", "skin flakes, droplets, garment fibres, behaviour"],
        ["10⁵ / min", "particles ≥0.5 µm shed by a person at rest", "moving fast, talking and rubbing multiply it"],
        ["10⁷ / day", "skin cells shed by one individual", "each can carry viable organisms"],
        ["4 hours", "typical maximum continuous time in Grade B before a break or change", "set and justified by your own site data"]
      ]
    },
    {
      k: "flow",
      t: "Entry sequence, Grade B core",
      sub: "Site SOPs differ in order; what matters is that it is validated, one-way and never rushed",
      ref: "Annex 1 §4.12 · §5.6",
      steps: [
        ["Pre-room", "Outer garments, jewellery, watches and cosmetics off; personal items stay outside; illness and skin condition self-declared"],
        ["Wash", "Hand and forearm washing at the first change-room stage only, dry thoroughly"],
        ["First step", "Hair cover, beard cover, coverall with boots attached or shoe covers, nose-mouth mask, first pair of gloves"],
        ["Disinfect", "Hand disinfection, sterile 70 % IPA for Grade A/B, gloves wetted and rubbed together"],
        ["Second step", "Sterile hood, sterile coverall, goggles, sterile gloves — cuff over gauntlet or glove over cuff per SOP; final IPA spray"],
        ["Enter", "Mirror check, no contact with surfaces, enter without touching the frame, avoid disturbing first air"]
      ],
      note: "Leave-by-a-different-route or time-separated egress is preferred where the CCS shows high risk; doffing is the reverse order, in the correct room, without re-contaminating the corridor."
    },
    {
      k: "cards",
      t: "The garment system",
      items: [
        ["🥼", "Coverall", "Sterile, low-lint, closed design with attached hood and boots for Grade A/B; no exposed cuffs; size chosen by the wearer's fit, not convenience."],
        ["🧤", "Two glove pairs", "Inner pair under the sleeve, outer pair disinfected in use; gloves changed at defined intervals, after any breach and at exit."],
        ["🥽", "Goggles / face shield", "Worn over the mask and hood; single-use or laundered and sterilised; must not be pushed up inside the cleanroom."],
        ["🧼", "Disinfectant", "Sterile, validated agent in Grade A/B; ready-made or aseptically diluted with defined in-use expiry; contact time respected."],
        ["♻️", "Laundering", "De-linting, particle and integrity testing of laundered garments, controlled repair/replacement, sterilisation by autoclave or VHP."],
        ["📋", "Garment records", "Batch/lot traceability, sterilisation cycle record, number of uses before discard, and evidence the garment suits the decontamination agents."]
      ]
    },
    {
      k: "split",
      t: "Aseptic behaviour",
      sub: "Training and supervision matter more than any single item of clothing",
      left: {
        h: "Do",
        tone: "good",
        items: [
          "Move slowly, deliberately and with hands kept low and downstream of first air",
          "Disinfect gloves at a defined frequency and after every contact with a non-sterile surface",
          "Sanitise items entering the critical zone and allow the contact time to dry",
          "Use the agreed exit strategy when something is touched, dropped or obstructed",
          "Keep body parts and objects out of the direct line between the HEPA filter and exposed product",
          "Announce interventions so the second person and the record reflect reality"
        ]
      },
      right: {
        h: "Don't",
        tone: "bad",
        items: [
          "Do not run, shuffle, rub gloves together, adjust goggles or scratch",
          "Do not talk unnecessarily, and never over open product or components",
          "Do not lean on walls, tables, doors or equipment",
          "Do not place hands or arms above open containers",
          "Do not pick items up off the floor and continue",
          "Do not prop doors, block returns, or bypass an interlock to save time"
        ]
      }
    },
    {
      k: "points",
      t: "Qualifying and monitoring people",
      ref: "Annex 1 §9.4–9.6",
      items: [
        ["Gowning qualification is mandatory", "Each person qualified for the specific gowning procedure and grade before access, with visual observation and viable sampling (gown and glove prints)."],
        ["Re-qualify at least every 6 months", "And after long absence, a change to the gowning procedure, or any excursion attributable to the individual."],
        ["Sample gloved fingertips in operation", "Finger/thumb prints from Grade A/B operators during aseptic operations — not only on exit — plus gown surface sampling."],
        ["Set and obey the limits", "Table 2 contact-plate limits apply at qualification; any result above the action limit triggers exclusion, investigation, retraining and re-qualification."],
        ["Health and hygiene controls", "Written screening and self-declaration, exclusion of weeping sores, infections and open wounds, hand-hygiene verification, and no cosmetics or nail products."],
        ["Train the behaviour, not only the sequence", "Microbiology basics, contamination routes, aseptic technique and cleanroom conduct, refreshed by the same 6-monthly cycle."]
      ]
    },
    {
      k: "callout",
      t: "Air showers, entry gates and access control",
      quote: "An air shower is an accessory, never a control. If the gowning programme depends on it, the programme is not validated.",
      ref: "Annex 1 §4.12 · §2.2",
      points: [
        ["Personnel air showers", "Turbulent purge can re-entrain particles from garments and encourage a false sense of security; rely on gowning and airlock design, and justify any air shower in the CCS."],
        ["Material air showers / pass-throughs", "Validated for the load pattern, filtered and flushed, with documented dwell and disinfection time."],
        ["Access control", "Badge or PIN access limited to qualified personnel for the grade they work in; entry log supports investigations and shift reconstruction."],
        ["Crowding", "Maximum personnel numbers per room are part of qualification — a room qualified with 4 people is not qualified for 8."]
      ]
    },
    {
      k: "quiz",
      t: "Knowledge check — Personnel & Gowning",
      questions: [
        {
          q: "How often must cleanroom personnel gowning be requalified at a minimum?",
          opts: ["Every 6 months", "Annually", "Every 3 years", "Only after a deviation"],
          a: 0,
          why: "Annex 1 §9.4 requires documented gowning qualification and requalification at least every 6 months, including for changes to the procedure or after excursions."
        },
        {
          q: "Glove / finger-print sampling for personnel working in Grade A/B should be taken:",
          opts: ["Only at the end of the gowning procedure", "During aseptic operations as well as on exit", "Once a year at requalification only", "Never — it is not a valid method"],
          a: 1,
          why: "Annex 1 requires monitoring of gloved fingertips during operations, because that is when the gloves can contaminate the critical zone."
        },
        {
          q: "Hand-washing facilities should generally be provided:",
          opts: ["In the change room directly accessing Grade B", "Only in the first stage of the changing rooms", "Inside the Grade A area", "Nowhere — sanitiser replaces washing"],
          a: 1,
          why: "§4.12 i: hand washing in the first stage only; sinks and water sources near Grade B create a moisture and microbial risk."
        }
      ]
    },
    {
      k: "end",
      t: "Gowning topic — what to remember",
      items: [
        ["Gowning is a validated process", "Sequence, garments, disinfectant and duration are qualification evidence, not a preference."],
        ["One-way flow, matched grades", "Personnel airlock stages increase in cleanliness; the last stage equals the destination grade at rest."],
        ["Behaviour is the real variable", "Speed, talking, leaning and glove contact decide the outcome; observe and coach it."],
        ["Qualify the person and re-qualify", "Initial qualification, 6-monthly requalification, in-operation fingertip sampling, and exclusion when limits are exceeded."],
        ["Write the exit strategy", "Every operator must know what to do after a touch, a drop or an alarm — and report it."]
      ]
    }
  ]
},

/* ---------------------- 4. CROSS-CONTAMINATION --------------------- */
{
  id: "contamination",
  n: 4,
  title: "Cross-Contamination & Contamination Control",
  icon: "🦠",
  accent: "#ff6b6b",
  tagline: "Sources, routes, the Contamination Control Strategy, disinfection",
  refs: ["EU GMP Annex 1 §2.3–2.6, §4.33–4.36", "EudraLex Ch.3 §1.6–1.7", "EMA PDE guideline"],
  slides: [
    {
      k: "intro",
      t: "Cross-Contamination & Contamination Control",
      lead: "Contamination is not prevented by one hero control. It is prevented by a documented strategy in which design, process, cleaning, people and monitoring cover the same risks from different angles.",
      objectives: [
        "Map sources and routes of microbial, particle and chemical contamination",
        "Write and review a Contamination Control Strategy that satisfies Annex 1",
        "Separate products by design, time or dedicated services",
        "Build a validated cleaning and disinfection programme",
        "Attack harbourage points and resistant organisms"
      ]
    },
    {
      k: "cards",
      t: "Sources, in order of how often they bite",
      items: [
        ["🧍", "Personnel", "Skin, clothing, droplets, poor technique, unwashed hands, unqualified access, traffic through the clean core."],
        ["📦", "Materials & components", "Bioburden and endotoxin on raw materials, secondary packaging, single-use assemblies, lubricants, gaskets."],
        ["🌀", "Air & HVAC", "Filter leaks, bypass, recirculation of poorly classified air, condensation, unbalanced cascade."],
        ["💧", "Water & steam", "WFI/PW loop biofilm, point-of-use filters, clean steam quality, condensate dripping into open product."],
        ["🔧", "Equipment", "Shared parts, dead legs, threads and seals, product residues, maintenance tools and lubricant, missing o-rings."],
        ["🚻", "The environment itself", "Drains, floor sinks, ceilings, walls, paint, ice machines, and any standing water in lower grades."]
      ]
    },
    {
      k: "table",
      t: "Routes and their controls",
      cols: ["Route", "How it travels", "Primary controls"],
      rows: [
        ["Airborne", "Suspended particles and droplets between rooms, over operators, from the floor", "Grade-appropriate UDAF, ≥10 Pa cascade, airflow visualisation, no obstruction of returns, door discipline"],
        ["Direct contact", "Gloves, tools, hands, transfer of unwiped items", "Gowning and glove programme, disinfection of all items entering, defined aseptic technique"],
        ["Shared equipment", "Multi-product lines, hoses, filters, bowls, adapters", "Dedicated parts, campaign scheduling, validated cleaning and changeover, visual cleanliness limits"],
        ["Common utilities", "One WFI header, one compressed-air main, shared condensate", "Loop design without dead legs, point-of-use filtration, separation for high-potency work, utility EM"],
        ["Personnel flow", "Same crew on two products in one shift, corridor crossings", "Segregated change rooms, traffic planning, colour-coded garments, shift separation"],
        ["Packaging & labels", "Mis-applied labels and closures from a previous batch", "Line clearance, in-process checks, automated camera verification, reconciliation"]
      ],
      note: "EU GMP requires that the risk of cross-contamination be reduced by suitable separations, designs and practices — physical, technical or organisational — and that the effectiveness be verified (§1.6–1.7)."
    },
    {
      k: "points",
      t: "The Contamination Control Strategy",
      sub: "Mandatory for every sterile operation, and the first document an Annex 1 inspector will ask for",
      ref: "Annex 1 §2.3–2.6",
      items: [
        ["What it is", "A single documented strategy that defines all critical control points and assesses the effectiveness of design, procedural, technical and organisational controls plus monitoring."],
        ["What it must cover", "Plant & process design, premises and equipment, personnel, utilities, raw materials, containers and closures, vendors, outsourcing, process risk, process and sterilisation validation, preventive maintenance, cleaning and disinfection, monitoring, prevention mechanisms, continuous improvement."],
        ["How it is built", "With QRM: identify the risk, decide the control, verify it works, and record why residual risk is acceptable. Monitoring alone never gives assurance of sterility."],
        ["Review cycle", "Actively reviewed and updated — at least annually through management review and the product quality review; changes are assessed for CCS impact before and after implementation."],
        ["Reference, don't duplicate", "Existing quality systems can be referenced rather than replaced, but the interactions between them must be shown and understood."],
        ["Evidence it lives", "Self-inspection findings, EM trends, deviation and CAPA data, APS results and inspection outcomes must visibly feed the next revision."]
      ]
    },
    {
      k: "split",
      t: "Segregation: what needs more than an SOP",
      sub: "Chapter 3 and Chapter 9 of EudraLex define when dedicated facilities are required",
      ref: "EudraLex Vol.4 Ch.3 §1.6 · Ch.9 Annex 19",
      left: {
        h: "Dedicated facility required",
        tone: "bad",
        items: [
          "β-lactam antibiotics (all forms of the pharmacologically active nucleus)",
          "Cytotoxics — dedicated suites, negative pressure, single-pass air",
          "Highly sensitising or highly toxic compounds where PDE cannot be met",
          "Certain live biologicals and pathogenic organisms (containment level per biosafety assessment)",
          "Handling of animals used for production where applicable"
        ]
      },
      right: {
        h: "Risk-based controls may suffice",
        tone: "good",
        items: [
          "Ordinary multi-product oral, topical and sterile non-potent lines, with validated cleaning and campaign planning",
          "Health-based exposure limits (PDE/ADE) calculated and verified by swab, rinse and air sampling",
          "Campaign scheduling with time separation and full changeover documentation",
          "Segregated air handling only where recirculation cannot be justified in the CCS",
          "Shared equipment after a change control, cleaning validation and effectiveness check"
        ]
      }
    },
    {
      k: "flow",
      t: "Cleaning and disinfection programme",
      sub: "Cleaning removes the soil; disinfection reduces the bioburden; sporicidal kills what survives",
      ref: "Annex 1 §4.33–4.36",
      steps: [
        ["Dry removal", "Gross product and debris removed so the agent can reach the surface"],
        ["Detergent clean", "Validated agent, dilution, contact time and mechanical action; removes residues and film"],
        ["Rinse & dry", "Purified or WFI rinse as required; drying prevents dilution of the next agent and microbial growth"],
        ["Disinfect", "Two agents with different modes of action; observed contact time respected; sterile product used in Grade A/B"],
        ["Sporicidal", "Periodic application on a defined frequency (e.g. weekly or monthly) including floors, ceilings and difficult areas"],
        ["Verify", "EM trends, organism identification, in-use expiry and residue checks; effectiveness re-confirmed after any change"]
      ],
      note: "Validation is performed on the actual surface material, with a test organism set including spore formers, and must demonstrate at least a 2-log (MEM 100) reduction for antimicrobial products and 4-log (MEM 10 000) for non-antimicrobial products, using neutralising media to avoid false success."
    },
    {
      k: "points",
      t: "Harbourage, resistance and back-flow",
      items: [
        ["Biofilm in water systems", "Rough welds, dead legs longer than 6D, low loop velocity and cold spots shelter Gram-negatives and non-tuberculous mycobacteria."],
        ["Drains and floor sinks", "Back-flow, dry traps and condensation on the underside of covers; use air breaks, fresh water flush and documented cleaning."],
        ["Disinfectant tolerance", "Rotating agents, monitoring for a shift in flora, verifying sporicidal coverage and removing residue film that shelters cells."],
        ["Spores in the room", "Bacillus and Clostridium species arriving on cartons, garments and maintenance items — a sporicidal programme is not optional."],
        ["Maintenance intrusion", "Tools, greases, replaced parts, welding fume and temporary hoses; controlled work protocols, post-work cleaning, disinfection and EM before restart."],
        ["Single-use assemblies", "Bioburden and endotoxin certificates, gamma dose effects, integrity testing where the supplier's data is not sufficient for your process."]
      ]
    },
    {
      k: "flow",
      t: "When contamination shows up",
      sub: "The same route for any excursion: an action-limit result, a fouled surface, a failed APS, a bioburden spike",
      steps: [
        ["Stop & protect", "Halt the affected step, secure exposed product, isolate the equipment and place the batch on hold"],
        ["Document & sample", "Contemporaneous facts, photographs, targeted sampling of the area, the operator's gloves and the suspect item"],
        ["Identify", "Species-level identification and comparison with historical isolates, personnel and environmental banks"],
        ["Investigate", "Root cause with evidence, and an explicit assessment of whether the control failed or was not followed"],
        ["Assess impact", "Other batches, other products, the CCS, the validation state and patient risk"],
        ["Correct & verify", "CAPA with owners and dates, effectiveness check on the next runs, then update the CCS and the training"]
      ]
    },
    {
      k: "quiz",
      t: "Knowledge check — Contamination Control",
      questions: [
        {
          q: "How many types of disinfecting agent does Annex 1 expect in a cleanroom programme?",
          opts: ["One, well validated", "More than one, with different modes of action", "Three, rotated monthly", "Any agent that passes growth promotion"],
          a: 1,
          why: "§4.33: more than one type of disinfecting agent should be employed so that combined usage is effective against bacteria and fungi, with periodic use of a sporicidal agent."
        },
        {
          q: "The CCS must be:",
          opts: ["Filed once at licence approval", "Actively reviewed and updated, with its effectiveness considered in periodic management review", "Prepared only for new facilities", "Limited to the EM plan"],
          a: 1,
          why: "Annex 1 §2.3 and §2.6: the CCS is a living document; changes to existing systems are assessed for impact on the CCS before and after implementation."
        },
        {
          q: "Disinfectants and detergents used in Grade A and B areas must be:",
          opts: ["Tap-water dilutions used same day", "Sterile prior to use", "Filtered through a 5 µm filter", "Only validated for stainless steel"],
          a: 1,
          why: "§4.35 requires sterility before use in Grade A and B, with microbial monitoring of dilutions prepared on site and defined storage periods."
        }
      ]
    },
    {
      k: "end",
      t: "Contamination topic — what to remember",
      items: [
        ["One document, all controls", "The CCS is where design, cleaning, utilities, people and EM are joined up — and where their gaps become visible."],
        ["Prevention beats detection", "Monitoring demonstrates that a control works; it never replaces the control itself."],
        ["Segregate by hazard, not by convenience", "β-lactams and cytotoxics are dedicated by rule; everything else needs a calculated, verified PDE argument."],
        ["Disinfection is a validated process", "Clean first, two modes of action, sporicidal on a schedule, contact time honoured, effect proven by EM."],
        ["Any excursion ends in a document", "Investigation, impact assessment, CAPA and a CCS update — or the event will happen again."]
      ]
    }
  ]
},

/* ------------------------------ 5. HVAC ----------------------------- */
{
  id: "hvac",
  n: 5,
  title: "HVAC & Air Handling",
  icon: "🌀",
  accent: "#a78bfa",
  tagline: "Air path, filtration, velocity, pressure cascade and recovery",
  refs: ["Annex 1 §4.14–4.20, §4.30", "EN 1822", "ISO 14644-3"],
  slides: [
    {
      k: "intro",
      t: "HVAC & Air Handling",
      lead: "The HVAC system is the cleanroom's engine: it sets the grade, holds the cascade, controls humidity and heat, and protects first air over open product. When it drifts, everything downstream becomes a deviation.",
      objectives: [
        "Trace air from intake to exhaust and name the control at each stage",
        "Apply velocity, air-change and pressure-differential criteria",
        "Understand HEPA filtration, integrity testing and change-out",
        "Design monitoring, alarms and recovery after disturbance",
        "Recognise the failure modes inspectors look for"
      ]
    },
    {
      k: "points",
      t: "What the system has to deliver",
      items: [
        ["Cleanliness", "Filtered air at a supply quality that achieves and maintains the grade under all operational conditions (§4.14)."],
        ["First-air protection", "Unidirectional flow over and away from exposed product and open components at the working position (§4.30)."],
        ["Cascade and containment", "Positive pressure relative to lower grades — or negative pressure where a hazard must be contained."],
        ["Temperature and humidity", "Comfort and product requirements; RH also limits static and microbial growth; typical 20–25 °C and 30–60 % RH unless the product dictates otherwise."],
        ["Recovery", "After door openings, interventions or a shutdown, the area returns to grade within the qualified clean-up period."],
        ["Controllable and monitorable", "Sensors, trends and alarms integrated with the BMS/EMS, with data retained as GMP records."]
      ],
      ref: "Annex 1 §4.14 · §4.16 · §4.30"
    },
    {
      k: "flow",
      t: "The air path",
      sub: "Read it left to right and ask, at each stage, what happens if this component fails",
      steps: [
        ["Intake", "Weather louvers, bird mesh, first stage 30–60 % panel filter, fresh-air damper"],
        ["Mixing", "Return / recirculated air blended with fresh air where the CCS allows it"],
        ["Conditioning", "Cooling coil, heating coil, humidification with clean steam, dehumidification, condensate trap and drain"],
        ["Fan & control", "Supply fan with VFD, VAV or damper control, silencers, pressure-independent flow control"],
        ["Second filtration", "Fine / bag filters (e.g. ePM1 60–80 %, F9) to protect the terminal filters"],
        ["Terminal HEPA", "H14 in the ceiling grid, gel or gasket seal, scan-tested, low turbulence downstream"],
        ["Room & egress", "UDAF over the critical zone, low-level returns opposite, dedicated exhaust with HEPA for potent areas"]
      ],
      note: "Fresh-air rate must cover room pressurisation losses, occupancy and any exhaust demand; system restart after a trip needs a validated recovery time before personnel and product return."
    },
    {
      k: "stats",
      t: "Design and acceptance numbers",
      ref: "Annex 1 §4.30 · EN 1822 · ISO 14644-3",
      items: [
        ["0.36–0.54 m/s", "UDAF velocity at the working position (guidance range)", "±20 % uniformity across the device, or justify in the CCS"],
        ["≥10 Pa", "Minimum ΔP between adjacent rooms of different grade", "Continuously monitored where the ΔP is critical"],
        ["60–90 / 20–40", "Typical ACH, Grade A–B vs Grade C–D", "Set by classification, recovery and NUDAF design (0.25–0.5 m/s duct guidance)"],
        ["<20 min", "Clean-up period to reach at-rest grade after operations", "Guidance value in §4.29; determined during qualification"]
      ]
    },
    {
      k: "cards",
      t: "Filtration: the part that must never be assumed",
      items: [
        ["🧫", "HEPA / ULPA class", "H14 = ≥99.995 % at MPPS (EN 1822). Choose the class for the process, not for the catalogue."],
        ["🔍", "Integrity testing", "Aerosol scanning: ≤0.01 % local and ≤0.005 % average penetration; at installation, after shutdown work and at each requalification."],
        ["🧷", "Housing and seal", "Gel seal or knife-edge gasket, clamping pressure per the manufacturer's data, no warped frames, filters logged by serial number."],
        ["🧤", "Change-out", "Bag-in/bag-out where the area is Grade A/B, gowning and PPE for the technician, cleaning and re-testing of the room afterwards."],
        ["🧴", "Sterilising filters", "0.22 µm bacterial-retentive grade, integrity limits from a bacterial retention study, wetted bubble point or diffusion test before and after use."],
        ["⚠️", "Common filter failures", "Bypass at the seal, pinholes from handling, missing gaskets after maintenance, untested new filters, single-use housings reused."]
      ]
    },
    {
      k: "points",
      t: "Cascade control, alarms and monitoring",
      ref: "Annex 1 §4.16",
      items: [
        ["Define which ΔP are critical", "Set points and criticality are considered in the CCS; critical differences are continuously monitored and recorded."],
        ["Warn instantly", "A warning system must indicate any failure of air supply or drop below the set limit; alarm delay must be assessed and justified."],
        ["No silent overrides", "An alarm may not be overridden without assessment, and a written procedure defines the operator's steps."],
        ["Interlocks and time delay", "Airlock doors cannot open simultaneously; sequence control keeps the cascade intact through the intervention."],
        ["Egress without defeat", "Emergency doors must release mechanically and alarm the loss of pressure — safety and compliance together."],
        ["Trend, don't just read", "ΔP, velocity, temperature and RH trends reviewed in the EM and quality reviews; sensor drift is a finding."]
      ]
    },
    {
      k: "split",
      t: "Recirculation, energy and containment",
      sub: "Where the design trade-off is decided — and documented",
      left: {
        h: "Recirculate only if justified",
        tone: "info",
        items: [
          "Air from a room where product is exposed should not be recirculated unless the CCS supports it",
          "Any recirculation across grades requires proven filtration, no carry-over of potent material and no cross-contamination path",
          "Terminal HEPA on recirculated air is not a substitute for a risk assessment",
          "Shared return air between two products is a classic 483 / GMP+ finding",
          "Re-circulating air through a room in use must not disturb first air"
        ]
      },
      right: {
        h: "Containment and exhaust",
        tone: "good",
        items: [
          "Potent and cytotoxic suites: single-pass air, dedicated extract, HEPA on exhaust, negative cascade",
          "Exhaust air from Grade A/B or from decontamination cycles is treated before release (HEPA, scrubber)",
          "Non-return dampers and interlocked extract fans prevent reverse flow during a trip",
          "Isolator and RABS: pressure and airflow direction across the interface monitored during operation",
          "Energy measures (heat recovery, VFD, set-point review) are changes — run them through change control"
        ]
      }
    },
    {
      k: "points",
      t: "HVAC failure modes to design against",
      items: [
        ["Overnight or weekend shutdown", "No recovery qualification, no restart procedure, product left exposed in an unclassified room."],
        ["Fan or belt failure with no alarm", "Cascade lost quietly; room continues to look and feel normal. Add low-ΔP and low-flow alarms."],
        ["Sensor drift and bad placement", "Transmitters installed in dead zones or out of calibration; verified as part of requalification, and cross-checked with portable instruments."],
        ["Blocked or painted returns", "Maintenance work leaves grilles painted over or storage placed in front of them, reversing the pattern."],
        ["Undocumented set-point changes", "Commissioning values changed for comfort or energy without change control or requalification."],
        ["Condensation and mould", "Cold ducts, missing insulation, humidifier scale and wet insulation above ceilings — an EM problem with an engineering cause."]
      ]
    },
    {
      k: "quiz",
      t: "Knowledge check — HVAC & Air Handling",
      questions: [
        {
          q: "Recommended velocity range for unidirectional airflow at the working position?",
          opts: ["0.10–0.20 m/s", "0.36–0.54 m/s", "0.90–1.20 m/s", "Velocity is not specified"],
          a: 1,
          why: "Annex 1 §4.30 gives 0.36–0.54 m/s as a homogeneous guidance range at the working position unless otherwise scientifically justified in the CCS."
        },
        {
          q: "An HEPA filter is accepted after integrity testing when:",
          opts: ["ΔP is within range", "≤0.01 % local penetration and ≤0.005 % average on the scan", "The certificate says H14", "Ten minutes of downstream counts are zero"],
          a: 1,
          why: "Classification by EN 1822 is not a leak test. Scanning must show no local penetration above 0.01 % and no average above 0.005 %."
        },
        {
          q: "Where a critical room air-pressure difference drops below its set point, the warning signal:",
          opts: ["Can be silenced by operators at will", "Must not be overridden without assessment, with a documented response procedure", "Is only needed in Grade D", "Is replaced by the daily manual reading"],
          a: 1,
          why: "§4.16 requires an instant warning for critical differences, justified alarm delays, and a procedure covering what happens when the signal sounds."
        }
      ]
    },
    {
      k: "end",
      t: "HVAC topic — what to remember",
      items: [
        ["Air is a product contact utility", "Treat it like WFI: specified, filtered, monitored, alarmed and requalified."],
        ["Velocity, direction and recovery", "Three different things — measure and document all three, at rest and in operation."],
        ["Integrity of the final filter is proven, not bought", "A certificate plus a scan record, or you have an unverified barrier."],
        ["Critical ΔP is continuously recorded", "With a justified alarm delay and no override without assessment."],
        ["Every change goes through change control", "Set points, filters, grilles and energy retrofits are all CCS-relevant."]
      ]
    }
  ]
}
];
