import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const REFERRAL_COOKIE_KEY = 'focus30_ref';
const REFERRAL_COOKIE_DAYS = 60;

// Função para definir cookie
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Função para ler cookie
function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

// Função para obter o código de referência salvo
export function getStoredReferralCode(): string | null {
  return getCookie(REFERRAL_COOKIE_KEY);
}

// Função para limpar o código de referência
export function clearReferralCode() {
  document.cookie = `${REFERRAL_COOKIE_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// Hook para capturar e rastrear referências
export function useReferralTracking() {
  useEffect(() => {
    const captureReferral = async () => {
      // Verificar se há parâmetro ref na URL
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      
      if (!refCode) return;

      // Verificar se já temos um código de referência diferente salvo
      const existingCode = getCookie(REFERRAL_COOKIE_KEY);
      if (existingCode && existingCode === refCode) {
        // Já temos o mesmo código, não precisa fazer nada
        return;
      }

      try {
        // Buscar o embaixador pelo código
        const { data: ambassador, error: ambassadorError } = await supabase
          .from('ambassadors')
          .select('id, status')
          .eq('referral_code', refCode.toUpperCase())
          .eq('status', 'active')
          .maybeSingle();

        if (ambassadorError || !ambassador) {
          console.log('Código de referência inválido ou embaixador inativo');
          return;
        }

        // Salvar o código no cookie por 60 dias
        setCookie(REFERRAL_COOKIE_KEY, refCode.toUpperCase(), REFERRAL_COOKIE_DAYS);

        // Registrar o clique
        const ipHash = await getIpHash();
        
        await supabase
          .from('referral_clicks')
          .insert({
            ambassador_id: ambassador.id,
            ip_hash: ipHash,
            user_agent: navigator.userAgent.substring(0, 500),
            referrer_url: document.referrer || null,
          });

        console.log('Referral tracked:', refCode);
        
        // Limpar o parâmetro da URL sem recarregar a página
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('ref');
        window.history.replaceState({}, '', newUrl.toString());

      } catch (error) {
        console.error('Error tracking referral:', error);
      }
    };

    captureReferral();
  }, []);
}

// Gerar hash do IP para privacidade
async function getIpHash(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    const ip = data.ip;
    
    // Hash simples do IP
    const encoder = new TextEncoder();
    const data2 = encoder.encode(ip);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data2);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
  } catch {
    return 'unknown';
  }
}
