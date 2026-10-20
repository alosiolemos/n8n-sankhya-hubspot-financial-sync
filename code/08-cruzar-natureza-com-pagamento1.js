function garantirArray(x) {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

const data = $('Obter Entities').first().json;

const entities = garantirArray(data.entities);
const naturezas = garantirArray(data.natureza);
const itensNota = garantirArray(data.item_nota);

// Mapeia código da natureza → descrição
const naturezaMap = {};
naturezas.forEach(nat => {
  naturezaMap[nat.f0.$] = nat.f1.$;
});

function formatarValor(valor) {
  const numero = Number(valor);
  if (isNaN(numero)) return 'valor inválido';
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function formatarProduto(nome) {
  if (!nome) return '';
  // Remove "RECEITA SAAS - " e deixa apenas primeira letra maiúscula
  let nomeFormatado = nome.replace(/^RECEITA SAAS - /i, '');
  return nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1).toLowerCase();
}

let linhas = [];

entities.forEach(ent => {
  const codigoNatureza = ent.f5?.$;
  const descricaoNatureza = naturezaMap[codigoNatureza] || `<DESCRIÇÃO (${codigoNatureza})>`;
  const valor = Number(ent.f1?.$) || 0;
  const numeroNota = ent.f6?.$ || '';

  // Pega produtos dessa nota, com valores
  const produtos = itensNota
    .filter(it => it.f2?.$ === numeroNota) // f2 = NUNOTA
    .map(it => {
      const nome = formatarProduto(it.f4?.$); // descrição
      const valorItem = formatarValor(it.f1?.$); // valor total
      return `${nome}: ${valorItem}`;
    });

  // Remove duplicados exatos
  const produtosUnicos = [...new Set(produtos)];

  // Monta a linha resumida
  let linha = `${descricaoNatureza}: ${formatarValor(valor)}                                          (${produtosUnicos.join(' & ')})`;

  linhas.push(linha);
});

return [
  {
    json: {
      observacoes: linhas.join("                                                                            ")
    }
  }
];
