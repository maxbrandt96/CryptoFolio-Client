import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../../services/auth.service";
import { Button, Card, Form, Input } from "antd";

function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (values) => {
    const requestBody = { email, password, name };

    authService
      .signup(requestBody)
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="homepage">
      <div className="homepage__content">
        <h2 className="homepage__description-title">¿What is CryptoFolio?</h2>
        <p className="homepage__description-text">
        CryptoFolio is a website that allows you to create a test portfolio and track your cryptocurrency investments in real time.

<br/>
    <br/>
    You can add your favorite cryptocurrencies to your portfolio, view their prices and performance, and make informed decisions based on the latest market data. <br/> 
    <br/>Whether you are a beginner or an experienced investor, CryptoFolio can help you manage your cryptocurrency assets and achieve your investment goals.
  </p>
      </div>
      <div className="homepage__signup">
        <Card title="Create Account" className="homepage__signup-card" bordered={false}>
          <Form onFinish={handleSignupSubmit} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input your name!" }]}>
              <Input value={name} onChange={handleName} size="large" />
            </Form.Item>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input value={email} onChange={handleEmail} size="large" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password value={password} onChange={handlePassword} size="large" />
            </Form.Item>
        
            <Form.Item>
              <Button type="primary" htmlType="submit" className="navbar__button" size="large">
                Register
              </Button>
            </Form.Item>
          </Form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default HomePage;