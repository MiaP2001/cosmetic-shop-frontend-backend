import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductList from "./components/ProductList";
import { useAuth } from "../src/hooks/useAuth";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <div style={{ padding: "1rem", borderBottom: "1px solid gray" }}>
        {user ? (
          <>
            <p>
              Welcome, {user.name} ({user.role})
            </p>
            {user.role === "admin" && <button>Admin Panel</button>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login">Login</a> | <a href="/register">Register</a>
          </>
        )}
      </div>

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
