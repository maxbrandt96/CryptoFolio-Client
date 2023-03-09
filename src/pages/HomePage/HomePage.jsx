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
        <h2 className="homepage__description-title">¿Qué es CryptoFolio?</h2>
        <p className="homepage__description-text">
    CryptoFolio es un sitio web que te permite crear un portafolio de prueba y rastrear tus inversiones en criptomonedas 
    en tiempo real.<br/>
    <br/>
     Puedes agregar tus criptomonedas favoritas a tu portafolio, ver sus precios y rendimientos, y tomar
    decisiones informadas basadas en los últimos datos del mercado. <br/> <br/>Ya seas un principiante o un inversor experimentado, CryptoFolio puede ayudarte a administrar tus activos de criptomonedas y alcanzar tus objetivos 
    de inversión.
  </p>
      </div>
      <div className="homepage__signup">
        <Card title="REGISTRARSE" className="homepage__signup-card" bordered={false}>
          <Form onFinish={handleSignupSubmit} layout="vertical">
          <Form.Item label="NOMBRE" name="name" rules={[{ required: true, message: "Please input your name!" }]}>
              <Input value={name} onChange={handleName} size="large" />
            </Form.Item>
            <Form.Item
              label="CORREO ELECTRONICO"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input value={email} onChange={handleEmail} size="large" />
            </Form.Item>
            <Form.Item
              label="CONTRASEÑA"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password value={password} onChange={handlePassword} size="large" />
            </Form.Item>
        
            <Form.Item>
              <Button type="primary" htmlType="submit" className="navbar__button" size="large">
                Registrarse
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