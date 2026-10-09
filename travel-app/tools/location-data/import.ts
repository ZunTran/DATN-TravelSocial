import { readFile} from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient} from '@prisma/client';
import { PrismaPg} from '@prisma/adapter-pg';
import { Pool } from 'pg';

const BASE_DIR = path.resolve(
  process.cwd(),
  'tools',
  'location-data',
);

const INPUT_FILE = path.join(
  BASE_DIR,
  'clean',
  'deduplicated.json',
);

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://admin:password123@localhost:5432/travel_db?schema=public";

type LocationInput = {
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  province: string;
  description: string | null;

  estimated_cost: number | null;
  opening_hours: string | null;
  source: string;
  source_url: string | null;
  category: string;
};


if (!DATABASE_URL) {
  throw new Error(
    [
      'DATABASE_URL is not defined.',
      '',
      'Please set DATABASE_URL before running import.ts.',
    ].join('\n'),
  );
}

const pool = new Pool({ connectionString: DATABASE_URL});
const adapter = new PrismaPg( pool);
const prisma = new PrismaClient({ adapter});

function normalizeText(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      ' ',
    );
}

function distanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const earthRadius =
    6_371_000;

  const toRadians =
    (degrees: number) =>
      (degrees * Math.PI) /
      180;

  const dLat =
    toRadians(
      lat2 - lat1,
    );

  const dLon =
    toRadians(
      lon2 - lon1,
    );

  const a =
    Math.sin(
      dLat / 2,
    ) ** 2 +
    Math.cos(
      toRadians(lat1),
    ) *
      Math.cos(
        toRadians(lat2),
      ) *
      Math.sin(
        dLon / 2,
      ) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    );

  return (
    earthRadius * c
  );
}

async function main(): Promise<void> {
  console.log('');
  console.log('======================================');
  console.log( '       IMPORT LOCATIONS TO DB');
  console.log('======================================');


  const text =await readFile(INPUT_FILE,'utf8',);
  const locations = JSON.parse( text ) as LocationInput[];
  console.log('');
  console.log('Input:', INPUT_FILE );

  console.log(
    'Locations:',
    locations.length,
  );


  const categoryNames = [
    'Ẩm thực',
    'Du lịch',
    'Địa điểm',
    'Mountain',
  ];

  const categories =
    await prisma.category.findMany({
      where: {
        name: {
          in: categoryNames,
        },
      },
    });

  const categoryMap =
    new Map<
      string,
      string
    >();

  for (const category of categories) {
    categoryMap.set(
      normalizeText( category.name),
      category.id,
    );
  }

  for (const categoryName of categoryNames) {
    if (
      !categoryMap.has(
        normalizeText( categoryName),
      )
    ) {
      throw new Error(`Category "${categoryName}" does not exist in database.`);
    }
  }

  console.log('');
  console.log('Categories loaded:', categories.length);
  const existingLocations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        province: true,
        category_id: true,
      },
    });

  console.log( 'Existing DB locations:', existingLocations.length);
  let created = 0;
  let skipped = 0;
  let failed = 0;



  for (
    let index = 0;
    index < locations.length;
    index++
  ) {
    const location =
      locations[index];

    console.log(
      `[${index + 1}/${locations.length}] ${location.name}`,
    );

    try {
      const categoryId =
        categoryMap.get(
          normalizeText(
            location.category,
          ),
        );

      if (!categoryId) {
        console.warn(
          `  SKIP: category not found: ${location.category}`,
        );

        skipped++;

        continue;
      }

   

      const normalizedName =
        normalizeText(
          location.name,
        );

      const possibleDuplicates =
        existingLocations.filter(
          (
            existing,
          ) =>
            normalizeText(
              existing.name,
            ) === normalizedName &&
            existing.category_id ===
              categoryId &&
            normalizeText(
              existing.province ?? '',
            ) ===
              normalizeText(
                location.province,
              ),
          );
      
      let isDuplicate =
        false;

      for (
        const existing
        of possibleDuplicates
      ) {
        if (
          existing.latitude ===
            null ||
          existing.longitude ===
            null
        ) {
          continue;
        }

        const existingLatitude =
          Number(
            existing.latitude,
          );

        const existingLongitude =
          Number(
            existing.longitude,
          );

        const distance =
          distanceInMeters(
            existingLatitude,
            existingLongitude,
            location.latitude,
            location.longitude,
          );

        if (
          distance <= 50
        ) {
          isDuplicate =
            true;

          break;
        }
      }

      if (
        isDuplicate
      ) {
        console.log(
          '  SKIP: already exists',
        );

        skipped++;

        continue;
      }

      const createdLocation =
        await prisma.location.create({
          data: {
            name:
              location.name,

            address:
              location.address,

            latitude:
              location.latitude,

            longitude:
              location.longitude,

            province:
              location.province,

            description:
              location.description,

            estimated_cost:
              location.estimated_cost,

            opening_hours:
              location.opening_hours,

            source:
              location.source,

            source_url:
              location.source_url,

            category_id:
              categoryId,
          },
        });

      existingLocations.push({
        id: createdLocation.id,
        name: createdLocation.name,
        latitude: createdLocation.latitude,
        longitude: createdLocation.longitude,
        province: createdLocation.province,
        category_id: createdLocation.category_id,
      });

      created++;

      console.log(
        '  CREATED:',
        createdLocation.id,
      );
    } catch (error) {
      failed++;

      console.error(
        '  FAILED:',
        error,
      );
    }
  }
  console.log('');
  console.log('============================================================');
  console.log('IMPORT SUCCESS');
  console.log( '============================================================');
  console.log('Input:', locations.length);
  console.log('Created:',created);
  console.log( 'Skipped:', skipped);
  console.log('Failed:', failed );
  console.log('============================================================' );
}


main()
  .catch(
    (error) => {
      console.error('');
      console.error( 'IMPORT FAILED');

      console.error(
        error,
      );

      process.exitCode = 1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
      await pool.end();
    },
  );