import React from "react";
import AboutHero from "./components/AboutHero";
import StatsSection from "./components/StatsSection";
import TeamList from "./components/TeamList";
import FAQAccordion from "./components/FAQAccordion";
import ContactCTA from "./components/ContactCTA";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <main>
      <AboutHero
        title="About LinuxAbuser"
        subtitle="We create tools, tips and resources for developers who love Linux."
      />

      <section className={styles.container}>
        <p>
          LinuxAbuser is a community-driven project that collects practical
          advice, tooling, and articles for developers working with Linux. Our
          goal is to make powerful low-level techniques approachable and
          shareable.
        </p>
      </section>

      <StatsSection />

      <TeamList />

      <FAQAccordion />

      <ContactCTA />
    </main>
  );
}
