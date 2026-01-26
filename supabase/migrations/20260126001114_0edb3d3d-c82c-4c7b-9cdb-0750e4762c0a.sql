-- Create a table for cake orders
CREATE TABLE public.cake_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Customer information
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  event_date DATE,
  
  -- Cake configuration (stored as JSON for flexibility)
  cake_config JSONB NOT NULL DEFAULT '{}',
  
  -- Order details
  guest_count INTEGER NOT NULL DEFAULT 50,
  estimated_price DECIMAL(10,2),
  special_requests TEXT,
  
  -- Reference image URLs (from storage bucket)
  reference_images TEXT[] DEFAULT '{}',
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'confirmed', 'completed', 'cancelled')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comment for table documentation
COMMENT ON TABLE public.cake_orders IS 'Stores customer cake order requests from the wedding cake builder';

-- Enable Row Level Security
ALTER TABLE public.cake_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to INSERT orders (public form submission)
-- This is intentional for a public lead form
CREATE POLICY "Anyone can submit cake orders"
  ON public.cake_orders
  FOR INSERT
  WITH CHECK (true);

-- Policy: No direct SELECT access (orders viewed via admin/edge functions only)
CREATE POLICY "No direct read access to orders"
  ON public.cake_orders
  FOR SELECT
  USING (false);

-- Policy: No direct UPDATE access (managed via admin/edge functions only)
CREATE POLICY "No direct update access to orders"
  ON public.cake_orders
  FOR UPDATE
  USING (false);

-- Policy: No direct DELETE access
CREATE POLICY "No direct delete access to orders"
  ON public.cake_orders
  FOR DELETE
  USING (false);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cake_orders_updated_at
  BEFORE UPDATE ON public.cake_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for common queries
CREATE INDEX idx_cake_orders_status ON public.cake_orders(status);
CREATE INDEX idx_cake_orders_created_at ON public.cake_orders(created_at DESC);
CREATE INDEX idx_cake_orders_event_date ON public.cake_orders(event_date);