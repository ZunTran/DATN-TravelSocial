import {
  mkdir,
  readdir,
  readFile,
  writeFile,
} from 'node:fs/promises';

import path from 'node:path';

import type {
  OSMElement,
} from './overpass-client';

const BASE_DIR =
  path.resolve(
    process.cwd(),
    'tools/location-data',
  );

const CHUNKS_DIR =
  path.join(
    BASE_DIR,
    'raw',
    'chunks',
  );

const OUTPUT_FILE =
  path.join(
    BASE_DIR,
    'raw',
    'osm-danang.json',
  );


type ChunkFile = {
  cell?: {
    row: number;
    col: number;

    bbox: {
      south: number;
      west: number;
      north: number;
      east: number;
    };
  };

  tag?: {
    key: string;
    value: string;
    category: string;
    label: string;
  };

  elements: OSMElement[];
};

async function main(): Promise<void> {
  console.log('');
  console.log(
    '======================================',
  );

  console.log(
    '          MERGE OSM RAW DATA',
  );

  console.log(
    '======================================',
  );

  await mkdir(
    CHUNKS_DIR,
    {
      recursive: true,
    },
  );

  const cellDirectories =
    await readdir(
      CHUNKS_DIR,
      {
        withFileTypes: true,
      },
    );


  const elementMap =
    new Map<
      string,
      OSMElement
    >();

  let chunkCount = 0;
  let elementCount = 0;

  for (
    const cellDirectory
    of cellDirectories
  ) {
    if (
      !cellDirectory.isDirectory()
    ) {
      continue;
    }

    const cellPath =
      path.join(
        CHUNKS_DIR,
        cellDirectory.name,
      );

    const files =
      await readdir(
        cellPath,
      );

    for (
      const fileName
      of files
    ) {
      if (
        !fileName.endsWith(
          '.json',
        )
      ) {
        continue;
      }

      const filePath =
        path.join(
          cellPath,
          fileName,
        );

      try {
        const text =
          await readFile(
            filePath,
            'utf8',
          );

        const chunk =
          JSON.parse(
            text,
          ) as ChunkFile;

        if (
          !Array.isArray(
            chunk.elements,
          )
        ) {
          console.warn(
            `[SKIP] Invalid chunk: ${filePath}`,
          );

          continue;
        }

        chunkCount++;

        elementCount +=
          chunk.elements.length;

        for (
          const element
          of chunk.elements
        ) {
          const id =
            `${element.type}:${element.id}`;

          if (
            !elementMap.has(id)
          ) {
            elementMap.set(
              id,
              element,
            );
          }
        }
      } catch (error) {
        console.error(
          `[ERROR] Cannot read ${filePath}`,
        );

        console.error(
          error,
        );
      }
    }
  }



  const elements =
    Array.from(
      elementMap.values(),
    );

  const output = {
    version: 0.6,

    generator:
      'TravelSocial Da Nang OSM Grid Crawler',

    elements,
  };

  await writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      output,
      null,
      2,
    ),
    'utf8',
  );

  console.log('');
  console.log(
    '============================================================',
  );

  console.log(
    `Chunk files: ${chunkCount}`,
  );

  console.log(
    `Raw elements before dedup: ${elementCount}`,
  );

  console.log(
    `Unique OSM elements: ${elements.length}`,
  );

  console.log(
    `Removed duplicates: ${
      elementCount - elements.length
    }`,
  );

  console.log('');
  console.log(
    `Output: ${OUTPUT_FILE}`,
  );

  console.log(
    '============================================================',
  );
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