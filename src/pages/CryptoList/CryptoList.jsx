import React, { useState, useEffect } from "react";
import CryptoLatest from "../../api";

function CryptoList() {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await CryptoLatest();
      const cryptoList = response.data.map((crypto) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.quote.USD.price,
        logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
      }));
      setCryptos(cryptoList);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Crypto List</h1>
      <ul>
        {cryptos.map((crypto) => (
          <li key={crypto.id}>
            <img src={crypto.logo} alt={`${crypto.name} Logo`} />
            <h2>{crypto.name}</h2>
            <p>{crypto.symbol}: ${crypto.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CryptoList;