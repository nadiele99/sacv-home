# Contexto: SACV (Sistema de Automação de Cargas Vagas)

> Texto de referência enviado pela usuária em 26/10/2026. Use como fonte para textos, telas e decisões do protótipo.

## O que é

O SACV é um sistema da GELOT (Gerência de Lotação), da SEDUC-AM, que automatiza a identificação de cargas vagas de professores da rede estadual do Amazonas. Hoje a GELOT faz isso à mão, em planilha. Ainda não existe sistema em produção: há um protótipo navegável de baixa fidelidade, uma página HTML única em `sacv-prototipo.vercel.app`, e uma documentação de requisitos.

## Conceitos

- **Carga:** um registro da base com escola, disciplina, turno, comunidade, horas, Motivo, pendência etc.
- **Carga vaga:** carga sem professor que, pela regra, deve virar uma vaga.
- **Ponta de carga:** sobra de carga abaixo do corte de horas. O cliente só diz que as pontas são compartilhadas. O protótipo trata como ponta a carga excluída apenas pela regra de horas.
- **Ciclo:** uma rodada de análise de um tipo, Regular ou Indígena. Há no máximo um ciclo aberto por tipo, e os dois podem estar abertos ao mesmo tempo.

## Quem usa

- **Gerente GELOT:** importa a base, abre e cancela ciclos, revisa cada município (aprova ou reprova com justificativa), consolida o ciclo e extrai o relatório final.
- **Analista GELOT:** reivindica um município (quem clica primeiro leva), consulta as regras em vigor, filtra e analisa as cargas, justifica pendências, exclui manualmente, unifica vagas e fecha o município. Ele não cria nem edita regras.
- **ETL / Equipe de Dados:** só salva a regra de cada tipo (uma para Regular, uma para Indígena). Não importa a base.
- **Equipe de TI:** a única que altera regra, por solicitação formal.
- **Gerente Superior:** é externa ao SACV. Confirma o relatório consolidado, e só depois o processo segue.
- **SIUS:** sistema de origem da base de cargas.
- **Sistema Admissional / GAAS:** o GAAS é o setor de homologação e admissão. O Sistema Admissional gerencia a documentação do candidato e consome as cargas aprovadas pela API.

## Como funciona, passo a passo

1. **Importação:** a Gerente pega o TXT extraído do SIUS e o importa manualmente. O sistema lê o arquivo direto, sem conversão. Arquivo inválido é rejeitado por inteiro. No futuro será automatizado. A base é semanal.
2. **Abertura do ciclo:** a Gerente escolhe o tipo. A regra do tipo vale automaticamente, e ela não escolhe regra. A regra aplicada fica gravada no ciclo, com histórico, e congela quando o ciclo fecha.
3. **Análise:** cada município vira uma unidade de trabalho. O Analista reivindica o município e vê a tabela de cargas, com filtros por coluna e duas visões: Vagas e pendências, e Excluídas.
   - As regras servem para excluir cargas. Elas vêm do formulário do cliente, por exemplo "horas acima de 10" (Indígena, acima de 8), e exceções como Educação Física na E.E. Giovanni Figliuolo.
   - Cargas com Motivo preenchido viram pendências, que o Analista justifica, anexando prova se quiser.
   - Casos manuais, como licença curta, conflito de horário e exclusão de turma, vão por justificativa ou "Excluir manualmente".
   - Carga com campo obrigatório vazio mostra o aviso "Informação insuficiente".
   - Unificar junta cargas que o cliente considera uma única carga: mesmo município, zona, componente curricular, turno, comunidade e modalidade de ensino.
   - Compartilhar (só pontas, no ato da posse ou da alocação do professor) não faz parte do SACV. Acontece depois, entre o Sistema Admissional e o SIUS.
4. **Fechamento:** o município só fecha depois de revisar o Resumo e justificar todas as pendências.
5. **Revisão:** a Gerente aprova ou reprova. Ao reprovar, ela libera a reabertura, o Analista corrige e fecha de novo.
6. **Consolidação:** só com todos os municípios aprovados. Consolidar fecha o ciclo e gera o relatório final.
7. **Saída:** o relatório segue à Gerente Superior. As cargas aprovadas vão por API ao Sistema Admissional.

## Regras de mudança

- Se a TI alterar a regra com ciclo aberto, só voltam para "Reanálise · regra alterada" os municípios já fechados cujas cargas mudam de situação.
- Sem ciclo aberto, o Analista só consulta.
- Importar uma nova base com ciclo aberto cancela o ciclo, após aviso e confirmação.

## Fluxo de dados

- O SIUS fornece a base ao SACV, e nada volta para ele.
- O SACV entrega as cargas aprovadas ao Sistema Admissional por API.
- Depois, a alocação do professor vai para o SIUS, fora do SACV.

## Documentação e fontes

- A Especificação de Requisitos v3.0 contém regras de negócio (RN), requisitos funcionais e não funcionais (RF e RNF), histórias de usuário (US), diagramas e pendências.
- A seção 4 traz as regras de parametrização que o cliente informou no Formulário de Pesquisa e Refinamento, citando o número da pergunta.
- Um segundo documento lista os campos para parametrização da base.
- O cliente é a fonte das regras. O que não vem do formulário está marcado como "Decisão do projeto" ou como pendência.

## Aspectos técnicos

- Protótipo em HTML, CSS e JavaScript, com visual estilo shadcn/ui, ícones Lucide e fonte Inter.
- A integração prevista usa APIs REST com OAuth2/OIDC (Keycloak).
  - **Decisão de 26/10/2026 para este protótipo:** o login fica sem Keycloak, só com usuário e senha.
- Padrão visual: identidade Seduc-AM, com azul institucional, amarelo, branco e verde, e Plus Jakarta Sans nos destaques.

## Pendências em aberto, resumidas

- O cliente precisa confirmar o corte de horas ("acima de 10 horas" ou "a partir de 10 aulas").
- O cliente precisa confirmar a definição de ponta de carga e se Unificar vale para pontas.
- A padronização do campo Motivo e a coluna que distingue Regular de Indígena na base ainda não existem.
- O contrato da ETL e o conteúdo do relatório final também estão em aberto.
