// scripts/sync-utd-majors.mjs
/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.resolve(__dirname, "../src/data/utd-majors.generated.json");

// Official UT Dallas catalog pages (authoritative lists)
const UNDERGRAD_URL = "https://catalog.utdallas.edu/2025/undergraduate/programs";
const GRAD_URL = "https://catalog.utdallas.edu/2025/graduate/programs";

// Extract program name from link text like:
// "Bachelor of Science in Computer Science" => "Computer Science"
// "Master of Science in Computer Science" => "Computer Science"
// "Doctor of Philosophy in Computer Science" => "Computer Science"
function normalizeProgramName(raw) {
  const s = raw.replace(/\s+/g, " ").trim();

  // Ignore certificates (we only want degrees)
  if (/^Certificate in /i.test(s)) return null;
  if (/^Graduate Certificates$/i.test(s)) return null;

  // Common degree-title patterns in the catalog
  const patterns = [
    // Bachelor/Master/Doctor formats
    /^Bachelor of (Arts|Science|Business Administration|Fine Arts) in (.+)$/i,
    /^Master of (Arts|Science|Fine Arts) in (.+)$/i,
    /^Doctor of (Philosophy|Audiology) in (.+)$/i,
    // Professional masters that appear as "Master of Public Affairs", etc.
    /^Master of (.+)$/i, // capture whole program name after "Master of "
    /^Doctor of (.+)$/i, // capture whole program name after "Doctor of "
  ];

  for (const p of patterns) {
    const m = s.match(p);
    if (!m) continue;

    // Patterns with "in (.+)" will have the program in the last capture group
    const candidate = (m[m.length - 1] || "").trim();

    // If it’s "Master of Public Affairs" (no "in"), candidate is full name ("Public Affairs")
    if (!candidate) return null;

    // Clean common trailing qualifiers in link text
    return candidate
      .replace(/\s*\(.+\)\s*$/g, "") // remove "(120 semester credit hours)" etc.
      .trim();
  }

  // Some UG programs appear without the "Bachelor of X in" prefix in this page’s link text,
  // but still represent degree programs (rare). As a fallback, accept items that end with "(BA)" etc
  // in the nav tree, e.g. "History (BA)" -> "History"
  const m2 = s.match(/^(.+)\s+\((BA|BS|BBA|BSEE|BSME|MS|MA|MBA|MFA|PHD|PhD|AuD|DBA)\)$/);
  if (m2) return m2[1].trim();

  return null;
}

function extractAnchorTexts(html) {
  // Very lightweight anchor-text extraction (no external deps)
  // Grabs inner text of <a ...>TEXT</a>
  const out = [];
  const re = /<a\b[^>]*>(.*?)<\/a>/gis;
  let m;
  while ((m = re.exec(html))) {
    const inner = m[1]
      .replace(/<[^>]+>/g, " ") // strip nested tags
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();

    if (inner) out.push(inner);
  }
  return out;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      // Helps avoid some edge caching / bot filtering issues
      "User-Agent": "Mozilla/5.0 (majors-sync-script)",
    },
  });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
  return await res.text();
}

async function main() {
  console.log("Fetching catalogs...");
  const [ugHtml, gradHtml] = await Promise.all([
    fetchHtml(UNDERGRAD_URL),
    fetchHtml(GRAD_URL),
  ]);

  const ugLinks = extractAnchorTexts(ugHtml);
  const gradLinks = extractAnchorTexts(gradHtml);

  const majors = new Set();

  for (const t of [...ugLinks, ...gradLinks]) {
    const name = normalizeProgramName(t);
    if (name) majors.add(name);
  }

  const majorsArr = Array.from(majors).sort((a, b) => a.localeCompare(b));

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(majorsArr, null, 2) + "\n", "utf8");

  console.log(`Wrote ${majorsArr.length} degree programs to: ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});