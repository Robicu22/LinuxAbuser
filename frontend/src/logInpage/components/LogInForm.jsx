import { useState } from "react";
import styles from "./form.module.css";

export default function LogInForm({
  onLogin,
  username,
  setUsername,
  password,
  setPassword,
}) {
  async function handleSubmit(e) {
    e.preventDefault();
    onLogin(username, password);
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
          className={styles.passwordInput}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
          name="password"
          type="password"
          required
        />
        <button className={styles.modernButton} type="submit">
          Log In
        </button>
      </div>
    </form>
  );
}
