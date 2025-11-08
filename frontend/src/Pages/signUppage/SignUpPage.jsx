import SignUpForm from "./components/SignUpForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./signUpPage.module.css";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSignUp(data) {
    try {
      setError("");
      setSuccess("");

      console.log("Attempting signup with:", {
        name: data.username,
        email: data.email,
      });

      const response = await axios.post("http://localhost:5000/api/signup", {
        name: data.username,
        email: data.email,
        password: data.password,
      });

      console.log("Signup successful:", response.data);
      setSuccess("Account created successfully! Redirecting to login...");

      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create account. Please try again."
      );
    }
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Sign Up</h1>
      {error && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{ color: "green", marginBottom: "10px", textAlign: "center" }}
        >
          {success}
        </div>
      )}
      <SignUpForm
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onSignUp={handleSignUp}
      />
      <div className={styles.switchContainer}>
        <span className={styles.switchText}>Already have an account?</span>
        <button
          className={styles.switchButton}
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
      </div>
    </div>
  );
}
