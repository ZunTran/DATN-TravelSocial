import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";

import OpenAI from "openai";
import { Pool } from "pg";

interface AIDocument {
  id: string;
  text: string;
  metadata: {
    name: string;
    category: string;
    province: string;

    estimated_cost?: number | null;
    duration_minutes?: number | null;
    opening_hours?: string | null;

    latitude?: number | null;
    longitude?: number | null;

    source?: string | null;
    source_url?: string | null;
    address?: string | null;
  };
}

const INPUT = path.resolve(
  "tools/location-data/clean/locations-ai-normalized.json"
);

const MODEL = "text-embedding-3-small";

const BATCH_SIZE = 50;

const MAX_RETRIES = 5;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: any) {
  const status = error?.status;

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    !status
  );
}

async function createEmbeddingsWithRetry(
  openai: OpenAI,
  input: string[],
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await openai.embeddings.create({
        model: MODEL,
        input,
      });
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === MAX_RETRIES) {
        throw error;
      }

      const delay = Math.min(1000 * 2 ** (attempt - 1), 15000);

      console.log(
        `  Retry ${attempt}/${MAX_RETRIES} after ${delay}ms...`,
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

async function main() {
  console.log("========================================");
  console.log(" AI DOCUMENT EMBEDDING");
  console.log("========================================");

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY in .env");
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL in .env");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {

    console.log(`Input file : ${INPUT}`);
    const raw = await fs.readFile(INPUT, "utf8");
    const documents: AIDocument[] = JSON.parse(raw);
    console.log(`Total documents : ${documents.length}`);
    console.log(`Model           : ${MODEL}`);
    console.log(`Batch size      : ${BATCH_SIZE}`);
    console.log("");

    if (documents.length === 0) 
      throw new Error("No documents found.");
    
    await pool.query("SELECT 1");
    console.log("Database connection: OK");
    console.log("");

    let processed = 0;

    for (
      let i = 0;
      i < documents.length;
      i += BATCH_SIZE
    ) {
      const batch = documents.slice(
        i,
        i + BATCH_SIZE,
      );

      console.log(
        `Embedding ${i + 1}-${i + batch.length}/${documents.length}...`,
      );

      const response = await createEmbeddingsWithRetry(
        openai,
        batch.map((doc) => doc.text),
      );

      if (response.data.length !== batch.length) {
        throw new Error(
          `Embedding count mismatch. Expected ${batch.length}, received ${response.data.length}`,
        );
      }

      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        for (let j = 0; j < batch.length; j++) {
          const doc = batch[j];

          const embedding = response.data[j].embedding;

          await client.query(
            `
            INSERT INTO location_embedding (
              location_id,
              content,
              embedding,
              metadata
            )
            VALUES (
              $1,
              $2,
              $3::vector,
              $4::jsonb
            )
            ON CONFLICT (location_id)
            DO UPDATE SET
              content = EXCLUDED.content,
              embedding = EXCLUDED.embedding,
              metadata = EXCLUDED.metadata,
              updated_at = NOW()
            `,
            [
              doc.id,
              doc.text,
              `[${embedding.join(",")}]`,
              JSON.stringify(doc.metadata),
            ],
          );
        }

        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      processed += batch.length;

      console.log(
        `  ✓ ${processed}/${documents.length}`,
      );
      console.log("");
    }

    console.log("========================================");
    console.log(" EMBEDDING COMPLETED");
    console.log("========================================");
    console.log(`Processed : ${processed}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("");
  console.error("Embedding failed:");
  console.error(error);
  process.exit(1);
});