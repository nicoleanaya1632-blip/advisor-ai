"use client";
import { useState, useRef, useEffect } from "react";

var FORMAT_HARD = "\n\n###FORMATTING RULES — MANDATORY — NON-NEGOTIABLE###\nRespond ONLY in flowing prose. Zero bullets. Zero headers. Zero numbering. Zero bold. Zero 'Assessment:', 'Conclusion:', 'Suggestion:', 'Overall:' or any subtitle. Maximum 150 words. If the question is short, answer in 2-3 sentences. Do not open with 'So', 'Sure', 'Look', 'Well', 'I understand that', 'Interesting', or by paraphrasing the question. Do not close with a summary, a moral, a follow-up question, or an offer to help. Do not introduce your answer — just answer. Write the way a real person talks in a meeting, not like a report.";

var META_BASE = "Also: if there is REFERENCE MATERIAL with markers like [Slide N] or [Page N] and one of your points leans on a specific part of that material, cite it in parentheses, e.g. (Slide 8) — only when it genuinely supports the point, never out of obligation. If the conversation includes contributions from other people marked with their name, this is a discussion panel: react with your own judgment, you can agree or disagree with them, but never repeat them or speak for them.";

var META_TAG_PERSONA = "\n\n###SINGLE EXCEPTION — SYSTEM MARKER###\nAfter your answer, on a separate final line, write exactly this marker: [CONFIANZA: NN | reason], where NN is an integer between 55 and 100. That number is your estimate of the probability that the real person you embody would give an answer like yours. Compute it from three factors: (1) clarity of the question — if ambiguous or incomplete, lower; (2) information provided — if the brief, material or context is missing, lower; (3) how squarely the topic sits within your documented territory — if your philosophy, cases and real phrases directly cover what you're answering, higher; if you're extrapolating beyond what's documented, lower. Never write a number below 55 or above 100. The reason: max 10 words. The system processes and hides this marker — it does not count as part of your answer and does not break the formatting rules. " + META_BASE;

var META_TAG_GENERIC = "\n\n###SYSTEM NOTES###\n" + META_BASE + " Do not write any confidence or system marker — just answer.";

var MARCUS_PROMPT = `You are Marcus Feld, Head of Product at a mid-size consumer technology company. You've spent 16 years building products — six as an engineer, then a decade in product leadership across a fintech scale-up, a marketplace, and now consumer tech. You've shipped things that worked and killed things that didn't, and you talk about both without ego.

How your head works: you separate the problem from the solution ruthlessly. Before anyone talks about features, you want to know what user pain we're actually solving and whether it's worth solving. A feature that doesn't move a real metric is a distraction dressed up as progress. You're allergic to "build it because a competitor has it." Your first question when someone brings you an idea is always: what's the smallest version of this we can put in front of real users this week? You believe roadmaps are hypotheses, not promises. When data proves you wrong you change direction without drama — you say it out loud, "the data says I was wrong, let's move."

Your philosophy: ship to learn. Scope down until it's uncomfortable, then ship that. You distrust features that only exist in slide decks. You care about adoption over surface area — one feature people use beats five they ignore. You think most teams over-build before they've earned the right to. You measure demand with the cheapest possible signal before committing engineering to it.

How you evaluate work: first, is there a real user problem here, or a solution looking for one? Second, what's the fastest way to test the riskiest assumption? Third, how will we know if it worked — what's the metric, and is it honest or vanity? You don't accept "it'll be great" as an answer. You want the assumption named and the test designed.

How you talk: plain, direct, a little dry. Product jargon when it earns its place (north star, MVP, retention, activation) but never to sound smart. You ask sharp questions more than you give sermons. When something's good you say so cleanly; when it's not you explain exactly why. You don't pad feedback to be nice — you respect people enough to be straight. If a question is really about brand, finance or ops rather than product, you say so and don't pretend otherwise.

React the way you would in a real product review — no report, no checklist. If the question is short, your answer is short.` + FORMAT_HARD + META_TAG_PERSONA;

var ELENA_PROMPT = `You are Elena Vasquez, VP of Marketing at a consumer goods company, with 20 years across brand and growth. You started in classical brand management at a large CPG, moved through agency-side strategy, ran growth at a DTC brand during its scale-up, and now lead marketing end to end. You've seen the pendulum swing from brand to performance and back, and you refuse to pick a side because the truth is both.

Your core conviction: marketing builds a brand and drives a number, and the moment you optimize only for the number you quietly destroy the thing that makes the number cheap to hit later. You distinguish a truth from an insight with precision — a truth is something everyone already knows ("people are busy"), an insight is the uncomfortable specific thing that makes someone say "that's exactly me." You chase the second. You're impatient with campaigns built on the first.

How you evaluate work: first, who is this actually for, and do we understand them beyond a demographic? Second, is there a real insight or just a category truism dressed up? Third, does this build something that compounds, or does it only work while we're paying for it? You respect performance discipline but you push back hard when short-term metrics are cannibalizing brand equity nobody's measuring.

Your obsession is getting out of the building. You don't trust marketing decisions made entirely from dashboards. You want to have talked to real customers recently — not focus-group theater, actual conversations. You believe the best positioning comes from noticing what people do, not what they say in surveys.

On new channels and tactics: you've watched enough hype cycles to stay calm. A new platform is a distribution question, not a strategy. The strategy is who you're for and why you matter. You get genuinely excited by sharp work and you say so; you also name it flatly when something is "first layer" — the obvious idea everyone would land on.

How you talk: warm but exacting, concrete, fond of a good analogy. Marketing language when it's useful (positioning, equity, funnel, insight) without hiding behind it. You trade opinions as a peer, not a boss. If a question is really about product mechanics or unit economics rather than marketing and brand, you flag it.

React the way you would in a real strategy session with your team — direct, specific, no lecture.` + FORMAT_HARD + META_TAG_PERSONA;

var DAVID_PROMPT = `You are David Okonkwo, CFO of a growth-stage company, 22 years in finance across investment banking, corporate FP&A, and two operating CFO roles. You're the person in the room who asks the question everyone else was avoiding. You are not the "no" guy — you're the "show me how this pays for itself" person, which is different, and you're careful about the distinction.

How your head works: every decision is a resource allocation decision, and resources are finite. You think in terms of return, risk, and time. You want to know the cost, the expected upside, how confident we are in that upside, and what happens if we're wrong. You're comfortable with a bet — you just want it named as a bet, sized correctly, and reversible where possible. You distrust plans that assume everything goes right.

Your discipline: separate the operating question from the financing question. Separate what's true from what we hope. You push people to state assumptions explicitly because that's where the real risk hides — a model is only as good as the number someone typed into a cell with false confidence. You'd rather have a rough answer to the right question than a precise answer to the wrong one.

How you evaluate a proposal: first, what does it cost, fully loaded, including the things people forget? Second, what's the honest return and over what horizon? Third, what's the downside if the core assumption breaks, and can we get out cheaply? You're not against ambition — you fund it constantly — but you want ambition with a floor under it. You call out vanity metrics and revenue that isn't really revenue.

On growth: you've seen companies grow themselves into insolvency. Growth that burns more than it builds isn't growth, it's a countdown. You like unit economics that work before you pour fuel on them.

How you talk: measured, precise, occasionally dry humor. Finance language when it's load-bearing (margin, burn, runway, ROI, opportunity cost) but you explain rather than gatekeep. You're direct about risk without being a doomsayer. If a question is really about product vision or creative rather than the numbers, you note that it's outside your lane and defer.

React the way you would in a real budget or planning meeting — sharp, grounded, focused on what the decision actually costs.` + FORMAT_HARD + META_TAG_PERSONA;

var PRIYA_PROMPT = `You are Priya Nair, Head of Operations at a scaling company, 17 years turning chaos into systems across manufacturing, logistics, and now company-wide ops. You're the person who makes things actually work at scale, and you have a deep, unglamorous appreciation for the boring machinery that keeps a business running.

How your head works: you see everything as a system with inputs, throughput, and failure points. When someone brings you an exciting idea, your instinct is to trace it downstream — who executes this, what breaks when volume triples, where's the bottleneck, what's the failure mode nobody planned for. You're not a pessimist; you're the person who's seen what happens when nobody asked these questions. You believe most great ideas die not in strategy but in execution, and execution is a discipline, not an afterthought.

Your philosophy: a process that only works when everyone's paying attention isn't a process, it's luck. You design for the tired Tuesday, not the launch-day adrenaline. You distinguish a one-time heroic effort from a repeatable system, and you know the second is worth ten of the first. You care about what scales without proportionally scaling headcount and pain.

How you evaluate a plan: first, who actually does this, and is that realistic with the team we have? Second, what breaks at 10x volume? Third, where are the dependencies and single points of failure? You want the operational reality named before everyone gets excited about the vision. You've killed beautiful plans that had no path to execution and you don't apologize for it.

On efficiency: you distinguish real efficiency from false economy. Cutting a cost that creates three downstream problems isn't saving money. You look at the whole flow, not the line item.

How you talk: practical, clear, calm under pressure, a little wry about how often the "simple" thing turns out not to be. Ops language when useful (throughput, bottleneck, SLA, capacity, dependency) but grounded and concrete. You trade views as a peer and you're generous with what you know. If a question is really about brand, creative, or high-level strategy rather than execution and operations, you say it's not your strongest ground.

React the way you would in a real ops review — grounded, specific, focused on whether this actually works when it meets reality.` + FORMAT_HARD + META_TAG_PERSONA;

var PRODUCT_GENERIC = `You are a senior product leader with 15+ years shipping software. Your judgment comes from having watched a lot of products succeed and fail, not from theory. You separate the problem from the solution, you scope aggressively toward the smallest testable version, and you care about adoption over feature count. You measure demand with the cheapest signal before committing real engineering. When you evaluate work, you look for a real user problem, the riskiest assumption and how to test it fast, and an honest metric of success rather than a vanity one. You give feedback like a peer in a product review — direct, specific, no padding, short when the question is short.` + FORMAT_HARD + META_TAG_GENERIC;

var MARKETING_GENERIC = `You are a senior marketing and brand leader with 18+ years across brand building and growth. You hold both truths at once: marketing builds a brand and drives a number, and optimizing only for the number erodes the brand that makes the number cheap later. You distinguish a category truism from a real insight — the specific, uncomfortable thing that makes someone say "that's exactly me." When you evaluate work you look for a clear audience understood beyond demographics, a genuine insight rather than the obvious first layer, and whether it builds something that compounds or only works while you're paying. You give feedback as a peer — warm but exacting, concrete, no lecture.` + FORMAT_HARD + META_TAG_GENERIC;

var FINANCE_GENERIC = `You are a senior finance leader with 18+ years across FP&A and operating finance. You treat every decision as a resource allocation under uncertainty: cost, expected return, confidence in that return, and the downside if you're wrong. You're comfortable with a bet as long as it's named as one, sized right, and reversible where possible. You push people to state assumptions explicitly because that's where risk hides. When you evaluate a proposal you look for the fully-loaded cost, the honest return over a real horizon, and a floor under the downside. You call out vanity metrics and revenue that isn't really revenue. You give feedback grounded in what the decision actually costs — direct about risk without being a doomsayer.` + FORMAT_HARD + META_TAG_GENERIC;

var OPS_GENERIC = `You are a senior operations leader with 15+ years turning ideas into systems that work at scale. You see everything as inputs, throughput, and failure points, and you trace exciting ideas downstream to who executes them and what breaks at 10x volume. You believe most great ideas die in execution, not strategy, and that a process which only works when everyone's paying attention is just luck. When you evaluate a plan you look for realistic ownership given the actual team, what breaks under scale, and the dependencies and single points of failure. You distinguish real efficiency from false economy. You give feedback like a peer in an ops review — practical, calm, concrete, focused on whether it survives contact with reality.` + FORMAT_HARD + META_TAG_GENERIC;

// ─── TOKENS — ADVISOR AI IDENTITY ──────────────────────────────────────────────
var YELLOW = "#F2C230";
var YELLOW_SOFT = "#FBEBBB";
var YELLOW_TINT = "#FCF4DC";
var INK = "#141414";
var PAGE_BG = "#ECEAE5";
var CARD = "#ffffff";
var SURFACE = "#F8F7F4";
var BORDER = "#E5E3DD";
var TEXT = "#141414";
var TEXT_DIM = "#5F5D57";
var TEXT_MUTED = "#98968F";

var MONO = "'JetBrains Mono', 'Courier New', monospace";
var SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, Helvetica, Arial, sans-serif";

var LS_KEY = "advisorai_history_v1";
var LS_LEARN = "advisorai_learnings_v1";
var LS_TERRITORIES = "advisorai_territories_v1";

// ─── MÉTRICAS PRIVADAS (solo escribe al Sheet de Nicole, invisible en la UI) ─
var METRICS_URL = ""; // demo build — metrics logging disabled

function logMetric(data) {
  if (!METRICS_URL) return;
  try {
    fetch(METRICS_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
    });
  } catch (e) {}
}

// Contador anónimo de aprendizajes — NUNCA envía el texto de la nota.
function logLearning(area, twin, tipo) {
  logMetric({
    area: area,
    twin: twin,
    tipo: tipo,
    aprendizaje_guardado: true,
    adjunto: false,
    largo: 0,
    pregunta: "",
  });
}

// ─── CONSISTENCY CHECKER — PROMPTS ───────────────────────────────────────────
// Nota: estos prompts SÍ piden estructura, a diferencia de FORMAT_HARD.
// El checker produce un artefacto, no una conversación.

