-- Create energy_logs table for tracking energy levels throughout the day
CREATE TABLE public.energy_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_slot TEXT NOT NULL, -- 'morning', 'late_morning', 'afternoon', 'late_afternoon', 'evening'
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 5),
  activity TEXT, -- What the user was doing
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.energy_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own energy logs" 
ON public.energy_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own energy logs" 
ON public.energy_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own energy logs" 
ON public.energy_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own energy logs" 
ON public.energy_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate entries for same time slot on same day
CREATE UNIQUE INDEX energy_logs_user_date_slot_unique ON public.energy_logs (user_id, date, time_slot);