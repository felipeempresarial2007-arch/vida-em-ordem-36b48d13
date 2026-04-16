

# Plan: Melhorar Landing Page e Destacar Plano Anual

## Problema Identificado
A seção de preços **tem** os dois planos no codigo (linhas 537-639), mas:
1. Todos os CTAs ao longo da pagina ("Garantir minha vaga") redirecionam **apenas** para o plano mensal
2. No mobile, o plano anual fica abaixo da dobra na seção de precos, dificil de ver
3. Nao ha menção ao plano anual fora da seção de pricing

## Mudanças Propostas

### 1. Adicionar toggle Mensal/Anual na seção de preços
- Colocar um seletor visual acima dos cards para alternar entre os planos
- O plano anual será o **padrão selecionado** (pre-selected) para maximizar conversão

### 2. Atualizar CTAs principais para redirecionar ao pricing
- Os botões "Garantir minha vaga" no hero e nas outras seções farão **scroll suave** para a seção `#pricing` em vez de abrir checkout direto — deixando o usuario escolher o plano
- O CTA final mantém redirecionamento direto ao plano anual (melhor valor)

### 3. Adicionar banner de economia no hero
- Incluir uma linha sutil no hero: "A partir de R$ 17,57/mês" para reforçar o preço anual desde o topo

### 4. Reordenar cards no mobile
- No mobile (coluna única), o plano **Anual** aparecerá **primeiro** (acima do mensal) por ser o mais popular

## Arquivo Editado
- `src/pages/Landing.tsx`

