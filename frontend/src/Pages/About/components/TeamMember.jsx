import React from "react";
import styles from "./TeamMember.module.css";

export default function TeamMember({ name, role, img, bio }) {
  return (
    <div className={styles.member} role="listitem">
      {img ? (
        <img src={img} alt={`${name} avatar`} className={styles.avatar} />
      ) : (
        <div className={`${styles.avatar} ${styles.placeholder}`} aria-hidden>
          {name?.charAt(0)}
        </div>
      )}
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.role}>{role}</p>
        {bio && <p className={styles.bio}>{bio}</p>}
      </div>
    </div>
  );
}
