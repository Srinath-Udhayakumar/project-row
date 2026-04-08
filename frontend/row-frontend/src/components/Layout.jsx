import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUsername, isAuthenticated } from "../util/auth";

function Layout({ children }) {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const onLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Food Ordering MVP</h1>
        <nav>
          {loggedIn && <Link to="/products">Products</Link>}
          {loggedIn && <Link to="/cart">Cart</Link>}
          {loggedIn && <Link to="/orders">Orders</Link>}
          {!loggedIn && <Link to="/login">Login</Link>}
          {!loggedIn && <Link to="/register">Register</Link>}
          {loggedIn && (
            <button type="button" onClick={onLogout} className="link-btn">
              Logout ({getUsername() || "User"})
            </button>
          )}
        </nav>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}

export default Layout;