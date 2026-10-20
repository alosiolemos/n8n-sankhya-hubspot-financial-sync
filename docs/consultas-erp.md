# Critérios SQL dentro das requisições

A integração não consulta o banco do ERP por um conector SQL direto. Ela envia requisições ao Gateway Sankhya, com critérios que incluem SQL e subconsultas.

Nos nós Valores Pagos e Consultar títulos pagos, o payload utiliza dataset e criteria.expression. O critério contém EXISTS sobre TGFPAR, relacionando CODPARC ao CODPARCMATRIZ obtido da conta HubSpot.

Também restringe RECDESP = 1, PROVISAO = N, DHBAIXA preenchida e data da baixa dentro do mês corrente. A consulta trata valores baixados, não simplesmente valores faturados, títulos em aberto ou receita contábil reconhecida.

## Campos solicitados

| Campo | Uso no tratamento |
| --- | --- |
| NUFIN | Referência do título financeiro |
| VLRBAIXA | Valor baixado |
| DHBAIXA | Data da baixa |
| DTVENC | Vencimento |
| CODPARC | Parceiro |
| CODNAT | Natureza financeira |
| CabecalhoNota.NUNOTA / NUMNOTA | Referência da nota e associação aos itens |

Outras requisições obtêm naturezas e itens/produtos para enriquecer o texto gravado no CRM. A definição dos campos e entidades depende do ambiente ERP.

As requisições Sankhya inspecionadas usam offsetPage 0. Não foi identificado um loop próprio para todas as páginas do ERP. A paginação explícita do fluxo é a da busca HubSpot; retorno com vários itens e paginação da API são problemas diferentes.

As datas são produzidas como texto pt-BR e inseridas nas expressões. Validar sintaxe, delimitadores, fuso e contrato da API no ambiente de teste. Não houve execução dessas consultas nesta preparação.
