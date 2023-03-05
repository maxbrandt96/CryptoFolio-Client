import { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import {getCryptoData} from "../../services/cryptoApi";
import axios from "axios";
import "./CryptoList.css"
import { Link } from "react-router-dom";


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
      title: "Name",
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
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Market Cap",
      dataIndex: "marketCap",
      key: "marketCap",
    },
    {
      title: "Volume 24h",
      dataIndex: "volume24h",
      key: "volume24h",
    },
    {
      title: "Add to Portfolio",
      dataIndex: "add",
      key: "add",
      render: (text, record) => (
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
            type="primary" className="navbar__button"
            onClick={() =>
              setPortfolio((prevState) => ({
                ...prevState,
                [record.key]: parseInt(
                  prevState[record.key] ? prevState[record.key] : 0
                ) + 1
              }))
            }
          >
            Add
          </Button>
        </div>
      ),
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
        placeholder="Search by name"
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: "16px", width: "200px" }}
      />
      <Table dataSource={filteredData} columns={columns} />
    </div>
  );
}
export default CryptoList;