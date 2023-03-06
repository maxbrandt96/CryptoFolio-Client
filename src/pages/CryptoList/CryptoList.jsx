import { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import { getCryptoData } from "../../services/cryptoApi";
import axios from "axios";
import "./CryptoList.css";
import { Link } from "react-router-dom";
import { userId } from "../../App"; // Import the userId constant from App.jsx

/* eslint-disable no-restricted-globals */
function CryptoList() {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [portfolio, setPortfolio] = useState({});

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/coins/${record.key}`} style={{ display: "flex", alignItems: "center" }}>
        <img
           src={record.iconUrl}
           alt={record.name}
           style={{ width: "24px", marginRight: "8px" }}
        />
        {text}
     </Link>
     
      ),
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Capitalizacion de mercado",
      dataIndex: "marketCap",
      key: "marketCap",
    },
    {
      title: "Volumen 24h",
      dataIndex: "volume24h",
      key: "volume24h",
    },
    {
      title: "Agregar a portafolio",
      dataIndex: "add",
      key: "add",
      render: (text, record) => {
        const currentValue = portfolio[record.key] || 0;

        return (
          <div>
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder={0}
              style={{
                width: "50px",
                marginRight: "8px",
                borderRadius: "4px",
                border: "1px solid #d9d9d9",
                padding: "4px 11px",
                boxSizing: "border-box",
                fontSize: "14px",
                outline: "none",
              }}
              onChange={(event) =>
                setPortfolio((prevState) => ({
                  ...prevState,
                  [record.key]: parseFloat(event.target.value),
                }))
              }
            />
            <Button
              type="primary"
              className="navbar__button"
              onClick={async () => {
                try {
                  const parsedValue = parseFloat(currentValue || 0);
                  const updatedPortfolio = Object.entries(portfolio).reduce(
                    (acc, [key, value]) => {
                      acc[key] = key === record.key ? parsedValue : value;
                      return acc;
                    },
                    {}
                  );
                  const response = await axios.post(
                    `http://localhost:5005/api/${userId}/portfolio`,
                    {
                      userId,
                      portfolio: updatedPortfolio,
                    }
                  );

                  // Update the portfolio state with the new data
                  setPortfolio(updatedPortfolio);
                } catch (error) {
                  console.error("Error saving portfolio data:", error);
                }
              }}
            >
              Add
            </Button>
            {currentValue > 0 && (
              <span style={{ marginLeft: "8px" }}>
                ({currentValue.toFixed(2)})
              </span>
            )}
          </div>
        );
      },
    },
  ];
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };
  
  useEffect(() => {
    const storedData = localStorage.getItem("cryptoData");
  
  
    const fetchCryptoData = async () => {
      try {
        const { data } = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              per_page: 100,
              page: 1,
            },
          }
        );
        console.log("Data from API:", data);
        const mappedData = data?.map((crypto) => {
          return {
            key: crypto.id,
            rank: crypto.market_cap_rank,
            name: crypto.name,
            iconUrl: crypto.image,
            price: `$${crypto.current_price.toFixed(2)}`,
            marketCap: `$${crypto.market_cap.toLocaleString()}`,
            volume24h: `$${crypto.total_volume.toLocaleString()}`,
          };
        });
        console.log("Mapped data:", mappedData);
        setCryptoData(mappedData || []);
        const timestamp = new Date();
        localStorage.setItem(
          "cryptoData",
          JSON.stringify({ data: mappedData, timestamp })
        );
      } catch (error) {
        console.error("Error fetching data from Coingecko API:", error);
      }
    };
  
    fetchCryptoData();
  }, []);
  
  const filteredData = cryptoData.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchText.toLowerCase())
  );
  
  return (
    <div>
      <Input
        placeholder="Busca por nombre"
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: "16px", width: "200px" }}
      />
      <Table dataSource={filteredData} columns={columns} />
    </div>
  );
}
export default CryptoList;