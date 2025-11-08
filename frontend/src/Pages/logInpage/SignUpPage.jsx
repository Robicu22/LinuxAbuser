import SignUpForm from "./components/SignUpForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./signUpPage.module.css";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  function handleSignUp(data) {
    console.log("Signed up successfully:", data);
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Sign Up</h1>
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
