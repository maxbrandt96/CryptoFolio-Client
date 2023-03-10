import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

function CoinChart({ coinId, timePeriod }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      let days = 7;
      if (timePeriod === '1m') {
        days = 30;
      } else if (timePeriod === '1y') {
        days = 365;
      } else if (timePeriod === 'all') {
        days = 'max';
      }

      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);

      const prices = response.data.prices.map((price) => {
        return {
          x: new Date(price[0]).toLocaleDateString(),
          y: price[1],
        };
      });

      const chartData = {
        labels: prices.map((price) => price.x),
        datasets: [
          {
            label: `${coinId.toUpperCase()} price in USD`,
            data: prices.map((price) => price.y),
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
          },
        ],
      };

      setChartData(chartData);
    };

    fetchChartData();
  }, [coinId, timePeriod]);

  useEffect(() => {
    if (!chartData) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart('coin-chart', {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'day',
              },
            },
          ],
        },
      },
    });
  }, [chartData]);

  return <canvas id="coin-chart"></canvas>;
}

export default CoinChart;
