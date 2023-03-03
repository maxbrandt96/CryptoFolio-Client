import axios from 'axios';

const CryptoLatest = async () => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      params: {
        api_key: 'eda1f5f6-2122-493e-806c-4b8956cce9e6'
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default CryptoLatest;