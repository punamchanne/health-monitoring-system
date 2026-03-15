import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HealthChart = ({ data, label, color }) => {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })).reverse(),
    datasets: [
      {
        label: label,
        data: data.map(d => d.value).reverse(),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: '#f1f5f9',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-48">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HealthChart;
