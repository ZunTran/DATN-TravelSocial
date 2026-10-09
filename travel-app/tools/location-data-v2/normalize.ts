import {
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';

import path from 'node:path';

import {
  OSM_TAGS,
  CATEGORY_NAMES,
} from './osm-tags';

import type {
  OSMElement,
} from './overpass-client';


const BASE_DIR =
  path.resolve(
    process.cwd(),
    'tools/location-data',
  );

const INPUT_FILE =
  path.join(
    BASE_DIR,
    'raw',
    'osm-danang.json',
  );

const CLEAN_DIR =
  path.join(
    BASE_DIR,
    'clean',
  );

const OUTPUT_FILE =
  path.join(
    CLEAN_DIR,
    'normalized.json',
  );

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

function getName(
  tags: Record<string, string | undefined>,
): string | null {
  return (
    tags['name:vi'] ??
    tags['name'] ??
    tags['name:en'] ??
    null
  );
}

function getCoordinates(
  element: OSMElement,
): {
  latitude: number;
  longitude: number;
} | null {
  if (
    typeof element.lat === 'number' &&
    typeof element.lon === 'number'
  ) {
    return {
      latitude: element.lat,
      longitude: element.lon,
    };
  }

  if (
    typeof element.center?.lat === 'number' &&
    typeof element.center?.lon === 'number'
  ) {
    return {
      latitude:
        element.center.lat,

      longitude:
        element.center.lon,
    };
  }

  return null;
}

function getAddress(
  tags: Record<string, string | undefined>,
): string | null {
  if (
    tags['addr:full']
  ) {
    return tags['addr:full'];
  }

  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:place'],
    tags['addr:suburb'],
    tags['addr:district'],
    tags['addr:city'],
  ].filter(Boolean);

  if (
    parts.length === 0
  ) {
    return null;
  }

  return parts.join(', ');
}

function getDescription(
  tags: Record<string, string | undefined>,
): string | null {
  return (
    tags['description:vi'] ??
    tags['description'] ??
    null
  );
}

function getSourceUrl(
  tags: Record<string, string | undefined>,
): string | null {
  return (
    tags['website'] ??
    tags['contact:website'] ??
    tags['url'] ??
    null
  );
}

function parseCost(
  value?: string,
): number | null {
  if (!value) {
    return null;
  }

  const match =
    value.match(
      /\d+(?:[.,]\d+)?/,
    );

  if (!match) {
    return null;
  }

  const number =
    Number(
      match[0].replace(
        ',',
        '.',
      ),
    );

  return Number.isFinite(
    number,
  )
    ? number
    : null;
}


function getCategory(tags: Record<string, string | undefined>): string | null {

  for (const definition of OSM_TAGS) {
    if (tags[definition.key] === definition.value) {
      return definition.category;
    }
  }

  return null;
}



function isInsideDaNang(
  latitude: number,
  longitude: number,
): boolean {
  return (
    latitude >= 15.95 &&
    latitude <= 16.20 &&
    longitude >= 107.95 &&
    longitude <= 108.35
  );
}

async function main(): Promise<void> {
  console.log('');
  console.log(
    '======================================',
  );

  console.log(
    '        NORMALIZE OSM LOCATIONS',
  );

  console.log(
    '======================================',
  );

  const rawText =
    await readFile(
      INPUT_FILE,
      'utf8',
    );

  const raw =
    JSON.parse(
      rawText,
    ) as {
      elements: OSMElement[];
    };

  const normalized:
    NormalizedLocation[] = [];

  let noTags = 0;
  let noName = 0;
  let noCoordinates = 0;
  let outsideBounds = 0;
  let noCategory = 0;

  for (
    const element
    of raw.elements
  ) {
    const tags =
      element.tags;

    if (!tags) {
      noTags++;
      continue;
    }

    const name =
      getName(tags);

    if (!name) {
      noName++;
      continue;
    }

    const coordinates =
      getCoordinates(
        element,
      );

    if (!coordinates) {
      noCoordinates++;
      continue;
    }

    if (
      !isInsideDaNang(
        coordinates.latitude,
        coordinates.longitude,
      )
    ) {
      outsideBounds++;
      continue;
    }

    const category =
      getCategory(tags);

    if (!category) {
      noCategory++;
      continue;
    }

    normalized.push({
      name,

      address:
        getAddress(tags),

      latitude:
        coordinates.latitude,

      longitude:
        coordinates.longitude,

      province:
        'Đà Nẵng',

      description:
        getDescription(tags),

      estimated_cost:
        parseCost(
          tags['charge'] ??
          tags['fee'],
        ),

      opening_hours:
        tags['opening_hours'] ??
        null,

      source:
        'OSM',

      source_url:
        getSourceUrl(tags),

      category,
    });
  }

  await mkdir(
    CLEAN_DIR,
    {
      recursive: true,
    },
  );

  await writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      normalized,
      null,
      2,
    ),
    'utf8',
  );

  const categoryCounts =new Map< string, number>();

  for ( const location of normalized) {
    categoryCounts.set(
      location.category,
      (
        categoryCounts.get(location.category) ?? 0
      ) + 1,
    );
  }

  console.log('');
  console.log('Raw elements:', raw.elements.length);
  console.log('No tags:',noTags);
  console.log( 'No name:', noName);
  console.log('No coordinates:', noCoordinates);
  console.log('Outside bounds:', outsideBounds );
  console.log( 'No category:', noCategory);
  console.log( 'Accepted:',normalized.length);
  console.log('');
  console.log('Category distribution:');
  for (
    const [
      category,
      count,
    ]
    of categoryCounts
  ) {
    console.log(
      `  ${category}: ${count}`,
    );
  }

  console.log('');
  console.log( `Output: ${OUTPUT_FILE}`);
}

main().catch(
  (error) => {
    console.error(
      'FATAL:',
      error,
    );

    process.exit(1);
  },
);