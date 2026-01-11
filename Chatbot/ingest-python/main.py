from fastapi import FastAPI, UploadFile
from unstructured.partition.pdf import partition_pdf
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from pgvector.psycopg import register_vector
import psycopg
import os
import tempfile
import logging

# -----------------------------------------------------------------------------
# 🔧 Environment configuration
# -----------------------------------------------------------------------------
DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://user:password@postgres:5432/chatbot"
)

# point to your Windows-hosted Ollama
OLLAMA_URL = os.environ.get(
    "OLLAMA_URL",
    "http://host.docker.internal:11434"
)

# -----------------------------------------------------------------------------
# 🚀 FastAPI setup
# -----------------------------------------------------------------------------
app = FastAPI(title="Python PDF Ingestion Service")

# -----------------------------------------------------------------------------
# 🧠 Initialize DB connection and register vector support
# -----------------------------------------------------------------------------
conn = psycopg.connect(DB_URL)
register_vector(conn)

# -----------------------------------------------------------------------------
# 🧩 Initialize embedding model (calls Ollama on your Windows host)
# -----------------------------------------------------------------------------
emb = OllamaEmbeddings(
    model="nomic-embed-text",   # or another model you have pulled in Ollama
    base_url=OLLAMA_URL         # critical: connect to host OlLama server
)

# -----------------------------------------------------------------------------
# 📥 PDF ingestion endpoint
# -----------------------------------------------------------------------------
@app.post("/ingest/pdf")
async def ingest_pdf(file: UploadFile):
    """Upload a PDF, extract text, chunk, embed via Ollama, and store in Postgres."""
    # Save the uploaded PDF to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Step 1️⃣: Extract text elements using Unstructured
    elements = partition_pdf(filename=tmp_path)
    text = "\n\n".join([el.text for el in elements if el.text])

    # Step 2️⃣: Split into logical chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)

    # Add some logging here . 
    logging.info(f"✅ Extracted {len(elements)} elements from {tmp_path}")
    preview = text[:1000].replace("\n", " ")  # Limit to first ~1000 chars
    logging.info(f"📄 Text preview: {preview}")


    # Step 3️⃣: Store embeddings into Postgres
    inserted = 0
    with conn.cursor() as cur:
        for i, chunk in enumerate(chunks):
            chunk_text = chunk.strip()
            if not chunk_text:
                continue

            # ---- Generate embedding via your Windows host Ollama ----
            vector = emb.embed_query(chunk_text)

            # ---- Insert into the document_chunks table ----
            cur.execute(
                """
                INSERT INTO document_chunks (filename, chunk_index, content, embedding)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (filename, chunk_index) DO NOTHING;
                """,
                (file.filename, i, chunk_text, vector),
            )
            inserted += 1

        conn.commit()

    return {
        "filename": file.filename,
        "inserted_chunks": inserted,
        "message": f"Inserted {inserted} chunks from {file.filename}"
    }

# -----------------------------------------------------------------------------
# 🩺 Health check endpoint
# -----------------------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok", "ollama_url": OLLAMA_URL, "db": DB_URL}