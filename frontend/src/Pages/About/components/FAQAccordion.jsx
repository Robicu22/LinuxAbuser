import React, { useState } from "react";
import styles from "./FAQAccordion.module.css";

const defaultFaqs = [
  {
    q: "What is LinuxAbuser?",
    a: "LinuxAbuser is a small project focused on Linux tips, tooling and developer resources.",
  },
  {
    q: "How can I contribute?",
    a: "Fork the repo on GitHub, open an issue or a pull request with your changes.",
  },
];

export default function FAQAccordion({ faqs = defaultFaqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className={styles.accordion}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Frequently asked questions</h2>
        <div className={styles.faqs}>
          {faqs.map((f, i) => (
            <div className={styles.faq} key={f.q}>
              <button
                aria-expanded={openIndex === i}
                className={styles.question}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {f.q}
              </button>
              <div
                className={`${styles.answer} ${
                  openIndex === i ? styles.open : ""
                }`}
              >
                {openIndex === i && <p>{f.a}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
