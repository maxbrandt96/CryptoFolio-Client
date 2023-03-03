import "./Navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { Button, Layout, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <Header className="navbar">
      <div className="navbar__logo">
        <Link to="/">
          <h1 className="navbar__title" style={{ color: "white" }}>CryptoFolio</h1>
        </Link>
      </div>

      <Menu className="navbar__menu" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" className="navbar__menu-item" onClick={logOutUser}>
          {isLoggedIn && (
            <Button className="navbar__button" type="primary" danger>
              Logout
            </Button>
          )}
        </Menu.Item>

        <Menu.Item key="2" className="navbar__menu-item" icon={<UserOutlined />}>
          {isLoggedIn && (
            <Link to="/profile">
              <Button className="navbar__button" type="primary" ghost>
                {user && user.name}
              </Button>
            </Link>
          )}
        </Menu.Item>

        <Menu.Item key="3" className="navbar__menu-item">
          {!isLoggedIn && (
            <Link to="/login">
              <Button className="navbar__button" type="primary">
                Ingresar
              </Button>
            </Link>
          )}
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default Navbar;