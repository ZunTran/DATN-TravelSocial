import fs from "node:fs";
import path from "node:path";

const INPUT = path.resolve(
  "tools/location-data/clean/locations-ai.json",
);

const OUTPUT = path.resolve(
  "tools/location-data/clean/locations-ai-normalized.json",
);

function normalizeText(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeNullableText(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  return normalizeText(value);
}

const raw = fs.readFileSync(INPUT, "utf8");
const documents = JSON.parse(raw);

let changedDocuments = 0;
let changedFields = 0;

const normalized = documents.map((doc: any) => {
  const original = JSON.stringify(doc);

  const next = {
    ...doc,

    text:
      typeof doc.text === "string"
        ? normalizeText(doc.text)
        : doc.text,

    metadata: {
      ...doc.metadata,

      name: normalizeNullableText(doc.metadata?.name),
      address: normalizeNullableText(doc.metadata?.address),
      category: normalizeNullableText(doc.metadata?.category),
      province: normalizeNullableText(doc.metadata?.province),
      opening_hours: normalizeNullableText(
        doc.metadata?.opening_hours,
      ),
      source: normalizeNullableText(doc.metadata?.source),
      source_url: normalizeNullableText(doc.metadata?.source_url),
    },
  };

  const updated = JSON.stringify(next);

  if (original !== updated) {
    changedDocuments++;
  }

  return next;
});

fs.writeFileSync(
  OUTPUT,
  JSON.stringify(normalized, null, 2),
  "utf8",
);

console.log("========================================");
console.log(" AI DOCUMENT NORMALIZATION");
console.log("========================================");
console.log(`Total documents   : ${documents.length}`);
console.log(`Changed documents : ${changedDocuments}`);
console.log(`Output            : ${OUTPUT}`);
console.log("========================================");