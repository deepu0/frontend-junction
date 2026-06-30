CREATE TABLE IF NOT EXISTS question_bank (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  question TEXT NOT NULL,
  type TEXT,
  difficulty TEXT,
  topics TEXT[] DEFAULT '{}',
  frequency INT DEFAULT 1,
  source_experience_ids UUID[] DEFAULT '{}',
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company, question)
);

CREATE INDEX idx_question_bank_company ON question_bank(company);
CREATE INDEX idx_question_bank_type ON question_bank(type);
CREATE INDEX idx_question_bank_frequency ON question_bank(frequency DESC);
