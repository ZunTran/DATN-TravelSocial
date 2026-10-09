import {
  access,
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';

import path from 'node:path';

import {
  buildTagQuery,
  createGrid,
  REQUEST_DELAY_MS,
  runOverpassQuery,
  saveJson,
  sleep,
  type OSMElement,
} from './overpass-client';

import {
  OSM_TAGS,
} from './osm-tags';


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

const FAILED_FILE =
  path.join(
    BASE_DIR,
    'raw',
    'failed-chunks.json',
  );


async function fileExists(
  filePath: string,
): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function chunkFilePath(
  row: number,
  col: number,
  key: string,
  value: string,
): string {
  const cellDirectory =
    path.join(
      CHUNKS_DIR,
      `r${row}-c${col}`,
    );

  return path.join(
    cellDirectory,
    `${key}-${value}.json`,
  );
}

function safeFileName(
  value: string,
): string {
  return value.replace(
    /[^a-zA-Z0-9_-]/g,
    '_',
  );
}


async function main(): Promise<void> {
  console.log('');
  console.log(
    '======================================',
  );
  console.log(
    '       OSM DANANG GRID CRAWLER',
  );
  console.log(
    '======================================',
  );

  console.log('');

  const grid =
    createGrid();

  console.log(
    `Grid cells: ${grid.length}`,
  );

  console.log(
    `OSM tags: ${OSM_TAGS.length}`,
  );

  console.log(
    `Total possible requests: ${
      grid.length * OSM_TAGS.length
    }`,
  );

  console.log('');

  await mkdir(
    CHUNKS_DIR,
    {
      recursive: true,
    },
  );

  const failedChunks: Array<{
    row: number;
    col: number;
    key: string;
    value: string;
    label: string;
    error: string;
  }> = [];

  let skipped = 0;
  let success = 0;


  for (
    let cellIndex = 0;
    cellIndex < grid.length;
    cellIndex++
  ) {
    const cell =
      grid[cellIndex];

    console.log('');
    console.log(
      '############################################################',
    );

    console.log(
      `CELL ${cellIndex + 1}/${grid.length}`,
    );

    console.log(`Row: ${cell.row}`, );
    console.log( `Col: ${cell.col}`,);
    console.log( 'BBox:',
      [
        cell.bbox.south,
        cell.bbox.west,
        cell.bbox.north,
        cell.bbox.east,
      ].join(','),
    );

    console.log('############################################################',);

    for (
      let tagIndex = 0;
      tagIndex < OSM_TAGS.length;
      tagIndex++
    ) {
      const tag =
        OSM_TAGS[tagIndex];

      const fileName =
        `${safeFileName(tag.key)}-${safeFileName(
          tag.value,
        )}.json`;

      const outputFile =
        path.join(
          CHUNKS_DIR,
          `r${cell.row}-c${cell.col}`,
          fileName,
        );

      if (
        await fileExists(
          outputFile,
        )
      ) {
        console.log('');
        console.log(
          `[SKIP] Cell ${cell.row}-${cell.col} / ${tag.label}`,
        );

        skipped++;

        continue;
      }

      console.log('');
      console.log( '------------------------------------------------------------');

      console.log(
        `[QUERY] Cell ${cell.row}-${cell.col}`,
      );

      console.log(
        `Tag: ${tag.key}=${tag.value}`,
      );

      console.log(
        `Category: ${tag.category}`,
      );

      console.log(
        '------------------------------------------------------------',
      );

      const query =
        buildTagQuery(
          tag.key,
          tag.value,
          cell.bbox,
        );

      try {
        const data =
          await runOverpassQuery(
            query,
            `Cell ${cell.row}-${cell.col} / ${tag.label}`,
          );

        await saveJson(
          outputFile,
          {
            cell: {
              row: cell.row,
              col: cell.col,
              bbox: cell.bbox,
            },

            tag: {
              key: tag.key,
              value: tag.value,
              category: tag.category,
              label: tag.label,
            },

            elements:
              data.elements,
          },
        );

        success++;

        console.log(
          `[SAVED] ${outputFile}`,
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : String(error);

        console.error('');
        console.error(
          `[FAILED] Cell ${cell.row}-${cell.col} / ${tag.label}`,
        );

        console.error(
          errorMessage,
        );

        failedChunks.push({
          row: cell.row,
          col: cell.col,
          key: tag.key,
          value: tag.value,
          label: tag.label,
          error: errorMessage,
        });

        continue;
      }

      await sleep(
        REQUEST_DELAY_MS,
      );
    }
  }


  await writeFile(
    FAILED_FILE,
    JSON.stringify(
      failedChunks,
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
    'CRAWLER FINISHED',
  );

  console.log(
    '============================================================',
  );

  console.log(
    `Successful chunks: ${success}`,
  );

  console.log(
    `Skipped existing chunks: ${skipped}`,
  );

  console.log(
    `Failed chunks: ${failedChunks.length}`,
  );

  console.log(
    `Failed file: ${FAILED_FILE}`,
  );

  console.log(
    `Chunks directory: ${CHUNKS_DIR}`,
  );

  console.log(
    '============================================================',
  );

  if (
    failedChunks.length > 0
  ) {
    console.log('');
    console.log(
      'WARNING:',
    );

    console.log(
      'Some chunks failed.',
    );

    console.log(
      'Run the crawler again to retry only failed chunks.',
    );
  }
}

main().catch(
  (error) => {
    console.error('');
    console.error(
      'FATAL CRAWLER ERROR',
    );

    console.error(
      error,
    );

    process.exit(1);
  },
);