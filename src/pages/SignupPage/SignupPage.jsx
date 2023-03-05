import "./SignupPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { Form, Input, Button, Card } from "antd";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (values) => {
    const requestBody = { email: values.email, password: values.password, name: values.name };

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
    <div className="SignupPage">
      <Card title="Sign Up" style={{ width: "400px" }}>
        <Form onFinish={handleSignupSubmit}>
          <Form.Item label="Email:" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
            <Input value={email} onChange={handleEmail} size="large" style={{ width: "250px" }} />
          </Form.Item>

          <Form.Item label="Password:" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
            <Input.Password value={password} onChange={handlePassword} size="large" style={{ width: "250px" }} />
          </Form.Item>

          <Form.Item label="Name:" name="name" rules={[{ required: true, message: "Please input your name!" }]}>
            <Input value={name} onChange={handleName} size="large" style={{ width: "250px" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="navbar__button" size="large">
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <p>Already have an account?</p>
        <Link to={"/login"}> Login</Link>
      </Card>
    </div>
  );
}

export default SignupPage;
