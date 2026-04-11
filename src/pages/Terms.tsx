import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Terms() {
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
        <h1 className="text-3xl font-bold text-foreground mb-8">Termos de Uso</h1>
        
        <div className="prose prose-sm text-muted-foreground space-y-6">
          <p><strong className="text-foreground">Última atualização:</strong> 11 de abril de 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar o FOCUS 30, você concorda com estes Termos de Uso. Caso não concorde, por favor, não utilize a plataforma.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Descrição do Serviço</h2>
            <p>O FOCUS 30 é uma plataforma digital de organização pessoal que oferece missões diárias, ferramentas de gestão financeira, rotina, ambiente e metas, além de um Coach de IA disponível 24/7.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Conta e Registro</h2>
            <p>Para utilizar o serviço, você deve criar uma conta fornecendo informações verdadeiras e atualizadas. Você é responsável por manter a confidencialidade da sua conta.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Período de Teste</h2>
            <p>O FOCUS 30 oferece um período de teste gratuito de 24 horas. Após este período, é necessário assinar um dos planos disponíveis para continuar utilizando a plataforma.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Pagamento e Assinatura</h2>
            <p>Os pagamentos são processados de forma segura pela Stripe. A assinatura é renovada automaticamente no período contratado (mensal ou anual). Você pode cancelar a qualquer momento.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Cancelamento</h2>
            <p>Você pode cancelar sua assinatura a qualquer momento. O acesso permanece ativo até o final do período já pago. Não há reembolso proporcional.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Propriedade Intelectual</h2>
            <p>Todo o conteúdo do FOCUS 30, incluindo textos, imagens, design e funcionalidades, é protegido por direitos autorais e não pode ser reproduzido sem autorização.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Limitação de Responsabilidade</h2>
            <p>O FOCUS 30 é uma ferramenta de apoio à organização pessoal. Não garantimos resultados específicos, pois estes dependem do comprometimento individual de cada usuário.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Contato</h2>
            <p>Para dúvidas sobre estes termos, entre em contato pelo nosso <a href="https://wa.me/5511920470829" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WhatsApp</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
