-- Enum para roles de usuário
CREATE TYPE public.app_role AS ENUM ('admin', 'ambassador');

-- Enum para status do embaixador
CREATE TYPE public.ambassador_status AS ENUM ('active', 'suspended', 'blocked');

-- Tabela de roles de usuário (seguindo boas práticas de segurança)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Função security definer para verificar roles (evita recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Tabela principal de embaixadores
CREATE TABLE public.ambassadors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    referral_code TEXT NOT NULL UNIQUE,
    status ambassador_status NOT NULL DEFAULT 'active',
    commission_rate NUMERIC(5,2) NOT NULL DEFAULT 20.00, -- 20% padrão
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    bonus_paid_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de cliques em links de indicação
CREATE TABLE public.referral_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ambassador_id UUID NOT NULL REFERENCES public.ambassadors(id) ON DELETE CASCADE,
    ip_hash TEXT, -- Hash do IP para privacidade
    user_agent TEXT,
    referrer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de clientes indicados
CREATE TABLE public.referral_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ambassador_id UUID NOT NULL REFERENCES public.ambassadors(id) ON DELETE CASCADE,
    customer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    stripe_customer_id TEXT,
    subscription_status TEXT NOT NULL DEFAULT 'pending', -- pending, trial, active, canceled, churned
    first_payment_at TIMESTAMP WITH TIME ZONE,
    last_payment_at TIMESTAMP WITH TIME ZONE,
    total_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de comissões
CREATE TABLE public.ambassador_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ambassador_id UUID NOT NULL REFERENCES public.ambassadors(id) ON DELETE CASCADE,
    referral_customer_id UUID NOT NULL REFERENCES public.referral_customers(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    payment_period_start DATE NOT NULL,
    payment_period_end DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, paid
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassadors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassador_commissions ENABLE ROW LEVEL SECURITY;

-- Políticas para user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para ambassadors
CREATE POLICY "Ambassadors can view their own data"
ON public.ambassadors FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Ambassadors can update terms acceptance"
ON public.ambassadors FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ambassadors"
ON public.ambassadors FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para referral_clicks
CREATE POLICY "Ambassadors can view their own clicks"
ON public.referral_clicks FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.ambassadors
        WHERE id = referral_clicks.ambassador_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all clicks"
ON public.referral_clicks FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert clicks"
ON public.referral_clicks FOR INSERT
WITH CHECK (true);

-- Políticas para referral_customers
CREATE POLICY "Ambassadors can view their own customers"
ON public.referral_customers FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.ambassadors
        WHERE id = referral_customers.ambassador_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage all customers"
ON public.referral_customers FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para ambassador_commissions
CREATE POLICY "Ambassadors can view their own commissions"
ON public.ambassador_commissions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.ambassadors
        WHERE id = ambassador_commissions.ambassador_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage all commissions"
ON public.ambassador_commissions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Função para gerar código de referência único
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
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

-- Função para contar clientes ativos de um embaixador
CREATE OR REPLACE FUNCTION public.get_ambassador_active_customers(ambassador_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)::INTEGER
    FROM public.referral_customers
    WHERE ambassador_id = ambassador_uuid
    AND subscription_status = 'active'
$$;

-- Trigger para atualizar updated_at nos ambassadors
CREATE TRIGGER update_ambassadors_updated_at
BEFORE UPDATE ON public.ambassadors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at nos referral_customers
CREATE TRIGGER update_referral_customers_updated_at
BEFORE UPDATE ON public.referral_customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_ambassadors_referral_code ON public.ambassadors(referral_code);
CREATE INDEX idx_ambassadors_user_id ON public.ambassadors(user_id);
CREATE INDEX idx_ambassadors_status ON public.ambassadors(status);
CREATE INDEX idx_referral_clicks_ambassador_id ON public.referral_clicks(ambassador_id);
CREATE INDEX idx_referral_clicks_created_at ON public.referral_clicks(created_at);
CREATE INDEX idx_referral_customers_ambassador_id ON public.referral_customers(ambassador_id);
CREATE INDEX idx_referral_customers_status ON public.referral_customers(subscription_status);
CREATE INDEX idx_ambassador_commissions_ambassador_id ON public.ambassador_commissions(ambassador_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);