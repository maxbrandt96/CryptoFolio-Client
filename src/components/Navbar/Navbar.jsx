import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { Button, Layout } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const location = useLocation();

  return (
    <Header className="navbar">
      <div className="navbar__logo">
        <Link to="/">
          <h1 className="navbar__title" style={{ color: "white" }}>
            CryptoFolio
          </h1>
        </Link>
      </div>

      {isLoggedIn && location.pathname === "/" && (
        <div className="navbar__menu">
          <Link to="/profile">
            <Button className="navbar__button" type="primary">
              {user && user.name}
            </Button>
          </Link>

          <Link to="/crypto-list">
            <Button className="navbar__button" type="primary">
              Cryptos
            </Button>
          </Link>

          <Button className="navbar__button" type="primary" danger onClick={logOutUser}>
            Logout
          </Button>
        </div>
      )}

      {isLoggedIn && location.pathname === "/crypto-list" && (
        <div className="navbar__menu">
          <Link to="/profile">
            <Button className="navbar__button" type="primary">
              {user && user.name}
            </Button>
          </Link>

          <Button className="navbar__button" type="primary" danger onClick={logOutUser}>
            Logout
          </Button>
        </div>
      )}

      {isLoggedIn && location.pathname === "/profile" && (
        <div className="navbar__menu">
          <Link to="/crypto-list">
            <Button className="navbar__button" type="primary">
              Cryptos
            </Button>
          </Link>

          <Button className="navbar__button" type="primary" danger onClick={logOutUser}>
            Logout
          </Button>
        </div>
      )}

      {!isLoggedIn && (location.pathname === "/login" || location.pathname === "/signup") && (
        <div className="navbar__menu">
          <Link to="/">
            <Button className="navbar__button" type="primary">
              Inicio
            </Button>
          </Link>
        </div>
      )}

      {!isLoggedIn && location.pathname === "/" && (
        <div className="navbar__menu">
          <Link to="/login">
            <Button className="navbar__button" type="primary">
              Ingresar
            </Button>
          </Link>
        </div>
      )}
    </Header>
  );
}

export default Navbar;
