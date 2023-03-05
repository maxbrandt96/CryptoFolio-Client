import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3";

export const getCoins = async () => {
  try {
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching data from Coingecko API:", error);
    throw error;
  }
};