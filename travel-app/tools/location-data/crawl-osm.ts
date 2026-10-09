import {
  mkdir,
  writeFile,
} from 'node:fs/promises';

import path from 'node:path';

const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

const OUTPUT_DIR = path.resolve(
  process.cwd(),
  'tools',
  'location-data',
  'raw',
);

const OUTPUT_FILE = path.join(
  OUTPUT_DIR,
  'osm-danang.json',
);

const DANANG_BBOX ='15.95,107.95,16.20,108.35';
const USER_AGENT = 'TravelSocial-DaNang-AI/1.0 (local development; contact: developer@example.com)';
const REQUEST_TIMEOUT_MS =150_000;
const REQUEST_DELAY_MS =5_000;
const MAX_ATTEMPTS_PER_QUERY = OVERPASS_ENDPOINTS.length;

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

const QUERIES = [
  {
    name: 'ẨM THỰC',

    query: `
[out:json][timeout:60];

(
  nwr["amenity"="restaurant"](${DANANG_BBOX});
  nwr["amenity"="cafe"](${DANANG_BBOX});
  nwr["amenity"="fast_food"](${DANANG_BBOX});
  nwr["amenity"="food_court"](${DANANG_BBOX});
  nwr["amenity"="bar"](${DANANG_BBOX});
);

out center tags;
`,
  },

  {
    name: 'DU LỊCH',

    query: `
[out:json][timeout:60];

(
  nwr["tourism"="hotel"](${DANANG_BBOX});
  nwr["tourism"="hostel"](${DANANG_BBOX});
  nwr["tourism"="guest_house"](${DANANG_BBOX});
  nwr["tourism"="motel"](${DANANG_BBOX});

  nwr["shop"="mall"](${DANANG_BBOX});

  nwr["amenity"="marketplace"](${DANANG_BBOX});

  nwr["shop"="gift"](${DANANG_BBOX});
  nwr["shop"="souvenir"](${DANANG_BBOX});
);

out center tags;
`,
  },

  {
    name: 'ĐỊA ĐIỂM',

    query: `
[out:json][timeout:60];

(
  nwr["tourism"="attraction"](${DANANG_BBOX});
  nwr["tourism"="museum"](${DANANG_BBOX});
  nwr["tourism"="viewpoint"](${DANANG_BBOX});
  nwr["tourism"="gallery"](${DANANG_BBOX});
  nwr["tourism"="artwork"](${DANANG_BBOX});
  nwr["tourism"="theme_park"](${DANANG_BBOX});
  nwr["tourism"="zoo"](${DANANG_BBOX});
  nwr["tourism"="aquarium"](${DANANG_BBOX});

  /*
   * Không lấy toàn bộ historic.
   *
   * Chỉ lấy các loại có giá trị cho travel.
   */
  nwr["historic"~"monument|memorial|castle|fort|ruins|archaeological_site|building"](${DANANG_BBOX});

  nwr["natural"="beach"](${DANANG_BBOX});
  nwr["natural"="bay"](${DANANG_BBOX});
  nwr["natural"="cave"](${DANANG_BBOX});
  nwr["natural"="island"](${DANANG_BBOX});

  nwr["leisure"="park"](${DANANG_BBOX});
  nwr["leisure"="garden"](${DANANG_BBOX});
);

out center tags;
`,
  },

  {
    name: 'MOUNTAIN',

    query: `
[out:json][timeout:60];

(
  nwr["natural"="peak"](${DANANG_BBOX});
  nwr["natural"="cliff"](${DANANG_BBOX});
  nwr["natural"="ridge"](${DANANG_BBOX});
);

out center tags;
`,
  },
];


async function sleep(
  milliseconds: number,
): Promise<void> {

  await new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds,
      ),
  );
}

