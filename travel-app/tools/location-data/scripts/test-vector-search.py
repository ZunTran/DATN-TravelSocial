import os
from pathlib import Path

import psycopg2
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer


BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_NAME = "BAAI/bge-m3"
TOP_K = 10


def main():
    print("=" * 60)
    print(" VECTOR SEARCH TEST")
    print("=" * 60)

    # Load environment
    load_dotenv(BASE_DIR / ".env")

    DATABASE_URL = os.getenv("EMBEDDING_DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError(
            "EMBEDDING_DATABASE_URL is missing from .env"
        )

    # Load model
    print(f"Model: {MODEL_NAME}")
    print("Loading embedding model...")

    model = SentenceTransformer(MODEL_NAME)

    print("Model loaded.")
    print()

    # Connect DB
    print("Connecting to PostgreSQL...")

    conn = psycopg2.connect(DATABASE_URL)

    print("Database connection: OK")
    print()

    try:
        while True:
            query = input(
                "Nhập câu tìm kiếm (Enter để thoát): "
            ).strip()

            if not query:
                break

            print()
            print(f"Query: {query}")
            print("Creating query embedding...")

            query_embedding = model.encode(
                query,
                normalize_embeddings=True,
            )

            vector = "[" + ",".join(
                str(float(x)) for x in query_embedding
            ) + "]"

            cursor = conn.cursor()

            cursor.execute(
                """
                SELECT
                    location_id,
                    metadata->>'name' AS name,
                    metadata->>'category' AS category,
                    metadata->>'province' AS province,
                    metadata->>'estimated_cost' AS estimated_cost,
                    metadata->>'duration_minutes' AS duration_minutes,
                    1 - (embedding <=> %s::vector) AS similarity
                FROM location_embedding
                ORDER BY embedding <=> %s::vector
                LIMIT %s
                """,
                (
                    vector,
                    vector,
                    TOP_K,
                ),
            )

            results = cursor.fetchall()

            cursor.close()

            print()
            print("-" * 60)
            print(f"TOP {TOP_K} RESULTS")
            print("-" * 60)

            for index, row in enumerate(results, start=1):
                (
                    location_id,
                    name,
                    category,
                    province,
                    estimated_cost,
                    duration_minutes,
                    similarity,
                ) = row

                print(
                    f"{index}. {name}"
                )
                print(
                    f"   Category   : {category}"
                )
                print(
                    f"   Province   : {province}"
                )
                print(
                    f"   Cost       : {estimated_cost}"
                )
                print(
                    f"   Duration   : {duration_minutes} min"
                )
                print(
                    f"   Similarity : {similarity:.4f}"
                )
                print(
                    f"   ID         : {location_id}"
                )
                print()

    finally:
        conn.close()

    print("Connection closed.")


if __name__ == "__main__":
    main()