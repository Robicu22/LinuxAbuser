import React from "react";
import styles from "./AboutHero.module.css";

export default function AboutHero({ title = "About Us", subtitle }) {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </section>
  );
}
