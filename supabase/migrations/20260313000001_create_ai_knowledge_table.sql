-- Create ai_knowledge table for storing CMS content embeddings
create table ai_knowledge (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(1536), -- OpenAI embeddings are 1536 dimensions
  source_type text not null, -- e.g., 'post', 'product', 'caseStudy'
  source_id text not null, -- Sanity document ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for faster querying
create index idx_ai_knowledge_source on ai_knowledge(source_type, source_id);
create index idx_ai_knowledge_created_at on ai_knowledge(created_at);

-- Add comment for documentation
comment on table ai_knowledge is 'Store CMS content embeddings for AI knowledge layer';
comment on column ai_knowledge.embedding is 'OpenAI embedding vector (1536 dimensions)';