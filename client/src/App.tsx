import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductList from "./components/ProductList";
import { useAuth } from "../src/hooks/useAuth";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import styles from "./styles/Header.module.scss";
import ProductPage from "./pages/ProductPage";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./context/CartContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <header className={styles.header}>
        <div className={styles.logo}>Cosmetic Shop</div>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navBtn}>
            All Products
          </Link>
          {user ? (
            <>
              <p className={styles.welcome}>
                Welcome, <span className={styles.user}>{user.name}</span> (
                {user.role})
              </p>

              {user.role === "admin" && (
                <Link to="/admin">
                  <button className={styles.navBtn}>Admin Panel</button>
                </Link>
              )}

              <button onClick={logout} className={styles.navBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>
                Login
              </Link>
              <Link to="/register" className={styles.link}>
                Register
              </Link>
            </>
          )}

          {user?.role === "user" && (
            <button
              onClick={() => (window.location.href = "/cart")}
              className={styles.navBtn}
            >
              Cart
            </button>
          )}
        </nav>
      </header>

      <CartProvider>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<ProductPage />} />
        </Routes>
      </CartProvider>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
