import LogInForm from "../components/LogInForm";
import { useState } from "react";
import formStyles from "../components/form.module.css";
import styles from "./loginPage.module.css";

export default function LogInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(data) {
    console.log("Logged in successfully:", data);
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Log In</h1>
      <LogInForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onLogin={handleLogin}
      />
    </div>
  );
}
