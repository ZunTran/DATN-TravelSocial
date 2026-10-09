import { mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

export type OSMTags = Record<
  string,
  string | undefined
>;

export type OSMElement = {
  type: string;
  id: number;

  lat?: number;
  lon?: number;

  center?: {
    lat?: number;
    lon?: number;
  };

  tags?: OSMTags;
};

export type OSMResponse = {
  version?: number;
  generator?: string;
  elements: OSMElement[];
};

export type BBox = {
  south: number;
  west: number;
  north: number;
  east: number;
};

export type GridCell = {
  row: number;
  col: number;
  bbox: BBox;
};

export const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

export const DANANG_BBOX: BBox = {
  south: 15.95,
  west: 107.95,
  north: 16.20,
  east: 108.35,
};

export const GRID_ROWS = 4;
export const GRID_COLS = 4;
export const REQUEST_TIMEOUT_MS = 90_000;
export const REQUEST_DELAY_MS = 3_000;
export const ENDPOINT_DELAY_MS = 5_000;
export const USER_AGENT =
  'TravelSocial-DaNang-AI/1.0 (local development; contact: developer@example.com)';


export function sleep(
  milliseconds: number,
): Promise<void> {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds,
      ),
  );
}


export function bboxToString(
  bbox: BBox,
): string {
  return [
    bbox.south,
    bbox.west,
    bbox.north,
    bbox.east,
  ].join(',');
}

export function createGrid(): GridCell[] {
  const cells: GridCell[] = [];

  const latStep =
    (DANANG_BBOX.north - DANANG_BBOX.south) /
    GRID_ROWS;

  const lonStep =
    (DANANG_BBOX.east - DANANG_BBOX.west) /
    GRID_COLS;

  for (
    let row = 0;
    row < GRID_ROWS;
    row++
  ) {
    for (
      let col = 0;
      col < GRID_COLS;
      col++
    ) {
      const south =
        DANANG_BBOX.south +
        row * latStep;

      const north =
        DANANG_BBOX.south +
        (row + 1) * latStep;

      const west =
        DANANG_BBOX.west +
        col * lonStep;

      const east =
        DANANG_BBOX.west +
        (col + 1) * lonStep;

      cells.push({
        row,
        col,
        bbox: {
          south,
          west,
          north,
          east,
        },
      });
    }
  }

  return cells;
}


export function buildTagQuery(
  key: string,
  value: string,
  bbox: BBox,
): string {
  const bboxString =
    bboxToString(bbox);

  return `
[out:json][timeout:60];

(
  nwr["${key}"="${value}"](${bboxString});
);

out center tags;
`;
}

export async function fetchFromOverpass(
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

    const text =
      await response.text();

    if (!response.ok) {
      throw new Error(
        [
          `HTTP ${response.status} ${response.statusText}`,
          '',
          text.slice(0, 1000),
        ].join('\n'),
      );
    }

    let data:
      OSMResponse;

    try {
      data =
        JSON.parse(
          text,
        ) as OSMResponse;
    } catch {
      throw new Error(
        [
          'Overpass returned invalid JSON.',
          '',
          text.slice(0, 1000),
        ].join('\n'),
      );
    }

    if (
      !Array.isArray(
        data.elements,
      )
    ) {
      throw new Error(
        'Invalid Overpass response: elements[] not found.',
      );
    }

    return data;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        `Request timeout after ${
          REQUEST_TIMEOUT_MS / 1000
        }s`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}


export async function runOverpassQuery(
  query: string,
  description: string,
): Promise<OSMResponse> {
  let lastError:
    | unknown
    | null = null;

  for (
    let i = 0;
    i < OVERPASS_ENDPOINTS.length;
    i++
  ) {
    const endpoint =
      OVERPASS_ENDPOINTS[i];

    console.log('');
    console.log(
      `Attempt ${i + 1}/${OVERPASS_ENDPOINTS.length}`,
    );

    console.log(
      'Endpoint:',
      endpoint,
    );

    try {
      const data =
        await fetchFromOverpass(
          endpoint,
          query,
        );

      console.log(
        `SUCCESS: ${description}`,
      );

      console.log(
        'Elements:',
        data.elements.length,
      );

      return data;
    } catch (error) {
      lastError =
        error;

      console.error(
        `FAILED: ${description}`,
      );

      console.error(
        String(error),
      );

      if (
        i <
        OVERPASS_ENDPOINTS.length - 1
      ) {
        console.log(
          `Waiting ${
            ENDPOINT_DELAY_MS / 1000
          }s before next endpoint...`,
        );

        await sleep(
          ENDPOINT_DELAY_MS,
        );
      }
    }
  }

  throw new Error(
    [
      `All Overpass endpoints failed: ${description}`,
      '',
      String(lastError),
    ].join('\n'),
  );
}

export async function saveJson(
  filePath: string,
  data: unknown,
): Promise<void> {
  await mkdir(
    path.dirname(filePath),
    {
      recursive: true,
    },
  );

  await writeFile(
    filePath,
    JSON.stringify(
      data,
      null,
      2,
    ),
    'utf8',
  );
}