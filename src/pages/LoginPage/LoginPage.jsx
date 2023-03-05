import "./LoginPage.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";
import { Form, Input, Button, Card } from "antd";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (values) => {
    const requestBody = { email: values.email, password: values.password };

    authService
      .login(requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/crypto-list"); // Redirect to CryptoList component
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="LoginPage">
      <h1 style={{color: "white"}}>Login</h1>

      <Form onFinish={handleLoginSubmit} layout="vertical">
        <Form.Item label="Email:" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
          <Input value={email} onChange={handleEmail} size="large" style={{ width: "250px" }} />
        </Form.Item>

        <Form.Item label="Password:" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
          <Input.Password value={password} onChange={handlePassword} size="large" style={{ width: "250px" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="navbar__button" size="large" style={{backgroundColor: "white", color: "black"}}>
            Login
          </Button>
        </Form.Item>
      </Form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p style={{color: "white"}}>Don't have an account yet?</p>
      <Link to={"/signup"} style={{color: "white"}}> Sign Up</Link>
    </div>
  );
}

export default LoginPage;
