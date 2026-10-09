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
  'raw',
  'osm-danang.json',
);

const OUTPUT_DIR = path.join(
  BASE_DIR,
  'clean',
);

const OUTPUT_FILE = path.join(
  OUTPUT_DIR,
  'normalized.json',
);

const DANANG_BBOX = {
  south: 15.95,
  west: 107.95,
  north: 16.20,
  east: 108.35,
};

type OSMElement = {
  type: string;

  id: number;

  lat?: number;

  lon?: number;
  center?: {
    lat?: number;
    lon?: number;
  };

  tags?: Record<
    string,
    string | undefined
  >;
};

type OSMResponse = {
  version?: number;
  generator?: string;
  elements: OSMElement[];
};

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

const FOOD_TAGS = new Set([
  'restaurant',
  'cafe',
  'fast_food',
  'food_court',
  'bar',
]);


const TRAVEL_TOURISM_TAGS = new Set([
  'hotel',
  'hostel',
  'guest_house',
  'motel',
]);

const TRAVEL_SHOP_TAGS = new Set([
  'mall',
  'gift',
  'souvenir',
]);


const PLACE_TOURISM_TAGS = new Set([
  'attraction',
  'museum',
  'viewpoint',
  'gallery',
  'artwork',
  'theme_park',
  'zoo',
  'aquarium',
]);

const PLACE_HISTORIC_TAGS = new Set([
  'monument',
  'memorial',
  'castle',
  'fort',
  'ruins',
  'archaeological_site',
  'building',
]);

const PLACE_NATURAL_TAGS = new Set([
  'beach',
  'bay',
  'cave',
  'island',
]);

const PLACE_LEISURE_TAGS = new Set([
  'park',
  'garden',
]);

const MOUNTAIN_TAGS = new Set([
  'peak',
  'cliff',
  'ridge',
]);

function getName(
  tags: Record<string, string | undefined>,
): string | null {
  return (
    tags['name:vi'] ??
    tags.name ??
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
      latitude: element.center.lat,
      longitude: element.center.lon,
    };
  }

  return null;
}

function getAddress(
  tags: Record<string, string | undefined>,
): string | null {
  if (
    tags['addr:full']?.trim()
  ) {
    return tags['addr:full'].trim();
  }

  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:place'],
    tags['addr:suburb'],
    tags['addr:district'],
    tags['addr:city'],
  ].filter(
    (
      value,
    ): value is string =>
      Boolean(
        value?.trim(),
      ),
  );

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
    tags['description:vi']?.trim() ||
    tags.description?.trim() ||
    null
  );
}

function getSourceUrl(
  tags: Record<string, string | undefined>,
): string | null {
  return (
    tags.website?.trim() ||
    tags['contact:website']?.trim() ||
    tags.url?.trim() ||
    null
  );
}

function parseCost(
  value?: string,
): number | null {
  if (!value) 
    return null;
  
  const normalized = value.replace(
      /\s+/g,
      '',
    );

  const match = normalized.match( /\d+(?:[.,]\d+)?/ );
  if (!match) 
    return null;
  

  let numberText = match[0];

  const parts = numberText.split(/[.,]/);
  if (
    parts.length === 2 &&
    parts[1].length === 3) {
    numberText = parts.join('');
  } else {
    numberText = numberText.replace( ',', '.');
  }

  const number = Number(numberText );

  if ( !Number.isFinite(number)) {
    return null;
  }
  return number;
}

function isInsideDaNang(
  latitude: number,
  longitude: number,
): boolean {
  return (
    latitude >= DANANG_BBOX.south &&
    latitude <= DANANG_BBOX.north &&
    longitude >= DANANG_BBOX.west &&
    longitude <= DANANG_BBOX.east
  );
}


function getCategory(tags: Record<string, string | undefined>): string | null {
  if ( tags.amenity && FOOD_TAGS.has(tags.amenity)) {
    return 'Ẩm thực';
  }

  if ( tags.tourism && TRAVEL_TOURISM_TAGS.has(tags.tourism)) {
    return 'Du lịch';
  }

  if ( tags.shop && TRAVEL_SHOP_TAGS.has( tags.shop )) {
    return 'Du lịch';
  }

  if ( tags.amenity ==='marketplace') {
    return 'Du lịch';
  }

  if ( tags.natural && MOUNTAIN_TAGS.has(tags.natural)) {
    return 'Mountain';
  }

  if ( tags.tourism && PLACE_TOURISM_TAGS.has( tags.tourism)) {
    return 'Địa điểm';
  }

  if ( tags.historic && PLACE_HISTORIC_TAGS.has( tags.historic)) {
    return 'Địa điểm';
  }

  if ( tags.natural && PLACE_NATURAL_TAGS.has(tags.natural)) {
    return 'Địa điểm';
  }

  if ( tags.leisure && PLACE_LEISURE_TAGS.has( tags.leisure )) {
    return 'Địa điểm';
  }

  return null;
}

async function main(): Promise<void> {
  console.log('');
  console.log('======================================');
  console.log( '       OSM LOCATION NORMALIZER');
  console.log('======================================');
  console.log('');

  const rawText = await readFile(INPUT_FILE,'utf8');
  const raw = JSON.parse( rawText ) as OSMResponse;
  console.log('Input:',INPUT_FILE,);
  console.log( 'Raw elements:',raw.elements.length,);


  let noTags = 0;
  let noName = 0;
  let noCoordinates = 0;
  let outsideBounds = 0;
  let noCategory = 0;
  const locations: NormalizedLocation[] = [];

  for ( const element
    of raw.elements ) {
    const tags = element.tags;

    if (!tags) {
      noTags++;
      continue;
    }

    const name = getName(tags);

    if (!name) {
      noName++;
      continue;
    }

    const coordinates = getCoordinates(
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

    const category = getCategory(tags);
    if (!category) {
      noCategory++;
      continue;
    }

    locations.push({
      name,
      address: getAddress(tags),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      province:'Đà Nẵng',
      description: getDescription(tags),

      estimated_cost:
        parseCost(
          tags.charge ??
          tags.fee,
        ),

      opening_hours:
        tags.opening_hours ??
        null,

      source:
        'OSM',

      source_url:
        getSourceUrl(tags),

      category,
    });
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
      locations,
      null,
      2,
    ),
    'utf8',
  );


  const categoryCounts =
    new Map<
      string,
      number
    >();

  for (
    const location
    of locations
  ) {
    categoryCounts.set(
      location.category,
      (
        categoryCounts.get(
          location.category,
        ) ?? 0
      ) + 1,
    );
  }


  console.log('');
  console.log(
    '============================================================',
  );

  console.log(
    'NORMALIZE SUCCESS',
  );

  console.log(
    '============================================================',
  );

  console.log(
    'Raw elements:',
    raw.elements.length,
  );

  console.log(
    'No tags:',
    noTags,
  );

  console.log(
    'No name:',
    noName,
  );

  console.log(
    'No coordinates:',
    noCoordinates,
  );

  console.log(
    'Outside bounds:',
    outsideBounds,
  );

  console.log(
    'No category:',
    noCategory,
  );

  console.log(
    'Accepted:',
    locations.length,
  );

  console.log('');

  console.log(
    'Category distribution:',
  );

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
      'NORMALIZE FAILED',
    );
    console.error(error);

    process.exit(1);
  },
);