const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canGsap = () => typeof gsap !== "undefined" && motionOk;

const STEPS = ["Audience", "Location", "Targeting", "Marketing", "Quantity", "Campaign", "Results"];
const KEYS = "ABCDEFGHIJK".split("");

const AUDIENCE_TYPES = [
  "Consumers",
  "Businesses",
  "Professionals or Executives",
  "Specialty Audience",
  "I'm Not Sure, Help Me Decide",
];

const SPECIALTIES = [
  "Insurance Prospects",
  "Seniors",
  "Medicare Prospects",
  "Final Expense Prospects",
  "Homeowners",
  "New Movers",
  "Healthcare",
  "Financial Services",
  "Mortgage or Real Estate",
  "Education",
  "Nonprofit or Donors",
  "Automotive",
  "Home Services",
  "Other",
];

const GEO_TYPES = [
  "Nationwide",
  "State",
  "County",
  "City",
  "ZIP Codes",
  "Radius Around a Location",
  "Multiple Markets",
  "Custom Sales Territory",
];

const RADII = ["5 Miles", "10 Miles", "15 Miles", "25 Miles", "50 Miles", "Custom"];

const INCOME = [
  "Any Income",
  "Under $50,000",
  "$50,000 to $74,999",
  "$75,000 to $99,999",
  "$100,000 to $149,999",
  "$150,000+",
  "Custom",
];

const CONSUMER_EXTRAS = [
  "Home Value",
  "Length of Residence",
  "Estimated Wealth",
  "Lifestyle or Interests",
  "Purchasing Behavior",
  "Senior Consumers",
  "New Movers",
  "New Homeowners",
  "Insurance Related Audiences",
  "Financial Characteristics",
  "Other Specialty Criteria",
];

const EMPLOYEES = ["Any", "1 to 10", "11 to 50", "51 to 100", "101 to 500", "500+", "Custom"];
const SALES = ["Any", "Under $1 Million", "$1 Million to $5 Million", "$5 Million to $10 Million", "$10 Million to $50 Million", "$50 Million+", "Custom"];
const ROLES = [
  "Business Owners",
  "Presidents or CEOs",
  "C Level Executives",
  "Marketing Executives",
  "Sales Executives",
  "Human Resources",
  "Finance",
  "Purchasing",
  "Operations",
  "IT or Technology",
  "Specific Job Title",
  "Any Decision Maker",
];
const INDUSTRY_CODES = ["SIC Codes", "NAICS Codes", "I don't know the codes, help me select them"];

const CHANNELS = [
  "Direct Mail",
  "Telemarketing",
  "Email",
  "Digital Advertising",
  "Multiple Channels",
  "Not Sure Yet",
];

const FIELDS = [
  "Name",
  "Mailing Address",
  "Phone Number",
  "Email Address",
  "Demographic Information",
  "Business Information",
  "Other Available Data",
];

const QTY = [
  "I want everyone who matches my criteria",
  "Under 5,000",
  "5,000 to 10,000",
  "10,000 to 25,000",
  "25,000 to 50,000",
  "50,000 to 100,000",
  "100,000+",
  "I'm Not Sure",
];

const TIMING = [
  "As Soon As Possible",
  "Within 1 Week",
  "Within 30 Days",
  "1 to 3 Months",
  "Just Researching Right Now",
];

const state = {
  screen: "q",
  q: 0,
  audienceType: "",
  specialties: [],
  otherSpecialty: "",
  geoType: "",
  market: "",
  radiusOrigin: "",
  radius: "",
  anyAge: false,
  ageFrom: "",
  ageTo: "",
  gender: "",
  income: [],
  homeownership: "",
  marital: [],
  children: "",
  extras: [],
  consumerNotes: "",
  industry: "",
  industryCodes: [],
  employees: "",
  sales: "",
  roles: [],
  jobTitles: "",
  channels: [],
  fields: [],
  quantity: "",
  offering: "",
  campaignNotes: "",
  timing: "",
  contact: {
    first: "",
    last: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    method: "",
  },
};

