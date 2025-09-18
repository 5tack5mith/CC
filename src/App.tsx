import React, { useEffect, useState } from "react";
import "./App.css";

const themes: Record<
  string,
  { background: string; accent: string; name: string }
> = {
  blossom: {
    background: "linear-gradient(135deg, #ffe6f0, #fff0f5)",
    accent: "#ff4d88",
    name: "🌸 Romantic Blossom",
  },
  starry: {
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    accent: "#a29bfe",
    name: "🌌 Starry Love",
  },
  sunset: {
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4, #fad390)",
    accent: "#ff6f61",
    name: "🌅 Sunset Romance",
  },
  winter: {
    background: "linear-gradient(135deg, #dfe9f3, #ffffff)",
    accent: "#00bcd4",
    name: "❄️ Cozy Winter Love",
  },
};

// Helper: parse date input
function parseDateFromInput(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function App() {
  // ✅ Load from localStorage on first render
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const savedDate = localStorage.getItem("couplesStartDate");
    return savedDate ? new Date(savedDate) : null;
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("couplesTheme");
    return savedTheme && themes[savedTheme] ? savedTheme : "blossom";
  });

  const [tempDate, setTempDate] = useState<string>("");

  // ✅ Save changes automatically
  useEffect(() => {
    if (startDate) {
      localStorage.setItem("couplesStartDate", startDate.toISOString());
    }
  }, [startDate]);

  useEffect(() => {
    localStorage.setItem("couplesTheme", theme);
  }, [theme]);

  // ✅ Calculate date difference
  let years = 0, months = 0, days = 0;
  if (startDate) {
    const today = new Date();
    years = today.getFullYear() - startDate.getFullYear();
    months = today.getMonth() - startDate.getMonth();
    days = today.getDate() - startDate.getDate();

    if (days < 0) {
      months--;
      const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += prevMonthDays;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  const formattedStart =
    startDate?.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) || "";

  // ✅ Reset handler
  const handleReset = () => {
    localStorage.removeItem("couplesStartDate");
    localStorage.removeItem("couplesTheme");
    setStartDate(null);
    setTempDate("");
    setTheme("blossom");
  };

  return (
    <div
      className="container"
      style={{ background: themes[theme].background }}
    >
      <div className="card">
        <h1 className="title">💕 Our Couples Project 💕</h1>

        {/* Theme Selector */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ marginRight: "8px" }}>Choose Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: "8px" }}
          >
            {Object.keys(themes).map((key) => (
              <option key={key} value={key}>
                {themes[key].name}
              </option>
            ))}
          </select>
        </div>

        {/* Main content */}
        {!startDate ? (
          <>
            <p className="subtitle">Please select your start date:</p>
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
            />
            <div>
              <button
                disabled={tempDate.length !== 10}
                onClick={() => setStartDate(parseDateFromInput(tempDate))}
                style={{
                  backgroundColor: tempDate.length === 10 ? themes[theme].accent : "#ccc",
                  cursor: tempDate.length === 10 ? "pointer" : "not-allowed",
                }}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="subtitle">We’ve been together since:</p>
            <h2 className="highlight">{formattedStart}</h2>
            <h3 className="counter">
              {years > 0 && `${years} year${years > 1 ? "s" : ""}, `}
              {months > 0 && `${months} month${months > 1 ? "s" : ""}, `}
              {days} day{days !== 1 ? "s" : ""}
            </h3>
            <button
              onClick={() => {
                localStorage.removeItem("couplesStartDate");
                setStartDate(null);
                setTempDate("");
              }}
              style={{ backgroundColor: themes[theme].accent, marginRight: "10px" }}
            >
              Change Date
            </button>
            <button
              onClick={handleReset}
              style={{
                backgroundColor: "#444",
                color: "#fff",
              }}
            >
              Reset All
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
