import {
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';

import path from 'node:path';

const BASE_DIR = path.resolve(
  process.cwd(),
  'tools',
  'location-data',
);

const INPUT_FILE = path.join(
  BASE_DIR,
  'clean',
  'normalized.json',
);

const OUTPUT_DIR = path.join(
  BASE_DIR,
  'clean',
);

const OUTPUT_FILE = path.join(
  OUTPUT_DIR,
  'deduplicated.json',
);

const DUPLICATE_DISTANCE_METERS = 50;

type NormalizedLocation = {
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
    ) **
      2 +
    Math.cos(
      toRadians(lat1),
    ) *
      Math.cos(
        toRadians(lat2),
      ) *
      Math.sin(
        dLon / 2,
      ) **
        2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    );

  return earthRadius * c;
}

function qualityScore(
  location: NormalizedLocation,
): number {
  let score = 0;

  if (
    location.name
  ) {
    score += 10;
  }

  if (
    location.address
  ) {
    score += 5;
  }

  if (
    location.description
  ) {
    score += 5;
  }

  if (
    location.opening_hours
  ) {
    score += 3;
  }

  if (
    location.estimated_cost !==
    null
  ) {
    score += 3;
  }

  if (
    location.source_url
  ) {
    score += 3;
  }

  if (
    location.province
  ) {
    score += 1;
  }

  return score;
}


function mergeLocations(
  first: NormalizedLocation,
  second: NormalizedLocation,
): NormalizedLocation {
  const firstScore =
    qualityScore(first);

  const secondScore =
    qualityScore(second);

  const primary =
    secondScore > firstScore
      ? second
      : first;

  const secondary =
    primary === first
      ? second
      : first;

  return {
    name:
      primary.name ||
      secondary.name,

    address:
      primary.address ??
      secondary.address,

    latitude:
      primary.latitude,

    longitude:
      primary.longitude,

    province:
      primary.province ||
      secondary.province,

    description:
      primary.description ??
      secondary.description,

    estimated_cost:
      primary.estimated_cost ??
      secondary.estimated_cost,

    opening_hours:
      primary.opening_hours ??
      secondary.opening_hours,

    source:
      primary.source ||
      secondary.source,

    source_url:
      primary.source_url ??
      secondary.source_url,

    category:
      primary.category,
  };
}

async function main(): Promise<void> {
  console.log('');
  console.log(
    '======================================',
  );

  console.log(
    '       LOCATION DEDUPLICATOR',
  );

  console.log(
    '======================================',
  );


  const text =
    await readFile(
      INPUT_FILE,
      'utf8',
    );

  const locations =
    JSON.parse(
      text,
    ) as NormalizedLocation[];

  console.log('');
  console.log(
    'Input locations:',
    locations.length,
  );


  const groups =
    new Map<
      string,
      NormalizedLocation[]
    >();

  for (
    const location
    of locations
  ) {
    const key =
      [
        normalizeText(
          location.name,
        ),
        normalizeText(
          location.category,
        ),
        normalizeText(
          location.province,
        ),
      ].join('|');

    const group =
      groups.get(key);

    if (group) {
      group.push(
        location,
      );
    } else {
      groups.set(
        key,
        [location],
      );
    }
  }

  console.log(
    'Name/category/province groups:',
    groups.size,
  );

  const deduplicated:
    NormalizedLocation[] = [];

  let duplicatesRemoved =
    0;

  for (
    const group
    of groups.values()
  ) {
    const kept:
      NormalizedLocation[] = [];

    for (
      const location
      of group
    ) {
      let duplicateIndex = -1;

      for (
        let i = 0;
        i < kept.length;
        i++
      ) {
        const existing =
          kept[i];

        const distance =
          distanceInMeters(
            existing.latitude,
            existing.longitude,
            location.latitude,
            location.longitude,
          );

        if (
          distance <=
          DUPLICATE_DISTANCE_METERS
        ) {
          duplicateIndex =
            i;

          break;
        }
      }
      if (
        duplicateIndex === -1
      ) {
        kept.push(
          location,
        );

        continue;
      }


      kept[duplicateIndex] =
        mergeLocations(
          kept[duplicateIndex],
          location,
        );

      duplicatesRemoved++;
    }

    deduplicated.push(
      ...kept,
    );
  }

  await mkdir(
    OUTPUT_DIR,
    {
      recursive: true,
    },
  );

  await writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      deduplicated,
      null,
      2,
    ),
    'utf8',
  );



  console.log('');
  console.log('============================================================');
  console.log('DEDUPLICATE SUCCESS');
  console.log('============================================================',);

  console.log(
    'Before:',
    locations.length,
  );

  console.log(
    'Duplicates:',
    duplicatesRemoved,
  );

  console.log(
    'After:',
    deduplicated.length,
  );

  console.log('');

  console.log(
    'Duplicate rule:',
  );

  console.log(
    `  Same normalized name`,
  );

  console.log(
    `  Same category`,
  );

  console.log(
    `  Same province`,
  );

  console.log(
    `  Distance <= ${DUPLICATE_DISTANCE_METERS}m`,
  );

  console.log('');

  console.log(
    'Output:',
    OUTPUT_FILE,
  );

  console.log(
    '============================================================',
  );
}


main().catch(
  (error) => {
    console.error('');
    console.error(
      'DEDUPLICATE FAILED',
    );

    console.error(error);

    process.exit(1);
  },
);