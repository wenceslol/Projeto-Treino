import React from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

const DonutChart = ({ gastos, labels }) => {
  // Configuração dos dados do gráfico
  const data = {
    labels: labels || ['Exercício 1', 'Exercício 2', 'Exercício 3'], // Substitua pelos nomes reais dos exercícios
    datasets: [
      {
        label: 'Gasto Calórico (kcal)',
        data: gastos || [0, 0, 0], // Substitua pelos valores reais de gastos
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)', // Cor para o primeiro segmento
          'rgba(54, 162, 235, 0.8)', // Cor para o segundo segmento
          'rgba(255, 206, 86, 0.8)', // Cor para o terceiro segmento
          // Adicione mais cores conforme necessário
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opções do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gasto Calórico por Exercício',
      },
      tooltip: {
        enabled: true,
      },
      colors: {
        enabled: true,
        forceOverride: true,
      },
    },
    cutout: '70%', // Define o tamanho do "buraco" do donut (50% cria um donut típico)
  };

  return (
    <div style={{ width: '400px', margin: '0 auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChart;