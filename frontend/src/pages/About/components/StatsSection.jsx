import React from "react";
import styles from "./StatsSection.module.css";

const defaultStats = [
  { label: "Years of Experience", value: "6+" },
  { label: "Open Source Projects", value: "7" },
  { label: "Contributors", value: "5" },
];

export default function StatsSection({ stats = defaultStats }) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((s) => (
            <div className={styles.stat} key={s.label}>
              <div className={styles.value}>{s.value}</div>
              <div className={styles.label}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
