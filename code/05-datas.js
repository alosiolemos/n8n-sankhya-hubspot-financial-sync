const now = new Date(); // Data atual

// Primeiro dia do mês corrente
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
const firstDayFormatted = firstDay.toLocaleDateString('pt-BR');

// Último dia do mês corrente
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
const lastDayFormatted = lastDay.toLocaleDateString('pt-BR');

// Retornar os resultados no formato esperado pelo n8n
return [
    {
        json: {
            first_day_of_month: firstDayFormatted,
            last_day_of_month: lastDayFormatted,
        },
    },
];