var DIMS_PROMPT = `You are a senior strategy advisor. Your task is to break a stated strategy or objective down into its constituent dimensions.

A dimension is a specific, evaluable axis of the strategy — something a piece of work can embody, brush against, ignore, or contradict. It is not a generic attribute. "Quality" is not a dimension; "the visible craftsmanship in the product" is.

Rules:
- Return between 3 and 5 dimensions. Never more than 5.
- Each dimension: maximum 4 words.
- Each description: one short sentence explaining what it means for a piece of work to be in that dimension.
- If the strategy you're given is generic (a list of attributes any company in any category could claim), do NOT invent dimensions. Return an empty array and explain why in the "problema" field.
- The dimensions must come from the strategy given, not from your prior knowledge.

###OUTPUT FORMAT — MANDATORY###
Respond ONLY with a valid JSON object. Zero text before. Zero text after. Zero backticks. Zero markdown.

{"marca":"name of the initiative or company if you can identify it, otherwise empty string","dimensiones":[{"nombre":"...","desc":"..."}],"problema":""}

If the strategy is insufficient:
{"marca":"","dimensiones":[],"problema":"explanation of why this is not an evaluable strategy, maximum 40 words"}`;

var EVAL_PROMPT = `You are a senior strategy advisor evaluating whether a piece of work is consistent with a stated strategy.

You will receive a strategy, a list of dimensions, and a piece of work. For each dimension, you decide a level:

- "fuerte": the work clearly and centrally embodies this dimension.
- "parcial": the work brushes against it, hints at it, or touches it without committing.
- "ausente": the work simply does not address it.
- "contradice": the work says or shows something that runs against this dimension.

Judgment rules:
- Evaluate what the work DOES, not what it says it does. A piece that mentions the word "customer-first" is not thereby embodying it.
- Shared vocabulary is not consistency. A piece can repeat the words of the strategy and still be outside it.
- A piece can embody a dimension without ever naming it. That is usually better work.
- Be specific in the evidence: cite or describe the concrete part of the work that supports your level.
- Don't soften. If something is absent, say absent — not "partial" out of politeness.

###OUTPUT FORMAT — MANDATORY###
Respond ONLY with a valid JSON object. Zero text before. Zero text after. Zero backticks. Zero markdown.

{"lectura":"a single sentence describing the pattern you see, without dictating a verdict or scoring, maximum 30 words","evaluaciones":[{"nombre":"exact name of the dimension","nivel":"fuerte|parcial|ausente|contradice","evidencia":"which specific part of the work supports this, maximum 35 words"}],"correccion":"one concrete direction that would bring the work closer to the strategy, not a rewrite, maximum 45 words","enTerritorio":"what DOES work in the piece within the strategy, maximum 30 words, empty string if nothing"}`;

var LEVELS = {
  fuerte:     { label: "fuerte",     color: "#2E9E5B", fill: 1.0,  order: 0 },
  parcial:    { label: "parcial",    color: "#D9A400", fill: 0.5,  order: 1 },
  ausente:    { label: "ausente",    color: "#C9C7C0", fill: 0.0,  order: 2 },
  contradice: { label: "contradice", color: "#C44536", fill: 0.28, order: 3 },
};

function parseJsonLoose(raw) {
  if (!raw) return null;
  var t = String(raw).trim();
  t = t.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  var a = t.indexOf("{");
  var b = t.lastIndexOf("}");
  if (a === -1 || b === -1 || b < a) return null;
  try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { return null; }
}

// ─── PROMPT LIBRARY ──────────────────────────────────────────────────────────
var PROMPT_LIBRARY = [
  {
    cat: "General assessment",
    items: [
      "Critique this idea",
      "Does this feel like it's missing something?",
      "What's the weakest part here?",
      "Would you back this if it were your call?"
    ]
  },
  {
    cat: "Problem / alignment",
    items: [
      "Is this solving a real problem?",
      "Does this address the actual business goal?",
      "What part of this drifts off-target?",
      "Are we missing something we should be solving?"
    ]
  },
  {
    cat: "Strategy / insight",
    items: [
      "Is this an insight or just a truism?",
      "Does the strategy actually support this?"
    ]
  },
  {
    cat: "Differentiation",
    items: [
      "What's the risk this goes unnoticed?",
      "What would make this more distinctive?"
    ]
  },
  {
    cat: "Value / impact",
    items: [
      "Does this build long-term value or just short-term wins?",
      "Is this consistent with our strategy?",
      "Does this stand apart from competitors or blend in?"
    ]
  },
  {
    cat: "Execution",
    items: [
      "Does this work in practice or only on paper?",
      "What breaks when this scales?",
      "What metric tells us if this worked?"
    ]
  },
  {
    cat: "Risk / defense",
    items: [
      "What risks do you see?",
      "How do I defend this to leadership?",
      "What tough question might I get asked?"
    ]
  },
  {
    cat: "Pitch / presentation",
    items: [
      "How do I sell this better in the room?",
      "Which slide is dead weight?",
      "What's the hook if I have 30 seconds?"
    ]
  }
];

var ALL_PROMPTS = PROMPT_LIBRARY.reduce(function(acc, g) {
  return acc.concat(g.items);
}, []);

// ─── TEAM ────────────────────────────────────────────────────────────────────
var TEAM = {
  product: {
    name: "Product",
    desc: "User problems, scope, and what to ship next.",
    icon: "★",
    members: {
      marcus: { name: "Marcus Feld", prompt: MARCUS_PROMPT },
      generic: { name: "General perspective", prompt: PRODUCT_GENERIC }
    }
  },
  marketing: {
    name: "Marketing",
    desc: "Brand, audience, and demand.",
    icon: "◈",
    members: {
      elena: { name: "Elena Vasquez", prompt: ELENA_PROMPT },
      generic: { name: "General perspective", prompt: MARKETING_GENERIC }
    }
  },
  finance: {
    name: "Finance",
    desc: "Cost, return, and risk.",
    icon: "◐",
    members: {
      david: { name: "David Okonkwo", prompt: DAVID_PROMPT },
      generic: { name: "General perspective", prompt: FINANCE_GENERIC }
    }
  },
  operations: {
    name: "Operations",
    desc: "Execution, scale, and failure points.",
    icon: "◉",
    members: {
      priya: { name: "Priya Nair", prompt: PRIYA_PROMPT },
      generic: { name: "General perspective", prompt: OPS_GENERIC }
    }
  }
};


function initials(name) {
  if (name === "General perspective") return "GP";
  var parts = name.split(" ");
  var a = parts[0] ? parts[0][0] : "";
  var b = parts[1] ? parts[1][0] : "";
  return (a + b).toUpperCase();
}

function selectionKey(area, member) { return area + ":" + member; }
function parseKey(key) { var p = key.split(":"); return { area: p[0], member: p[1] }; }

function twinInfo(key) {
  var p = parseKey(key);
  var area = TEAM[p.area];
  var member = area && area.members[p.member];
  if (!member) return null;
  var displayName = member.name === "General perspective" ? member.name + " (" + area.name + ")" : member.name;
  return { key: key, area: area, member: member, displayName: displayName };
}

function convTitle(conv) {
  return conv.twinKeys.map(function(k) {
    var info = twinInfo(k);
    return info ? info.displayName : k;
  }).join(" + ");
}

function fmtTime(ts) {
  var d = new Date(ts);
  var now = new Date();
  var yest = new Date(now); yest.setDate(now.getDate() - 1);
  var h = d.getHours();
  var m = ("0" + d.getMinutes()).slice(-2);
  var ap = h >= 12 ? "p.m." : "a.m.";
  var hh = h % 12; if (hh === 0) hh = 12;
  var t = hh + ":" + m + " " + ap;
  if (d.toDateString() === now.toDateString()) return "today, " + t;
  if (d.toDateString() === yest.toDateString()) return "yesterday, " + t;
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + ", " + t;
}

// Extrae y limpia el marcador [CONFIANZA: NN | razón] de la respuesta.
// NN es un porcentaje 55–100. Compatibilidad con el marcador viejo (alta/media/baja).
function parseConfidence(text) {
  var result = { clean: text, level: null, reason: null };
  var match = text.match(/\[\s*CONFIANZA\s*:\s*(\d{1,3})\s*%?\s*[|—-]?\s*([^\]]*)\]/i);
  if (match) {
    var pct = parseInt(match[1], 10);
    if (isNaN(pct)) pct = 55;
    if (pct < 55) pct = 55;
    if (pct > 100) pct = 100;
    result.level = pct;
    result.reason = (match[2] || "").trim();
    result.clean = text.replace(match[0], "").trim();
    return result;
  }
  var old = text.match(/\[\s*CONFIANZA\s*:\s*(alta|media|baja)\s*[|—-]?\s*([^\]]*)\]/i);
  if (old) {
    var map = { alta: 90, media: 75, baja: 58 };
    result.level = map[old[1].toLowerCase()];
    result.reason = (old[2] || "").trim();
    result.clean = text.replace(old[0], "").trim();
  }
  return result;
}

// Solo los twins de personas reales (no "General perspective") muestran confianza
function isNamedTwin(key) {
  if (!key) return false;
  return parseKey(key).member !== "generic";
}

// Construye el hilo de mensajes desde la perspectiva de un twin específico.
// Sus propias respuestas van como "assistant"; las de otros twins van como
// contexto de usuario con su nombre, para que pueda reaccionar a ellas.
function buildApiMessages(messages, twinKey, multi) {
  var out = [];
  function push(role, content) {
    if (out.length > 0 && out[out.length - 1].role === role) {
      out[out.length - 1].content += "\n\n" + content;
    } else {
      out.push({ role: role, content: content });
    }
  }
  for (var i = 0; i < messages.length; i++) {
    var m = messages[i];
    if (m.role === "user") {
      var content = m.apiContent || m.text;
      if (i === 0 && multi) {
        content = "(You are in a discussion panel with other members of the team. Their contributions are marked with their name. React with your own judgment — you can agree or disagree, but do not repeat what they already said.)\n\n" + content;
      }
      push("user", content);
    } else if (m.twinKey === twinKey) {
      push("assistant", m.text);
    } else {
      var info = twinInfo(m.twinKey);
      var label = info ? info.member.name + " (" + info.area.name + ")" : "Otro participante";
      push("user", label + ": " + m.text);
    }
  }
  return out;
}

// ─── FILE EXTRACTION (con marcadores de página/slide para referencias) ──────
async function extractTextFromFile(file) {
  var name = file.name.toLowerCase();
  if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".csv")) return await file.text();
  if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".webp")) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var dataUrl = e.target.result;
        var base64 = dataUrl.split(",")[1];
        var mime = file.type || "image/png";
        resolve({ __isImage: true, base64: base64, mime: mime, name: file.name });
      };
      reader.onerror = function() { reject(new Error("Error reading image")); };
      reader.readAsDataURL(file);
    });
  }
  if (name.endsWith(".pdf")) {
    try {
      var pdfjsLib = window.pdfjsLib;
      if (!pdfjsLib) return "[Loading PDF reader, try again in a few seconds]";
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      var buffer = await file.arrayBuffer();
      var pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      var text = "";
      var maxPages = Math.min(pdf.numPages, 50);
      for (var i = 1; i <= maxPages; i++) {
        var page = await pdf.getPage(i);
        var content = await page.getTextContent();
        text += "[Page " + i + "] " + content.items.map(function(item) { return item.str; }).join(" ") + "\n\n";
      }
      return text || "[Could not extract text from the PDF]";
    } catch (e) { return "[Error reading PDF. Try copying and pasting the text.]"; }
  }
  if (name.endsWith(".docx") || name.endsWith(".pptx")) {
    try {
      var JSZipLib = window.JSZip;
      if (!JSZipLib) return "[Loading reader, try again in a few seconds]";
      var buffer = await file.arrayBuffer();
      var zip = await JSZipLib.loadAsync(buffer);
      if (name.endsWith(".docx")) {
        var docXml = await zip.file("word/document.xml").async("string");
        return docXml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
      if (name.endsWith(".pptx")) {
        var allText = "";
        var slideFiles = Object.keys(zip.files).filter(function(f) { return f.match(/ppt\/slides\/slide\d+\.xml/); }).sort(function(a, b) {
          var na = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
          var nb = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
          return na - nb;
        });
        for (var idx = 0; idx < slideFiles.length; idx++) {
          var xml = await zip.files[slideFiles[idx]].async("string");
          var matches = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
          allText += "[Slide " + (idx + 1) + "] " + matches.map(function(m) { return m.replace(/<\/?a:t>/g, ""); }).join(" ") + "\n\n";
        }
        return allText || "[Could not extract text from the PPTX]";
      }
    } catch (e) { return "[Error reading file. Try copying and pasting the text.]"; }
  }
  try { return await file.text(); } catch (e) { return "[Formato no soportado]"; }
}

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function callTwin(systemPrompt, messages, imageBase64, imageMime) {
  try {
    var payload = { systemPrompt: systemPrompt, messages: messages };
    if (imageBase64) { payload.imageBase64 = imageBase64; payload.imageMime = imageMime || "image/png"; }
    var res = await fetch("/api/sparring", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    var data = await res.json();
    if (data.error) return "⚠️ " + data.error;
    return data.text;
  } catch (e) { return "⚠️ Connection error. Please try again."; }
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function Avatar({ name, size, dark }) {
  var s = size || 36;
  return (
    <div style={{
      width: s, height: s, borderRadius: "50%",
      background: dark ? INK : YELLOW,
      color: dark ? "#fff" : INK,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: MONO, fontWeight: 700, fontSize: s * 0.34,
      letterSpacing: "0.02em", flexShrink: 0,
    }}>{initials(name)}</div>
  );
}

function AvatarStack({ names, size }) {
  var s = size || 34;
  var shown = names.slice(0, 3);
  return (
    <div style={{ display: "flex", flexShrink: 0 }}>
      {shown.map(function(n, i) {
        return (
          <div key={i} style={{ marginLeft: i === 0 ? 0 : -(s * 0.32), zIndex: shown.length - i, border: "2px solid " + CARD, borderRadius: "50%" }}>
            <Avatar name={n} size={s} dark />
          </div>
        );
      })}
      {names.length > 3 && (
        <div style={{
          marginLeft: -(s * 0.32), zIndex: 0, width: s + 4, height: s + 4,
          borderRadius: "50%", background: SURFACE, border: "2px solid " + CARD,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontFamily: MONO, fontWeight: 700, color: TEXT_DIM,
        }}>+{names.length - 3}</div>
      )}
    </div>
  );
}

function Eyebrow({ children, style }) {
  return (
    <div style={Object.assign({
      fontSize: 11, color: TEXT_MUTED, fontWeight: 700,
      letterSpacing: "0.24em", textTransform: "uppercase",
      fontFamily: MONO, marginBottom: 14,
    }, style || {})}>{children}</div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "14px 18px", background: CARD, border: "1px solid " + BORDER, borderRadius: "4px 16px 16px 16px", width: "fit-content" }}>
      <span className="fa-dot" style={{ animationDelay: "0s" }} />
      <span className="fa-dot" style={{ animationDelay: "0.15s" }} />
      <span className="fa-dot" style={{ animationDelay: "0.3s" }} />
    </div>
  );
}

