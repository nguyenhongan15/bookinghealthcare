import "./Appointments.css";
import { CalendarDays, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/http";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?.doctorId;

  useEffect(() => {
    api.get("/bookings/doctor-schedule", {
      params: { doctorId },
    }).then((res) => {
      const data = res.data?.data || [];
      setAppointments(data);
      setFiltered(data);
    });
  }, [doctorId]);

  useEffect(() => {
    if (!selectedDate) {
      setFiltered(appointments);
    } else {
      setFiltered(
        appointments.filter((b) => b.date === selectedDate)
      );
    }
  }, [selectedDate, appointments]);

  return (
    <div className="appointments-page">
      <h1>Lịch khám với bệnh nhân</h1>

      {/* FILTER */}
      <div className="filter-bar">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        {selectedDate && (
          <button onClick={() => setSelectedDate("")}>Xoá lọc</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Không có lịch trong ngày này</div>
      ) : (
        <div className="appointment-list">
          {filtered.map((item) => (
            <div key={item.id} className="appointment-card doctor">
              <div className="row">
                <User size={18} />
                <strong>{item.patientName}</strong>
              </div>

              <div className="row">
                <CalendarDays size={18} />
                {item.date}
              </div>

              <div className="row">
                <Clock size={18} />
                {item.time}
              </div>

              <span className={`status ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
