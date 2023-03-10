import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Descriptions } from "antd";
import axios from "axios";
import Chart from "chart.js/auto";
import "./CoinPage.css";

function CoinPage() {
  const { id } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [timePeriod, setTimePeriod] = useState("7d");
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
      setCoinData(response.data);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!coinData) return;

    let days = 7;

    if (timePeriod === "1m") {
      days = 30;
    } else if (timePeriod === "1y") {
      days = 365;
    } else if (timePeriod === "all") {
      days = "max";
    }

    const fetchChartData = async () => {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
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
            label: `${id.toUpperCase()} price in USD`,
            data: prices.map((price) => price.y),
            borderColor: "rgb(75, 192, 192)",
            fill: false,
          },
        ],
      };

      const chartOptions = {
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
              },
            },
          ],
        },
      };

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart("coin-chart", {
        type: "line",
        data: chartData,
        options: chartOptions,
      });
    };

    fetchChartData();
  }, [coinData, id, timePeriod]);

  const handleTimePeriodClick = (period) => {
    setTimePeriod(period);
  };

  if (!coinData) {
    return <div>Loading...</div>;
  }

  const { name, image, symbol, market_data, description } = coinData;

  return (
    <div className="coin-page">
  <div className="coin-page__header">
    <h1 className="coin-page__title">{name} ({symbol.toUpperCase()})</h1>
    <img src={image.small} alt={`${name} logo`} className="coin-page__image" />
  </div>
  <div className="coin-page__grid">
    
    <div className="coin-page__grid-item">
      <canvas id="coin-chart"></canvas>
      <div className="coin-page__time-period">
        <button className={`coin-page__time-period-button ${timePeriod === "1d" ? "active" : ""}`} onClick={() => handleTimePeriodClick("1d")}>
          1D
        </button>
        <button className={`coin-page__time-period-button ${timePeriod === "7d" ? "active" : ""}`} onClick={() => handleTimePeriodClick("7d")}>
          7D
        </button>
        <button className={`coin-page__time-period-button ${timePeriod === "1m" ? "active" : ""}`} onClick={() => handleTimePeriodClick("1m")}>
          1M
        </button>
        <button className={`coin-page__time-period-button ${timePeriod === "1y" ? "active" : ""}`} onClick={() => handleTimePeriodClick("1y")}>
          1Y
        </button>
        <button className={`coin-page__time-period-button ${timePeriod === "all" ? "active" : ""}`} onClick={() => handleTimePeriodClick("all")}>
          ALL
        </button>
      </div>
    </div>
    <div className="descriptions">
    <div className="coin-page__grid-item">
      <Descriptions bordered>
        <Descriptions.Item label="Price">
          ${market_data.current_price.usd}
        </Descriptions.Item>
        <Descriptions.Item label="24h Change">
          {market_data.price_change_percentage_24h.toFixed(2)}%
        </Descriptions.Item>
      </Descriptions>
    </div>
    <div className="coin-page__grid-item">
      <Descriptions bordered>
        <Descriptions.Item label="Market Cap">
          ${market_data.market_cap.usd.toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Total Volume">
          ${market_data.total_volume.usd.toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </div>
    <div className="coin-page__grid-item">
      <Descriptions bordered>
        <Descriptions.Item label="Circulating Supply">
          {coinData.market_data.circulating_supply.toLocaleString()} {symbol.toUpperCase()}
        </Descriptions.Item>
      </Descriptions>
    </div>
    <div className="coin-page__grid-item">
      <Descriptions bordered>
        <Descriptions.Item label="All-Time High">
          ${market_data.ath.usd.toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="All-Time Low">
          ${market_data.atl.usd.toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </div>
    <div className="coin-page__grid-item">
      <Descriptions bordered>
        <Descriptions.Item label="Website">
          <a href={coinData.links.homepage[0]} target="_blank" rel="noopener noreferrer">
            {coinData.links.homepage[0]}
          </a>
        </Descriptions.Item>
      </Descriptions>
    </div>
  </div>
</div>
</div>
  );
}

export default CoinPage;
