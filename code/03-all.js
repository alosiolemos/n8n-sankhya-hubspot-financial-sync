const allData = []
let counter = 0;

do {
  try {
    // Verifique os dados retornados para cada iteração
    const items = $items("Paginação HubSpot", 0, counter).map(item => item.json.results);

    allData.push.apply(allData, items[0]);
  } catch (error) {

    return allData;
  }

  counter++;
} while(true);
