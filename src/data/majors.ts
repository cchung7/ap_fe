// src/data/majors.ts
// Auto-generated via: `node scripts/sync-utd-majors.mjs`
// Source catalogs:
// - Undergraduate programs: https://catalog.utdallas.edu/2025/undergraduate/programs
// - Graduate programs:      https://catalog.utdallas.edu/2025/graduate/programs

import majorsJson from "./utd-majors.generated.json";

// Keep the same export shape your UI expects: string[]
export const majors: string[] = (majorsJson as string[]).sort((a, b) =>
  a.localeCompare(b)
);