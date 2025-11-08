import { useState } from "react";
import styles from "./form.module.css";

export default function SignUpForm({
  onSignUp,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) {
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    onSignUp({ username, email, password });
  }

  return (
    <form className={styles.logInForm} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <input
          className={styles.usernameInput}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Username"
          name="username"
          autoComplete="username"
          required
        />
        <input
          className={styles.usernameInput}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <input
          className={styles.passwordInput}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        <input
          className={styles.passwordInput}
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          placeholder="Confirm Password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
        <button className={styles.modernButton} type="submit">
          Sign Up
        </button>
      </div>
    </form>
  );
}
