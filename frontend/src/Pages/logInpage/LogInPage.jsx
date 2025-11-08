import LogInForm from "./components/LogInForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../config/api";
import formStyles from "./components/form.module.css";
import styles from "./loginPage.module.css";

export default function LogInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(email, pass) {
    try {
      setError("");
      
      console.log("Attempting login with:", { email });
      // If the user input looks like an email use the email field, otherwise send it as a name
      const payload = email && email.includes('@')
        ? { email: email, password: pass }
        : { name: email, password: pass };

      const response = await axios.post(`${API_URL}/login`, payload);
      
      console.log("Login successful:", response.data);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate to dashboard
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Failed to log in. Please try again.");
    }
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Log In</h1>
      {error && <div style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
      <LogInForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onLogin={handleLogin}
      />
      <div className={styles.switchContainer}>
        <span className={styles.switchText}>Don't have an account?</span>
        <button
          className={styles.switchButton}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
