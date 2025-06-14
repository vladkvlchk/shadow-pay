-- Create the payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(20, 8) NOT NULL,
  comment TEXT,
  recipient_address VARCHAR(42) NOT NULL,
  sender_address VARCHAR(42),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')),
  tx_hash VARCHAR(66),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for demo purposes)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations on payments" ON payments
  FOR ALL USING (true);
