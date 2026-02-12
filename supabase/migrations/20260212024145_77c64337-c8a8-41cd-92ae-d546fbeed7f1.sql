
-- Add missing DELETE policies for LGPD compliance
CREATE POLICY "Users can delete own challenge progress"
ON public.challenge_progress FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily missions"
ON public.daily_missions FOR DELETE
USING (auth.uid() = user_id);

-- Add missing DELETE policies on other user tables for data ownership
CREATE POLICY "Users can delete own daily habits"
ON public.daily_habits FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own energy logs"
ON public.energy_logs FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial entries"
ON public.financial_entries FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
ON public.goals FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily agenda"
ON public.daily_agenda FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminder settings"
ON public.reminder_settings FOR DELETE
USING (auth.uid() = user_id);