const trackEl = document.getElementById("quiz-track");
const summaryEl = document.getElementById("audience-summary");
const body = document.getElementById("quiz-body");
const dock = document.getElementById("quiz-dock");
const dockBack = document.getElementById("dock-back");
const dockNext = document.getElementById("dock-next");
const dockHint = document.getElementById("dock-hint");

if (!body) {
  /* Inner pages do not load the builder. */
} else {

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function animateIn() {
  if (!canGsap()) return;
  gsap.killTweensOf(".quiz-enter");
  gsap.from(".quiz-enter", { y: 16, opacity: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" });
}

function toggle(list, value) {
  const i = list.indexOf(value);
  if (i >= 0) list.splice(i, 1);
  else list.push(value);
}

function toggleExclusive(list, value, anyLabel) {
  if (value === anyLabel) {
    list.splice(0, list.length, anyLabel);
    return;
  }
  const any = list.indexOf(anyLabel);
  if (any >= 0) list.splice(any, 1);
  toggle(list, value);
}

function toggleChannel(label) {
  if (label === "Not Sure Yet") {
    state.channels = state.channels.includes(label) ? [] : ["Not Sure Yet"];
    return;
  }
  const unsure = state.channels.indexOf("Not Sure Yet");
  if (unsure >= 0) state.channels.splice(unsure, 1);
  toggle(state.channels, label);
}

function el(html) {
  const wrap = document.createElement("div");
  wrap.innerHTML = html.trim();
  return wrap.firstElementChild;
}

function isBusinessPath() {
  return state.audienceType === "Businesses" || state.audienceType === "Professionals or Executives";
}

function isConsumerPath() {
  return state.audienceType === "Consumers" || state.audienceType === "I'm Not Sure, Help Me Decide" || state.audienceType === "Specialty Audience";
}

function progressIndex() {
  if (state.screen !== "q") return 6;
  return state.q;
}

function clip(text, max = 72) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function audienceLabel() {
  const parts = [state.audienceType];
  if (state.specialties.length) parts.push(state.specialties.join(", "));
  if (state.otherSpecialty.trim()) parts.push(state.otherSpecialty.trim());
  return parts.filter(Boolean).join(" · ");
}

function marketLabel() {
  if (state.geoType === "Nationwide") return "Nationwide";
  if (state.geoType === "Radius Around a Location") {
    if (state.radiusOrigin && state.radius) return `${state.radius} of ${state.radiusOrigin}`;
    return [state.geoType, state.radiusOrigin, state.radius].filter(Boolean).join(" · ");
  }
  if (state.geoType && state.market) return `${state.geoType}: ${state.market}`;
  return state.geoType;
}

function recapPairs() {
  return [
    ["Audience", audienceLabel()],
    ["Market", marketLabel()],
    ["Quantity", state.quantity],
    ["Marketing Method", state.channels.join(" + ")],
    ["Timing", state.timing],
  ].filter(([, value]) => String(value || "").trim());
}

function summaryItems() {
  const items = [];
  const add = (value) => {
    const text = clip(value);
    if (text) items.push(text);
  };

  add(audienceLabel());
  add(marketLabel());
  if (state.anyAge) add("Any Age");
  else if (state.ageFrom || state.ageTo) add(`Age ${state.ageFrom || "?"} to ${state.ageTo || "?"}`);
  if (state.gender && state.gender !== "All") add(state.gender);
  if (state.income.length) add(state.income.filter((v) => v !== "Any Income").join(", ") || "Any Income");
  if (state.homeownership && state.homeownership !== "Any") add(state.homeownership);
  if (state.marital.length && !state.marital.includes("Any")) add(state.marital.join(", "));
  if (state.children && state.children !== "Any") add(state.children);
  state.extras.forEach((item) => add(item));
  if (state.industry) add(state.industry);
  if (state.employees && state.employees !== "Any") add(`${state.employees} employees`);
  if (state.sales && state.sales !== "Any") add(state.sales);
  if (state.roles.length) add(state.roles.join(", "));
  if (state.jobTitles) add(state.jobTitles);
  if (state.channels.length) add(state.channels.join(" + "));
  if (state.fields.length) add(state.fields.join(", "));
  add(state.quantity);
  add(state.timing);
  return items;
}

function renderSummary() {
  const items = summaryItems();
  summaryEl.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Tell us who you want to reach.";
    summaryEl.appendChild(empty);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    summaryEl.appendChild(li);
  });
  const card = document.getElementById("audience-card");
  if (card) card.scrollTop = card.scrollHeight;
}

function goQuestion(i) {
  state.screen = "q";
  state.q = i;
  render({ scroll: true, animate: true });
}

function renderTrack() {
  const current = progressIndex();
  trackEl.innerHTML = STEPS.map((label, i) => {
    const cls = i === current ? "on" : i < current ? "done" : "";
    return `<button type="button" class="${cls}" data-step="${i}" ${i > current ? "disabled" : ""}>${label}</button>`;
  }).join("");
  [...trackEl.querySelectorAll("button")].forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.step);
      if (i > current || i === 6) return;
      goQuestion(i);
    });
  });
}

