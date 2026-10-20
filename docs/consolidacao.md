# Consolidação financeira

Os dois caminhos combinam pagamentos, natureza financeira e itens da nota. Campos como entities podem vir como objeto único ou array; o tratamento normaliza esses formatos antes de percorrer os dados.

## Soma dos valores

PAGAMENTO ACUMULADO e Pagamento leem f0 a f3 e calculam ValorPago, NRUNICO, UltimoPagamento e UltimoVencimento. A soma é arredondada para duas casas.

As datas e a referência do título são sobrescritas ao percorrer os registros. Portanto representam o último item válido percorrido, não uma ordenação explícita pela maior data. O título individual retornado também não representa sozinho todos os títulos incluídos na soma.

Na versão pública, declarei lastNRUNICO como null e tratei entities ausente como lista vazia. Isso evita variável implícita e falha de entrada vazia. Não alterei os arquivos originais nem acrescentei ordenação inexistente.

## Natureza e produtos

Cruzar Natureza com Pagamento e sua variante montam um mapa CODNAT → descrição. Para cada título, procuram itens associados à mesma NUNOTA, formatam valores em reais e montam observações. Set remove textos de produto exatamente iguais; não é uma reconciliação de toda a base financeira.

Duplicar um título na entrada ainda pode inflar a soma. A comparação de NUNOTA usa igualdade estrita; diferenças entre número e string precisam ser verificadas.

## Atualização do CRM

Os dois PATCHs atualizam status_inadimplencia como Adimplente, valor do pagamento, data do pagamento, vencimento, ID de invoice e observações. Não foi encontrada uma escrita explícita de Inadimplente ou Ativo/Inativo nessa versão.

Um pagamento identificado no mês não demonstra que todos os títulos do cliente estão em dia. A evolução para uma classificação financeira completa exigiria considerar títulos vencidos em aberto, pagamentos parciais, escopo do período e regras acordadas com o Financeiro.
