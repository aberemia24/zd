-- Migration: create custom_categories table for user-defined categories/subcategories
CREATE TABLE IF NOT EXISTS custom_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER DEFAULT 1
);

ALTER TABLE custom_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own categories"
  ON custom_categories
  FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE custom_categories 
ADD CONSTRAINT check_category_data 
CHECK (jsonb_typeof(category_data) = 'object');
