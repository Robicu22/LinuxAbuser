import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import RecentTasks from "./components/RecentTasks";
import Calendar from "./components/Calendar";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.dashboard}>
      <button
        className={styles.menuButton}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className={styles.main}>
        <RecentTasks />
        <Calendar />
      </main>
    </div>
  );
}
