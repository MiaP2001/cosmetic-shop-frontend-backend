import { useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import styles from "../styles/Register.module.scss";

const Register = () => {
  const navigate = useNavigate();
  const { dispatch } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post<{
        token: string;
        user: {
          _id: string;
          name: string;
          email: string;
          role: "user" | "admin";
        };
      }>("http://localhost:5000/api/users/login", formData);

      const token = res.data.token;
      localStorage.setItem("token", token);

      dispatch({
        type: "LOGIN",
        payload: {
          id: res.data.user._id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
        },
      });

      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className={styles.input}
        />

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
          Register
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
