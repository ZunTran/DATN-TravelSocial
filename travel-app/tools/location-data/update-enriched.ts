import 'dotenv/config';

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type EnrichmentField =
  | 'address'
  | 'description'
  | 'opening_hours'
  | 'estimated_cost'
  | 'source_url';

type EnrichedLocation = {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  opening_hours: string | null;
  estimated_cost: number | null;
  source: string | null;
  source_url: string | null;
  enrichment?: {
    fields?: string[];
    fantasticity?: boolean;
    officialWebsite?: boolean;
    matchedSourceName?: string | null;
    matchScore?: number | null;
  };
};

const INPUT_FILE = resolve(
  process.cwd(),
  'tools/location-data/clean/enriched.json',
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const VALID_FIELDS = new Set<EnrichmentField>([
  'address',
  'description',
  'opening_hours',
  'estimated_cost',
  'source_url',
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function getFields(location: EnrichedLocation): EnrichmentField[] {
  return (location.enrichment?.fields ?? []).filter(
    (field): field is EnrichmentField => VALID_FIELDS.has(field as EnrichmentField),
  );
}

async function main() {
  console.log('============================================================');
  console.log('UPDATE LOCATION DB FROM ENRICHED.JSON');
  console.log('============================================================');
  console.log(`Input: ${INPUT_FILE}`);

  const raw = await readFile(INPUT_FILE, 'utf8');
  const locations = JSON.parse(raw) as EnrichedLocation[];

  if (!Array.isArray(locations)) {
    throw new Error('enriched.json must contain a JSON array.');
  }

  console.log(`Records in enriched.json: ${locations.length}`);

  let updatedLocations = 0;
  let skippedLocations = 0;
  let missingLocations = 0;

  const counters: Record<EnrichmentField, number> = {
    address: 0,
    description: 0,
    opening_hours: 0,
    estimated_cost: 0,
    source_url: 0,
  };

  const skipped: Array<{ id: string; name: string; reason: string }> = [];
  const missing: Array<{ id: string; name: string }> = [];

  for (const location of locations) {
    if (!location?.id || !location.name) {
      skippedLocations++;
      skipped.push({
        id: location?.id ?? 'UNKNOWN',
        name: location?.name ?? 'UNKNOWN',
        reason: 'Missing id or name',
      });
      continue;
    }

    const fields = getFields(location);

    if (fields.length === 0) {
      skippedLocations++;
      continue;
    }

    const existing = await prisma.location.findUnique({
      where: { id: location.id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!existing) {
      missingLocations++;
      missing.push({ id: location.id, name: location.name });
      continue;
    }

    const data: Record<string, unknown> = {};

    for (const field of fields) {
      switch (field) {
        case 'address':
          if (isNonEmptyString(location.address)) {
            data.address = location.address.trim();
          }
          break;

        case 'description':
          if (isNonEmptyString(location.description)) {
            data.description = location.description.trim();
          }
          break;

        case 'opening_hours':
          if (isNonEmptyString(location.opening_hours)) {
            data.opening_hours = location.opening_hours.trim();
          }
          break;

        case 'estimated_cost':
          if (isValidNumber(location.estimated_cost)) {
            data.estimated_cost = location.estimated_cost;
          }
          break;

        case 'source_url':
          if (isNonEmptyString(location.source_url)) {
            data.source_url = location.source_url.trim();

            if (isNonEmptyString(location.source)) {
              data.source = location.source.trim();
            }
          }
          break;
      }
    }

    if (Object.keys(data).length === 0) {
      skippedLocations++;
      continue;
    }

    await prisma.location.update({
      where: { id: location.id },
      data,
    });

    updatedLocations++;

    for (const key of Object.keys(data) as Array<EnrichmentField | 'source'>) {
      if (key === 'source') continue;
      counters[key]++;
    }

    console.log(
      `[UPDATED] ${location.name} (${location.id}) -> ${Object.keys(data).join(', ')}`,
    );
  }

  console.log('\n============================================================');
  console.log('UPDATE RESULT');
  console.log('============================================================');
  console.log(`Records read:                 ${locations.length}`);
  console.log(`Locations updated:            ${updatedLocations}`);
  console.log(`Locations skipped:            ${skippedLocations}`);
  console.log(`Locations not found in DB:    ${missingLocations}`);
  console.log('\nFields updated:');
  console.log(`  address:                    ${counters.address}`);
  console.log(`  description:                ${counters.description}`);
  console.log(`  opening_hours:              ${counters.opening_hours}`);
  console.log(`  estimated_cost:             ${counters.estimated_cost}`);
  console.log(`  source_url:                 ${counters.source_url}`);

  if (missing.length > 0) {
    console.log('\nWARNING: Records present in enriched.json but missing in DB:');
    for (const item of missing) {
      console.log(`  - ${item.name} (${item.id})`);
    }
  }

  if (skipped.length > 0) {
    console.log('\nSkipped records:');
    for (const item of skipped) {
      console.log(`  - ${item.name} (${item.id}): ${item.reason}`);
    }
  }

  console.log('============================================================');
  console.log('DONE');
}

main()
  .catch((error) => {
    console.error('\nUPDATE LOCATION DB FAILED');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
