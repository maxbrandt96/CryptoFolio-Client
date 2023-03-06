import "./ProfilePage.css";

import { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import { userId, _id } from '../../App';



function ProfilePage({ }) {
  const [userData, setUserData] = useState({});
  const [portfolioData, setPortfolioData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...')
        const { data } = await axios.get(`http://localhost:5005/api/${_id}`);
        console.log('User data:', data)
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    

    const fetchPortfolioData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5005/api/${userId}/portfolio`);
        console.log("Portfolio data:", data);
        setPortfolioData(data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };

    fetchUserData();
    fetchPortfolioData();
  }, [userId, _id]);

  return (
    <div>
      {userData && (
        <>
          <h1>{userData.name}'s Profile</h1>
          <p>Email: {userData.email}</p>
        </>
      )}
      {portfolioData && (
        <>
          <h2>Portfolio</h2>
          <ul>
            {Object.entries(portfolioData).map(([crypto, data]) => (
              <li key={crypto}>
                {crypto}:
                <ul>
                  {Object.entries(data).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
  
}

export default ProfilePage;
