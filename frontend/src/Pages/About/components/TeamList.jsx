import React from "react";
import TeamMember from "./TeamMember";
import styles from "./TeamList.module.css";

const sampleTeam = [
  {
    name: "Gyibgyak Eduard",
    role: "Main Backend Developer & Team Leader",
    bio: "Builds and maintains fast and reliable infrastructure.",
  },
  {
    name: "Tudor Constantin",
    role: "Main Frontend Developer",
    bio: "CSS and HTML enthuziast.",
  },
  {
    name: "Ilie Robert",
    role: "Backend developer",
    bio: "Interested in the security aspect of web apps.",
  },
  {
    name: "Radulescu Radu",
    role: "Frontend developer",
    bio: "Pasionate about the creation process of ReactJS aplications.",
  },
];

export default function TeamList({ members = sampleTeam }) {
  return (
    <section className={styles.list}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Meet the team</h2>
        <div className={styles.grid} role="list">
          {members.map((m) => (
            <TeamMember key={m.name} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}
