

# Plano: Liberar Acesso de Admin para Sua Conta Atual

## Contexto do Problema

| Conta logada | user_id |
|--------------|---------|
| felipeempresarial2007@gmail.com | c52e4c12-8433-4a6b-aa14-2ce5c9f90389 |
| (conta com admin hoje) | 7abd20d0-c9be-4198-934a-2b1128952eaa |

A role `admin` está vinculada a um usuário antigo que você não tem mais acesso. Precisamos adicionar essa permissão à conta que você usa hoje.

---

## Passo a Passo

### Etapa 1 — Acessar o backend

Vou abrir para você a interface do backend do projeto.

### Etapa 2 — Inserir registro na tabela `user_roles`

Na interface do backend:

1. Navegue até **Database → Tables → user_roles**
2. Clique em **Insert row** (ou "+ Add row")
3. Preencha os campos:

| Campo | Valor |
|-------|-------|
| user_id | `c52e4c12-8433-4a6b-aa14-2ce5c9f90389` |
| role | `admin` |

4. Salve/Confirm

### Etapa 3 — Testar o acesso

1. Faça logout no app
2. Faça login novamente com seu e-mail
3. O link **"Admin"** (ícone de escudo 🛡️) deve aparecer:
   - **Desktop**: na barra lateral esquerda
   - **Mobile**: no menu de configurações (ícone de engrenagem no canto superior direito)
4. Acesse `/admin` e gere seu primeiro código de embaixador

---

## Alternativa (se preferir via SQL)

Se você tiver acesso ao painel "Run SQL" no backend, pode executar:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('c52e4c12-8433-4a6b-aa14-2ce5c9f90389', 'admin');
```

---

## Resumo

- Nenhuma alteração de código é necessária
- Apenas um registro precisa ser adicionado ao banco de dados
- Após isso, você terá acesso completo ao painel de Admin e poderá gerar códigos de embaixador

