/* Topics 6-9 of the deck content (see data.js for 1-5). */

const TOPICS_B = [

/* ------------------------ 6. ENVIRONMENTAL MONITORING ---------------------- */
{
  id: "em",
  n: 6,
  title: "Environmental Monitoring",
  icon: "🔬",
  accent: "#2dd4bf",
  tagline: "Viable and non-viable sampling, limits, trending and decisions",
  refs: ["EU GMP Annex 1 §9", "ISO 14644-1/-2, ISO 21501-4", "ISO 11133"],
  slides: [
    {
      k: "intro",
      t: "Environmental Monitoring",
      lead: "EM is the early-warning system of the CCS. It shows whether the controls are working — and it is the data set that supports every batch release, product quality review and inspection answer.",
      objectives: [
        "Choose the right method for air, surfaces, personnel and particles",
        "Design points, frequency, volumes and exposure times from risk",
        "Set alert and action limits from your own data",
        "Handle media, incubation and identification correctly",
        "Turn excursions into investigations, CAPA and CCS updates"
      ]
    },
    {
      k: "cards",
      t: "Methods and what each one answers",
      items: [
        ["💨", "Active air", "Volume-based impaction (e.g. slit-to-arm or centrifugal). Grade A: ≥1 m³ per sample; probe isokinetic in UDAF. Quantifies airborne CFU/m³."],
        ["🍽️", "Settle plates", "90 mm, exposed for the duration of the operation and changed at least every 4 h; exposure must not dry the medium. Passive, closer to real risk in a zone."],
        ["🖐️", "Contact plates", "55 mm RODAC on floors, walls, tables, equipment and gloved fingers. The standard surface method; never swab-and-plate when a plate will do."],
        ["🧻", "Swabs", "Only for irregular surfaces (filler parts, seals, buttons) with a validated wetted swab and neutralising medium; recovery must be qualified."],
        ["🔢", "Non-viable particles", "Laser counter per ISO 21501-4, at rest and in operation, minimum sample volume per ISO 14644-1; remote continuous systems in Grade A/B."],
        ["💧", "Utilities & product-adjacent", "WFI/PW points, clean steam, compressed gases, and equipment surfaces after cleaning — sampled on a plan, not on request."]
      ]
    },
    {
      k: "table",
      t: "Qualification limits vs routine limits",
      sub: "Annex 1 Table 2 (qualification). Routine operational limits come from your own data — but Grade A has no allowance for growth.",
      ref: "Annex 1 §4.31 Table 2 · §9.5",
      cols: ["Grade", "Air CFU/m³", "Settle 90 mm CFU/4 h", "Contact 55 mm CFU/plate", "Typical routine action (illustrative)"],
      rows: [
        ["A", "no growth", "no growth", "no growth", "1 CFU = investigation; growth above alert with no explanation = action"],
        ["B", "10", "5", "5", "alert ≈ 80 % of historical 95th pct; action at qualification level"],
        ["C", "100", "50", "25", "alert/action from trend, reviewed at least annually"],
        ["D", "200", "100", "50", "in-operation limits set by the manufacturer on risk and data"]
      ],
      note: "The last column is typical industry practice and must be justified with your own ≥12–24 months of data. Numbers are not specifications to be tuned until the data passes."
    },
    {
      k: "diagram",
      anim: "emtrend",
      t: "Read the trend, not the number",
      sub: "A dozen results plotted against your own alert and action limits",
      items: [
        ["One point is an event, a pattern is information", "Act on the excursion; use the trend to see whether a control is drifting."],
        ["Identify what you grew", "Genus at minimum, species for Grade A/B and outliers, with a typed isolate bank to compare against."],
        ["Then three documents", "A deviation, a CAPA with an effectiveness check, and an update to the CCS."]
      ],
      note: "Alert levels warn you before the process is out of control; action limits say it already is."
    },
    {
      k: "points",
      t: "Designing the sampling programme",
      ref: "Annex 1 §9.1–9.4",
      items: [
        ["Documented EM plan", "A written plan describing methods, points, frequency, sample volumes, incubation, limits and response — justified by the CCS and risk assessment."],
        ["Points by risk", "Minimum locations per ISO 14644-1, plus additional points at all critical processing locations: point of fill, stopper bowl, closure feeder, operator's hands."],
        ["Frequency by state of control", "Higher frequency where the process is new, after a change, after an excursion, and reduced only with data and justification."],
        ["Media matters", "TSA for total aerobic count, Sabouraud with antibiotic for yeasts and moulds, neutralisers (lecithin, polysorbate, histidine) to stop disinfectant carry-over; ISO 11133 suitability, growth promotion and inhibitory testing."],
        ["Two incubations", "A lower and a higher condition, e.g. 20–25 °C for 5 days and 30–35 °C for 3 days, to recover slow and injured organisms; never a single warm incubation alone."],
        ["Sample handling", "Transport time, temperature and storage before incubation are part of the method; control plates and documented holding times close the loop."]
      ]
    },
    {
      k: "points",
      t: "Non-viable monitoring and recovery",
      ref: "ISO 14644-1/-2 · Annex 1 §4.27",
      items: [
        ["Instrument discipline", "Daily zero and calibration checks, flow-rate verification, count-stability checks; a counter that drifts creates phantom excursions."],
        ["Volume and location", "Sample volume large enough to be meaningful for the size threshold and class; probes positioned so sampling itself does not disturb first air."],
        ["At rest and in operation", "Classification in both states; in-operation counts include the maximum personnel number, and a clean-up period (guidance <20 min) before the at-rest claim."],
        ["Continuous monitoring in the aseptic core", "Remote particle counters in Grade A/B give the early warning and the record of interventions and door openings during a filled batch."],
        ["Recovery and 100:1", "The room must clear a deliberate particle challenge from 100× to 1× the limit within the qualified recovery time (ISO 14644-3)."],
        ["Particles predict microbes — imperfectly", "A clean particle result never proves sterility; an excursion is a process signal and must be assessed as such."]
      ]
    },
    {
      k: "table",
      t: "Alert limits, action limits and what each triggers",
      cols: ["Concept", "Meaning", "Required response"],
      rows: [
        ["Alert limit", "Early-warning level set from historical data (e.g. 80 % of the action limit or a percentile of results)", "Look for a trend or a change; note the investigation if unexplained; no batch impact automatically"],
        ["Action limit", "The level above which the process is out of control", "Deviation raised, root cause investigation, product impact assessment, CAPA, re-testing of the area"],
        ["Grade A expectation", "Any unexplained result above the alert limit is investigated; viable results must be no growth at qualification", "Immediate containment of the affected operation and evaluation of the batch"],
        ["Review of limits", "Re-evaluated with new data, at least annually and after any change to controls", "Change control, revised procedure, communication, and justification retained"]
      ],
      note: "Never respond to an action limit by raising the limit. Changing a limit is a change-controlled decision supported by data and a review of why the excursion occurred."
    },
    {
      k: "points",
      t: "From data to decisions",
      items: [
        ["Identify the organism", "Genus at minimum, species for Grade A/B isolates, action-limit excursions and any unusual recovery; maintain a typed isolate bank for comparison."],
        ["Correlate deliberately", "Personnel vs surface vs air, one operator or many, one room or the whole suite, one shift, one gowning lot, one disinfectant rotation."],
        ["Trend, don't tabulate", "Charts per grade, area, point and method with % of points above alert, count of action exceedances and shift in flora; a table of numbers tells nobody anything."],
        ["Feed the quality system", "EM excursions are deviations; results are reviewed before certification or release, and the annual summary feeds the product quality review and the CCS revision."],
        ["Pathogens and signals", "A defined escalation for P. aeruginosa, S. aureus, E. coli, moulds in Grade A/B and spore formers: exclusion, retraining, additional cleaning, re-qualification."],
        ["Data integrity in the lab", "Raw data, incubator charts, rejection and re-test rules, and audit-trail review are inspected as closely as the counts themselves."]
      ],
      ref: "Annex 1 §3.2 · §9.30–9.32"
    },
    {
      k: "split",
      t: "What good looks like, what findings look like",
      left: {
        h: "Effective programme",
        tone: "good",
        items: [
          "Plan references the CCS, the risk assessment and the airflow studies that set the points",
          "Sample volumes, exposure times and incubation defined, SOP'd and followed",
          "Glove and gown sampling during operations, with re-qualification when limits are exceeded",
          "Excursions linked to deviation numbers and CAPA, with documented batch impact",
          "Annual EM report with trend charts, flora shifts and effectiveness of the disinfection programme"
        ]
      },
      right: {
        h: "Typical inspection findings",
        tone: "bad",
        items: [
          "Missing samples with no recorded reason, or plates incubated only at 30–35 °C",
          "Settle plates left for a whole shift so the medium dries out",
          "Action limits copied from another site, or quietly increased after exceedances",
          "EM data reviewed after batch release rather than before certification",
          "No identification of isolates, no trending, no link to the CCS or CAPA",
          "Contact plates used on wet or disinfected surfaces without neutralisers"]
      }
    },
    {
      k: "quiz",
      t: "Knowledge check — Environmental Monitoring",
      questions: [
        {
          q: "Maximum exposure time for a 90 mm settle plate in a critical area?",
          opts: ["1 hour", "4 hours, changed as required", "End of shift", "8 hours"],
          a: 1,
          why: "Annex 1 Table 2 note (a): settle plates are exposed for the duration of operations and changed after a maximum of 4 hours, with exposure based on recovery studies so the medium does not dry out."
        },
        {
          q: "Grade A viable results at qualification must show:",
          opts: ["≤10 CFU/m³", "≤1 CFU/plate", "No growth", "Any level if the trend is stable"],
          a: 2,
          why: "Table 2 sets the Grade A air, settle and contact limits at no growth; Annex 1 requires investigation of any growth."
        },
        {
          q: "Why use two incubation conditions?",
          opts: ["To save time", "To recover both faster-growing and slower or injured organisms, including fungi", "Because the media requires it", "Only for mould detection"],
          a: 1,
          why: "A warm, short incubation and a cooler, longer one (e.g. 30–35 °C and 20–25 °C) maximise recovery and prevent false negatives from environmental and injured flora."
        }
      ]
    },
    {
      k: "end",
      t: "EM topic — what to remember",
      items: [
        ["EM demonstrates, it does not assure", "Sterility is built by the controls; EM tells you whether they held."],
        ["Plan by risk, sample by plan", "Points, frequency, volumes and exposure times all trace back to the CCS and are followed literally."],
        ["Limits are yours to justify", "Derived from your data, reviewed periodically, never adjusted to hide excursions."],
        ["Every action limit = a deviation", "With investigation, product impact, CAPA and effectiveness verification."],
        ["Trends are the story", "Flora shifts, repeat rooms, repeat operators and repeat disinfectants are the findings you act on before a batch is at risk."]
      ]
    }
  ]
},

/* ------------------------------ 7. DEVIATIONS ------------------------------ */
{
  id: "deviations",
  n: 7,
  title: "Deviations",
  icon: "⚠️",
  accent: "#fb7185",
  tagline: "Recognition, containment, investigation, impact, CAPA and closure",
  refs: ["EudraLex Ch.1 §1.4, §2.5", "21 CFR 211.100, 211.192", "Annex 1 §3.2"],
  slides: [
    {
      k: "intro",
      t: "Deviations",
      lead: "A deviation is not a failure of the person who reports it. It is the only mechanism that turns an unexpected event into a controlled decision about product, process and prevention.",
      objectives: [
        "Classify events correctly and immediately",
        "Contain the risk before investigating it",
        "Write an investigation that reaches a real root cause",
        "Assess impact across batches, products and the CCS",
        "Close with CAPA that demonstrably works"
      ]
    },
    {
      k: "table",
      t: "Words that must mean different things",
      sub: "Site definitions vary; using them interchangeably is what makes investigations unreadable",
      cols: ["Term", "Definition", "Typical owner"],
      rows: [
        ["Deviation", "Planned activity not carried out as described in an SOP, batch record or specification", "Production, raised to QA"],
        ["Excursion", "A monitored parameter left its accepted range (ΔP, temperature, RH, EM result, cycle)", "Engineering / QC with QA"],
        ["OOS", "A test result outside its registered or internal specification", "QC laboratory"],
        ["OOT", "A result within specification but statistically unusual or trending adversely", "QC with QA"],
        ["Incident / near miss", "An event that could have affected quality but did not reach a limit", "Area owner"],
        ["Critical deviation", "Direct potential impact on product quality, patient safety or data reliability", "QA, escalate immediately"],
        ["CAPA", "Action removing the cause of a detected deviation (corrective) or of a potential one (preventive)", "Process owner, QA verified"],
        ["Effectiveness check", "Objective verification, after a defined period, that the CAPA worked", "QA"]
      ]
    },
    {
      k: "flow",
      t: "Deviation lifecycle, with clocks",
      sub: "Timings are site-set, but the sequence is not negotiable",
      ref: "Ch.1 §1.4 · 21 CFR 211.192",
      steps: [
        ["0 h — Stop", "Make it safe, protect the batch, halt the step, secure the equipment state"],
        ["0–4 h — Contain", "Quarantine, segregate, mark the line, preserve samples, photographs and raw data"],
        ["≤24 h — Record", "Raise the deviation with facts, time, batch, equipment, who was present"],
        ["≤48 h — Assess", "QA initial review: classification, scope of affected batches, extra testing"],
        ["≤30 d — Investigate", "Root cause with evidence, not assumption; document every rejected hypothesis"],
        ["Then — CAPA", "Owners, dates, change control where a system changes, retraining or requalification"],
        ["Then — Disposition", "QA/QP decision on the batch, with rationale referencing the investigation"],
        ["60–90 d — Verify", "Effectiveness check on defined criteria; only then close and update the CCS"]
      ]
    },
    {
      k: "diagram",
      anim: "timeline",
      t: "The shape of a good investigation",
      sub: "Same sequence at every site: containment, evidence, reasoning, verification",
      track: [
        ["0 h Stop", "halt the step, freeze state"],
        ["0–4 h Contain", "hold batch, keep samples"],
        ["≤24 h Record", "facts, time, batch, witness"],
        ["≤48 h Assess", "classify, scope the batches"],
        ["≤30 d Investigate", "root cause with evidence"],
        ["Then CAPA", "owner, date, change control"],
        ["Then Disposition", "QA/QP decision in writing"],
        ["60–90 d Verify", "effectiveness, then close"]
      ],
      items: [
        ["Containment is not optional", "Everything after the first hour is easier if the product and the evidence were protected in minute one."],
        ["Evidence has a shelf life", "Photographs, BMS trends, plate counts and interviews decay — capture them before the shift forgets."],
        ["Closure needs verification", "A CAPA without an effectiveness check is a promise, not a control."]
      ],
      note: "The marker travels while the hold bar stays lit: the batch waits for the whole sequence, not for the paperwork."
    },
    {
      k: "cards",
      t: "Root-cause tools worth the paper",
      items: [
        ["❓", "5 Whys", "Cheap and effective when each why is answered with evidence, not opinion. Stop when a systemic control explains the event."],
        ["🐟", "Fishbone", "Man, machine, material, method, measurement, environment — forces you to look beyond the obvious first answer."],
        ["🌳", "Why–because tree", "Logical tree that shows which causes are necessary and sufficient; best for complex or multi-day events."],
        ["🚪", "Is / Is-Not", "Narrow the field by comparing affected and unaffected batches, lines, shifts and products."],
        ["🧠", "Human performance review", "Distinguish knowledge, rule- and skill-based errors; examine procedures, workload, aids and double checks before blaming attention."],
        ["📉", "FMEA re-check", "Ask why the risk assessment did not anticipate it — the control's detection rating or the trigger was wrong."]
      ]
    },
    {
      k: "points",
      t: "Impact assessment: the part that decides the batch",
      items: [
        ["This batch", "Direct quality effect: sterility assurance, identity, strength, purity, container closure, packaging, labelling and data completeness."],
        ["Other batches", "Before and after, other products on the shared system, and any batch released under the same faulty control."],
        ["The controls", "Is the process still validated? Is the room still qualified? Does the CCS need revision or an additional control?"],
        ["The people", "Retraining, temporary supervision, re-qualification of gowning or aseptic technique, and workload review."],
        ["Outside the plant", "Reportability to authorities, field alerts or recall where product may reach patients; QP and regulatory affairs informed early."],
        ["Written decision", "A clear statement of what is affected and why, signed by QA, referring to the data that supports it."]
      ],
      ref: "Annex 1 §3.2 · Ch.1 §1.4 xiv"
    },
    {
      k: "split",
      t: "A good report vs one that fails inspection",
      left: {
        h: "Good",
        tone: "good",
        items: [
          "Objective, dated, chronological narrative with names, equipment IDs and set points",
          "Facts separated from opinion; the theory is stated as a theory and then tested",
          "Every hypothesis has supporting or refuting data, including what was not found",
          "Root cause is a system condition, with the immediate human action clearly distinguished from it",
          "CAPA addresses cause, not symptom, with a measurable effectiveness check",
          "Explicit reasoning for the statement that other batches are unaffected"
        ]
      },
      right: {
        h: "Fails",
        tone: "bad",
        items: [
          "\"Operator error, retrained\" with no analysis of why the procedure allowed it",
          "\"No impact on product quality\" as the only assessment",
          "Deviations recorded in a notebook, e-mail or none at all",
          "Investigation closed before CAPA completion or before lab results returned",
          "Repeat events described as isolated, and no trend reviewed",
          "Retest without scientific justification, or an unused OOS phase-2 procedure"]
      }
    },
    {
      k: "points",
      t: "CAPA that survives the effectiveness check",
      items: [
        ["Correction ≠ corrective action", "Cleaning up the spill is a correction; changing the transfer method that caused it is the corrective action."],
        ["One cause can need several actions", "Engineering change, procedure update, training, additional monitoring and a change to the CCS, each with its own owner."],
        ["Make it harder to fail", "Poka-yoke, physical keying, interlocks and system prompts outperform instructions and awareness alone."],
        ["Define the check before you start", "e.g. \"no recurrence in 10 consecutive batches and 3 months of EM data\" — vague verification is the most common CAPA finding."],
        ["Close the loop with the CCS and PQR", "The deviation, the CAPA, the risk assessment and the annual product quality review must tell the same story."],
        ["Measure the process", "Aging, repeat rate, on-time closure, % with identified root cause, % CAPA effectiveness — reported to senior management quarterly."]
      ]
    },
    {
      k: "quiz",
      t: "Knowledge check — Deviations",
      questions: [
        {
          q: "A critical aseptic-area deviation is raised. First action?",
          opts: ["Finish the batch and investigate later", "Immediate containment: secure product, hold the batch, preserve the state and data", "Raise a CAPA", "Change the SOP"],
          a: 1,
          why: "Containment precedes investigation: protect the patient and the evidence, then explain. Batch disposition happens only after a documented impact assessment."
        },
        {
          q: "Before certifying or releasing a batch, Annex 1 requires that:",
          opts: ["EM results are filed", "All non-conformities, EM excursions and deviations that could affect the batch are adequately investigated", "The deviation file is closed with CAPA complete", "The trend report is published"],
          a: 1,
          why: "§3.2 requires investigation of sterility test failures, EM excursions and deviations before certification/release, with the reason for including or excluding a batch recorded."
        },
        {
          q: "Which is a genuine root cause?",
          opts: ["The operator was careless", "The training record was late", "The filler door seal was not in the preventive maintenance plan, so wear was never detected", "The deviation was found by EM"],
          a: 2,
          why: "Root cause is the system condition that allowed the failure; carelessness and a late record are symptoms that need a systemic explanation."
        }
      ]
    },
    {
      k: "end",
      t: "Deviation topic — what to remember",
      items: [
        ["Report early, judge later", "A culture where events are raised within hours is worth more than a fast closure statistic."],
        ["Contain, then explain", "Protect product and evidence first; the state of the process must be preserved for the investigation."],
        ["Impact assessment is the deliverable", "Regulators read the reasoning about affected batches more closely than the cause."],
        ["Close only after verification", "CAPA without an effectiveness check is a promise, not a control."],
        ["Feed the strategy", "Every deviation is data for the CCS, the risk assessment and the product quality review."]
      ]
    }
  ]
},

/* ---------------------------- 8. QA & QC ---------------------------- */
{
  id: "qa-qc",
  n: 8,
  title: "QC & QA Responsibilities",
  icon: "🧾",
  accent: "#60a5fa",
  tagline: "Who tests, who assures, who decides — and how they stay independent",
  refs: ["EudraLex Ch.1 §2, Ch.6", "21 CFR 211.22, .160, .192", "Annex 16"],
  slides: [
    {
      k: "intro",
      t: "QC & QA Responsibilities",
      lead: "Quality Control produces reliable data. Quality Assurance makes sure the system that produces the product — and the data — is designed, followed and improved. Neither can substitute for the other.",
      objectives: [
        "State the difference between QA and QC in GMP terms",
        "Allocate responsibility for EM, deviations, release and validation",
        "Protect the independence of QC and the authority of QA",
        "Run the laboratory controls that inspections examine",
        "Support the QP or the designated person at release"
      ]
    },
    {
      k: "split",
      t: "Two different jobs",
      ref: "EudraLex Ch.1 §1.3–1.4 · Ch.6",
      left: {
        h: "Quality Assurance",
        tone: "info",
        items: [
          "Planned and systematic action giving assurance that product meets its requirements — GMP is part of QA",
          "Owns procedures, change control, deviations and CAPA, validation master plan, self-inspection, suppliers and quality agreements",
          "Reviews the batch before it can be released and certifies the whole system, not the last test",
          "Independent authority to stop production and reject material",
          "Prepares the site for inspection and answers with documents, not opinions"
        ]
      },
      right: {
        h: "Quality Control",
        tone: "good",
        items: [
          "Sampling, specification, testing and the documentation of all of it — including release testing",
          "Verifies incoming materials, in-process samples, finished product, stability and the environment",
          "Maintains methods, reference standards, instruments, media and laboratory records",
          "Investigates OOS/OOT with a defined phase-1 / phase-2 protocol before any result is invalidated",
          "Reports data and trends; the decision to release is not QC's alone"
        ]
      }
    },
    {
      k: "table",
      t: "Who does what",
      sub: "R = responsible, A = approves/accountable, C = consulted, I = informed",
      cols: ["Activity", "Production", "QC", "QA", "Engineering / Micro"],
      rows: [
        ["Cleanroom & HVAC qualification", "C", "C", "A / R approval", "R execution"],
        ["Routine environmental monitoring", "C (access)", "R analysis", "A review & trend", "R sampling (Micro)"],
        ["Gowning qualification of staff", "C", "R plating & ID", "A / R programme", "C"],
        ["Aseptic process simulation", "R execution", "C incubation", "A / R protocol", "C"],
        ["Batch record review", "R preparation", "C data & CoA", "A / R review", "I"],
        ["Deviation & CAPA", "R raising", "C lab data", "A / R process", "C investigation"],
        ["OOS investigation", "I", "R phase 1–2", "A decision", "C"],
        ["Change control", "C", "C impact testing", "A / R screening", "C"],
        ["Batch release / certification", "I", "R release testing", "R review", "I"]
      ],
      note: "Adapt to your organisation chart — but the principle is fixed: production never approves its own result, and QC never reports to the manager of the product it tests."
    },
    {
      k: "diagram",
      anim: "handoff",
      t: "Four reviews, one batch",
      sub: "Each function looks at the same record through a different lens",
      items: [
        ["Independence makes it real", "If the person who owns the result also approves it, the review is theatre."],
        ["Release reads the record", "EM, deviations, cycle data, lab results and the validation state — not only a certificate of analysis."],
        ["QC does not release", "QC reports; QA and the QP decide, and both must be able to say no."]
      ],
      note: "The travelling chip is the batch record: nothing new is created at each stop, each stop only asks its own question."
    },
    {
      k: "points",
      t: "QA: the gatekeeping list",
      items: [
        ["Documentation system", "SOP lifecycle, numbering, version control, training-record linkage, and periodic review before documents rot."],
        ["Change control", "Every change to process, equipment, facility, software or supplier is screened for quality impact — including the CCS — before approval."],
        ["Deviation and CAPA ownership", "Timeliness, quality, batch impact, aging and effectiveness; QA owns the process, the area owns the action."],
        ["Qualification and validation", "Validation master plan, protocol and report approval, requalification calendar, and traceability to requirements."],
        ["Suppliers and outsourcing", "Audits, quality agreements, certificate review, contract-manufacturer data flow and the annual supplier review."],
        ["Product lifecycle", "Complaints, recall readiness, product quality reviews, QP certification support under Annex 16, and self-inspection against the standards."]
      ]
    },
    {
      k: "points",
      t: "QC: the laboratory controls that get read",
      ref: "Ch.6 · 21 CFR 211.160–211.178",
      items: [
        ["Sampling", "Defined plan and container, identity verification of the sample, aseptic technique for microbiological samples, documented rejection and re-sampling."],
        ["Methods", "Validated or verified for the purpose, with transfer, stability-indicating properties, system suitability and defined re-test rules."],
        ["Standards & reference materials", "Certified, stored, sub-cultured and used within expiry, with a documented chain for microbial strains and chemical standards."],
        ["Instruments", "IQ/OQ/PQ, calibration on schedule, out-of-calibration impact assessment, maintenance log, and audit-trail review."],
        ["Media & microbiology lab", "Prepared media QC: sterility, growth promotion, inhibitory testing, fill volume and plate shelf-life; incubator temperature records and gas cycles."],
        ["Records", "Complete workbook and raw data, calculations independently checked, no orphan data, retention and disposal under control, results available to the reviewer before release."]
      ]
    },
    {
      k: "callout",
      t: "Authority and independence",
      quote: "Testing alone does not give assurance of quality; the QC laboratory must be independent of production, and both must be adequately resourced.",
      ref: "EudraLex Ch.1 §2.2 · Ch.6 §1 · 21 CFR 211.22",
      points: [
        ["Separate reporting lines", "The head of QC and the head of QA are named in the licence or Site Master File and do not report to the head of production for quality decisions."],
        ["Right and duty to reject", "QA and QC must have the authority — and the resourcing — to stop a process, reject material and delay release."],
        ["Access to information", "Persons certifying or releasing sterile product must have access to manufacturing and quality information and sufficient expertise (§3.1 vii)."],
        ["Resourcing is a GMP requirement", "Understaffed labs create OOS backlogs, late EM review and rushed release decisions — all findings, all avoidable."]
      ]
    },
    {
      k: "points",
      t: "Where QA and QC collide — and how to fix it",
      items: [
        ["\"QA will handle it\"", "Assign each CAPA and each investigation to a named technical owner with QA as process owner, never both or neither."],
        ["EM ownership disputes", "Split it explicitly: Micro takes the sample, QC analyses, QA reviews trends and decides escalation — written in the SOP."],
        ["Release-day surprises", "A pre-release checklist reviewed 5 days before the batch, so deviations, OOS and missing data are found before the QP session."],
        ["Data nobody connected", "Monthly joint review of EM, deviations, complaints and OOS by QA, QC, Production and Engineering — with actions recorded."],
        ["Sign-off culture", "Reviewers must be able to say \"the record does not support release\"; approval by scrolling an electronic record is a finding."],
        ["Training as a tick-box", "Effectiveness checks on training: observed technique, qualification results and question-based verification, not just a signature."]
      ]
    },
    {
      k: "quiz",
      t: "Knowledge check — QA & QC",
      questions: [
        {
          q: "Under EU GMP, releasing a batch of sterile product requires the QP to:",
          opts: ["Check that the sterility test passed", "Certify that the batch was manufactured and tested in accordance with GMP and the MAH requirements", "Repeat the QC testing", "Approve the EM plan"],
          a: 1,
          why: "Annex 16 certification is a system-level judgement: the whole manufacturing and control process, including review of deviations and all test results, not a single test outcome."
        },
        {
          q: "QC should report to:",
          opts: ["The production manager, for speed", "A structure independent of production, with defined authority to reject", "The commercial director", "Nobody — QC is self-managing"],
          a: 1,
          why: "Independence of QC from production is a basic GMP requirement (Ch.1 and 21 CFR 211.22), otherwise the pressure to release conflicts with the duty to test."
        },
        {
          q: "An OOS result may be invalidated only when:",
          opts: ["The operator promises to be careful", "A documented laboratory investigation identifies an assignable error and the retest rules are followed", "Two of three replicate results pass", "Production confirms the batch looks fine"],
          a: 1,
          why: "FDA and EU expectations require a documented phase-1/phase-2 investigation with an identified assignable cause; rejecting data because it is inconvenient is a data-integrity finding."
        }
      ]
    },
    {
      k: "end",
      t: "QA / QC topic — what to remember",
      items: [
        ["Assurance is not testing", "QA builds and audits the system; QC measures the product. Both are needed, neither is sufficient."],
        ["Independence is structural", "Reporting lines, authority to reject, and enough people — documented in the SMF and the job descriptions."],
        ["Release reviews the record", "The decision references EM, deviations, OOS, cycle data and the CCS — not just a certificate of analysis."],
        ["Interfaces need ownership", "EM, CAPA, media fill and change control each get a named responsible function in an SOP."],
        ["Data is a product", "Lab records, media, strains, instruments and audit trails are as inspectable as the fill line."]
      ]
    }
  ]
},

/* --------------------------- 9. REGULATORY -------------------------- */
{
  id: "regulatory",
  n: 9,
  title: "Regulatory Requirements",
  icon: "⚖️",
  accent: "#e879f9",
  tagline: "EU, FDA, ICH, WHO, PIC/S and ISO — what each one actually demands",
  refs: ["EudraLex Vol.4", "21 CFR 210/211, Part 11", "ICH Q7, Q9(R1), Q10", "ISO 14644"],
  slides: [
    {
      k: "intro",
      t: "Regulatory Requirements",
      lead: "Regulations tell you what must be true. Guidelines tell you how industry proves it. A cleanroom system is compliant when both are traceable in one documented strategy.",
      objectives: [
        "Locate each requirement in the right framework",
        "Apply the sterile-specific rules of EU GMP Annex 1",
        "Map the FDA clauses that auditors cite for cleanrooms",
        "Meet data-integrity expectations for electronic records",
        "Prepare for an inspection with the documents that get asked for"
      ]
    },
    {
      k: "cards",
      t: "The frameworks, and what each governs",
      items: [
        ["🇪🇺", "EU GMP (EudraLex Vol.4)", "Legally binding. Part I Chapters 1–9 plus Annexes; Annex 1 sets the requirements for sterile manufacture."],
        ["🇺🇸", "US FDA cGMP", "21 CFR 210 & 211 for drugs; Part 11 for electronic records; guidance documents (sterile aseptic processing, process validation, data integrity) set expectations."],
        ["🌐", "ICH", "Q7 APIs, Q8/Q9(R1)/Q10/Q11/Q12 lifecycle and risk management, Q1 stability — implemented through EU, US and PIC/S adoption."],
        ["🧭", "WHO & PIC/S", "WHO Technical Report Series GMP annexes; PIC/S PI 007 (GMP guide), PI 020 (EM), PI 041 (data integrity) — used by 50+ inspectorates."],
        ["📐", "ISO & EN", "ISO 14644 series (classification, monitoring, test methods, design, operations), ISO 14698 (biocontamination), ISO 13408 (aseptic processing), ISO 11133 (media), EN 1822 (filters), ISO 21501-4 (counters)."],
        ["💊", "Pharmacopoeias", "USP/EP general chapters for sterility, endotoxins, microbial attributes, particulates and alternative methods — e.g. USP <71>, <85>, <1111>, <1223>."]
      ]
    },
    {
      k: "diagram",
      anim: "framework",
      t: "One batch, eight points of view",
      sub: "Different frameworks, the same product, one set of evidence",
      items: [
        ["Binding vs demonstrative", "Regulation says what must be true; standards and guidance show how industry proves it."],
        ["The CCS is the join", "One documented strategy can answer Annex 1, 21 CFR 211 and an ISO clause at the same time."],
        ["Evidence closes the gap", "A requirement nobody can trace to a record is an observation waiting to be written."]
      ],
      note: "Inspectors travel along the same spokes: pick a control, then ask for the design, qualification, monitoring and review behind it."
    },
    {
      k: "table",
      t: "EU GMP documents you are expected to know",
      sub: "Sterile-focused selections; Chapter 1 applies to every operation",
      cols: ["Document", "What it demands"],
      rows: [
        ["Part I, Ch.1 — PQS", "A pharmaceutical quality system with management responsibility, QC, self-inspection, product quality review and change control"],
        ["Part I, Ch.3 §1.6–1.7", "Prevention of cross-contamination through suitable separations, designs and practices"],
        ["Part I, Ch.4 — Documentation", "Contemporaneous, legible, traceable records; good documentation practice; no undocumented activity"],
        ["Part I, Ch.5 — Production", "Facility and equipment design, calibration, sanitation, processing controls, packaging and labelling controls"],
        ["Part I, Ch.6 — QC", "Independent laboratory, approved methods, retain samples, stability, OOS investigation, release decisions"],
        ["Annex 1 (2022)", "Grades, CCS, qualification, personnel and gowning, EM, APS, barrier technology; in operation since 25 Aug 2023"],
        ["Annex 11", "Computerised systems across the lifecycle, with data integrity, security, audit trail and business-by-objective controls"],
        ["Annex 15", "Qualification and validation lifecycle, V-model, requalification and the linkage to change control and PQR"],
        ["Annex 16", "QP certification and batch release by the manufacturer, including import testing exemptions and auditing"],
        ["Annex 19", "Parallel manufacture of non-β-lactam, non-cytotoxic products: cleaning, campaign and exposure-limit justification"]
      ]
    },
    {
      k: "table",
      t: "FDA clauses that drive cleanroom compliance",
      cols: ["Section", "Requirement in plain words"],
      rows: [
        ["211.22", "An independent quality control unit with authority to develop, approve and disapprove procedures and to accept or reject material"],
        ["211.42", "Design and construction of adequate, cleanable facilities and separate areas for production, testing and storage"],
        ["211.43", "Control of air particles and microorganisms; HEPA filtration of air in aseptic processing areas; monitoring of pressure differentials"],
        ["211.65 / 211.67", "Equipment surfaces non-reactive, smooth, cleanable; runs at controlled parameters; cleaned between batches to avoid contamination"],
        ["211.68", "Automated, electronic and computerised systems checked, calibrated and reviewed for accuracy, validity and security"],
        ["211.84 / 211.94", "Water and component controls, including testing for identity, strength, quality and purity; containers and closures treated as components"],
        ["211.100 / 211.110", "Written procedures followed and deviations recorded with explanation; in-process controls and environmental monitoring in controlled areas"],
        ["211.113", "Operations to prevent microbiological contamination, including sanitisation and cleanliness of the immediate working environment"],
        ["211.160 / 211.165", "Scientifically sound laboratory controls, approved methods, OOS investigation with a documented follow-up"],
        ["211.180 / 211.188 / 211.192", "Complete, accurate records; batch production and control records; QC unit review of any anomaly before distribution"]
      ],
      note: "Part 11 governs electronic records and signatures: validation, audit trails, access control, authority checks and record retention — the same expectations appear in EU Annex 11."
    },
    {
      k: "points",
      t: "Data integrity: the cross-cutting requirement",
      ref: "Part 11 · Annex 11 · PIC/S PI 041 · FDA 2018 guidance",
      items: [
        ["ALCOA+", "Attributable, Legible, Contemporaneous, Original, Accurate — plus Complete, Consistent, Enduring and Available."],
        ["Original data includes metadata", "Audit trails, sequences, re-injections, time stamps, method versions and instrument logs are part of the record that must be reviewed."],
        ["Controls built into the system", "Individual named accounts, role-based permissions, no shared or administrator-level testing accounts, time synchronisation, and secure backup with restore testing."],
        ["No workarounds", "Disabling an audit trail, re-running until a result passes, or storing data on a local drive outside the LIMS are the classic findings."],
        ["Paper is not exempt", "Signature meaning defined, no pre-signing, no back-dating, corrections initialled with reason, and forms controlled as records."],
        ["Suppliers and service providers", "Data-integrity expectations written into quality agreements, including cloud providers, CMOs and test labs."]
      ]
    },
    {
      k: "points",
      t: "What changed recently — and what is coming",
      sub: "Verify against the current official text before you cite it in a submission",
      items: [
        ["EU GMP Annex 1 (2022 revision)", "In operation since 25 Aug 2023. Brought the CCS, quality risk management, RABS/isolator preference, revised classification limits and 6-monthly gowning requalification."],
        ["Lyophiliser clause", "Manual-load lyophilisers without a barrier must be sterilised before each load — effective 25 Aug 2024, giving industry an extra year."],
        ["ICH Q9(R1) on QRM", "Introduced formal treatment of risk tolerance and uncertainty, and knowledge management, in the 2023 revision — now reflected in PIC/S and EU guidance."],
        ["ISO 14644 family", "ISO 14644-1:2015 remains the classification standard; EN ISO 14644-14:2026 now provides a method to assess the suitability of equipment by airborne particle concentration (effective 8 Jul 2026)."],
        ["US FDA agenda", "The 2011 process-validation guidance and the 2004 aseptic-processing guidance remain the reference points; FDA has announced proposed rules to update 21 CFR 210/211 and biologics CGMP for continuous, distributed and point-of-care manufacturing, real-time control strategies and lifecycle validation."],
        ["Adjacent frameworks", "US FDA's QMSR (effective 2 Feb 2026) aligns device QSR with ISO 13485 — relevant for combination products and devices in the same facility."]
      ]
    },
    {
      k: "flow",
      t: "Inspection readiness in six moves",
      sub: "Inspectors follow the process, not your table of contents",
      steps: [
        ["Map the requirement", "Clause-by-clause gap assessment against Annex 1 / 21 CFR 211 / ISO 14644"],
        ["Assemble the narrative", "CCS, quality policy, site layout, process flow and the validation master plan in one pack"],
        ["Prove the state of control", "EM trend pack, requalification calendar with evidence, deviation and CAPA metrics, APS results"],
        ["Show the people", "Training matrix, gowning qualification records, job descriptions, and organisation chart with independence"],
        ["Rehearse the walk-through", "Route, gowning, answering at the line, room data on request, escort protocol"],
        ["Close the loop", "Prior 483s and self-inspection actions verified, owners named, evidence attached"]
      ]
    },
    {
      k: "stats",
      t: "The numbers a regulator expects to see trending",
      sub: "Report these monthly to site leadership; an untracked metric is an unmanaged risk",
      items: [
        ["100 %", "requalifications completed on schedule", "cleanrooms A/B every 6 months, C/D every 12 months"],
        ["<1 %", "EM results above action limit", "with zero unexplained Grade A excursions"],
        ["≥95 %", "deviations and CAPA closed by due date", "plus repeat-deviation rate below 5 %"],
        ["0", "tolerated data-integrity shortcuts", "shared logins, disabled audit trails, undocumented activity"]
      ]
    },
    {
      k: "quiz",
      t: "Knowledge check — Regulatory",
      questions: [
        {
          q: "Since when has the revised EU GMP Annex 1 for sterile products been in operation?",
          opts: ["25 August 2022", "25 August 2023", "1 January 2024", "It is guidance only, with no date"],
          a: 1,
          why: "Published 25 August 2022 and in operation from 25 August 2023; the manually loaded lyophiliser requirement followed one year later, on 25 August 2024."
        },
        {
          q: "Which FDA clause specifically requires control of airborne particles and microorganisms with HEPA-filtered air in aseptic processing areas?",
          opts: ["211.22", "211.43", "211.67", "211.180"],
          a: 1,
          why: "211.43 (ventilation, air filtration and air control in controlled areas) requires HEPA filtration in aseptic processing areas and monitoring of particulate matter and pressure differentials."
        },
        {
          q: "A documented gowning qualification record is required by:",
          opts: ["ISO 9001 only", "EU GMP Annex 1 §9.4, reflected in the CCS and training system", "Only by the FDA", "No framework requires it"],
          a: 1,
          why: "Annex 1 §9.4 sets personnel qualification and 6-monthly requalification; WHO and PIC/S follow the same text, and it is inspected through the training and CCS records."
        }
      ]
    },
    {
      k: "end",
      t: "Regulatory topic — what to remember",
      items: [
        ["Know your binding text", "Annex 1 and 21 CFR 211 are legal requirements; ISO and guidance documents are the accepted methods for demonstrating them."],
        ["One strategy, many clauses", "A single CCS plus a validation master plan can answer most questions — write it once and reference it everywhere."],
        ["Risk must be documented", "Where you depart from guidance, the rationale, alternatives and residual risk have to exist on paper (Q9(R1))."],
        ["Data integrity is non-negotiable", "It is the fastest route from an observation to a warning letter, and the easiest to fix in advance."],
        ["Stay current", "Annex 1 Q&A, PIC/S recommendations, FDA guidance projects and ISO revisions change expectations — review annually."]
      ]
    }
  ]
}
];
