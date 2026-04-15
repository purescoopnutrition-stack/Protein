CREATE TABLE IF NOT EXISTS home_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    view_all_link TEXT,
    type TEXT NOT NULL CHECK (type IN ('carousel', 'grid', 'tabs')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[], -- For custom filtering
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for home_sections" ON home_sections
    FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admin full access for home_sections" ON home_sections
    FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
