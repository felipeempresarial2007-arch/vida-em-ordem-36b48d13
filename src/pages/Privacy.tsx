import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 py-4">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <Link to="/landing" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Logo size="sm" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-sm text-muted-foreground space-y-6">
          <p><strong className="text-foreground">Última atualização:</strong> 11 de abril de 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Informações que Coletamos</h2>
            <p>Coletamos informações que você fornece ao criar uma conta (nome, e-mail), dados de uso da plataforma e informações de pagamento processadas pela Stripe.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Como Usamos suas Informações</h2>
            <p>Utilizamos seus dados para fornecer e melhorar o serviço, personalizar sua experiência, processar pagamentos e enviar comunicações relacionadas ao serviço.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Coach de IA</h2>
            <p>As conversas com o Coach de IA são processadas para fornecer orientações personalizadas. Não compartilhamos o conteúdo dessas conversas com terceiros.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Compartilhamento de Dados</h2>
            <p>Não vendemos seus dados pessoais. Compartilhamos informações apenas com provedores de serviço essenciais (processamento de pagamento, hospedagem) sob acordos de confidencialidade.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Segurança</h2>
            <p>Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados, incluindo criptografia em trânsito e em repouso.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Cookies e Rastreamento</h2>
            <p>Utilizamos cookies essenciais para o funcionamento da plataforma e ferramentas de análise (Google Analytics e Facebook Pixel) para melhorar a experiência do usuário.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Seus Direitos</h2>
            <p>Você tem direito a acessar, corrigir ou excluir seus dados pessoais. Para exercer esses direitos, entre em contato conosco pelo <a href="https://wa.me/5511920470829" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WhatsApp</a>.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Retenção de Dados</h2>
            <p>Mantemos seus dados enquanto sua conta estiver ativa. Após o cancelamento, seus dados são retidos por 30 dias antes da exclusão permanente.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Alterações nesta Política</h2>
            <p>Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas por e-mail ou aviso na plataforma.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
