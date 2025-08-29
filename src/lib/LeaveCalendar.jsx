import React, { useState } from "react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

const LeaveCalendar = ({
  leaves = [],
  theme = {
    primary: "#800000",      // titles, text
    secondary: "#CC5500",    // highlights
    accent: "#8C4C1F",       // extra avatars
    todayBg: "linear-gradient(135deg, #fff0f0, #f5b7b1)",
    selectedBg: "linear-gradient(135deg, #ffe8d6, #ffb385)",
    defaultBg: "linear-gradient(145deg, #ffffff, #f9f9f9)",
    scrollbarThumb: "#cc5500",
    scrollbarTrack: "#ffe8d6"
  }
}) => {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);

  const startDay = currentMonth.startOf("month").day();
  const daysInMonth = currentMonth.daysInMonth();

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  // Filter leaves for the selected day
  const selectedDayLeaves = leaves.filter((l) =>
    l.date ? dayjs(l.date).isSame(selectedDate, "day") : false
  );

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "1rem",
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "2rem",
        alignItems: "start",
      }}
    >
      {/* Calendar Column */}
      <div
        style={{
          border: "1px solid rgb(226, 232, 240)",
          borderRadius: "40px",
          padding: "22px",
          height: "600px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <button
            onClick={prevMonth}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background: "#fff5f0",
              color: theme.primary,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ←
          </button>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: theme.secondary,
            }}
          >
            {currentMonth.format("MMMM YYYY")}
          </h2>
          <button
            onClick={nextMonth}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background: "#fff5f0",
              color: theme.primary,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            →
          </button>
        </div>

        {/* Days of Week */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            textAlign: "center",
            marginBottom: "0.5rem",
            fontWeight: "700",
            color: theme.primary,
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.5rem",
          }}
        >
          {/* Empty cells before month start */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = currentMonth.date(day);
            const isToday = today.isSame(date, "day");
            const isSelected = dayjs(selectedDate).isSame(date, "day");

            const dayLeaves = leaves.filter((l) =>
              l.date ? dayjs(l.date).isSame(date, "day") : false
            );

            const firstTwo = dayLeaves.slice(0, 2);
            const extraCount = dayLeaves.length - 2;

            return (
              <motion.div
                key={day}
                layout
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedDate(date)}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "12px",
                  background: isSelected
                    ? theme.selectedBg
                    : isToday
                      ? theme.todayBg
                      : theme.defaultBg,
                  border: isSelected
                    ? `2px solid ${theme.secondary}`
                    : isToday
                      ? `2px solid ${theme.primary}`
                      : "1px solid #e2e8f0",
                  boxShadow: isSelected
                    ? `0 6px 15px ${theme.secondary}55`
                    : isToday
                      ? `0 6px 15px ${theme.primary}40`
                      : "0 4px 10px rgba(0,0,0,0.06)",
                  position: "relative",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: isSelected
                    ? theme.secondary
                    : isToday
                      ? theme.primary
                      : "#2d3748",
                }}
              >
                {day}

                {/* Leaves stacked avatars */}
                {dayLeaves.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      position: "absolute",
                      bottom: "4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    {firstTwo.map((l, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                        }}
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: l.color || theme.secondary,
                          color: "white",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                          marginLeft: idx === 0 ? "0" : "-8px",
                          zIndex: firstTwo.length - idx,
                        }}
                        title={`${l.name || "Unknown"} - ${l.type || ""}`}
                      >
                        {(l.name && l.name[0]) || "?"}
                      </motion.div>
                    ))}

                    {extraCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: theme.accent,
                          color: "white",
                          fontSize: "0.65rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: "-8px",
                          cursor: "default",
                        }}
                        title={dayLeaves
                          .slice(2)
                          .map((l) => `${l.name} - ${l.type}`)
                          .join("\n")}
                      >
                        +{extraCount}
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sidebar Column */}
      <div>
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              key={selectedDate.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
                background: "linear-gradient(to right, #fff5f0, #ffe8d6)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                border: "1px solid #e2e8f0",
                maxHeight: "600px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  color: theme.primary,
                }}
              >
                Leaves on {dayjs(selectedDate).format("MMMM D, YYYY")}
              </h3>

              {selectedDayLeaves.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    overflowY: "auto",
                    flexGrow: 1,
                    paddingRight: "4px",

                    // ✅ Scrollbar styling
                    scrollbarWidth: "thin",
                    scrollbarColor: `${theme.scrollbarThumb} ${theme.scrollbarTrack}`,
                  }}
                  className="custom-scroll"
                >
                  {selectedDayLeaves.map((l, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: "tween",
                        duration: 0.15,
                        delay: idx * 0.03,
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.75rem",
                        borderRadius: "12px",
                        background: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: l.color || theme.secondary,
                          marginRight: "0.75rem",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: "600", color: theme.primary }}>
                          {l.name || "Unknown"}
                        </div>
                        <div style={{ fontSize: "0.9rem", color: theme.secondary }}>
                          {l.type || "Leave"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p style={{ color: theme.primary, margin: 0 }}>
                  No leaves scheduled for this day.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeaveCalendar;