function needsOtherSpecialty() {
  return state.audienceType === "Specialty Audience" && state.specialties.includes("Other");
}

function canContinue() {
  if (state.q === 0) {
    if (!state.audienceType) return false;
    if (state.audienceType === "Specialty Audience" && !state.specialties.length) return false;
    if (needsOtherSpecialty()) return !!state.otherSpecialty.trim();
    return true;
  }
  if (state.q === 1) {
    if (!state.geoType) return false;
    if (state.geoType === "Nationwide") return true;
    if (state.geoType === "Radius Around a Location") {
      return !!state.radiusOrigin.trim() && !!state.radius;
    }
    return !!state.market.trim();
  }
  if (state.q === 2) return true;
  if (state.q === 3) return state.channels.length > 0;
  if (state.q === 4) return !!state.quantity;
  if (state.q === 5) return !!state.timing;
  return false;
}

function updateChrome() {
  const onQuestion = state.screen === "q";
  renderTrack();
  renderSummary();
  dock.hidden = !onQuestion;
  dockBack.hidden = state.q === 0;
  if (!onQuestion) return;

  const tapAdvance = state.q === 4;
  dockNext.hidden = tapAdvance;
  dockNext.disabled = tapAdvance ? false : !canContinue();
  dockNext.textContent = state.q === 5 ? "See My Audience Summary" : "Continue";

  const hints = [
    "Choose the type of prospects you want to reach.",
    "Select your market.",
    "Add targeting if you need it. This step is optional.",
    "Select all that apply.",
    "Tell us the size of your campaign.",
    "A little campaign context helps us recommend the right data.",
  ];
  dockHint.textContent = hints[state.q] || "";
}

function pillRow(options, isOn, onToggle) {
  const row = document.createElement("div");
  row.className = "quiz-pills quiz-enter";
  options.forEach((label) => {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.value = label;
    b.textContent = label;
    if (isOn(label)) b.classList.add("selected");
    b.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle(label);
      [...row.children].forEach((btn) => btn.classList.toggle("selected", isOn(btn.dataset.value)));
      renderSummary();
      updateChrome();
    });
    row.appendChild(b);
  });
  return row;
}

function answerBtn({ key, label, selected, check, onClick }) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = `answer quiz-enter${check ? " check" : ""}${selected ? " selected" : ""}`;
  b.innerHTML = `<kbd>${key}</kbd><span><b>${label}</b></span><i></i>`;
  b.addEventListener("click", () => onClick(b));
  return b;
}

