import json
import os
from pathlib import Path

import psycopg2
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer


# ============================================================
# CONFIG
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[3]

INPUT_FILE = (
    BASE_DIR
    / "tools"
    / "location-data"
    / "clean"
    / "locations-ai-normalized.json"
)

MODEL_NAME = "BAAI/bge-m3"

BATCH_SIZE = 8


# ============================================================
# ENV
# ============================================================

load_dotenv(BASE_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing from .env")


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 40)
    print(" AI DOCUMENT EMBEDDING - LOCAL")
    print("=" * 40)

    # --------------------------------------------------------
    # Load documents
    # --------------------------------------------------------

    print(f"Input file : {INPUT_FILE}")

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        documents = json.load(f)

    print(f"Total documents : {len(documents)}")
    print(f"Model           : {MODEL_NAME}")
    print(f"Batch size      : {BATCH_SIZE}")
    print()

    if not documents:
        raise RuntimeError("No documents found.")

    # --------------------------------------------------------
    # Load embedding model
    # --------------------------------------------------------

    print("Loading embedding model...")

    model = SentenceTransformer(MODEL_NAME)

    print("Model loaded.")
    print()

    # --------------------------------------------------------
    # Database
    # --------------------------------------------------------

    print("Connecting to PostgreSQL...")

    conn = psycopg2.connect(DATABASE_URL)

    print("Database connection: OK")
    print()

    try:

        processed = 0

        # ----------------------------------------------------
        # Process batches
        # ----------------------------------------------------

        for start in range(0, len(documents), BATCH_SIZE):

            batch = documents[
                start:start + BATCH_SIZE
            ]

            print(
                f"Embedding "
                f"{start + 1}-"
                f"{start + len(batch)}/"
                f"{len(documents)}..."
            )

            texts = [
                document["text"]
                for document in batch
            ]

            # ------------------------------------------------
            # Generate embeddings
            # ------------------------------------------------

            embeddings = model.encode(
                texts,
                batch_size=BATCH_SIZE,
                normalize_embeddings=True,
                show_progress_bar=False,
            )

            if len(embeddings) != len(batch):
                raise RuntimeError(
                    "Embedding count mismatch."
                )

            # ------------------------------------------------
            # Insert into PostgreSQL
            # ------------------------------------------------

            cursor = conn.cursor()

            try:

                for document, embedding in zip(
                    batch,
                    embeddings
                ):

                    vector = (
                        "["
                        + ",".join(
                            str(float(x))
                            for x in embedding
                        )
                        + "]"
                    )

                    metadata = json.dumps(
                        document.get("metadata", {}),
                        ensure_ascii=False,
                    )

                    cursor.execute(
                        """
                        INSERT INTO location_embedding (
                            location_id,
                            content,
                            embedding,
                            metadata
                        )
                        VALUES (
                            %s,
                            %s,
                            %s::vector,
                            %s::jsonb
                        )
                        ON CONFLICT (location_id)
                        DO UPDATE SET
                            content = EXCLUDED.content,
                            embedding = EXCLUDED.embedding,
                            metadata = EXCLUDED.metadata,
                            updated_at = NOW()
                        """,
                        (
                            document["id"],
                            document["text"],
                            vector,
                            metadata,
                        ),
                    )

                conn.commit()

            except Exception:

                conn.rollback()
                raise

            finally:

                cursor.close()

            processed += len(batch)

            print(
                f"  ✓ {processed}/{len(documents)}"
            )

            print()

        # ----------------------------------------------------
        # Finish
        # ----------------------------------------------------

        print("=" * 40)
        print(" EMBEDDING COMPLETED")
        print("=" * 40)

        print(f"Processed : {processed}")

    finally:

        conn.close()


if __name__ == "__main__":
    main()