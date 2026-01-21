-- Create table for daily agenda/schedule items
CREATE TABLE public.daily_agenda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  time_start TIME,
  time_end TIME,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups by user and date
CREATE INDEX idx_daily_agenda_user_date ON public.daily_agenda(user_id, date);

-- Enable Row Level Security
ALTER TABLE public.daily_agenda ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own agenda items" 
ON public.daily_agenda 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agenda items" 
ON public.daily_agenda 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agenda items" 
ON public.daily_agenda 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agenda items" 
ON public.daily_agenda 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_agenda_updated_at
BEFORE UPDATE ON public.daily_agenda
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();