function radioList(options, getSelected, onSelect, { check = false, advance = false } = {}) {
  const list = document.createElement("div");
  list.className = "answer-stack";
  options.forEach((label, i) => {
    list.appendChild(answerBtn({
      key: KEYS[i],
      label,
      check,
      selected: check ? getSelected().includes(label) : getSelected() === label,
      onClick: async (btn) => {
        onSelect(label, btn, list);
        updateChrome();
        if (advance) {
          await delay(220);
          goQuestion(state.q + 1);
        }
      },
    }));
  });
  return list;
}

function head(kicker, title, help) {
  return el(`
    <div class="quiz-head quiz-enter">
      <p class="quiz-kicker">${kicker}</p>
      <h2>${title}</h2>
      ${help ? `<p>${help}</p>` : ""}
    </div>`);
}

function block(label, child) {
  const wrap = el(`<div class="quiz-block quiz-enter">${label ? `<p class="quiz-label">${label}</p>` : ""}</div>`);
  wrap.appendChild(child);
  return wrap;
}

function textField({ id, value, placeholder, textarea, onInput }) {
  const node = el(textarea
    ? `<textarea class="quiz-note-field quiz-enter" id="${id}" placeholder="${placeholder || ""}"></textarea>`
    : `<input class="quiz-text-field quiz-enter" id="${id}" type="text" placeholder="${placeholder || ""}" />`);
  node.value = value || "";
  node.addEventListener("input", () => onInput(node.value));
  return node;
}

function renderQ() {
  if (state.q === 0) {
    body.appendChild(head(
      "Step 1 of 6: Who do you want to reach?",
      "Let’s start with your audience.",
      "What type of prospects are you looking for?",
    ));
    body.appendChild(radioList(
      AUDIENCE_TYPES,
      () => state.audienceType,
      (label, btn, list) => {
        state.audienceType = label;
        list.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
        btn.classList.add("selected");
        syncSpecialty();
      },
    ));
    const specialty = el(`<div class="quiz-block quiz-enter" id="specialty-wrap"></div>`);
    body.appendChild(specialty);
    syncSpecialty();
  }

  if (state.q === 1) {
    body.appendChild(head(
      "Step 2 of 6: Where do you want to target?",
      "Choose your market.",
    ));
    body.appendChild(radioList(
      GEO_TYPES,
      () => state.geoType,
      (label, btn, list) => {
        state.geoType = label;
        list.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
        btn.classList.add("selected");
        syncGeoFields();
      },
    ));
    const fields = el(`<div class="quiz-block quiz-enter" id="geo-fields"></div>`);
    body.appendChild(fields);
    syncGeoFields();
  }

  if (state.q === 2) {
    if (isBusinessPath()) renderBusinessTargeting();
    else renderConsumerTargeting();
  }

  if (state.q === 3) {
    body.appendChild(head(
      "Step 4 of 6: How do you want to reach them?",
      "Choose the marketing channels you plan to use.",
      "Select all that apply.",
    ));
    body.appendChild(radioList(
      CHANNELS,
      () => state.channels,
      (label, btn) => {
        toggleChannel(label);
        [...btn.parentElement.children].forEach((item) => {
          item.classList.toggle("selected", state.channels.includes(item.querySelector("b").textContent));
        });
      },
      { check: true },
    ));
    body.appendChild(block("What information would you like included?", pillRow(
      FIELDS,
      (label) => state.fields.includes(label),
      (label) => toggle(state.fields, label),
    )));
    body.appendChild(el(`<p class="quiz-help quiz-enter">Available fields vary by audience, database, intended use, and licensing requirements. We’ll review the best options for your campaign.</p>`));
  }

  if (state.q === 4) {
    body.appendChild(head(
      "Step 5 of 6: How many prospects do you need?",
      "Tell us the size of your campaign.",
      "",
    ));
    body.appendChild(radioList(
      QTY,
      () => state.quantity,
      (label, btn, list) => {
        state.quantity = label;
        list.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
        btn.classList.add("selected");
      },
      { advance: true },
    ));
  }

  if (state.q === 5) {
    body.appendChild(head(
      "Step 6 of 6: Tell Us About Your Campaign",
      "Tell Us About Your Campaign",
    ));
    body.appendChild(block("What are you marketing or selling?", textField({
      id: "offering",
      value: state.offering,
      placeholder: "What are you marketing or selling?",
      onInput: (v) => { state.offering = v; updateChrome(); },
    })));
    body.appendChild(block("Tell us a little about your campaign.", textField({
      id: "campaign-notes",
      textarea: true,
      value: state.campaignNotes,
      placeholder: "Example: We’re an insurance agency looking to reach homeowners age 60+ in three counties. We’ll primarily be using direct mail and outbound calling.",
      onInput: (v) => { state.campaignNotes = v; updateChrome(); },
    })));
    body.appendChild(el(`<p class="quiz-label quiz-enter">When do you need the data?</p>`));
    body.appendChild(radioList(
      TIMING,
      () => state.timing,
      (label, btn, list) => {
        state.timing = label;
        list.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
        btn.classList.add("selected");
      },
    ));
  }
}

