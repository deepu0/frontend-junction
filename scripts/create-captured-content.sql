-- Separate bucket for extension/manual captures
-- Completely independent from scraped_experiences pipeline

CREATE TABLE captured_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled',
  original_url TEXT UNIQUE NOT NULL,
  raw_content TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'extension', -- 'extension' | 'manual'
  
  -- AI processing results
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'approved', 'review', 'rejected', 'published')),
  ai_processed BOOLEAN DEFAULT FALSE,
  quality_score INT,
  processed_content TEXT, -- AI-rewritten markdown
  slug TEXT UNIQUE,
  company TEXT,
  role TEXT,
  level TEXT,
  outcome TEXT,
  rounds JSONB DEFAULT '[]',
  topics TEXT[] DEFAULT '{}',
  summary TEXT,
  
  -- Metadata
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_captured_status ON captured_content(status);
CREATE INDEX idx_captured_ai_processed ON captured_content(ai_processed);
CREATE INDEX idx_captured_company ON captured_content(company);
CREATE INDEX idx_captured_slug ON captured_content(slug);

-- RLS
ALTER TABLE captured_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON captured_content FOR SELECT USING (status = 'published');
CREATE POLICY "Service role full access" ON captured_content FOR ALL USING (true) WITH CHECK (true);
