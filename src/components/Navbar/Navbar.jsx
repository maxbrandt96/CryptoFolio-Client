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

      {isLoggedIn && (
        <div className="navbar__menu">
          {location.pathname !== "/crypto-list" && (
            <Link to="/crypto-list">
              <Button className="navbar__button" type="primary">
                Cryptos
              </Button>
            </Link>
          )}

          {location.pathname !== "/profile" && (
            <Link to="/profile">
              <Button className="navbar__button" type="primary">
                Profile
              </Button>
            </Link>
          )}

          <Button className="navbar__button" type="primary" danger onClick={logOutUser}>
            Logout
          </Button>
        </div>
      )}

      {!isLoggedIn && location.pathname === "/" && (
        <div className="navbar__menu">
          <Link to="/login">
            <Button className="navbar__button" type="primary">
              Log In
            </Button>
          </Link>
        </div>
      )}

      {!isLoggedIn && (location.pathname === "/signup" || location.pathname === "/login") && (
        <div className="navbar__menu">
          <Link to="/">
            <Button className="navbar__button" type="primary">
              Home
            </Button>
          </Link>
        </div>
      )}
    </Header>
  );
}

export default Navbar;