async function fetchFromOverpass(
  endpoint: string,
  query: string,
): Promise<OSMResponse> {

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => {
        controller.abort();
      },
      REQUEST_TIMEOUT_MS,
    );


  try {

    console.log('');
    console.log(
      'Request:',
      endpoint,
    );


    const response =
      await fetch(
        endpoint,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded; charset=UTF-8',

            Accept:
              'application/json',

            'User-Agent':
              USER_AGENT,

            'Accept-Language':
              'en-US,en;q=0.9',

            'Cache-Control':
              'no-cache',
          },

          body:
            new URLSearchParams({
              data: query,
            }),

          signal:
            controller.signal,
        },
      );


    const text = await response.text();


    if (
      !response.ok
    ) {

      throw new Error(
        [
          `HTTP ${response.status} ${response.statusText}`,
          '',
          text.slice(0, 1000),
        ].join('\n'),
      );
    }

    let data: OSMResponse;

    try {

      data = JSON.parse(text) as OSMResponse;
    } catch {

      throw new Error(
        [
          'Overpass returned invalid JSON.',
          '',
          text.slice(0, 1000),
        ].join('\n'),
      );
    }

    if ( !Array.isArray( data.elements )) {
      throw new Error( 'Invalid Overpass response: elements[] not found.');
    }

    return data;

  } catch (error) {

    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {

      throw new Error(
        `Request timeout after ${REQUEST_TIMEOUT_MS / 1000}s`,
      );
    }


    throw error;

  } finally {

    clearTimeout(
      timeout,
    );
  }
}


async function fetchQuery(
  queryName: string,
  query: string,
): Promise<OSMResponse> {

  let lastError: | unknown | null = null;
  console.log('');

  console.log(
    '============================================================',
  );

  console.log(
    `QUERY: ${queryName}`,
  );

  console.log(
    '============================================================',
  );


  for (
    let attempt = 0;
    attempt <
    MAX_ATTEMPTS_PER_QUERY;
    attempt++
  ) {

    const endpoint =
      OVERPASS_ENDPOINTS[
        attempt
      ];


    try {

      console.log('');
      console.log(
        `Attempt ${attempt + 1}/${MAX_ATTEMPTS_PER_QUERY}`,
      );


      const data =
        await fetchFromOverpass(
          endpoint,
          query,
        );


      console.log('');

      console.log(
        `SUCCESS: ${queryName}`,
      );

      console.log(
        'Endpoint:',
        endpoint,
      );

      console.log(
        'Elements:',
        data.elements.length,
      );


      return data;

    } catch (error) {

      lastError =
        error;


      console.error('');

      console.error(
        `FAILED: ${queryName}`,
      );

      console.error(
        'Endpoint:',
        endpoint,
      );

      console.error(
        error,
      );

      if ( attempt < MAX_ATTEMPTS_PER_QUERY - 1 ) {
        console.log('');
        console.log(`Waiting ${REQUEST_DELAY_MS / 1000}s before next endpoint...`);

        await sleep(
          REQUEST_DELAY_MS,
        );
      }
    }
  }


  throw new Error(
    [
      `All Overpass endpoints failed for query: ${queryName}`,
      '',
      String(lastError),
    ].join('\n'),
  );
}

function getElementKey(
  element: OSMElement,
): string {

  return `${element.type}:${element.id}`;
}

