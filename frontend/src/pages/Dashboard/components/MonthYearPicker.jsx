import React from "react";
import styles from "./MonthYearPicker.module.css";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthYearPicker({
  isOpen,
  onClose,
  currentMonth,
  currentYear,
  onSelect,
}) {
  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);

  const handleApply = () => {
    onSelect(selectedMonth, selectedYear);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Select Date</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <label className={styles.label}>Year</label>
            <input
              type="number"
              className={styles.yearInput}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              min="2000"
              max="2100"
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Month</label>
            <div className={styles.monthGrid}>
              {monthNames.map((month, index) => (
                <button
                  key={month}
                  className={`${styles.monthBtn} ${
                    selectedMonth === index ? styles.monthBtnActive : ""
                  }`}
                  onClick={() => setSelectedMonth(index)}
                >
                  {month.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.applyBtn} onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
