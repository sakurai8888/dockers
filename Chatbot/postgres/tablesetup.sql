CREATE EXTENSION IF NOT EXISTS vector;


CREATE TABLE IF NOT EXISTS faq (
  id SERIAL PRIMARY KEY,
  question TEXT,
  answer TEXT,
  embedding vector(768) -- adjust dim based on Ollama model output
);