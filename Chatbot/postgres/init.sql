CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(768) -- adjust depending on embedding model dimension
);



CREATE TABLE IF NOT EXISTS document_chunks (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,             -- original file name or source
    chunk_index INTEGER NOT NULL,       -- sequential index for the chunk
    content TEXT NOT NULL,              -- text content of this chunk
    embedding VECTOR(768),             -- adjust dimension per embedding model
    created_at TIMESTAMP DEFAULT NOW(), -- record creation time
    UNIQUE (filename, chunk_index)      -- prevent duplicate entries
);


-- Regular indexes
CREATE INDEX IF NOT EXISTS idx_docchunks_filename ON document_chunks (filename);
CREATE INDEX IF NOT EXISTS idx_docchunks_chunk_index ON document_chunks (chunk_index);

-- Vector index (may require existing data)
CREATE INDEX IF NOT EXISTS idx_docchunks_embedding
ON document_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);