function ConfidenceBadge({ level, reason }) {
  if (level == null) return null;
  var pct = level;
  if (typeof pct === "string") {
    var map = { alta: 90, media: 75, baja: 58 };
    pct = map[pct.toLowerCase()];
    if (pct == null) return null;
  }
  if (pct < 55) pct = 55;
  if (pct > 100) pct = 100;
  var color = pct >= 85 ? "#2E9E5B" : pct >= 70 ? "#D9A400" : "#C44536";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 6, padding: "4px 10px", background: SURFACE, border: "1px solid " + BORDER, borderRadius: 999 }}
      title={reason || ""}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 10, fontFamily: MONO, color: TEXT_DIM, letterSpacing: "0.04em" }}>
        Confianza {pct}%{reason ? " · " + reason : ""}
      </span>
    </div>
  );
}

function MessageBubble({ msg, showSpeaker, onSaveLearning, isSaved }) {
  var isUser = msg.role === "user";
  var info = !isUser ? twinInfo(msg.twinKey) : null;
  var speakerName = info ? info.member.name : "Advisor";
  return (
    <div className="fa-msg" style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 10, marginBottom: 6 }}>
      {!isUser && <Avatar name={speakerName} size={32} dark />}
      <div style={{ maxWidth: "78%" }}>
        {!isUser && showSpeaker && info && (
          <div style={{ fontSize: 11, fontFamily: MONO, color: TEXT_DIM, marginBottom: 4, paddingLeft: 2 }}>
            <span style={{ fontWeight: 700, color: INK }}>{info.member.name}</span>
            <span style={{ color: TEXT_MUTED }}> · {info.area.name}</span>
          </div>
        )}
        <div style={{
          padding: "14px 18px",
          background: isUser ? YELLOW_SOFT : CARD,
          border: isUser ? "1px solid " + YELLOW : "1px solid " + BORDER,
          borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
          color: TEXT, fontSize: 15, lineHeight: 1.7,
          fontFamily: SANS, whiteSpace: "pre-wrap",
        }}>
          {msg.fileName && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(20,20,20,0.06)", borderRadius: 8, padding: "4px 10px", marginBottom: 8, fontSize: 12, fontFamily: MONO, color: TEXT_DIM }}>
              <span>▤</span> {msg.fileName}
            </div>
          )}
          <div>
            {msg.text.split(/(\*\*[^*]+\*\*)/).map(function(part, i) {
              if (part.startsWith("**") && part.endsWith("**"))
                return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
              return <span key={i}>{part}</span>;
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: isUser ? "flex-end" : "flex-start", marginTop: 4, marginBottom: 12, flexWrap: "wrap" }}>
          {!isUser && isNamedTwin(msg.twinKey) && <ConfidenceBadge level={msg.confidence} reason={msg.confidenceReason} />}
          {!isUser && onSaveLearning && msg.text && msg.text.indexOf("\u26A0\uFE0F") !== 0 && (
            <button
              onClick={function() { if (!isSaved) onSaveLearning(msg); }}
              title={isSaved ? "Already saved to your learnings" : "Save as learning"}
              className={isSaved ? "" : "fa-learnbtn"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 10px", borderRadius: 999,
                background: isSaved ? YELLOW_TINT : "transparent",
                border: "1px solid " + (isSaved ? YELLOW : BORDER),
                color: isSaved ? INK : TEXT_MUTED,
                fontSize: 10, fontFamily: MONO, letterSpacing: "0.04em",
                cursor: isSaved ? "default" : "pointer",
              }}
            >
              <span style={{ fontSize: 11 }}>{isSaved ? "\u2605" : "\u2606"}</span>
              {isSaved ? "Saved" : "Save learning"}
            </button>
          )}
          {msg.ts && <span style={{ fontSize: 10, color: TEXT_MUTED, fontFamily: MONO }}>{fmtTime(msg.ts)}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── VISTA CHAT (pantalla completa, multi-twin) ──────────────────────────────
function ChatView({ conv, typingTwinKey, onBack, onSend, onAddTwin, onSaveLearning, savedIds }) {
  var participants = conv.twinKeys.map(twinInfo).filter(Boolean);
  var multi = conv.twinKeys.length > 1;
  var pending = !!typingTwinKey;
  var typingInfo = typingTwinKey ? twinInfo(typingTwinKey) : null;

  var replyState = useState(""); var reply = replyState[0]; var setReply = replyState[1];
  var fileState = useState(null); var attach = fileState[0]; var setAttach = fileState[1];
  var analyzingState = useState(false); var analyzing = analyzingState[0]; var setAnalyzing = analyzingState[1];
  var addState = useState(false); var showAdd = addState[0]; var setShowAdd = addState[1];
  var inputRef = useRef(null);
  var fileRef = useRef(null);
  var endRef = useRef(null);

  useEffect(function() { if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" }); }, [conv.messages, typingTwinKey]);

  var availableTwins = [];
  Object.keys(TEAM).forEach(function(areaId) {
    Object.keys(TEAM[areaId].members).forEach(function(memberId) {
      var key = selectionKey(areaId, memberId);
      if (conv.twinKeys.indexOf(key) === -1) availableTwins.push(twinInfo(key));
    });
  });

  var pickFile = async function(f) {
    if (!f) return;
    setAnalyzing(true);
    try {
      var result = await extractTextFromFile(f);
      if (result && result.__isImage) {
        setAttach({ name: f.name, image: { base64: result.base64, mime: result.mime } });
      } else if (result && result.length > 0) {
        setAttach({ name: f.name, text: result });
      }
    } catch (e) {}
    setAnalyzing(false);
  };

  var send = function() {
    if ((!reply.trim() && !attach) || pending) return;
    var text = reply.trim() || "Take a look at this material.";
    onSend(conv.id, text, attach);
    setReply("");
    setAttach(null);
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  var canSend = (reply.trim().length > 0 || attach) && !pending && !analyzing;

  return (
    <div style={{ paddingTop: 28, display: "flex", flexDirection: "column", minHeight: "calc(100vh - 120px)" }}>
      {/* Barra superior */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 20, borderBottom: "1px solid " + BORDER }}>
        <button onClick={onBack} className="fa-hover" style={{
          width: 40, height: 40, borderRadius: "50%", border: "1px solid " + BORDER,
          background: CARD, cursor: "pointer", fontSize: 17, color: INK,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>←</button>
        <div style={{ width: 1, height: 28, background: BORDER }} />
        <span style={{ fontSize: 10, fontFamily: MONO, color: TEXT_MUTED, letterSpacing: "0.22em", textTransform: "uppercase" }}>
          {multi ? "Discussion panel" : participants[0] ? participants[0].area.name : ""}
        </span>
        <div style={{ flex: 1 }} />
      </div>

      {/* Header: participants + add advisor */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 0", borderBottom: "1px solid " + BORDER, marginBottom: 26, position: "relative" }}>
        <AvatarStack names={participants.map(function(p) { return p.member.name; })} size={multi ? 44 : 54} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: multi ? 16.5 : 19, color: INK, fontFamily: SANS, lineHeight: 1.35 }}>{convTitle(conv)}</div>
          <div style={{ fontSize: 12.5, color: TEXT_MUTED, fontFamily: SANS, marginTop: 3 }}>
            {participants.length} participant{participants.length !== 1 ? "s" : ""} · Started {fmtTime(conv.startedAt)}
          </div>
        </div>
        <button
          onClick={function() { setShowAdd(!showAdd); }}
          disabled={pending || availableTwins.length === 0}
          className="fa-hover"
          title="Add an advisor to the conversation"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 16px", borderRadius: 999,
            border: "1px solid " + (showAdd ? INK : BORDER),
            background: showAdd ? YELLOW_TINT : CARD,
            cursor: (pending || availableTwins.length === 0) ? "default" : "pointer",
            fontSize: 12.5, fontFamily: MONO, fontWeight: 700, color: INK,
            flexShrink: 0, opacity: (pending || availableTwins.length === 0) ? 0.4 : 1,
          }}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Add advisor
        </button>

        {/* Dropdown of available advisors */}
        {showAdd && availableTwins.length > 0 && (
          <div style={{
            position: "absolute", top: "100%", right: 0, zIndex: 50,
            background: CARD, border: "1px solid " + BORDER, borderRadius: 16,
            boxShadow: "0 10px 36px rgba(20,20,20,0.14)", padding: 8,
            width: 300, marginTop: 6,
          }}>
            {availableTwins.map(function(t) {
              return (
                <button key={t.key} className="fa-hover" onClick={function() { setShowAdd(false); onAddTwin(conv.id, t.key); }} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  width: "100%", padding: "10px 12px", borderRadius: 10,
                  border: "none", background: "transparent", cursor: "pointer", textAlign: "left",
                }}>
                  <Avatar name={t.member.name} size={34} dark />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: INK, fontFamily: SANS }}>{t.member.name}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{t.area.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1 }}>
        {conv.messages.map(function(msg, i) {
          return <MessageBubble key={i} msg={msg} showSpeaker={true}
            onSaveLearning={msg.role === "assistant" ? function(m) { onSaveLearning(conv, m); } : null}
            isSaved={msg.role === "assistant" && savedIds.indexOf(conv.id + ":" + msg.ts) !== -1} />;
        })}
        {pending && typingInfo && (
          <div className="fa-msg" style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <Avatar name={typingInfo.member.name} size={32} dark />
            <div>
              <div style={{ fontSize: 11, fontFamily: MONO, color: TEXT_DIM, marginBottom: 4, paddingLeft: 2 }}>
                <span style={{ fontWeight: 700, color: INK }}>{typingInfo.member.name}</span>
                <span style={{ color: TEXT_MUTED }}> is typing...</span>
              </div>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Conversation bar */}
      <div style={{ position: "sticky", bottom: 20, marginTop: 24 }}>
        {attach && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: CARD, border: "1px solid " + BORDER, borderRadius: 12, padding: "8px 14px", marginBottom: 8, boxShadow: "0 2px 8px rgba(20,20,20,0.06)" }}>
            <span style={{ fontSize: 13 }}>{attach.image ? "▣" : "▤"}</span>
            <span style={{ fontSize: 12.5, fontFamily: MONO, color: TEXT_DIM }}>{attach.name}</span>
            <button onClick={function() { setAttach(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_MUTED, fontSize: 13, padding: 0 }}>✕</button>
          </div>
        )}
        {analyzing && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: CARD, border: "1px solid " + BORDER, borderRadius: 12, padding: "8px 14px", marginBottom: 8 }}>
            <div className="fa-spinner" />
            <span style={{ fontSize: 12, fontFamily: MONO, color: TEXT_DIM }}>Analyzing file...</span>
          </div>
        )}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: 8,
          background: CARD, border: "1px solid " + BORDER, borderRadius: 26,
          padding: "8px 8px 8px 20px", boxShadow: "0 4px 20px rgba(20,20,20,0.08)",
        }}>
          <textarea
            ref={inputRef}
            value={reply}
            rows={1}
            onChange={function(e) { setReply(e.target.value); }}
            onInput={function(e) { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"; }}
            onKeyDown={function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type your question..."
            disabled={pending}
            style={{
              flex: 1, border: "none", background: "transparent", resize: "none",
              color: INK, fontSize: 15, lineHeight: 1.6, fontFamily: SANS,
              padding: "8px 0", maxHeight: 160,
            }}
          />
          <input ref={fileRef} type="file" accept=".txt,.md,.csv,.pdf,.docx,.pptx,.png,.jpg,.jpeg,.webp" style={{ display: "none" }}
            onChange={function(e) { var f = e.target.files && e.target.files[0]; if (f) pickFile(f); e.target.value = ""; }} />
          <button onClick={function() { if (fileRef.current) fileRef.current.click(); }} className="fa-hover" title="Attach file" style={{
            width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent",
            cursor: "pointer", fontSize: 17, color: TEXT_DIM, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>📎</button>
          <button onClick={send} disabled={!canSend} className={canSend ? "fa-send" : ""} style={{
            width: 42, height: 42, borderRadius: "50%",
            background: canSend ? YELLOW : "#eeede8",
            color: canSend ? INK : "#aaa",
            border: "none", fontSize: 17, fontWeight: 900,
            cursor: canSend ? "pointer" : "default", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.1s, background 0.15s",
          }}>→</button>
        </div>
      </div>
    </div>
  );
}

// ─── AREA CARD ─────────────────────────────────────────────────────────
function AreaCard({ areaId, area, selected, onToggle }) {
  // Twins nombrados primero; "General perspective" siempre al final
  var memberIds = Object.keys(area.members).sort(function(a, b) {
    return (a === "generic" ? 1 : 0) - (b === "generic" ? 1 : 0);
  });
  var anySelected = memberIds.some(function(m) { return selected.includes(selectionKey(areaId, m)); });
  return (
    <div className="fa-card" style={{
      border: "1px solid " + (anySelected ? INK : BORDER),
      borderRadius: 16, background: CARD, padding: 18,
      transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: YELLOW_TINT,
        border: "1px solid " + YELLOW, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 18, color: INK, marginBottom: 12, fontFamily: MONO,
      }}>{area.icon}</div>
      <div style={{ fontWeight: 800, color: INK, fontSize: 14, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{area.name}</div>
      <div style={{ fontSize: 12.5, color: TEXT_DIM, fontFamily: SANS, lineHeight: 1.45, marginBottom: 14, minHeight: 36 }}>{area.desc}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {memberIds.map(function(memberId) {
          var member = area.members[memberId];
          var key = selectionKey(areaId, memberId);
          var isOn = selected.includes(key);
          var isNamed = memberId !== "generic";
          return (
            <button key={memberId} onClick={function() { onToggle(key); }} style={{
              display: "flex", alignItems: "center", gap: 10, padding: isNamed ? "9px 10px" : "7px 10px",
              border: "none", borderRadius: 8,
              background: isOn ? YELLOW_TINT : "transparent",
              cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.1s",
            }}>
              <span style={{
                width: 13, height: 13, borderRadius: 4,
                border: isOn ? "none" : "1.5px solid #b5b3ac",
                background: isOn ? YELLOW : "transparent",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 9, color: INK, fontWeight: 900,
              }}>{isOn ? "✓" : ""}</span>
              {isNamed && <span style={{ color: YELLOW, fontSize: 11, flexShrink: 0, lineHeight: 1 }}>★</span>}
              <span style={{
                color: isNamed ? INK : (isOn ? INK : TEXT_MUTED),
                fontWeight: isNamed ? 800 : 500,
                fontSize: isNamed ? 13.5 : 12,
                fontFamily: isNamed ? SANS : MONO,
                letterSpacing: "0.01em",
              }}>{member.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── UPLOAD (pregunta inicial) ───────────────────────────────────────────────
function FileUpload({ onFileContent, fileName, onClear, imagePreview }) {
  var inputRef = useRef(null);
  var dragState = useState(false); var dragging = dragState[0]; var setDragging = dragState[1];
  var procState = useState(false); var processing = procState[0]; var setProcessing = procState[1];
  var errState = useState(null); var error = errState[0]; var setError = errState[1];

  var readFile = async function(file) {
    setError(null); setProcessing(true);
    try {
      var result = await extractTextFromFile(file);
      if (result && result.__isImage) {
        onFileContent(result, file.name);
      } else if (result && result.length > 0) {
        onFileContent(result, file.name);
      } else {
        setError("Could not extract content. Copy and paste the text.");
      }
    } catch (err) { setError("Error reading the file."); }
    setProcessing(false);
  };

  return (
    <div>
      {!fileName ? (
        <div
          onDragOver={function(e) { e.preventDefault(); setDragging(true); }}
          onDragLeave={function() { setDragging(false); }}
          onDrop={function(e) { e.preventDefault(); setDragging(false); var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) readFile(f); }}
          onClick={function() { if (inputRef.current) inputRef.current.click(); }}
          style={{
            border: "1.5px dashed " + (dragging ? INK : "#c9c7c0"),
            borderRadius: 14, padding: "22px 16px", textAlign: "center", cursor: "pointer",
            background: dragging ? YELLOW_TINT : SURFACE,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
            transition: "background 0.15s, border-color 0.15s",
          }}>
          <input ref={inputRef} type="file" accept=".txt,.md,.csv,.pdf,.docx,.pptx,.png,.jpg,.jpeg,.webp" style={{ display: "none" }} onChange={function(e) { var f = e.target.files && e.target.files[0]; if (f) readFile(f); }} />
          {processing
            ? <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="fa-spinner" />
                <p style={{ color: TEXT_DIM, fontSize: 12, margin: 0, fontFamily: MONO, letterSpacing: "0.1em" }}>Analyzing file...</p>
              </div>
            : <>
                <span style={{ fontSize: 18, color: TEXT_DIM }}>↥</span>
                <div style={{ textAlign: "left" }}>
                  <p style={{ color: TEXT, fontSize: 13, margin: "0 0 2px", fontFamily: SANS, fontWeight: 600 }}>Drag your file here or upload it</p>
                  <p style={{ color: TEXT_MUTED, fontSize: 11.5, margin: 0, fontFamily: SANS }}>PDF, DOCX, PPTX, TXT, MD, PNG, JPG</p>
                </div>
              </>}
        </div>
      ) : (
        <div style={{ background: SURFACE, border: "1px solid " + BORDER, borderRadius: 14, overflow: "hidden" }}>
          {imagePreview && <img src={imagePreview} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "contain", display: "block", background: CARD }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
            <span style={{ color: INK, fontSize: 14 }}>{imagePreview ? "▣" : "▤"}</span>
            <span style={{ color: TEXT_DIM, fontSize: 13, fontFamily: MONO, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fileName}</span>
            <button onClick={onClear} style={{ background: "none", border: "1px solid " + BORDER, borderRadius: 8, color: TEXT_DIM, fontSize: 11, padding: "4px 12px", cursor: "pointer", fontFamily: MONO }}>✕</button>
          </div>
        </div>
      )}
      {error && <p style={{ color: "#cc3333", fontSize: 12, marginTop: 6, fontFamily: MONO }}>{error}</p>}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ onHome, onHistory, onLearnings, onPrompts, onChecker, activeView, learnCount }) {
  var iconStyle = {
    width: 44, height: 44, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 17, color: "#8d8b85", cursor: "default", position: "relative",
    background: "none", border: "none",
  };
  var activeStyle = { color: YELLOW, background: "rgba(242,194,48,0.12)" };
  var isHistory = activeView === "history";
  var isLearn = activeView === "learnings";
  var isPrompts = activeView === "prompts";
  var isChecker = activeView === "checker";
  return (
    <aside style={{
      width: 68, background: INK,
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: 26, paddingBottom: 26, flexShrink: 0,
    }}>
      <button onClick={onHome} style={{
        color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 22,
        marginBottom: 44, letterSpacing: "-0.02em", background: "none", border: "none", cursor: "pointer",
      }}>A<span style={{ color: YELLOW }}>.</span></button>
      <button onClick={onHome} title="New consultation" style={Object.assign({}, iconStyle, !isHistory ? activeStyle : null, { cursor: "pointer" })}>
        {!isHistory && <div style={{ position: "absolute", left: -12, top: 8, bottom: 8, width: 3, background: YELLOW, borderRadius: 2 }} />}
        ✎
      </button>
      <button onClick={onHistory} title="Conversation history" style={Object.assign({}, iconStyle, { marginTop: 8, cursor: "pointer" }, isHistory ? activeStyle : null)}>
        {isHistory && <div style={{ position: "absolute", left: -12, top: 8, bottom: 8, width: 3, background: YELLOW, borderRadius: 2 }} />}
        ◷
      </button>
      <button onClick={onChecker} title="Consistency checker" style={Object.assign({}, iconStyle, { marginTop: 8, cursor: "pointer" }, isChecker ? activeStyle : null)}>
        {isChecker && <div style={{ position: "absolute", left: -12, top: 8, bottom: 8, width: 3, background: YELLOW, borderRadius: 2 }} />}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="4" y1="7" x2="14" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="9" y2="17" />
        </svg>
      </button>
      <button onClick={onLearnings} title="My learnings" style={Object.assign({}, iconStyle, { marginTop: 8, cursor: "pointer" }, isLearn ? activeStyle : null)}>
        {isLearn && <div style={{ position: "absolute", left: -12, top: 8, bottom: 8, width: 3, background: YELLOW, borderRadius: 2 }} />}
        ★
        {learnCount > 0 && !isLearn && (
          <span style={{
            position: "absolute", top: 5, right: 4, minWidth: 15, height: 15,
            borderRadius: 999, background: YELLOW, color: INK,
            fontSize: 9, fontFamily: MONO, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
          }}>{learnCount > 99 ? "99+" : learnCount}</span>
        )}
      </button>
      <button onClick={onPrompts} title="Prompt library" style={Object.assign({}, iconStyle, { marginTop: 8, cursor: "pointer" }, isPrompts ? activeStyle : null)}>
        {isPrompts && <div style={{ position: "absolute", left: -12, top: 8, bottom: 8, width: 3, background: YELLOW, borderRadius: 2 }} />}
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </button>
    </aside>
  );
}

// ─── LISTA DE HISTORIAL (reutilizable en home y en vista completa) ───────────
function HistoryList({ items, typing, onOpen, onDelete }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map(function(c) {
        var names = c.twinKeys.map(function(k) { var info = twinInfo(k); return info ? info.member.name : k; });
        var isPending = !!typing[c.id];
        return (
          <div key={c.id} className="fa-histitem" style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "13px 16px", background: CARD,
            border: "1px solid " + BORDER, borderRadius: 14,
          }}>
            <button onClick={function() { onOpen(c.id); }} style={{
              display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0,
              background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0,
            }}>
              <AvatarStack names={names} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: INK, fontFamily: SANS, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {convTitle(c)}
                </div>
                <div style={{ fontSize: 12.5, color: TEXT_DIM, fontFamily: SANS, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                  {fmtTime(c.updatedAt)} · {c.firstQuestion}
                </div>
              </div>
              {isPending ? <div className="fa-spinner" /> : <span style={{ color: TEXT_MUTED, fontSize: 15 }}>→</span>}
            </button>
            <button onClick={function() { onDelete(c.id); }} title="Delete conversation" style={{
              background: "none", border: "none", cursor: "pointer", color: TEXT_MUTED,
              fontSize: 13, padding: "4px 6px", flexShrink: 0,
            }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}

// ─── CONSISTENCY CHECKER ─────────────────────────────────────────────────────
function LevelBar({ nivel }) {
  var cfg = LEVELS[nivel] || LEVELS.ausente;
  var segs = 16;
  var filled = Math.round(segs * cfg.fill);
  var blocks = [];
  for (var i = 0; i < segs; i++) blocks.push(i < filled);
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {blocks.map(function(on, i) {
        return <span key={i} style={{
          width: 7, height: 13, borderRadius: 1.5,
          background: on ? cfg.color : "rgba(20,20,20,0.07)",
        }} />;
      })}
    </div>
  );
}

function CheckerView({ onBack, territories, onSaveTerritory, onSaveLearning, savedIds, onDiscuss }) {
  var stepState = useState("input"); var step = stepState[0]; var setStep = stepState[1];
  var terrState = useState(""); var territory = terrState[0]; var setTerritory = terrState[1];
  var pieceState = useState(""); var piece = pieceState[0]; var setPiece = pieceState[1];
  var brandState = useState(""); var brand = brandState[0]; var setBrand = brandState[1];
  var dimsState = useState([]); var dims = dimsState[0]; var setDims = dimsState[1];
  var resState = useState(null); var result = resState[0]; var setResult = resState[1];
  var loadState = useState(false); var loading = loadState[0]; var setLoading = loadState[1];
  var errState = useState(null); var error = errState[0]; var setError = errState[1];
  var busyState = useState(null); var busy = busyState[0]; var setBusy = busyState[1];
  var tFileRef = useRef(null);
  var pFileRef = useRef(null);

  var brandKeys = Object.keys(territories || {});

  var readFile = async function(f, setter, which) {
    if (!f) return;
    setBusy(which);
    try {
      var r = await extractTextFromFile(f);
      if (r && r.__isImage) { setError("The checker works with text. Attach a PDF, DOCX or TXT."); }
      else if (r && r.length > 0) { setter(r); setError(null); }
    } catch (e) { setError("Could not read that file."); }
    setBusy(null);
  };

  var loadSaved = function(name) {
    var t = territories[name];
    if (!t) return;
    setBrand(name);
    setTerritory(t.territory || "");
    setDims(t.dims || []);
    setStep("dims");
    setError(null);
  };

  var proposeDims = async function() {
    if (!territory.trim()) return;
    setLoading(true); setError(null);
    var msgs = [{ role: "user", content: "STRATEGY:\n\n" + territory.trim() }];
    var raw = await callTwin(DIMS_PROMPT, msgs, null, null);
    setLoading(false);
    if (raw.indexOf("⚠️") === 0) { setError(raw.replace("⚠️ ", "")); return; }
    var parsed = parseJsonLoose(raw);
    if (!parsed) { setError("The model returned something I could not read. Try again."); return; }
    if (parsed.problema && (!parsed.dimensiones || parsed.dimensiones.length === 0)) {
      setError(parsed.problema);
      return;
    }
    if (!parsed.dimensiones || parsed.dimensiones.length === 0) {
      setError("I could not break that strategy into evaluable dimensions.");
      return;
    }
    if (parsed.marca && !brand) setBrand(parsed.marca);
    setDims(parsed.dimensiones.slice(0, 5).map(function(d, i) {
      return { id: "d" + i + "-" + Date.now(), nombre: d.nombre || "", desc: d.desc || "" };
    }));
    setStep("dims");
  };

  var evaluate = async function() {
    var clean = dims.filter(function(d) { return d.nombre.trim(); });
    if (clean.length === 0 || !piece.trim()) return;
    setLoading(true); setError(null);
    var dimText = clean.map(function(d, i) {
      return (i + 1) + ". " + d.nombre + (d.desc ? " — " + d.desc : "");
    }).join("\n");
    var msgs = [{ role: "user", content:
      "STRATEGY:\n" + territory.trim() +
      "\n\nDIMENSIONS TO EVALUATE:\n" + dimText +
      "\n\nTHE WORK:\n" + piece.trim()
    }];
    var raw = await callTwin(EVAL_PROMPT, msgs, null, null);
    setLoading(false);
    if (raw.indexOf("⚠️") === 0) { setError(raw.replace("⚠️ ", "")); return; }
    var parsed = parseJsonLoose(raw);
    if (!parsed || !parsed.evaluaciones) { setError("The model returned something I could not read. Try again."); return; }
    var evs = parsed.evaluaciones.map(function(e) {
      var lvl = String(e.nivel || "").toLowerCase().trim();
      if (!LEVELS[lvl]) lvl = "ausente";
      return { nombre: e.nombre || "", nivel: lvl, evidencia: e.evidencia || "" };
    });
    var res = {
      id: "chk-" + Date.now(),
      brand: brand.trim() || "Untitled",
      lectura: parsed.lectura || "",
      evaluaciones: evs,
      correccion: parsed.correccion || "",
      enTerritorio: parsed.enTerritorio || "",
      territory: territory.trim(),
      pieceSnippet: piece.trim().slice(0, 140),
      ts: Date.now(),
    };
    setResult(res);
    setStep("result");
    if (brand.trim()) onSaveTerritory(brand.trim(), territory.trim(), dims.filter(function(d) { return d.nombre.trim(); }));
    logMetric({
      area: "Consistency", twin: "Consistency Checker", tipo: "checker",
      adjunto: false, largo: piece.trim().length, pregunta: "",
    });
  };

  var reset = function() {
    setStep("input"); setTerritory(""); setPiece(""); setBrand("");
    setDims([]); setResult(null); setError(null);
  };

  var boxStyle = {
    width: "100%", padding: "13px 15px", background: SURFACE,
    border: "1px solid " + BORDER, borderRadius: 12, color: INK,
    fontSize: 13.5, fontFamily: SANS, resize: "vertical", lineHeight: 1.6,
  };
  var labelStyle = {
    fontSize: 11, fontFamily: MONO, fontWeight: 700, color: TEXT_MUTED,
    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 9,
    display: "flex", alignItems: "center", gap: 9,
  };
  var dot = <span style={{ width: 6, height: 6, borderRadius: "50%", background: YELLOW, flexShrink: 0 }} />;

  var attachBtn = function(refObj, which) {
    return (
      <button onClick={function() { if (refObj.current) refObj.current.click(); }} className="fa-hover" style={{
        background: CARD, border: "1px solid " + BORDER, borderRadius: 999,
        padding: "5px 13px", fontSize: 11, fontFamily: MONO, color: TEXT_DIM,
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        {busy === which ? <span className="fa-spinner" /> : <span>▤</span>}
        {busy === which ? "Leyendo..." : "Adjuntar"}
      </button>
    );
  };

  return (
    <div style={{ paddingTop: 44 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
        <button onClick={step === "input" ? onBack : reset} className="fa-hover" style={{
          width: 40, height: 40, borderRadius: "50%", border: "1px solid " + BORDER,
          background: CARD, cursor: "pointer", fontSize: 17, color: INK,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>←</button>
        <Eyebrow style={{ marginBottom: 0 }}>Consistency checker</Eyebrow>
        <span style={{ fontSize: 12, fontFamily: MONO, color: TEXT_MUTED }}>
          {step === "input" ? "step 1 of 3" : step === "dims" ? "step 2 of 3" : "result"}
        </span>
      </div>

      <p style={{ fontSize: 13, color: TEXT_DIM, fontFamily: SANS, margin: "0 0 26px 56px", lineHeight: 1.6, maxWidth: 540 }}>
        Check whether a piece of work is consistent with its stated strategy. No verdict — just dimensions. The read is yours to make.
      </p>

      {error && (
        <div style={{
          padding: "13px 16px", background: "#FDF0EE", border: "1px solid #E8C4BE",
          borderRadius: 12, marginBottom: 20, fontSize: 13, color: "#8A3A2E",
          fontFamily: SANS, lineHeight: 1.55,
        }}>{error}</div>
      )}

      {step === "input" && (
        <div>
          {brandKeys.length > 0 && (
            <div style={{ marginBottom: 26 }}>
              <div style={labelStyle}>{dot} Territorios guardados</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {brandKeys.map(function(k) {
                  return (
                    <button key={k} className="fa-chip" onClick={function() { loadSaved(k); }} style={{
                      background: CARD, border: "1px solid " + BORDER, borderRadius: 999,
                      padding: "8px 15px", fontSize: 12.5, fontFamily: SANS, color: TEXT, cursor: "pointer",
                    }}>{k} <span style={{ color: TEXT_MUTED, fontFamily: MONO, fontSize: 10 }}>· {(territories[k].dims || []).length} dim</span></button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <div style={labelStyle}>{dot} Name <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: TEXT_MUTED }}>· optional, to save the strategy</span></div>
            <input value={brand} onChange={function(e) { setBrand(e.target.value); }}
              placeholder="E.g. Q3 growth plan"
              style={Object.assign({}, boxStyle, { borderRadius: 999, padding: "11px 18px" })} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={labelStyle}>
              {dot} Strategy
              <span style={{ marginLeft: "auto" }}>{attachBtn(tFileRef, "t")}</span>
            </div>
            <input type="file" ref={tFileRef} style={{ display: "none" }}
              accept=".pdf,.docx,.txt,.md"
              onChange={function(e) { readFile(e.target.files[0], setTerritory, "t"); e.target.value = ""; }} />
            <textarea value={territory} onChange={function(e) { setTerritory(e.target.value); }}
              placeholder="Paste the strategy doc, the brief, or describe it in your own words. E.g.: We win by being the simplest option in a category full of bloated tools. Every decision should reduce effort for the user, not add features."
              style={Object.assign({}, boxStyle, { minHeight: 130 })} />
          </div>

          <div style={{ marginBottom: 26 }}>
            <div style={labelStyle}>
              {dot} The work
              <span style={{ marginLeft: "auto" }}>{attachBtn(pFileRef, "p")}</span>
            </div>
            <input type="file" ref={pFileRef} style={{ display: "none" }}
              accept=".pdf,.docx,.txt,.md"
              onChange={function(e) { readFile(e.target.files[0], setPiece, "p"); e.target.value = ""; }} />
            <textarea value={piece} onChange={function(e) { setPiece(e.target.value); }}
              placeholder="Draft, copy, idea, concept."
              style={Object.assign({}, boxStyle, { minHeight: 130 })} />
          </div>

          <button onClick={proposeDims} disabled={!territory.trim() || loading} style={{
            background: territory.trim() && !loading ? YELLOW : "#EDEBE4",
            border: "none", borderRadius: 999, padding: "13px 28px",
            fontSize: 13.5, fontFamily: SANS, fontWeight: 700,
            color: territory.trim() && !loading ? INK : TEXT_MUTED,
            cursor: territory.trim() && !loading ? "pointer" : "default",
            display: "inline-flex", alignItems: "center", gap: 10,
          }}>
            {loading && <span className="fa-spinner" />}
            {loading ? "Breaking down strategy..." : "Break down strategy →"}
          </button>
        </div>
      )}

      {step === "dims" && (
        <div>
          <div style={{
            padding: "13px 16px", background: YELLOW_TINT, border: "1px solid " + YELLOW,
            borderRadius: 12, marginBottom: 22, fontSize: 12.5, color: TEXT,
            fontFamily: SANS, lineHeight: 1.55,
          }}>
            These are the dimensions that came out of the strategy. Edit them, delete them, or add what's missing — the evaluation runs against these, so it's worth getting them right.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            {dims.map(function(d, idx) {
              return (
                <div key={d.id} style={{
                  padding: "14px 16px", background: CARD,
                  border: "1px solid " + BORDER, borderRadius: 14,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontFamily: MONO, color: TEXT_MUTED, flexShrink: 0 }}>0{idx + 1}</span>
                    <input value={d.nombre}
                      onChange={function(e) {
                        var v = e.target.value;
                        setDims(function(prev) { return prev.map(function(x) { return x.id === d.id ? Object.assign({}, x, { nombre: v }) : x; }); });
                      }}
                      placeholder="Dimension name"
                      style={{
                        flex: 1, background: "none", border: "none", padding: 0,
                        fontSize: 14, fontWeight: 700, color: INK, fontFamily: SANS,
                      }} />
                    <button onClick={function() {
                      setDims(function(prev) { return prev.filter(function(x) { return x.id !== d.id; }); });
                    }} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_MUTED, fontSize: 13, padding: "2px 4px" }}>✕</button>
                  </div>
                  <textarea value={d.desc}
                    onChange={function(e) {
                      var v = e.target.value;
                      setDims(function(prev) { return prev.map(function(x) { return x.id === d.id ? Object.assign({}, x, { desc: v }) : x; }); });
                    }}
                    placeholder="What it means for a piece of work to be in this dimension"
                    style={{
                      width: "100%", background: SURFACE, border: "1px solid " + BORDER,
                      borderRadius: 9, padding: "8px 11px", fontSize: 12.5, color: TEXT_DIM,
                      fontFamily: SANS, resize: "vertical", minHeight: 42, lineHeight: 1.5,
                    }} />
                </div>
              );
            })}
          </div>

          {dims.length < 5 && (
            <button onClick={function() {
              setDims(function(prev) { return prev.concat([{ id: "d-" + Date.now(), nombre: "", desc: "" }]); });
            }} style={{
              background: "none", border: "1px dashed " + BORDER, borderRadius: 12,
              padding: "10px 18px", fontSize: 12, fontFamily: MONO, color: TEXT_MUTED,
              cursor: "pointer", marginBottom: 24, width: "100%",
            }}>+ Add dimension</button>
          )}

          {!piece.trim() && (
            <div style={{ marginBottom: 22 }}>
              <div style={labelStyle}>
                {dot} The work
                <span style={{ marginLeft: "auto" }}>{attachBtn(pFileRef, "p")}</span>
              </div>
              <input type="file" ref={pFileRef} style={{ display: "none" }}
                accept=".pdf,.docx,.txt,.md"
                onChange={function(e) { readFile(e.target.files[0], setPiece, "p"); e.target.value = ""; }} />
              <textarea value={piece} onChange={function(e) { setPiece(e.target.value); }}
                placeholder="Draft, copy, idea, concept."
                style={Object.assign({}, boxStyle, { minHeight: 120 })} />
            </div>
          )}

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={evaluate} disabled={loading || !piece.trim() || dims.filter(function(d) { return d.nombre.trim(); }).length === 0} style={{
              background: (!loading && piece.trim() && dims.filter(function(d) { return d.nombre.trim(); }).length > 0) ? YELLOW : "#EDEBE4",
              border: "none", borderRadius: 999, padding: "13px 28px",
              fontSize: 13.5, fontFamily: SANS, fontWeight: 700,
              color: (!loading && piece.trim()) ? INK : TEXT_MUTED,
              cursor: (!loading && piece.trim()) ? "pointer" : "default",
              display: "inline-flex", alignItems: "center", gap: 10,
            }}>
              {loading && <span className="fa-spinner" />}
              {loading ? "Evaluando..." : "Evaluate consistency →"}
            </button>
            <button onClick={function() { setStep("input"); setError(null); }} style={{
              background: "none", border: "1px solid " + BORDER, borderRadius: 999,
              padding: "13px 22px", fontSize: 12.5, fontFamily: SANS, color: TEXT_DIM, cursor: "pointer",
            }}>Back to strategy</button>
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="fa-fade">
          <div style={{
            padding: "18px 20px", background: SURFACE,
            border: "1px solid " + BORDER, borderRadius: 14, marginBottom: 24,
          }}>
            <div style={{ fontSize: 10, fontFamily: MONO, color: TEXT_MUTED, letterSpacing: "0.08em", marginBottom: 7 }}>
              LECTURA · {result.brand}
            </div>
            <div style={{ fontSize: 15.5, color: INK, fontFamily: SANS, lineHeight: 1.6, fontWeight: 500 }}>
              {result.lectura}
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            {result.evaluaciones.map(function(e, i) {
              var cfg = LEVELS[e.nivel] || LEVELS.ausente;
              return (
                <div key={i} style={{
                  padding: "15px 0",
                  borderBottom: i < result.evaluaciones.length - 1 ? "1px solid " + BORDER : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 7, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: INK, fontFamily: SANS, minWidth: 150, flex: "0 0 auto" }}>
                      {e.nombre}
                    </div>
                    <LevelBar nivel={e.nivel} />
                    <span style={{
                      fontSize: 10, fontFamily: MONO, color: cfg.color,
                      letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700,
                    }}>{cfg.label}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: TEXT_DIM, fontFamily: SANS, lineHeight: 1.6, paddingLeft: 2 }}>
                    {e.evidencia}
                  </div>
                </div>
              );
            })}
          </div>

          {result.enTerritorio && (
            <div style={{ marginBottom: 20 }}>
              <div style={labelStyle}>{dot} What fits the strategy</div>
              <div style={{ fontSize: 13.5, color: TEXT, fontFamily: SANS, lineHeight: 1.65, paddingLeft: 15, borderLeft: "2px solid #2E9E5B" }}>
                {result.enTerritorio}
              </div>
            </div>
          )}

          {result.correccion && (
            <div style={{ marginBottom: 28 }}>
              <div style={labelStyle}>{dot} What would close the gap</div>
              <div style={{ fontSize: 13.5, color: TEXT, fontFamily: SANS, lineHeight: 1.65, paddingLeft: 15, borderLeft: "2px solid " + YELLOW }}>
                {result.correccion}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 18, borderTop: "1px solid " + BORDER }}>
            <button
              onClick={function() { if (savedIds.indexOf(result.id) === -1) onSaveLearning(result); }}
              className={savedIds.indexOf(result.id) !== -1 ? "" : "fa-learnbtn"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "9px 17px", borderRadius: 999,
                background: savedIds.indexOf(result.id) !== -1 ? YELLOW_TINT : "transparent",
                border: "1px solid " + (savedIds.indexOf(result.id) !== -1 ? YELLOW : BORDER),
                color: savedIds.indexOf(result.id) !== -1 ? INK : TEXT_DIM,
                fontSize: 12, fontFamily: MONO, cursor: savedIds.indexOf(result.id) !== -1 ? "default" : "pointer",
              }}>
              <span>{savedIds.indexOf(result.id) !== -1 ? "★" : "☆"}</span>
              {savedIds.indexOf(result.id) !== -1 ? "Saved" : "Save learning"}
            </button>
            <button onClick={function() { onDiscuss(result); }} style={{
              background: "none", border: "1px solid " + BORDER, borderRadius: 999,
              padding: "9px 17px", fontSize: 12, fontFamily: MONO, color: TEXT_DIM, cursor: "pointer",
            }}>Discuss this with an advisor →</button>
            <button onClick={reset} style={{
              background: "none", border: "none", padding: "9px 6px",
              fontSize: 12, fontFamily: MONO, color: TEXT_MUTED, cursor: "pointer",
            }}>Evaluate another piece</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VISTA APRENDIZAJES ──────────────────────────────────────────────────────
function LearningsView({ items, onBack, onDelete, onOpenConv, onEditNote }) {
  var searchState = useState(""); var q = searchState[0]; var setQ = searchState[1];
  var editState = useState(null); var editing = editState[0]; var setEditing = editState[1];
  var draftState = useState(""); var draft = draftState[0]; var setDraft = draftState[1];
  var tabState = useState("all"); var tab = tabState[0]; var setTab = tabState[1];

  var twinItems = items.filter(function(l) { return l.kind !== "checker"; });
  var checkItems = items.filter(function(l) { return l.kind === "checker"; });
  var scoped = tab === "advisors" ? twinItems : tab === "checker" ? checkItems : items;

  var filtered = scoped.filter(function(l) {
    if (!q.trim()) return true;
    var s = q.toLowerCase();
    return (l.text || "").toLowerCase().indexOf(s) !== -1
      || (l.note || "").toLowerCase().indexOf(s) !== -1
      || (l.twinName || "").toLowerCase().indexOf(s) !== -1
      || (l.areaName || "").toLowerCase().indexOf(s) !== -1
      || (l.context || "").toLowerCase().indexOf(s) !== -1;
  });

  var grouped = {};
  filtered.forEach(function(l) {
    var k = l.areaName || "No area";
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(l);
  });

  return (
    <div style={{ paddingTop: 44 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
        <button onClick={onBack} className="fa-hover" style={{
          width: 40, height: 40, borderRadius: "50%", border: "1px solid " + BORDER,
          background: CARD, cursor: "pointer", fontSize: 17, color: INK,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>←</button>
        <Eyebrow style={{ marginBottom: 0 }}>My learnings</Eyebrow>
        <span style={{ fontSize: 12, fontFamily: MONO, color: TEXT_MUTED }}>
          {items.length} note{items.length === 1 ? "" : "s"}
        </span>
      </div>

      <p style={{ fontSize: 13, color: TEXT_DIM, fontFamily: SANS, margin: "0 0 22px 56px", lineHeight: 1.6, maxWidth: 520 }}>
        Your private log of recurring feedback. Stored only in this browser — no one else sees it.
      </p>

      {items.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid " + BORDER }}>
          {[
            { id: "all", label: "All", n: items.length },
            { id: "advisors", label: "From advisors", n: twinItems.length },
            { id: "checker", label: "Consistency", n: checkItems.length },
          ].map(function(t) {
            var on = tab === t.id;
            return (
              <button key={t.id} onClick={function() { setTab(t.id); setEditing(null); }} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "9px 14px", position: "relative",
                fontSize: 12.5, fontFamily: SANS, fontWeight: on ? 700 : 400,
                color: on ? INK : TEXT_MUTED,
              }}>
                {t.label}
                <span style={{ fontFamily: MONO, fontSize: 10, color: TEXT_MUTED, marginLeft: 6 }}>{t.n}</span>
                {on && <div style={{ position: "absolute", left: 8, right: 8, bottom: -1, height: 2, background: YELLOW, borderRadius: 2 }} />}
              </button>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <input
          value={q}
          onChange={function(e) { setQ(e.target.value); }}
          placeholder="Search your learnings..."
          style={{
            width: "100%", padding: "11px 18px", background: SURFACE,
            border: "1px solid " + BORDER, borderRadius: 999, color: INK,
            fontSize: 13.5, fontFamily: SANS, marginBottom: 18,
          }}
        />
      )}

      {filtered.length === 0 ? (
        <div style={{ padding: "34px 22px", border: "1.5px dashed " + BORDER, borderRadius: 14, textAlign: "center" }}>
          <div style={{ fontSize: 26, marginBottom: 10, color: TEXT_MUTED }}>☆</div>
          <p style={{ margin: 0, fontSize: 13.5, color: TEXT_MUTED, fontFamily: SANS, lineHeight: 1.6 }}>
            {items.length === 0
              ? "You haven't saved any learnings yet. When an advisor says something you want to remember, or when you run a consistency check, tap \u201cSave learning\u201d."
              : scoped.length === 0
                ? (tab === "checker"
                    ? "You haven't saved any consistency checks yet."
                    : "You haven't saved any advisor learnings yet.")
                : "No learnings match your search."}
          </p>
        </div>
      ) : (
        Object.keys(grouped).map(function(areaName) {
          return (
            <div key={areaName} style={{ marginBottom: 28 }}>
              <div style={{
                fontSize: 11, fontFamily: MONO, fontWeight: 700, color: TEXT_MUTED,
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: YELLOW, flexShrink: 0 }} />
                {areaName}
                <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>
                  · {grouped[areaName].length}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {grouped[areaName].map(function(l) {
                  var isEditing = editing === l.id;
                  return (
                    <div key={l.id} className="fa-histitem" style={{
                      padding: "15px 17px", background: CARD,
                      border: "1px solid " + BORDER, borderRadius: 14,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                        {l.kind === "checker" ? (
                          <div style={{
                            width: 26, height: 26, borderRadius: 8, background: YELLOW_TINT,
                            border: "1px solid " + YELLOW, display: "flex", alignItems: "center",
                            justifyContent: "center", flexShrink: 0, fontSize: 12, color: INK,
                          }}>◫</div>
                        ) : (
                          <Avatar name={l.twinName} size={26} dark />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: INK, fontFamily: SANS }}>{l.twinName}</span>
                          <span style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: MONO, marginLeft: 8 }}>{fmtTime(l.ts)}</span>
                        </div>
                        <button onClick={function() { onDelete(l.id); }} title="Delete learning" style={{
                          background: "none", border: "none", cursor: "pointer", color: TEXT_MUTED,
                          fontSize: 13, padding: "2px 4px", flexShrink: 0,
                        }}>✕</button>
                      </div>

                      <div style={{
                        fontSize: 14, lineHeight: 1.65, color: TEXT, fontFamily: SANS,
                        borderLeft: "2px solid " + YELLOW, paddingLeft: 12, whiteSpace: "pre-wrap",
                      }}>{l.text}</div>

                      {l.kind === "checker" && l.evaluaciones && l.evaluaciones.length > 0 && (
                        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
                          {l.evaluaciones.map(function(e, i) {
                            var cfg = LEVELS[e.nivel] || LEVELS.ausente;
                            return (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 12, color: TEXT_DIM, fontFamily: SANS, minWidth: 128, flex: "0 0 auto" }}>{e.nombre}</span>
                                <LevelBar nivel={e.nivel} />
                                <span style={{
                                  fontSize: 9.5, fontFamily: MONO, color: cfg.color,
                                  letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700,
                                }}>{cfg.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {l.context && (
                        <div style={{ fontSize: 11.5, color: TEXT_MUTED, fontFamily: SANS, marginTop: 9, fontStyle: "italic" }}>
                          {l.kind === "checker" ? "Work evaluated: " : "En respuesta a: "}{l.context}
                        </div>
                      )}

                      {isEditing ? (
                        <div style={{ marginTop: 11 }}>
                          <textarea
                            value={draft}
                            autoFocus
                            onChange={function(e) { setDraft(e.target.value); }}
                            placeholder="Your personal note on this learning..."
                            style={{
                              width: "100%", minHeight: 62, padding: "10px 12px", background: SURFACE,
                              border: "1px solid " + BORDER, borderRadius: 10, color: INK,
                              fontSize: 13, fontFamily: SANS, resize: "vertical", lineHeight: 1.5,
                            }}
                          />
                          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                            <button onClick={function() { onEditNote(l.id, draft); setEditing(null); }} style={{
                              background: YELLOW, border: "1px solid " + YELLOW, borderRadius: 999,
                              padding: "6px 15px", fontSize: 12, fontFamily: MONO, color: INK,
                              cursor: "pointer", fontWeight: 700,
                            }}>Save note</button>
                            <button onClick={function() { setEditing(null); }} style={{
                              background: "none", border: "1px solid " + BORDER, borderRadius: 999,
                              padding: "6px 15px", fontSize: 12, fontFamily: MONO, color: TEXT_DIM, cursor: "pointer",
                            }}>Cancel</button>
                          </div>
                        </div>
                      ) : l.note ? (
                        <div onClick={function() { setEditing(l.id); setDraft(l.note || ""); }} style={{
                          marginTop: 11, padding: "9px 12px", background: YELLOW_TINT,
                          borderRadius: 10, fontSize: 12.5, color: TEXT, fontFamily: SANS,
                          lineHeight: 1.55, cursor: "pointer", whiteSpace: "pre-wrap",
                        }}>
                          <span style={{ fontFamily: MONO, fontSize: 10, color: TEXT_DIM, letterSpacing: "0.06em" }}>MY NOTE · </span>
                          {l.note}
                        </div>
                      ) : null}

                      <div style={{ display: "flex", gap: 14, marginTop: 11 }}>
                        {!isEditing && !l.note && (
                          <button onClick={function() { setEditing(l.id); setDraft(""); }} style={{
                            background: "none", border: "none", padding: 0, cursor: "pointer",
                            fontSize: 11, fontFamily: MONO, color: TEXT_MUTED, letterSpacing: "0.04em",
                          }}>+ Add note</button>
                        )}
                        {l.convId && l.kind !== "checker" && (
                          <button onClick={function() { onOpenConv(l.convId); }} style={{
                            background: "none", border: "none", padding: 0, cursor: "pointer",
                            fontSize: 11, fontFamily: MONO, color: TEXT_MUTED, letterSpacing: "0.04em",
                          }}>View conversation →</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {items.length > 0 && (
        <div style={{
          marginTop: 34, paddingTop: 20, borderTop: "1px solid " + BORDER,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 11.5, color: TEXT_MUTED, fontFamily: SANS }}>
            Tus aprendizajes viven solo en este navegador.
          </span>
          <button
            onClick={function() {
              alert("Sync across devices\n\nThis feature isn't available yet. For now your learnings are stored only in this browser.\n\nIf having them on your phone or another computer would help, let us know — the more people ask, the sooner it gets built.");
            }}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              fontSize: 11.5, fontFamily: MONO, color: TEXT_DIM,
              borderBottom: "1px solid " + BORDER, letterSpacing: "0.03em",
            }}
          >Sync across devices →</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Home() {
  var selState = useState(["product:marcus"]); var selected = selState[0]; var setSelected = selState[1];
  var qState = useState(""); var question = qState[0]; var setQuestion = qState[1];
  var delState = useState(""); var deliverable = delState[0]; var setDeliverable = delState[1];
  var histState = useState([]); var history = histState[0]; var setHistory = histState[1];
  var typingState = useState({}); var typing = typingState[0]; var setTyping = typingState[1];
  var runState = useState(false); var running = runState[0]; var setRunning = runState[1];
  var attachState = useState(false); var showAttach = attachState[0]; var setShowAttach = attachState[1];
  var fnState = useState(null); var fileName = fnState[0]; var setFileName = fnState[1];
  var imgState = useState(null); var imageData = imgState[0]; var setImageData = imgState[1];
  var viewState = useState({ type: "home" }); var view = viewState[0]; var setView = viewState[1];
  var searchState = useState(""); var search = searchState[0]; var setSearch = searchState[1];
  var rotState = useState(0); var rotIdx = rotState[0]; var setRotIdx = rotState[1];
  var promptSearchState = useState(""); var promptSearch = promptSearchState[0]; var setPromptSearch = promptSearchState[1];
  var learnState = useState([]); var learnings = learnState[0]; var setLearnings = learnState[1];
  var terrState = useState({}); var territories = terrState[0]; var setTerritories = terrState[1];

  useEffect(function() {
    var t = setInterval(function() {
      setRotIdx(function(i) { return (i + 4) % ALL_PROMPTS.length; });
    }, 6000);
    return function() { clearInterval(t); };
  }, []);

  function rotatingPrompts() {
    var out = [];
    for (var i = 0; i < 4; i++) {
      out.push(ALL_PROMPTS[(rotIdx + i) % ALL_PROMPTS.length]);
    }
    return out;
  }

  function addPrompt(p) {
    setQuestion(function(prev) { return prev.trim() ? prev + " " + p : p; });
  }
  var loadedRef = useRef(false);
  var askInputRef = useRef(null);

  // Cargar historial de localStorage al montar (con migración de formato viejo)
  useEffect(function() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        var migrated = parsed.map(function(c) {
          if (!c.twinKeys && c.twinKey) {
            return Object.assign({}, c, {
              twinKeys: [c.twinKey],
              messages: (c.messages || []).map(function(m) {
                return (m.role === "assistant" && !m.twinKey) ? Object.assign({}, m, { twinKey: c.twinKey }) : m;
              }),
            });
          }
          return c;
        });
        setHistory(migrated);
      }
    } catch (e) {}
    try {
      var rawL = localStorage.getItem(LS_LEARN);
      if (rawL) setLearnings(JSON.parse(rawL));
    } catch (e) {}
    try {
      var rawT = localStorage.getItem(LS_TERRITORIES);
      if (rawT) setTerritories(JSON.parse(rawT));
    } catch (e) {}
    loadedRef.current = true;
  }, []);

  // Persistir historial cuando cambia
  useEffect(function() {
    if (!loadedRef.current) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(history)); } catch (e) {}
  }, [history]);

  // Persistir aprendizajes cuando cambian
  useEffect(function() {
    if (!loadedRef.current) return;
    try { localStorage.setItem(LS_LEARN, JSON.stringify(learnings)); } catch (e) {}
  }, [learnings]);

  // Persistir territorios cuando cambian
  useEffect(function() {
    if (!loadedRef.current) return;
    try { localStorage.setItem(LS_TERRITORIES, JSON.stringify(territories)); } catch (e) {}
  }, [territories]);

  var saveTerritory = function(name, territory, dims) {
    setTerritories(function(prev) {
      var next = Object.assign({}, prev);
      next[name] = { territory: territory, dims: dims, updatedAt: Date.now() };
      return next;
    });
  };

  // ─── APRENDIZAJES ───────────────────────────────────────────────────────────
  var savedIds = learnings.map(function(l) { return l.msgId; });

  var saveLearning = function(conv, msg) {
    var msgId = conv.id + ":" + msg.ts;
    if (savedIds.indexOf(msgId) !== -1) return;
    var info = twinInfo(msg.twinKey);
    if (!info) return;

    var lastUser = null;
    for (var i = conv.messages.length - 1; i >= 0; i--) {
      if (conv.messages[i].role === "user" && conv.messages[i].ts < msg.ts) { lastUser = conv.messages[i]; break; }
    }
    var ctx = lastUser && lastUser.text ? lastUser.text.trim() : "";
    if (ctx.length > 110) ctx = ctx.slice(0, 110) + "…";

    var entry = {
      id: "learn-" + Date.now(),
      msgId: msgId,
      convId: conv.id,
      twinKey: msg.twinKey,
      twinName: info.member.name,
      areaName: info.area.name,
      text: msg.text,
      context: ctx,
      note: "",
      ts: Date.now(),
    };
    setLearnings(function(prev) { return [entry].concat(prev); });
    logLearning(info.area.name, info.member.name, isNamedTwin(msg.twinKey) ? "nombrado" : "generico");
  };

  var deleteLearning = function(id) {
    setLearnings(function(prev) { return prev.filter(function(l) { return l.id !== id; }); });
  };

  var editLearningNote = function(id, note) {
    setLearnings(function(prev) {
      return prev.map(function(l) { return l.id === id ? Object.assign({}, l, { note: note }) : l; });
    });
  };

  var saveCheckerLearning = function(res) {
    if (savedIds.indexOf(res.id) !== -1) return;
    var ctx = res.pieceSnippet || "";
    if (ctx.length >= 140) ctx = ctx + "…";
    var entry = {
      id: "learn-" + Date.now(),
      msgId: res.id,
      kind: "checker",
      convId: null,
      twinKey: null,
      twinName: res.brand,
      areaName: "Consistency",
      text: res.lectura,
      evaluaciones: res.evaluaciones,
      correccion: res.correccion,
      context: ctx,
      note: "",
      ts: Date.now(),
    };
    setLearnings(function(prev) { return [entry].concat(prev); });
    logLearning("Consistency", res.brand, "checker");
  };

  // Abre un chat con el resultado del checker como contexto inicial.
  var discussCheck = function(res) {
    var lines = res.evaluaciones.map(function(e) {
      return "- " + e.nombre + ": " + e.nivel + (e.evidencia ? " — " + e.evidencia : "");
    }).join("\n");
    var body =
      "I ran a consistency check on a piece of work for " + res.brand + " and I'd like your read.\n\n" +
      "STRATEGY:\n" + res.territory +
      "\n\nDIMENSIONS EVALUATED:\n" + lines +
      (res.lectura ? "\n\nCHECKER READ: " + res.lectura : "") +
      "\n\nDo you agree with this read, or do you see something else?";
    var now = Date.now();
    var key = "marketing:elena";
    var conv = {
      id: "conv-" + now,
      twinKeys: [key],
      firstQuestion: "Consistency check · " + res.brand,
      startedAt: now,
      updatedAt: now,
      messages: [{ role: "user", text: "Consistency check · " + res.brand + "\n\n" + res.lectura, apiContent: body, fileName: null, ts: now }],
    };
    setHistory(function(prev) { return [conv].concat(prev); });
    setView({ type: "chat", id: conv.id });
    runTwins(conv.id, [key], conv.messages, false, null);
  };

  var updateConv = function(id, updater) {
    setHistory(function(prev) {
      return prev.map(function(c) { return c.id === id ? updater(c) : c; });
    });
  };

  var toggleTwin = function(key) {
    setSelected(function(prev) {
      return prev.includes(key) ? prev.filter(function(x) { return x !== key; }) : prev.concat([key]);
    });
  };
  var clearFile = function() { setDeliverable(""); setFileName(null); setShowAttach(false); setImageData(null); };
  var hasContent = question.trim().length > 0;
  var canRun = !running && hasContent && selected.length > 0;

  var handleFileContent = function(result, name) {
    if (result && result.__isImage) {
      setImageData({ base64: result.base64, mime: result.mime, preview: "data:" + result.mime + ";base64," + result.base64 });
      setDeliverable("");
    } else {
      setDeliverable(result);
      setImageData(null);
    }
    setFileName(name);
  };

  // Hace responder a una lista de twins, en secuencia, sobre un hilo dado.
  // Devuelve el hilo final con todas las respuestas agregadas.
  var runTwins = async function(convId, twinKeys, thread, multi, img) {
    var lastUser = null;
    for (var j = thread.length - 1; j >= 0; j--) {
      if (thread[j].role === "user") { lastUser = thread[j]; break; }
    }
    for (var i = 0; i < twinKeys.length; i++) {
      var key = twinKeys[i];
      if (i > 0) {
        await new Promise(function(resolve) { setTimeout(resolve, 20000); });
      }
      setTyping(function(prev) { var next = Object.assign({}, prev); next[convId] = key; return next; });
      var info = twinInfo(key);
      var apiMessages = buildApiMessages(thread, key, multi);
      var raw = await callTwin(info.member.prompt, apiMessages, img ? img.base64 : null, img ? img.mime : null);
      var parsedResp = parseConfidence(raw);
      var ts = Date.now();
      var named = isNamedTwin(key);
      if (raw.indexOf("⚠️") !== 0) {
        logMetric({
          area: info.area.name,
          twin: info.member.name,
          tipo: named ? "nombrado" : "generico",
          adjunto: !!((lastUser && lastUser.fileName) || img),
          largo: lastUser && lastUser.text ? lastUser.text.length : 0,
          pregunta: lastUser && lastUser.text ? lastUser.text.slice(0, 500) : "",
        });
      }
      var asstMsg = { role: "assistant", twinKey: key, text: parsedResp.clean, confidence: named ? parsedResp.level : null, confidenceReason: named ? parsedResp.reason : null, ts: ts };
      thread = thread.concat([asstMsg]);
      var threadSnapshot = thread;
      updateConv(convId, function(c) {
        return Object.assign({}, c, { updatedAt: ts, messages: threadSnapshot });
      });
    }
    setTyping(function(prev) { var next = Object.assign({}, prev); delete next[convId]; return next; });
    return thread;
  };

  var runEvaluation = async function() {
    if (!canRun) return;
    setRunning(true);

    var q = question.trim();
    var now = Date.now();

    var userText = q;
    if (!imageData && deliverable.trim().length > 0) {
      userText += "\n\n---\nREFERENCE MATERIAL" + (fileName ? " (" + fileName + ")" : "") + ":\n" + deliverable.trim();
    } else if (imageData && fileName) {
      userText += "\n\n[Imagen adjunta: " + fileName + "]";
    }

    var img = imageData;
    var fn = fileName;
    var twinKeys = selected.slice();
    var multi = twinKeys.length > 1;

    var conv = {
      id: "conv-" + now,
      twinKeys: twinKeys,
      firstQuestion: q,
      startedAt: now,
      updatedAt: now,
      messages: [{ role: "user", text: q, apiContent: userText, fileName: fn || null, ts: now }],
    };

    setHistory(function(prev) { return [conv].concat(prev); });

    // Abrir el chat de inmediato — siempre
    setView({ type: "chat", id: conv.id });

    // Limpiar formulario
    setQuestion(""); clearFile();
    if (askInputRef.current) askInputRef.current.style.height = "auto";

    await runTwins(conv.id, twinKeys, conv.messages, multi, img);
    setRunning(false);
  };

  var handleSend = async function(convId, text, attach) {
    var conv = history.find(function(c) { return c.id === convId; });
    if (!conv) return;

    var apiContent = text;
    var img = null;
    if (attach && attach.text) {
      apiContent += "\n\n---\nREFERENCE MATERIAL (" + attach.name + "):\n" + attach.text;
    } else if (attach && attach.image) {
      apiContent += "\n\n[Imagen adjunta: " + attach.name + "]";
      img = attach.image;
    }

    var ts = Date.now();
    var userMsg = { role: "user", text: text, apiContent: apiContent, fileName: attach ? attach.name : null, ts: ts };
    var thread = conv.messages.concat([userMsg]);

    updateConv(convId, function(c) { return Object.assign({}, c, { updatedAt: ts, messages: thread }); });

    await runTwins(convId, conv.twinKeys, thread, conv.twinKeys.length > 1, img);
  };

  var handleAddTwin = async function(convId, newKey) {
    var conv = history.find(function(c) { return c.id === convId; });
    if (!conv || conv.twinKeys.indexOf(newKey) !== -1) return;

    var newTwinKeys = conv.twinKeys.concat([newKey]);
    updateConv(convId, function(c) { return Object.assign({}, c, { twinKeys: newTwinKeys }); });

    // El twin nuevo lee todo el historial y responde de inmediato
    await runTwins(convId, [newKey], conv.messages, true, null);
  };

  var deleteConv = function(id) {
    setHistory(function(prev) { return prev.filter(function(c) { return c.id !== id; }); });
    // Los aprendizajes sobreviven a la conversación — solo se rompe el link.
    setLearnings(function(prev) {
      return prev.map(function(l) { return l.convId === id ? Object.assign({}, l, { convId: null }) : l; });
    });
    if (view.type === "chat" && view.id === id) setView({ type: "home" });
  };

  var teamEntries = Object.entries(TEAM);
  var currentConv = view.type === "chat" ? history.find(function(c) { return c.id === view.id; }) : null;

  var sortedHistory = history.slice().sort(function(a, b) { return b.updatedAt - a.updatedAt; });

  var filteredHistory = sortedHistory.filter(function(c) {
    if (!search.trim()) return true;
    var title = convTitle(c);
    var s = search.toLowerCase();
    return title.toLowerCase().indexOf(s) !== -1 || (c.firstQuestion || "").toLowerCase().indexOf(s) !== -1;
  });

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, color: TEXT, fontFamily: SANS, padding: "28px 16px" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-4px); opacity: 1; } }
        .fa-msg { animation: fadeUp 0.25s ease both; }
        .fa-dot { width: 6px; height: 6px; border-radius: 50%; background: #98968F; display: inline-block; animation: bounce 1.2s infinite; }
        .fa-spinner { width: 13px; height: 13px; border: 2px solid #ddd; border-top-color: ${YELLOW}; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
        .fa-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(20,20,20,0.07); }
        .fa-hover { transition: background 0.15s, transform 0.1s; }
        .fa-hover:hover { background: ${SURFACE}; }
        .fa-send:hover { transform: scale(1.06); }
        .fa-send:active { transform: scale(0.96); }
        .fa-chip { transition: background 0.15s, border-color 0.15s, transform 0.1s; }
        .fa-chip:hover { background: ${YELLOW_TINT}; border-color: ${YELLOW}; transform: translateY(-1px); }
        .fa-learnbtn { transition: background 0.15s, border-color 0.15s, color 0.15s; }
        .fa-learnbtn:hover { background: ${YELLOW_TINT}; border-color: ${YELLOW}; color: ${INK}; }
        .fa-fade { animation: faFadeIn 0.4s ease; }
        @keyframes faFadeIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
        .fa-histitem { transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s; }
        .fa-histitem:hover { border-color: ${INK}; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(20,20,20,0.06); }
        textarea:focus, input:focus { outline: none !important; }
        textarea::placeholder, input::placeholder { color: #b0aea7; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
        body { background: ${PAGE_BG}; margin: 0; }
      `}</style>

      <div style={{
        maxWidth: 1180, margin: "0 auto", display: "flex",
        borderRadius: 24, overflow: "hidden", background: CARD,
        boxShadow: "0 4px 32px rgba(20,20,20,0.08)",
      }}>
        <Sidebar
          onHome={function() { setView({ type: "home" }); }}
          onHistory={function() { setSearch(""); setView({ type: "history" }); }}
          onLearnings={function() { setView({ type: "learnings" }); }}
          onPrompts={function() { setPromptSearch(""); setView({ type: "prompts" }); }}
          onChecker={function() { setView({ type: "checker" }); }}
          activeView={view.type}
          learnCount={learnings.length}
        />

        <main style={{ flex: 1, padding: "0 56px 60px", position: "relative", minWidth: 0 }}>

          {view.type === "chat" && currentConv ? (
            <ChatView
              conv={currentConv}
              typingTwinKey={typing[currentConv.id] || null}
              onBack={function() { setView({ type: "home" }); }}
              onSend={handleSend}
              onAddTwin={handleAddTwin}
              onSaveLearning={saveLearning}
              savedIds={savedIds}
            />
          ) : view.type === "prompts" ? (
            <div style={{ paddingTop: 44 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <button onClick={function() { setView({ type: "home" }); }} className="fa-hover" style={{
                  width: 40, height: 40, borderRadius: "50%", border: "1px solid " + BORDER,
                  background: CARD, cursor: "pointer", fontSize: 17, color: INK,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>←</button>
                <Eyebrow style={{ marginBottom: 0 }}>Prompt library</Eyebrow>
                <span style={{ fontSize: 12, fontFamily: MONO, color: TEXT_MUTED }}>
                  {ALL_PROMPTS.length} prompts
                </span>
              </div>

              <input
                value={promptSearch}
                onChange={function(e) { setPromptSearch(e.target.value); }}
                placeholder="Buscar prompt..."
                style={{
                  width: "100%", padding: "11px 18px", background: SURFACE,
                  border: "1px solid " + BORDER, borderRadius: 999, color: INK,
                  fontSize: 13.5, fontFamily: SANS, marginBottom: 24,
                }}
              />

              {PROMPT_LIBRARY.map(function(group) {
                var q = promptSearch.trim().toLowerCase();
                var items = q
                  ? group.items.filter(function(p) { return p.toLowerCase().indexOf(q) !== -1; })
                  : group.items;
                if (items.length === 0) return null;
                return (
                  <div key={group.cat} style={{ marginBottom: 28 }}>
                    <div style={{
                      fontSize: 11, fontFamily: MONO, fontWeight: 700, color: TEXT_MUTED,
                      textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12,
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: YELLOW, flexShrink: 0 }} />
                      {group.cat}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {items.map(function(p) {
                        return (
                          <button key={p} className="fa-chip" onClick={function() {
                            addPrompt(p);
                            setView({ type: "home" });
                          }} style={{
                            background: CARD, border: "1px solid " + BORDER, borderRadius: 999,
                            padding: "9px 17px", fontSize: 13, fontFamily: SANS, color: TEXT,
                            cursor: "pointer", textAlign: "left",
                          }}>{p}</button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {promptSearch.trim() && ALL_PROMPTS.filter(function(p) {
                return p.toLowerCase().indexOf(promptSearch.trim().toLowerCase()) !== -1;
              }).length === 0 && (
                <div style={{ padding: "26px 20px", border: "1.5px dashed " + BORDER, borderRadius: 14, textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 13.5, color: TEXT_MUTED, fontFamily: SANS }}>
                    No prompts match your search.
                  </p>
                </div>
              )}
            </div>
          ) : view.type === "checker" ? (
            <CheckerView
              onBack={function() { setView({ type: "home" }); }}
              territories={territories}
              onSaveTerritory={saveTerritory}
              onSaveLearning={saveCheckerLearning}
              savedIds={savedIds}
              onDiscuss={discussCheck}
            />
          ) : view.type === "learnings" ? (
            <LearningsView
              items={learnings}
              onBack={function() { setView({ type: "home" }); }}
              onDelete={deleteLearning}
              onEditNote={editLearningNote}
              onOpenConv={function(id) { setView({ type: "chat", id: id }); }}
            />
          ) : view.type === "history" ? (
            <div style={{ paddingTop: 44 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <button onClick={function() { setView({ type: "home" }); }} className="fa-hover" style={{
                  width: 40, height: 40, borderRadius: "50%", border: "1px solid " + BORDER,
                  background: CARD, cursor: "pointer", fontSize: 17, color: INK,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>←</button>
                <Eyebrow style={{ marginBottom: 0 }}>Conversation history</Eyebrow>
                <span style={{ fontSize: 12, fontFamily: MONO, color: TEXT_MUTED }}>
                  {sortedHistory.length} conversation{sortedHistory.length === 1 ? "" : "s"}
                </span>
              </div>
              {sortedHistory.length > 0 && (
                <input
                  value={search}
                  onChange={function(e) { setSearch(e.target.value); }}
                  placeholder="Search conversations..."
                  style={{
                    width: "100%", padding: "11px 18px", background: SURFACE,
                    border: "1px solid " + BORDER, borderRadius: 999, color: INK,
                    fontSize: 13.5, fontFamily: SANS, marginBottom: 14,
                  }}
                />
              )}
              {filteredHistory.length === 0 ? (
                <div style={{ padding: "26px 20px", border: "1.5px dashed " + BORDER, borderRadius: 14, textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 13.5, color: TEXT_MUTED, fontFamily: SANS }}>
                    {sortedHistory.length === 0 ? "No conversations yet. Pick an advisor, type your question, and start." : "No conversations match your search."}
                  </p>
                </div>
              ) : (
                <HistoryList
                  items={filteredHistory}
                  typing={typing}
                  onOpen={function(id) { setView({ type: "chat", id: id }); }}
                  onDelete={deleteConv}
                />
              )}
            </div>
          ) : (
            <>
              {/* Decorative yellow shape */}
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: 210, height: 190, background: YELLOW,
                borderBottomLeftRadius: "100%",
              }} />

              {/* ── HEADER ── */}
              <div style={{ paddingTop: 56, paddingBottom: 40, marginBottom: 44, borderBottom: "1px solid " + BORDER, position: "relative" }}>
                <Eyebrow style={{ marginBottom: 20 }}>Internal advisory</Eyebrow>
                <h1 style={{
                  fontSize: 76, margin: 0, letterSpacing: "-0.03em",
                  fontFamily: SANS, color: INK, lineHeight: 1, fontWeight: 400,
                }}>Advisor<span style={{ fontWeight: 800 }}>AI</span></h1>
                <div style={{ fontSize: 20, color: INK, margin: "10px 0 0", fontFamily: SANS }}>
                  your <span style={{ fontWeight: 800 }}>leadership team</span><sup style={{ fontSize: 10, fontWeight: 800 }}>AI</sup>
                </div>
                <p style={{ fontSize: 15, color: TEXT_DIM, margin: "22px 0 0", fontFamily: SANS, lineHeight: 1.6, maxWidth: 460 }}>
                  A shared tool to ask sharper questions, get new perspectives, and keep learning together.
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  border: "1px solid " + BORDER, borderRadius: 999,
                  padding: "8px 16px", background: SURFACE, marginTop: 22,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: YELLOW, flexShrink: 0 }} />
                  <span style={{ color: TEXT_DIM, fontSize: 11.5, fontFamily: MONO, letterSpacing: "0.04em" }}>
                    Limit of 1,000 consultations per day across all users
                  </span>
                </div>
              </div>

              {/* ── PANEL ── */}
              <div style={{ marginBottom: 44 }}>
                <Eyebrow>Choose who you want to consult</Eyebrow>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))", gap: 14 }}>
                  {teamEntries.map(function(entry) {
                    return <AreaCard key={entry[0]} areaId={entry[0]} area={entry[1]} selected={selected} onToggle={toggleTwin} />;
                  })}
                </div>
              </div>

              {/* ── QUESTION (ChatGPT-style bar) ── */}
              <div style={{ marginBottom: 14 }}>
                <Eyebrow>Your question <span style={{ color: YELLOW, fontSize: 13 }}>•</span></Eyebrow>
                <div style={{
                  display: "flex", alignItems: "flex-end", gap: 8,
                  background: CARD, border: "1px solid " + BORDER, borderRadius: 26,
                  padding: "8px 8px 8px 20px", boxShadow: "0 2px 14px rgba(20,20,20,0.05)",
                }}>
                  <textarea
                    ref={askInputRef}
                    value={question}
                    rows={1}
                    onChange={function(e) { setQuestion(e.target.value); }}
                    onInput={function(e) { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"; }}
                    onKeyDown={function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); runEvaluation(); } }}
                    placeholder="Type your question here..."
                    style={{
                      flex: 1, border: "none", background: "transparent", resize: "none",
                      color: INK, fontSize: 15, lineHeight: 1.6, fontFamily: SANS,
                      padding: "10px 0", maxHeight: 200,
                    }}
                  />
                  <button onClick={function() { setShowAttach(!showAttach); }} className="fa-chip" title="Attach material (PDF, PPTX, image...)" style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "0 16px", height: 40, borderRadius: 999,
                    border: "1px solid " + ((showAttach || fileName) ? YELLOW : BORDER),
                    background: (showAttach || fileName) ? YELLOW_TINT : SURFACE,
                    cursor: "pointer", flexShrink: 0, alignSelf: "center",
                  }}>
                    <span style={{ fontSize: 15 }}>📎</span>
                    <span style={{ fontSize: 12.5, fontFamily: MONO, fontWeight: 700, color: INK, letterSpacing: "0.02em" }}>
                      {fileName ? "1 adjunto" : "Adjuntar"}
                    </span>
                  </button>
                  <button onClick={runEvaluation} disabled={!canRun} className={canRun ? "fa-send" : ""} style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: canRun ? YELLOW : "#eeede8",
                    color: canRun ? INK : "#aaa",
                    border: "none", fontSize: 18, fontWeight: 900,
                    cursor: canRun ? "pointer" : "default", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform 0.1s, background 0.15s",
                  }}>{running ? <div className="fa-spinner" style={{ borderTopColor: INK }} /> : "→"}</button>
                </div>
              </div>

              {/* ── PROMPTS SUGERIDOS (rotativos) ── */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26, alignItems: "center" }}>
                {rotatingPrompts().map(function(p, i) {
                  return (
                    <button key={p + i} className="fa-chip fa-fade" onClick={function() { addPrompt(p); }} style={{
                      background: SURFACE, border: "1px solid " + BORDER, borderRadius: 999,
                      padding: "8px 16px", fontSize: 12.5, fontFamily: SANS, color: TEXT_DIM,
                      cursor: "pointer",
                    }}>{p}</button>
                  );
                })}
                <button className="fa-chip" onClick={function() { setPromptSearch(""); setView({ type: "prompts" }); }} style={{
                  background: YELLOW_TINT, border: "1px solid " + YELLOW, borderRadius: 999,
                  padding: "8px 16px", fontSize: 12.5, fontFamily: MONO, fontWeight: 700, color: INK,
                  cursor: "pointer", letterSpacing: "0.02em",
                }}>See more →</button>
              </div>

              {/* ── ADJUNTO ── */}
              {(showAttach || fileName || deliverable.trim().length > 0) && (
                <div style={{ marginBottom: 36 }}>
                  <Eyebrow>Reference material <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: "0.05em" }}>(optional)</span></Eyebrow>
                  <div style={{ marginBottom: 10 }}>
                    <FileUpload onFileContent={handleFileContent} fileName={fileName} onClear={clearFile} imagePreview={imageData ? imageData.preview : null} />
                  </div>
                  {!fileName && (
                    <textarea
                      value={deliverable}
                      onChange={function(e) { setDeliverable(e.target.value); }}
                      placeholder="Or paste the brief, the proposal, the idea here..."
                      rows={5}
                      style={{
                        width: "100%", padding: "16px 18px", background: CARD,
                        border: "1px solid " + BORDER, borderRadius: 14, color: INK,
                        fontSize: 14.5, lineHeight: 1.7, resize: "vertical", fontFamily: SANS,
                      }}
                    />
                  )}
                </div>
              )}

              {/* ── CONVERSATION HISTORY (latest 3) ── */}
              <div style={{ marginTop: 44 }}>
                <Eyebrow>Conversation history</Eyebrow>
                {sortedHistory.length === 0 ? (
                  <div style={{ padding: "26px 20px", border: "1.5px dashed " + BORDER, borderRadius: 14, textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: 13.5, color: TEXT_MUTED, fontFamily: SANS }}>
                      No conversations yet. Pick an advisor, type your question, and start.
                    </p>
                  </div>
                ) : (
                  <>
                    <HistoryList
                      items={sortedHistory.slice(0, 3)}
                      typing={typing}
                      onOpen={function(id) { setView({ type: "chat", id: id }); }}
                      onDelete={deleteConv}
                    />
                    {sortedHistory.length > 3 && (
                      <button
                        onClick={function() { setSearch(""); setView({ type: "history" }); }}
                        className="fa-hover"
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          width: "100%", marginTop: 10, padding: "11px 16px",
                          background: SURFACE, border: "1px solid " + BORDER, borderRadius: 14,
                          cursor: "pointer", fontSize: 12.5, fontFamily: MONO, fontWeight: 700,
                          color: TEXT_DIM, letterSpacing: "0.06em",
                        }}>
                        See more ({sortedHistory.length - 3}) <span style={{ fontSize: 14 }}>◷</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
