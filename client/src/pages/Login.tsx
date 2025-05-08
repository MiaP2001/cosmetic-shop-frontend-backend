import { useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import styles from "../styles/Login.module.scss";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      const token = res.data.token;
      localStorage.setItem("token", token);

      const userData = res.data.user;

      if (userData) {
        dispatch({
          type: "LOGIN",
          payload: {
            id: res.data.user._id,
            name: res.data.user.name,
            email: res.data.user.email,
            role: res.data.user.role,
          },
        });
        window.location.href = "/";
      } else {
        setError("Login failed: user data missing");
      }
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Something went wrong";
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Login
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