function renderConsumerTargeting() {
  const title = state.audienceType === "Specialty Audience"
    ? "Add any consumer targeting that applies."
    : "Now let’s define your ideal consumer.";
  body.appendChild(head("Step 3 of 6: Build Your Consumer Audience", title));

  const age = el(`
    <div class="quiz-block quiz-enter">
      <p class="quiz-label">Age Range</p>
      <label class="quiz-check"><input type="checkbox" id="any-age" ${state.anyAge ? "checked" : ""} /> Any Age</label>
      <div class="quiz-age" id="age-fields">
        <div>
          <label for="age-from">From</label>
          <input id="age-from" type="number" min="18" max="120" inputmode="numeric" value="${state.ageFrom}" />
        </div>
        <div>
          <label for="age-to">To</label>
          <input id="age-to" type="number" min="18" max="120" inputmode="numeric" value="${state.ageTo}" />
        </div>
      </div>
    </div>`);
  const anyAge = age.querySelector("#any-age");
  const ageFields = age.querySelector("#age-fields");
  ageFields.hidden = state.anyAge;
  anyAge.addEventListener("change", () => {
    state.anyAge = anyAge.checked;
    ageFields.hidden = state.anyAge;
    updateChrome();
  });
  age.querySelector("#age-from").addEventListener("input", (e) => { state.ageFrom = e.target.value; updateChrome(); });
  age.querySelector("#age-to").addEventListener("input", (e) => { state.ageTo = e.target.value; updateChrome(); });
  body.appendChild(age);

  body.appendChild(block("Gender", pillRow(
    ["All", "Male", "Female"],
    (label) => state.gender === label,
    (label) => { state.gender = label; },
  )));
  body.appendChild(block("Estimated Household Income", pillRow(
    INCOME,
    (label) => state.income.includes(label),
    (label) => toggleExclusive(state.income, label, "Any Income"),
  )));
  body.appendChild(block("Homeownership", pillRow(
    ["Any", "Homeowners", "Renters"],
    (label) => state.homeownership === label,
    (label) => { state.homeownership = label; },
  )));
  body.appendChild(block("Marital Status", pillRow(
    ["Any", "Married", "Single"],
    (label) => state.marital.includes(label),
    (label) => toggleExclusive(state.marital, label, "Any"),
  )));
  body.appendChild(block("Presence of Children", pillRow(
    ["Any", "Children Present", "No Children Present"],
    (label) => state.children === label,
    (label) => { state.children = label; },
  )));
  body.appendChild(el(`<p class="quiz-help quiz-enter">Want to target even further? Select any additional characteristics you’re interested in.</p>`));
  body.appendChild(block("", pillRow(
    CONSUMER_EXTRAS,
    (label) => state.extras.includes(label),
    (label) => toggle(state.extras, label),
  )));
  body.appendChild(block("Anything else we should know about your ideal consumer?", textField({
    id: "consumer-notes",
    textarea: true,
    value: state.consumerNotes,
    placeholder: "Example: Homeowners age 55 to 75 with household income above $75,000 who live within 25 miles of our office.",
    onInput: (v) => { state.consumerNotes = v; updateChrome(); },
  })));
}

