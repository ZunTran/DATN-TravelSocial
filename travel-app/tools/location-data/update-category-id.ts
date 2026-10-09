import 'dotenv/config';

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type LocationJson = {
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  province: string;
  description: string | null;
  estimated_cost: number | null;
  opening_hours: string | null;
  source: string | null;
  source_url: string | null;
  category: string;
};

const DATA_FILE = resolve(
  process.cwd(),
  'tools/location-data/clean/deduplicated.json',
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const CATEGORY_NAMES = [
  'Ẩm thực',
  'Du lịch',
  'Địa điểm',
  'Mountain',
] as const;

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;

  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

async function main() {
  console.log('============================================================');
  console.log('UPDATE LOCATION CATEGORY_ID');
  console.log('============================================================');

  const raw = await readFile(DATA_FILE, 'utf8');
  const locations = JSON.parse(raw) as LocationJson[];
  console.log(`Input JSON: ${locations.length}`);

  const categories = await prisma.category.findMany({
    where: {
      name: {
        in: [...CATEGORY_NAMES],
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    categoryMap.set(category.name, category.id);
  }

  console.log('\nCategories:');

  for (const name of CATEGORY_NAMES) {
    const id = categoryMap.get(name);

    console.log(
      `  ${name}: ${id ?? 'NOT FOUND'}`,
    );
  }

  const missingCategories = CATEGORY_NAMES.filter(
    (name) => !categoryMap.has(name),
  );

  if (missingCategories.length > 0) {
    throw new Error(
      `Missing categories: ${missingCategories.join(', ')}`,
    );
  }

  const dbLocations = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      province: true,
      category_id: true,
    },
  });

  console.log(`\nDB locations: ${dbLocations.length}`);

  const lookup = new Map<
    string,
    typeof dbLocations
  >();

  for (const location of dbLocations) {
    const key = [
      normalizeText(location.name),
      normalizeText(location.province ?? ''),
    ].join('|');

    const list = lookup.get(key) ?? [];

    list.push(location);

    lookup.set(key, list);
  }

  let updated = 0;
  let alreadyCorrect = 0;
  let notFound = 0;
  let ambiguous = 0;

  const categoryStats = new Map<string, number>();

  for (const item of locations) {
    const categoryId = categoryMap.get(item.category);

    if (!categoryId) {
      console.warn(
        `Unknown category: ${item.category} - ${item.name}`,
      );

      continue;
    }

    const key = [
      normalizeText(item.name),
      normalizeText(item.province),
    ].join('|');

    const candidates = lookup.get(key) ?? [];

    if (candidates.length === 0) {
      notFound++;

      console.warn(
        `[NOT FOUND] ${item.name}`,
      );

      continue;
    }


    let bestCandidate:
      | (typeof candidates)[number]
      | null = null;

    let bestDistance = Number.POSITIVE_INFINITY;

    for (const candidate of candidates) {
      if (
        candidate.latitude == null ||
        candidate.longitude == null
      ) {
        continue;
      }

      const distance = distanceMeters(
        item.latitude,
        item.longitude,
        Number(candidate.latitude),
        Number(candidate.longitude),
      );

      if (distance < bestDistance) {
        bestDistance = distance;
        bestCandidate = candidate;
      }
    }

    if (!bestCandidate) {
      notFound++;

      console.warn(
        `[NO COORDINATE MATCH] ${item.name}`,
      );

      continue;
    }

    if (bestDistance > 100) {
      notFound++;

      console.warn(
        `[TOO FAR] ${item.name} (${bestDistance.toFixed(1)}m)`,
      );

      continue;
    }

    if (bestCandidate.category_id === categoryId) {
      alreadyCorrect++;

      categoryStats.set(
        item.category,
        (categoryStats.get(item.category) ?? 0) + 1,
      );

      continue;
    }

    await prisma.location.update({
      where: {
        id: bestCandidate.id,
      },
      data: {
        category_id: categoryId,
      },
    });

    bestCandidate.category_id = categoryId;
    updated++;

    categoryStats.set(
      item.category,
      (categoryStats.get(item.category) ?? 0) + 1,
    );

    if ((updated + alreadyCorrect) % 100 === 0) {
      console.log(
        `Processed: ${updated + alreadyCorrect}/${locations.length}`,
      );
    }
  }

  console.log('\n============================================================');
  console.log('CATEGORY UPDATE RESULT');
  console.log('============================================================');

  console.log(`Input:          ${locations.length}`);
  console.log(`Updated:        ${updated}`);
  console.log(`Already correct:${alreadyCorrect}`);
  console.log(`Not found:      ${notFound}`);
  console.log(`Ambiguous:      ${ambiguous}`);

  console.log('\nCategory distribution:');

  for (const name of CATEGORY_NAMES) {
    console.log(
      `  ${name}: ${categoryStats.get(name) ?? 0}`,
    );
  }

  console.log('============================================================');
}

main()
  .catch((error) => {
    console.error('\nCATEGORY UPDATE FAILED');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });