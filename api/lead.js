const FORM_URL =
  "https://form.123formbuilder.com/6980525/best-mail-list-broker-quiz";
const FORM_ID = 6980525;
const SITE_ORIGIN = "https://bestmailinglistbroker.com/";

/** Field map from form 6980525 — https://form.123formbuilder.com/6980525/best-mail-list-broker-quiz */
const FIELDS = {
  first: { id: 121876407, type: 23, hash: "00000007" },
  last: { id: 121876408, type: 23, hash: "00000009" },
  company: { id: 121876409, type: 23, hash: "0000000b" },
  email: { id: 121876410, type: 5, hash: "0000000d" },
  phone: { id: 121876411, type: 16, hash: "0000000f" },
  website: { id: 121876412, type: 23, hash: "00000011" },
  contactMethod: { id: 121876413, type: 23, hash: "00000013" },
  audienceType: { id: 121876414, type: 23, hash: "00000015" },
  specialties: { id: 121876415, type: 23, hash: "00000017" },
  otherSpecialty: { id: 121876455, type: 23, hash: "00000043" },
  geoType: { id: 121876416, type: 23, hash: "00000019" },
  market: { id: 121876417, type: 23, hash: "0000001b" },
  radiusOrigin: { id: 121876458, type: 23, hash: "00000047" },
  radius: { id: 121876460, type: 23, hash: "00000049" },
  ageFrom: { id: 121876424, type: 23, hash: "00000029" },
  ageTo: { id: 121876425, type: 23, hash: "0000002b" },
  anyAge: { id: 121876426, type: 23, hash: "0000002d" },
  gender: { id: 121876428, type: 23, hash: "00000031" },
  income: { id: 121876429, type: 23, hash: "00000033" },
  homeownership: { id: 121876430, type: 23, hash: "00000035" },
  marital: { id: 121876432, type: 23, hash: "00000039" },
  children: { id: 121876419, type: 23, hash: "0000001f" },
  extras: { id: 121876420, type: 23, hash: "00000021" },
  consumerNotes: { id: 121876468, type: 24, hash: "00000052" },
  industry: { id: 121876422, type: 23, hash: "00000025" },
  industryCodes: { id: 121876476, type: 23, hash: "00000053" },
  employees: { id: 121876477, type: 23, hash: "00000055" },
  sales: { id: 121876479, type: 23, hash: "00000057" },
  jobTitles: { id: 121876480, type: 23, hash: "00000059" },
  channel: { id: 121876481, type: 23, hash: "0000005b" },
  fields: { id: 121876482, type: 23, hash: "0000005d" },
  quantity: { id: 121876484, type: 23, hash: "0000005f" },
  offering: { id: 121876487, type: 23, hash: "00000061" },
  campaignNotes: { id: 121876491, type: 24, hash: "00000065" },
  timing: { id: 121876493, type: 23, hash: "00000068" },
  summary: { id: 121876496, type: 24, hash: "0000006b" },
};

function formatPhone(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return String(raw || "").trim();
}

async function getSession() {
  const res = await fetch(FORM_URL, {
    headers: { "User-Agent": "Mozilla/5.0 BestMailingListBroker" },
  });
  const html = await res.text();
  const match = html.match(/withSessionId\(\s*"([^"]+)"/);
  if (!match) throw new Error("123FormBuilder session missing");
  return match[1];
}

function submissionFrom(payload) {
  const entries = Object.entries(FIELDS).flatMap(([key, field]) => {
    let value = payload[key];
    if (value == null) return [];
    value = String(value).trim();
    if (!value) return [];
    if (key === "phone") value = formatPhone(value);
    return [
      {
        id: field.id,
        value: { value },
        hash: field.hash,
        typeId: field.type,
        visible: true,
        path: "",
      },
    ];
  });

  if (payload.roles && String(payload.roles).trim()) {
    const roles = String(payload.roles).trim();
    const summaryEntry = entries.find((e) => e.id === FIELDS.summary.id);
    const rolesLine = `Roles: ${roles}`;
    if (summaryEntry) {
      summaryEntry.value.value = `${summaryEntry.value.value} | ${rolesLine}`;
    }
  }

  return entries;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const payload =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    const session = await getSession();
    const body = {
      action: 0,
      formId: FORM_ID,
      location: SITE_ORIGIN,
      referrer: SITE_ORIGIN,
      partial: false,
      sessionId: session,
      submission: submissionFrom(payload),
      sessionKey: "",
      currentPage: 0,
      targetPage: null,
      totalPages: 1,
      language: "en",
    };

    const submit = await fetch(`${FORM_URL}?PHPSESSID=${encodeURIComponent(session)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 BestMailingListBroker",
        "X-PHPSESSID": session,
        Origin: "https://form.123formbuilder.com",
        Referer: FORM_URL,
      },
      body: JSON.stringify(body),
    });
    const result = await submit.json();
    if (!result || result.ok !== true) {
      return res.status(502).json({
        ok: false,
        error: "123FormBuilder rejected the submission",
        details: result,
      });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Lead submit failed",
    });
  }
};