function renderBusinessTargeting() {
  body.appendChild(head(
    "Step 3 of 6: Build Your Business Audience",
    "What types of businesses do you want to reach?",
  ));
  body.appendChild(block("Industry or Business Type", textField({
    id: "industry",
    value: state.industry,
    placeholder: "Example: Insurance agencies, dentists, manufacturers, restaurants, HVAC companies, accounting firms.",
    onInput: (v) => { state.industry = v; updateChrome(); },
  })));
  body.appendChild(block("Industry Codes", pillRow(
    INDUSTRY_CODES,
    (label) => state.industryCodes.includes(label),
    (label) => toggle(state.industryCodes, label),
  )));
  body.appendChild(block("Company Size", pillRow(
    EMPLOYEES,
    (label) => state.employees === label,
    (label) => { state.employees = label; },
  )));
  body.appendChild(block("Estimated Annual Sales", pillRow(
    SALES,
    (label) => state.sales === label,
    (label) => { state.sales = label; },
  )));
  body.appendChild(block("Who within the company do you want to reach?", pillRow(
    ROLES,
    (label) => state.roles.includes(label),
    (label) => {
      toggle(state.roles, label);
      syncJobTitles();
    },
  )));
  const titles = el(`<div class="quiz-block quiz-enter" id="title-wrap"></div>`);
  body.appendChild(titles);
  syncJobTitles();
}

function syncJobTitles() {
  const wrap = document.getElementById("title-wrap");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (!state.roles.includes("Specific Job Title")) {
    updateChrome();
    return;
  }
  wrap.appendChild(el(`<p class="quiz-label">Enter desired titles</p>`));
  wrap.appendChild(textField({
    id: "job-titles",
    value: state.jobTitles,
    placeholder: "Example: Owner, Office Manager, Benefits Administrator",
    onInput: (v) => { state.jobTitles = v; updateChrome(); },
  }));
  updateChrome();
}

function syncSpecialty() {
  const wrap = document.getElementById("specialty-wrap");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (state.audienceType !== "Specialty Audience") {
    updateChrome();
    return;
  }
  wrap.appendChild(el(`<p class="quiz-label">Which specialty audience?</p>`));
  wrap.appendChild(pillRow(
    SPECIALTIES,
    (label) => state.specialties.includes(label),
    (label) => {
      toggle(state.specialties, label);
      syncSpecialty();
    },
  ));
  if (needsOtherSpecialty()) {
    wrap.appendChild(el(`<p class="quiz-label">Describe the audience</p>`));
    wrap.appendChild(textField({
      id: "other-specialty",
      value: state.otherSpecialty,
      placeholder: "Tell us about the specialty audience you want to reach",
      onInput: (v) => { state.otherSpecialty = v; updateChrome(); },
    }));
  }
  updateChrome();
}

function syncGeoFields() {
  const wrap = document.getElementById("geo-fields");
  if (!wrap) return;
  wrap.innerHTML = "";
  const type = state.geoType;
  if (!type || type === "Nationwide") {
    updateChrome();
    return;
  }
  if (type === "Radius Around a Location") {
    wrap.appendChild(el(`<p class="quiz-label">Starting ZIP Code or City</p>`));
    const origin = textField({
      id: "radius-origin",
      value: state.radiusOrigin,
      placeholder: "Starting ZIP Code or city",
      onInput: (v) => { state.radiusOrigin = v; updateChrome(); },
    });
    wrap.appendChild(origin);
    wrap.appendChild(el(`<p class="quiz-label">Radius</p>`));
    wrap.appendChild(pillRow(
      RADII,
      (label) => state.radius === label,
      (label) => { state.radius = label; },
    ));
    setTimeout(() => origin.focus(), 40);
    updateChrome();
    return;
  }
  const placeholders = {
    State: "Enter one or more states",
    County: "Enter one or more counties",
    City: "Enter one or more cities",
    "ZIP Codes": "Enter one or more ZIP Codes",
    "Multiple Markets": "Enter ZIP Codes, cities, counties, or states",
    "Custom Sales Territory": "Describe your sales territory",
  };
  wrap.appendChild(el(`<p class="quiz-label">Enter your target market. You can add more than one.</p>`));
  const field = textField({
    id: "market-field",
    textarea: true,
    value: state.market,
    placeholder: placeholders[type] || "Enter your target market",
    onInput: (v) => { state.market = v; updateChrome(); },
  });
  wrap.appendChild(field);
  setTimeout(() => field.focus(), 40);
  updateChrome();
}

