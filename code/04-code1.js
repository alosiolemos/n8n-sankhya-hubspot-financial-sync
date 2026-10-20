const items = $input.all(); // Obtém todos os itens de entrada
let output = []; // Array para armazenar os itens divididos

// Itera sobre os itens do JSON de entrada
items.forEach(item => {
  // Itera sobre os resultados do JSON
  item.json.results.forEach(result => {
    // Adiciona cada registro como um item separado no array de saída
    output.push({
      json: result
    });
  });
});

// Retorna os itens individualmente
return output;
