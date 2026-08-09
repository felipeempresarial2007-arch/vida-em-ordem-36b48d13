import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sentry } from "@/lib/sentry";

export default function SentryTest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 space-y-6 text-center">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Teste de monitoramento
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Use os botões abaixo para enviar um evento de teste ao Sentry e
              confirmar que o rastreamento de erros está ativo.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => {
                throw new Error("This is your first error!");
              }}
            >
              Break the world
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                Sentry.captureException(
                  new Error("Evento de teste capturado manualmente")
                );
              }}
            >
              Enviar evento capturado
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Rota interna de diagnóstico. Remova quando o teste for concluído.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
