# Paginação, rotina e reprocessamento

Consulta HubSpot e Paginação HubSpot usam busca de contas e cursor after. paginacao3 inicia em zero; prox_pag3 lê paging.next.after. all agrega resultados das execuções anteriores e encerra ao capturar uma exceção de leitura. O código não distingue explicitamente fim de paginação de qualquer outro erro capturado.

Os loops percorrem contas e consultam o ERP por suas referências de parceiro/matriz. Dois caminhos com consultas e tratamentos semelhantes estão presentes no export; a documentação não os apresenta como duas fontes independentes de faturamento nem soma seus resultados entre si.

Datas calcula o primeiro e último dia do mês corrente pelo relógio do ambiente. Não existe janela histórica configurável nesse código. O cron exportado é 01:00, sem timezone explícito; revisar o fuso e o horário operacional desejado antes de habilitar a rotina.

As atualizações no HubSpot usam PATCH e possuem retryOnFail. Repetir a escrita pode substituir o mesmo conjunto de propriedades, mas o export não demonstra reconciliação transacional, garantia de entrega ou tratamento completo de falhas entre todas as etapas.

Para adaptar, conferir quantidade de contas, total de títulos, paginação do ERP e correspondência parceiro/matriz. A duração próxima de um minuto é minha observação operacional, não resultado dos testes locais.
