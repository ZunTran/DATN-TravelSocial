import os
import json
from typing import Optional

import psycopg2
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

MODEL_NAME = "BAAI/bge-m3"
DEFAULT_LIMIT = 10

load_dotenv()

DATABASE_URL = os.getenv("EMBEDDING_DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "Missing EMBEDDING_DATABASE_URL in .env\n"
        "Example:\n"
        'EMBEDDING_DATABASE_URL="postgresql://admin:password@localhost:5432/travel_db"'
    )

print("Loading embedding model...")
model = SentenceTransformer(MODEL_NAME)
print("Model loaded.")

def get_connection():
    return psycopg2.connect(DATABASE_URL)

def create_query_embedding(query: str):
    """
    Convert user query into BGE-M3 embedding.
    Returns a list with 1024 dimensions.
    """
    embedding = model.encode(
        query,
        normalize_embeddings=True,
    )

    return embedding.tolist()


# ============================================================
# HYBRID SEARCH
# ============================================================

def hybrid_search(
    query: str,
    province: Optional[str] = None,
    category: Optional[str] = None,
    min_cost: Optional[float] = None,
    max_cost: Optional[float] = None,
    min_duration: Optional[int] = None,
    max_duration: Optional[int] = None,
    limit: int = DEFAULT_LIMIT,
):
    """
    Hybrid search:

    1. Convert query -> embedding
    2. Apply structured filters
    3. Rank remaining records using cosine similarity
    """

    query_embedding = create_query_embedding(query)

    conditions = []
    params = []

    # --------------------------------------------------------
    # Province
    # --------------------------------------------------------

    if province:
        conditions.append(
            "metadata->>'province' = %s"
        )
        params.append(province)

    # --------------------------------------------------------
    # Category
    # --------------------------------------------------------

    if category:
        conditions.append(
            "metadata->>'category' = %s"
        )
        params.append(category)

    if min_cost is not None:
        conditions.append(
            """
            NULLIF(metadata->>'estimated_cost', '')::numeric >= %s
            """
        )
        params.append(min_cost)

    if max_cost is not None:
        conditions.append(
            """
            NULLIF(metadata->>'estimated_cost', '')::numeric <= %s
            """
        )
        params.append(max_cost)

    # --------------------------------------------------------
    # Min duration
    # --------------------------------------------------------

    if min_duration is not None:
        conditions.append(
            """
            NULLIF(metadata->>'duration_minutes', '')::numeric >= %s
            """
        )
        params.append(min_duration)

    # --------------------------------------------------------
    # Max duration
    # --------------------------------------------------------

    if max_duration is not None:
        conditions.append(
            """
            NULLIF(metadata->>'duration_minutes', '')::numeric <= %s
            """
        )
        params.append(max_duration)

    # --------------------------------------------------------
    # WHERE
    # --------------------------------------------------------

    where_clause = ""

    if conditions:
        where_clause = "WHERE " + "\nAND ".join(conditions)

    # --------------------------------------------------------
    # SQL
    # --------------------------------------------------------

    sql = f"""
        SELECT
            location_id,

            metadata->>'name' AS name,
            metadata->>'category' AS category,
            metadata->>'province' AS province,
            metadata->>'estimated_cost' AS estimated_cost,
            metadata->>'duration_minutes' AS duration_minutes,
            metadata->>'opening_hours' AS opening_hours,

            1 - (embedding <=> %s::vector) AS similarity

        FROM location_embedding

        {where_clause}

        ORDER BY embedding <=> %s::vector

        LIMIT %s;
    """

    # --------------------------------------------------------
    # Parameters
    #
    # First embedding is used for SELECT similarity.
    # Filter parameters follow.
    # Second embedding is used for ORDER BY.
    # --------------------------------------------------------

    sql_params = [
        str(query_embedding),
        *params,
        str(query_embedding),
        limit,
    ]

    # --------------------------------------------------------
    # Execute
    # --------------------------------------------------------

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(sql, sql_params)

            rows = cursor.fetchall()

    finally:
        connection.close()

    return rows


