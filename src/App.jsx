import { LeaveCalendar } from "./lib/LeaveCalendar.jsx";
import dayjs from "dayjs";

const leaves = [
  { name: "Alice", type: "Sick Leave", date: "2025-08-10", color: "red" },
  { name: "Bob", type: "Casual Leave", date: "2025-08-15", color: "blue" },
  { name: "Charlie", type: "WFH", date: "2025-08-15", color: "green" },
];

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <LeaveCalendar leaves={leaves} month={dayjs("2025-08-01")} />
    </div>
  );
}

export default App;
