import "./Appointments.css";
import { CalendarDays, Clock, User, FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/http";
import { healthProfileService } from "../../services/healthProfileService";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [healthProfile, setHealthProfile] = useState(null);
  const [selectedPatientName, setSelectedPatientName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?.doctorId;

  // =====================
  // LOAD APPOINTMENTS
  // =====================
  useEffect(() => {
    if (!doctorId) return;

    api
      .get("/bookings/doctor-schedule", {
        params: { doctorId },
      })
      .then((res) => {
        const data = res.data?.data || [];
        setAppointments(data);
        setFiltered(data);
      });
  }, [doctorId]);

  // =====================
  // FILTER BY DATE
  // =====================
  useEffect(() => {
    if (!selectedDate) {
      setFiltered(appointments);
    } else {
      setFiltered(appointments.filter((b) => b.date === selectedDate));
    }
  }, [selectedDate, appointments]);

  // =====================
  // VIEW HEALTH PROFILE
  // =====================
  const handleViewHealthProfile = async (userId, patientName, doctorId) => {
    try {
      const res = await healthProfileService.doctorViewPatient(userId, doctorId);
  
      if (res.data?.success) {
        setHealthProfile(res.data.data);
        setSelectedPatientName(patientName);
        setShowProfile(true);
      } else {
        alert(res.data?.message || "Không thể xem hồ sơ");
      }
    } catch (err) {
      alert("Không thể xem hồ sơ sức khoẻ");
    }
  };
  
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

      {/* LIST */}
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

              {/* VIEW HEALTH PROFILE */}
              <button
                className="view-health-btn"
                onClick={() =>
                  handleViewHealthProfile(item.userId, item.patientName, doctorId)
                }
              >
                <FileText size={16} />
                Xem hồ sơ sức khoẻ
              </button>
            </div>
          ))}
        </div>
      )}

      {/* =====================
          HEALTH PROFILE POPUP
         ===================== */}
      {showProfile && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button
              className="modal-close"
              onClick={() => setShowProfile(false)}
            >
              <X size={18} />
            </button>

            <h3>Hồ sơ sức khoẻ</h3>
            <p className="patient-name">{selectedPatientName}</p>

            <div className="hp-section">
              <strong>Tiền sử bệnh</strong>
              <p>{healthProfile?.medicalHistory || "Không có"}</p>
            </div>

            <div className="hp-section">
              <strong>Dị ứng</strong>
              <p>{healthProfile?.allergies || "Không có"}</p>
            </div>

            <div className="hp-section">
              <strong>Thuốc đang dùng</strong>
              <p>{healthProfile?.currentMedications || "Không có"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
