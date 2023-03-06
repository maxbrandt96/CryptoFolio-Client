import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Descriptions } from "antd";
import axios from "axios";
import "./CoinPage.css"

function CoinPage() {
  const { id } = useParams();
  const [coinData, setCoinData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
      setCoinData(response.data);
    };
    fetchData();
  }, [id]);

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
          <Descriptions>
            <Descriptions.Item label="Price">
              ${market_data.current_price.usd}
            </Descriptions.Item>
            <Descriptions.Item label="24h Change">
              {market_data.price_change_percentage_24h.toFixed(2)}%
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="coin-page__grid-item">
          <Descriptions>
            <Descriptions.Item label="Market Cap">
              ${market_data.market_cap.usd.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Total Volume">
              ${market_data.total_volume.usd.toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="coin-page__grid-item">
          <Descriptions>
            <Descriptions.Item label="Circulating Supply">
              {coinData.market_data.circulating_supply.toLocaleString()} {symbol.toUpperCase()}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="coin-page__grid-item">
          <Descriptions>
            <Descriptions.Item label="All-Time High">
              ${market_data.ath.usd.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="All-Time Low">
              ${market_data.atl.usd.toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="coin-page__grid-item">
          <Descriptions>
            <Descriptions.Item label="Website">
              <a href={coinData.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                {coinData.links.homepage[0]}
              </a>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </div>
  );
}

export default CoinPage;