# ============================================================
# DISPLAY
# ============================================================

def print_results(
    rows,
    query: str,
    province: Optional[str],
    category: Optional[str],
    min_cost: Optional[float],
    max_cost: Optional[float],
    min_duration: Optional[int],
    max_duration: Optional[int],
):
    print()
    print("=" * 70)
    print("HYBRID SEARCH")
    print("=" * 70)

    print(f"Query        : {query}")
    print(f"Province     : {province or '-'}")
    print(f"Category     : {category or '-'}")
    print(f"Min cost     : {min_cost if min_cost is not None else '-'}")
    print(f"Max cost     : {max_cost if max_cost is not None else '-'}")
    print(f"Min duration : {min_duration if min_duration is not None else '-'}")
    print(f"Max duration : {max_duration if max_duration is not None else '-'}")

    print("-" * 70)

    if not rows:
        print("NO RESULTS")
        print("=" * 70)
        return

    print(f"RESULTS: {len(rows)}")
    print("=" * 70)

    for index, row in enumerate(rows, start=1):
        (
            location_id,
            name,
            category_value,
            province_value,
            estimated_cost,
            duration_minutes,
            opening_hours,
            similarity,
        ) = row

        print(f"{index}. {name}")
        print(f"   Category   : {category_value}")
        print(f"   Province   : {province_value}")
        print(f"   Cost       : {estimated_cost}")
        print(f"   Duration   : {duration_minutes} min")
        print(f"   Opening    : {opening_hours}")
        print(f"   Similarity : {float(similarity):.4f}")
        print(f"   ID         : {location_id}")
        print()


# ============================================================
# INPUT HELPERS
# ============================================================

def input_optional_string(prompt: str):
    value = input(prompt).strip()

    if value == "":
        return None

    return value


def input_optional_float(prompt: str):
    value = input(prompt).strip()

    if value == "":
        return None

    try:
        return float(value)
    except ValueError:
        print("Invalid number. Using no filter.")
        return None


def input_optional_int(prompt: str):
    value = input(prompt).strip()

    if value == "":
        return None

    try:
        return int(value)
    except ValueError:
        print("Invalid integer. Using no filter.")
        return None


# ============================================================
# INTERACTIVE MODE
# ============================================================

def interactive_mode():
    print()
    print("=" * 70)
    print("HYBRID SEARCH TEST")
    print("=" * 70)
    print("Press ENTER on an optional filter to skip it.")
    print("Type 'exit' as query to quit.")
    print()

    while True:

        query = input("Nhập câu tìm kiếm: ").strip()

        if not query:
            continue

        if query.lower() in {"exit", "quit", "q"}:
            print("Exit.")
            break

        print()
        print("---- FILTERS ----")

        province = input_optional_string(
            "Province [default: Đà Nẵng]: "
        )

        if province is None:
            province = "Đà Nẵng"

        category = input_optional_string(
            "Category [empty = all]: "
        )

        min_cost = input_optional_float(
            "Min cost [empty = no limit]: "
        )

        max_cost = input_optional_float(
            "Max cost [empty = no limit]: "
        )

        min_duration = input_optional_int(
            "Min duration (minutes) [empty = no limit]: "
        )

        max_duration = input_optional_int(
            "Max duration (minutes) [empty = no limit]: "
        )

        limit = input_optional_int(
            "Limit [default: 10]: "
        )

        if limit is None:
            limit = DEFAULT_LIMIT

        print()
        print("Creating query embedding...")

        try:
            rows = hybrid_search(
                query=query,
                province=province,
                category=category,
                min_cost=min_cost,
                max_cost=max_cost,
                min_duration=min_duration,
                max_duration=max_duration,
                limit=limit,
            )

            print_results(
                rows=rows,
                query=query,
                province=province,
                category=category,
                min_cost=min_cost,
                max_cost=max_cost,
                min_duration=min_duration,
                max_duration=max_duration,
            )

        except Exception as error:
            print()
            print("ERROR:")
            print(error)

        print()


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    interactive_mode()