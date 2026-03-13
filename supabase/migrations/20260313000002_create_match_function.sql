-- Create function for matching AI knowledge items using vector similarity
create extension if not exists vector;

create or replace function match_ai_knowledge (
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  embedding vector(1536),
  source_type text,
  source_id text,
  created_at timestamp with time zone,
  similarity float
)
language sql
as $$
  select
    ai_knowledge.id,
    ai_knowledge.content,
    ai_knowledge.embedding,
    ai_knowledge.source_type,
    ai_knowledge.source_id,
    ai_knowledge.created_at,
    1 - (ai_knowledge.embedding <=> query_embedding) as similarity
  from ai_knowledge
  where 1 - (ai_knowledge.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count
$$;