async function main() {

  console.log('======================================');

  console.log('    OSM DANANG CRAWLER');
  console.log('======================================');

  console.log(
    'Bounding box:',
    DANANG_BBOX,
  );

  console.log(
    'Query groups:',
    QUERIES.length,
  );

  console.log(
    'Endpoints:',
    OVERPASS_ENDPOINTS.length,
  );

  console.log(
    'Request timeout:',
    `${REQUEST_TIMEOUT_MS / 1000}s`,
  );

  console.log(
    'Request delay:',
    `${REQUEST_DELAY_MS / 1000}s`,
  );




  const allElements:
    OSMElement[] =
    [];



  for (
    let i = 0;
    i < QUERIES.length;
    i++
  ) {

    const queryGroup =
      QUERIES[i];


    console.log('');
    console.log(
      '############################################################',
    );

    console.log(
      `GROUP ${i + 1}/${QUERIES.length}: ${queryGroup.name}`,
    );

    console.log(
      '############################################################',
    );


    try {

      const data =
        await fetchQuery(
          queryGroup.name,
          queryGroup.query,
        );


      allElements.push(
        ...data.elements,
      );


      console.log('');

      console.log(
        `Collected from ${queryGroup.name}:`,
        data.elements.length,
      );


    } catch (error) {
      throw new Error(
        [
          `Query group failed: ${queryGroup.name}`,
          '',
          String(error),
          '',
          'Crawler stopped to avoid producing incomplete data.',
        ].join('\n'),
      );
    }


    if (
      i <
      QUERIES.length - 1
    ) {

      console.log('');

      console.log(
        `Waiting ${REQUEST_DELAY_MS / 1000}s before next query...`,
      );

      await sleep(
        REQUEST_DELAY_MS,
      );
    }
  }


  const uniqueElements:
    OSMElement[] =
    [];

  const seen =
    new Set<string>();


  for (
    const element
    of allElements
  ) {

    const key =
      getElementKey(
        element,
      );


    if (
      seen.has(
        key,
      )
    ) {
      continue;
    }


    seen.add(
      key,
    );


    uniqueElements.push(
      element,
    );
  }

  const output: OSMResponse = {
    version: 0.6,

    generator:
      'TravelSocial-DaNang-AI/1.0',

    elements:
      uniqueElements,
  };


  await mkdir(
    OUTPUT_DIR,
    {
      recursive: true,
    },
  );



  await writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      output,
      null,
      2,
    ),
    'utf8',
  );


  const duplicatesRemoved =
    allElements.length -
    uniqueElements.length;




  const nodeCount =
    uniqueElements.filter(
      (
        element,
      ) =>
        element.type ===
        'node',
    ).length;


  const wayCount =
    uniqueElements.filter(
      (
        element,
      ) =>
        element.type ===
        'way',
    ).length;


  const relationCount =
    uniqueElements.filter(
      (
        element,
      ) =>
        element.type ===
        'relation',
    ).length;

  const tagCounts =
    new Map<
      string,
      number
    >();


  for (
    const element
    of uniqueElements
  ) {

    const tags =
      element.tags;


    if (
      !tags
    ) {
      continue;
    }

    const candidates = [
      tags.amenity
        ? `amenity=${tags.amenity}`
        : null,

      tags.tourism
        ? `tourism=${tags.tourism}`
        : null,

      tags.natural
        ? `natural=${tags.natural}`
        : null,

      tags.historic
        ? `historic=${tags.historic}`
        : null,

      tags.leisure
        ? `leisure=${tags.leisure}`
        : null,

      tags.shop
        ? `shop=${tags.shop}`
        : null,
    ];


    for (
      const candidate
      of candidates
    ) {

      if (
        !candidate
      ) {
        continue;
      }


      tagCounts.set(
        candidate,
        (
          tagCounts.get(
            candidate,
          ) ?? 0
        ) + 1,
      );
    }
  }


  console.log('');
  console.log(
    '============================================================',
  );

  console.log(
    '                    CRAWL SUCCESS',
  );

  console.log(
    '============================================================',
  );

  console.log(
    'Total collected:',
    allElements.length,
  );

  console.log(
    'Duplicates removed:',
    duplicatesRemoved,
  );

  console.log(
    'Unique elements:',
    uniqueElements.length,
  );

  console.log('');

  console.log(
    'Element types:',
  );

  console.log(
    `  node:     ${nodeCount}`,
  );

  console.log(
    `  way:      ${wayCount}`,
  );

  console.log(
    `  relation: ${relationCount}`,
  );


  console.log('');

  console.log(
    'OSM tag distribution:',
  );


  const sortedTags =
    [
      ...tagCounts.entries(),
    ].sort(
      (
        [, countA],
        [, countB],
      ) =>
        countB - countA,
    );


  for (
    const [
      tag,
      count,
    ]
    of sortedTags
  ) {

    console.log(
      `  ${tag}: ${count}`,
    );
  }


  console.log('');

  console.log(
    'Output:',
    OUTPUT_FILE,
  );

  console.log('');

  console.log(
    'Next:',
  );

  console.log(
    '  npx tsx tools/location-data/normalize.ts',
  );

  console.log(
    '  npx tsx tools/location-data/deduplicate.ts',
  );

  console.log(
    '  npx tsx tools/location-data/import.ts',
  );
}

main().catch(
  (error) => {

    console.error('');

    console.error(
      '======================================',
    );

    console.error(
      '              CRAWL FAILED',
    );

    console.error(
      '======================================',
    );

    console.error(error);

    process.exit(1);
  },
);




