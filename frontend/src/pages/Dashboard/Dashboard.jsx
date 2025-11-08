import React from "react";
import Sidebar from "./components/Sidebar";
import RecentTasks from "./components/RecentTasks";
import Calendar from "./components/Calendar";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.main}>
        <RecentTasks />
        <Calendar />
      </main>
    </div>
  );
}