function leadPayload() {
  const c = state.contact;
  return {
    first: c.first.trim(),
    last: c.last.trim(),
    company: c.company.trim(),
    email: c.email.trim(),
    phone: c.phone.trim(),
    website: c.website.trim(),
    contactMethod: c.method,
    audienceType: state.audienceType,
    specialties: state.specialties.join(", "),
    otherSpecialty: state.otherSpecialty,
    geoType: state.geoType,
    market: state.market,
    radiusOrigin: state.radiusOrigin,
    radius: state.radius,
    ageFrom: state.ageFrom,
    ageTo: state.ageTo,
    anyAge: state.anyAge ? "Yes" : "",
    gender: state.gender,
    income: state.income.join(", "),
    homeownership: state.homeownership,
    marital: state.marital.join(", "),
    children: state.children,
    extras: state.extras.join(", "),
    consumerNotes: state.consumerNotes,
    industry: state.industry,
    industryCodes: state.industryCodes.join(", "),
    employees: state.employees,
    sales: state.sales,
    roles: state.roles.join(", "),
    jobTitles: state.jobTitles,
    channel: state.channels.join(", "),
    fields: state.fields.join(", "),
    quantity: state.quantity,
    offering: state.offering,
    campaignNotes: state.campaignNotes,
    timing: state.timing,
    summary: recapPairs().map(([label, value]) => `${label}: ${value}`).join(" | "),
  };
}

