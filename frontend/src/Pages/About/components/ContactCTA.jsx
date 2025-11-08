import React from "react";
import styles from "./ContactCTA.module.css";

export default function ContactCTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Want to collaborate?</h2>
        <p className={styles.text}>
          Reach out — we're always happy to chat about open source and tooling.
        </p>
        <a
          className={styles.btn}
          href="https://www.youtube.com/watch?v=fZK57PxKC-0"
        >
          Contact us
        </a>
      </div>
    </section>
  );
}
