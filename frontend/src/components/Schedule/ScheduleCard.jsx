import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ScheduleCard.css";

function ScheduleCard({ schedules, doctor }) {
  const navigate = useNavigate();

  if (!schedules || schedules.length === 0) {
    return (
      <div className="schedule-box">
        <div className="schedule-top no-schedule">Không có lịch cố định</div>
        <button
        className="btn-register"
        onClick={() =>
          navigate("/dat-lich-kham", {
            state: {
              doctor: doctor,
              date: "Không cố định",
              slot: "Tự chọn",
            },
          })
        }
      >
        Đăng ký khám</button>
      </div>
    );
  }

  const [selectedDay, setSelectedDay] = useState(schedules[0]);
  const [open, setOpen] = useState(false);

  const handleClickSlot = (slot) => {
    navigate("/dat-lich-kham", {
      state: {
        doctor: doctor,
        date: selectedDay.date,
        slot: slot,
      }
    });
  };
  return (
    <div className="schedule-box">

      <div className="schedule-top" onClick={() => setOpen(!open)}>
        {selectedDay.date}
        <span className="arrow">▼</span>
      </div>

      {open && (
        <div className="dropdown-days">
          {schedules.map((d, idx) => (
            <div
              key={idx}
              className="dropdown-item"
              onClick={() => {
                setSelectedDay(d);
                setOpen(false);
              }}
            >
              {d.date}
            </div>
          ))}
        </div>
      )}

      {/* ---- LỊCH KHÁM ---- */}
      <div className="schedule-title">🗓 LỊCH KHÁM</div>

      <div className="schedule-grid">
        {selectedDay.slots.map((slot) => (
          <span 
            key={slot} 
            className="slot" 
            onClick={() => handleClickSlot(slot)}
            >
              {slot}
          </span>
        ))}
      </div>

      <div className="schedule-note">Chọn và đặt (Phí đặt lịch 0đ)</div>
    </div>
  );
}

export default ScheduleCard;
