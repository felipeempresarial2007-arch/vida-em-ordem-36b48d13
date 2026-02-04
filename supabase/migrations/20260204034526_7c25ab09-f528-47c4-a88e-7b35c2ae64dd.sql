-- Corrigir função generate_referral_code com search_path
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$;

-- Remover política permissiva de cliques e substituir por uma mais segura
DROP POLICY IF EXISTS "Anyone can insert clicks" ON public.referral_clicks;

-- Criar política que permite inserir cliques apenas se o embaixador existe e está ativo
CREATE POLICY "Insert clicks for active ambassadors"
ON public.referral_clicks FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.ambassadors
        WHERE id = ambassador_id
        AND status = 'active'
    )
);