async function submitLead(payload) {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Lead submit ${res.status}`);
  } catch (err) {
    console.info("Mockup lead captured locally.", payload, err);
  }
}

function renderUnlock() {
  body.innerHTML = `
    <div class="unlock quiz-enter">
      <p class="quiz-kicker">Step 7: Your Audience Is Almost Ready</p>
      <h2>Great. We’ve Got Your Audience Criteria.</h2>
      <p>Where should we send your free audience analysis? We’ll review your selections, research available data, and provide you with available counts, targeting recommendations, and pricing.</p>
      <form class="unlock-form" id="unlock-form">
        <div class="row-2">
          <input required name="first" placeholder="First Name*" autocomplete="given-name" />
          <input required name="last" placeholder="Last Name*" autocomplete="family-name" />
        </div>
        <input required name="company" placeholder="Company*" autocomplete="organization" />
        <input required type="email" name="email" placeholder="Email Address*" autocomplete="email" />
        <input required type="tel" name="phone" placeholder="Phone Number*" autocomplete="tel" />
        <input name="website" placeholder="Website" autocomplete="url" />
        <p class="quiz-label">Preferred Contact Method</p>
        <div class="quiz-pills" id="method-pills">
          <button type="button" data-value="Email">Email</button>
          <button type="button" data-value="Phone">Phone</button>
          <button type="button" data-value="Either">Either</button>
        </div>
        <button class="btn btn-primary btn-lg" type="submit">GET MY FREE AUDIENCE COUNT</button>
        <p class="form-note">Free audience research. No obligation to purchase.</p>
        <p class="form-note">By submitting, you agree that AmeriList may contact you about this request. See our <a href="https://www.amerilist.com/privacypolicy" target="_blank" rel="noopener">Privacy Policy</a>.</p>
      </form>
    </div>`;
  const form = document.getElementById("unlock-form");
  [...form.querySelectorAll("input")].forEach((input) => {
    input.value = state.contact[input.name] || "";
    input.addEventListener("input", () => { state.contact[input.name] = input.value; });
  });
  const pills = document.getElementById("method-pills");
  [...pills.children].forEach((btn) => {
    if (btn.dataset.value === state.contact.method) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      state.contact.method = btn.dataset.value;
      [...pills.children].forEach((b) => b.classList.toggle("selected", b === btn));
    });
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.classList.add("is-loading");
    const payload = leadPayload();
    try {
      await submitLead(payload);
    } finally {
      state.screen = "thanks";
      render({ scroll: true, animate: true });
    }
  });
}

function renderThanks() {
  const wrap = el(`
    <div class="beat quiz-enter thanks-panel">
      <p class="quiz-kicker">Audience Builder</p>
      <h2>Your Audience Request Has Been Submitted!</h2>
      <div class="gen-bar"><i></i></div>
      <p class="gen-label" id="thanks-status">We’re researching your market.</p>
      <p>Thank you for using the Best Mailing List Broker Audience Builder.</p>
      <ul class="recap-list" id="thanks-recap"></ul>
      <p>A data specialist will review your targeting criteria and research the available marketing databases that best match your request.</p>
      <p>We’ll provide you with:</p>
      <ul class="thanks-checks">
        <li>Available Audience Counts</li>
        <li>Recommended Targeting Options</li>
        <li>Available Data Fields</li>
        <li>List Pricing</li>
        <li>Suggestions for Your Campaign</li>
      </ul>
      <p>Have an urgent request? Call AmeriList at <a href="tel:18004572899">1.800.457.2899</a>.</p>
      <p class="fine-center">Powered by AmeriList. Helping marketers find the right audiences since 2002.</p>
    </div>`);
  body.appendChild(wrap);
  const list = wrap.querySelector("#thanks-recap");
  recapPairs().forEach(([label, value]) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    li.appendChild(strong);
    li.appendChild(document.createTextNode(value));
    list.appendChild(li);
  });
  const markSent = () => {
    const status = document.getElementById("thanks-status");
    if (status) status.textContent = "We’re researching your market.";
  };
  if (canGsap()) {
    gsap.fromTo(".gen-bar i", { width: "0%" }, {
      width: "100%",
      duration: 1.4,
      ease: "power2.inOut",
      onComplete: markSent,
    });
  } else {
    const bar = wrap.querySelector(".gen-bar i");
    if (bar) bar.style.width = "100%";
    markSent();
  }
}

function render({ scroll, animate } = {}) {
  body.innerHTML = "";
  updateChrome();
  if (state.screen === "q") renderQ();
  else if (state.screen === "unlock") renderUnlock();
  else renderThanks();
  if (animate) animateIn();
  if (scroll) {
    document.getElementById("quiz-shell").scrollIntoView({ behavior: motionOk ? "smooth" : "auto", block: "start" });
  }
}

dockBack.addEventListener("click", () => {
  if (state.q > 0) goQuestion(state.q - 1);
});

dockNext.addEventListener("click", async () => {
  if (!canContinue()) return;
  dockNext.classList.add("is-loading");
  dockNext.disabled = true;
  await delay(280);
  dockNext.classList.remove("is-loading");
  if (state.q === 5) {
    state.screen = "unlock";
    render({ scroll: true, animate: true });
    return;
  }
  goQuestion(state.q + 1);
});

document.addEventListener("keydown", (e) => {
  if (state.screen !== "q") return;
  if (e.target.matches("input, textarea")) return;
  const answers = [...body.querySelectorAll(".answer")];
  const idx = KEYS.indexOf(e.key.toUpperCase());
  if (idx >= 0 && answers[idx]) answers[idx].click();
});

render({ animate: true });

}
