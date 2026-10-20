const items = $input.all(); // Obtém todos os itens de entrada
let totalSum = 0; // Variável para armazenar a soma total
let lastPaymentDate = ''; // Variável para armazenar a última data de pagamento
let lastDueDate = '';
let lastNRUNICO = null; // Variável para armazenar a última data de vencimento

items.forEach(item => {
  // Garante que entities seja tratado como array, mesmo se houver apenas um pagamento
  const entities = Array.isArray(item.json.entities) ? item.json.entities : item.json.entities ? [item.json.entities] : [];

  entities.forEach(entity => {
    // Obtém valores de F0, F1, F2 e F3
    const NRUNICO = parseFloat(entity.f0?.$) || 0; // NRO Unico
    const valorPago = parseFloat(entity.f1?.$) || 0; // Converte F1 para número (valor pago)
    const dataPagamento = entity.f2?.$ || ''; // Data de Pagamento (F2)
    const dataVencimento = entity.f3?.$ || ''; // Data de Vencimento (F3)

    // Soma o valor pago
    totalSum += valorPago;

    // Atualiza a última Data de Pagamento (F2)
    if (dataPagamento) {
      lastPaymentDate = dataPagamento;
    }

    // Atualiza a última NR_Unica (F0)
    if (NRUNICO) {
      lastNRUNICO = NRUNICO;
    }

    // Atualiza a última Data de Vencimento (F3)
    if (dataVencimento) {
      lastDueDate = dataVencimento;
    }
  });
});

// Arredonda a soma para 2 casas decimais
totalSum = parseFloat(totalSum.toFixed(2));

// Retorna o resultado no formato desejado
return [{
  json: {
    NRUNICO:lastNRUNICO,
    ValorPago: totalSum,
    UltimoPagamento: lastPaymentDate,
    UltimoVencimento: lastDueDate
  }
}];
