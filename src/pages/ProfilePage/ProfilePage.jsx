import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { Table, Card, Avatar  } from "antd";
import axios from "axios";
import { getCoins } from "../../services/cryptoApi";
import { Link } from "react-router-dom";
import "./ProfilePage.css"
import { UserOutlined } from '@ant-design/icons';

const MIN_ROWS = 10;

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [portfolioData, setPortfolioData] = useState([]);
  const [coins, setCoins] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editingCoinId, setEditingCoinId] = useState(null);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:5005/api/${user._id}/portfolio`);
        if (Object.keys(response.data.cryptos).length > 0) {
          setPortfolioData(response.data.cryptos);
        }

        async function fetchCoins() {
          try {
            const coinIds = Object.keys(response.data.cryptos);
            const coinsData = await getCoins(coinIds);
            const filteredCoins = coinsData.filter((coin) =>
              coinIds.includes(coin.id)
            );
            setCoins(filteredCoins);
          } catch (error) {
            console.error("Error fetching coins data:", error);
          }
        }
        fetchCoins();
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    }
    fetchData();
  }, [user._id]);

  useEffect(() => {
    const NUM_ROWS = Math.max(Object.keys(portfolioData).length, MIN_ROWS);
    const updatedTableData = [];
    for (let i = 0; i < NUM_ROWS; i++) {
      const coinId = Object.keys(portfolioData)[i];
      if (coinId) {
        const coin = coins.find((coin) => coin.id === coinId);
        const price = coin ? coin.current_price : 0;
        const name = coin ? coin.name : "";
        const quantity = portfolioData[coinId] || 0;
        const total = `$${(quantity * price).toFixed(2)}`;
        const iconUrl = coin ? coin.image : "";
        updatedTableData.push({
          key: coinId,
          name: name,
          quantity: quantity,
          price: `$${price.toFixed(2)}`,
          priceChange: coin ? coin.price_change_percentage_24h : 0,
          total: total,
          iconUrl: iconUrl,
        });
      } else {
        updatedTableData.push({ key: i, name: "", quantity: 0, price: "", priceChange: 0, total: "", iconUrl: "" });
      }
    }

    const numAdditionalRows = Math.max(Object.keys(portfolioData).length - NUM_ROWS, 0);
    for (let i = 0; i < numAdditionalRows; i++) {
      updatedTableData.push({
        key: i + NUM_ROWS,
        name: "",
        quantity: 0,
        price: "",
        priceChange: 0,
        total: "",
        iconUrl: ""
      });
    }

    
    setTableData(updatedTableData.slice(0, NUM_ROWS));
  }, [portfolioData, coins]);

  const handleDelete = async (coinId) => {
    try {
      await axios.delete(`http://localhost:5005/api/${user._id}/portfolio/${coinId}`);
      setPortfolioData((prevData) => {
        const newData = { ...prevData };
        delete newData[coinId];
        return newData;
      });
      setEditingCoinId((prevId) => (prevId === coinId ? null : prevId));
      setTableData((prevData) => prevData.filter((row) => row.key !== coinId));
    } catch (error) {
      console.error("Error deleting crypto:", error);
    }
  };
  
  const handleEdit = async (coinId, quantity) => {
    try {
      await axios.put(`http://localhost:5005/api/${user._id}/portfolio/${coinId}`, {
        quantity,
      });
      setEditingCoinId(null);
      setPortfolioData((prevData) => ({ ...prevData, [coinId]: parseInt(quantity, 10) }));
    } catch (error) {
      console.error("Error editing coin:", error);
    }
  };
  
  
  const columns = [
    {
      title: "Crypto",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {record.iconUrl && (
            <Link to={`/coins/${record.key}`} style={{ display: "flex", alignItems: "center" }}>
              <img
                src={record.iconUrl}
                alt={record.name}
                style={{ width: "24px", marginRight: "8px" }}
              />
              {text}
            </Link>
          )}
        </div>
      ),
      
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) =>
        editingCoinId === record.key ? (
          <input
            type="number"
            value={text}
            onChange={(e) =>
              setTableData((prevData) =>
                prevData.map((row) =>
                  row.key === record.key ? { ...row, quantity: e.target.value } : row
                )
              )
            }
          />
        ) : record.name ? (
          text
        ) : null,
    },
    
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (record.name ? text : null),
    },
    {
      title: "Cambio 24h",
      dataIndex: "priceChange",
      key: "priceChange",
      render: (text, record) =>
        record.name ? (
          <span style={{ color: text > 0 ? "green" : "red" }}>
            {text.toFixed(2)}%
          </span>
        ) : null,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text, record) => (record.name ? text : null),
    },
    {
      title: "Editar",
      dataIndex: "edit",
      key: "edit",
      render: (text, record) =>
        editingCoinId === record.key && record.name ? (
          <button className="navbar__button" onClick={() => handleEdit(record.key, record.quantity)}>Save</button>
        ) : record.name ? (
          <button className="navbar__button" onClick={() => setEditingCoinId(record.key)}>Editar</button>
        ) : null,
    },
    {
      title: "Eliminar",
      dataIndex: "delete",
      key: "delete",
      render: (text, record) =>
        record.name ? (
          <button className="navbar__button" onClick={() => handleDelete(record.key)}>Eliminar</button>
        ) : null,
    },
  ];
  
  
  const totalBalance = Object.keys(portfolioData).reduce((acc, coinId) => {
    const coin = coins.find((c) => c.id === coinId);
    const price = coin ? coin.current_price : 0;
    const quantity = portfolioData[coinId] || 0;
    return acc + price * quantity;
  }, 0);

  const footerStyles = {
    background: "transparent",
    fontWeight: "bold",
    borderTop: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    padding: "0.5rem",
    fontSize: "1.2rem",
    marginLeft: "85rem"
  };
  
  
  
  const labelStyles = {
    marginRight: "1rem",
  };
  
  return (
    <div>
      <div className="ProfDiv" style={{ marginLeft: "5rem", marginRight: "5rem" }}>
        <h2 className="h2">
          <Avatar size={64} icon={<UserOutlined />} />{" "}
          <span className="spanName">Name: {user.name}</span>{" "}
          <span className="emailSpan">Email: {user.email}</span>{" "}
        </h2>
        <div style={{ height: "700px", marginBottom: "1rem" }}>
          <Table
            dataSource={tableData}
            columns={columns}
            className="table"
            rowClassName="table-row"
            scroll={{ y: 570 }}
            pagination={false}
            footer={() => (
              <footer style={footerStyles}>
                <span style={labelStyles}>Balance Total:</span>
                <span>${totalBalance.toFixed(2)}</span>
              </footer>
            )}
          />
          {Object.keys(portfolioData).length === 0 && (
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              No coins in your portfolio yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;