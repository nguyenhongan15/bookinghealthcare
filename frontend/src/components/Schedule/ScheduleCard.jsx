import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ScheduleCard.css";

const VIET_DAY = {
  Mon: "Thứ 2",
  Tue: "Thứ 3",
  Wed: "Thứ 4",
  Thu: "Thứ 5",
  Fri: "Thứ 6",
  Sat: "Thứ 7",
};

function getToday() {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  return now;
}

function getNextDateOf(dayName) {
  const map = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  const today = getToday();
  const todayDay = today.getDay();

  const target = map[dayName];

  let diff = target - todayDay;
  if (diff < 0) diff += 7;

  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  result.setHours(12, 0, 0, 0);

  return result.toISOString().slice(0, 10);
}

function formatVietnameseDate(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("vi-VN");
}

function getWeekRangeFromDate(dateStr) {
  const date = new Date(dateStr + "T12:00:00");
  const day = date.getDay(); // 0 = Sunday

  const mondayOffset = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10)
  };
}



function ScheduleCard({ schedules, doctor }) {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(null);
  const [open, setOpen] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      setSelectedDay(schedules[0]);
    }
  }, [schedules]);

  useEffect(() => {
    if (!doctor || !selectedDay) return;

    const realDate = getNextDateOf(selectedDay.day);
    fetch(`http://localhost:8080/api/bookings/booked-slots?doctorId=${doctor.id}&date=${realDate}`)


      .then(res => res.json())
      .then(api => {
        if (api.data) {
          setBookedSlots(api.data); // danh sách slotId đã đặt
        }
      })
      .catch(err => console.error("Booked slot error", err));
  }, [doctor, selectedDay]);
  

  if (!schedules || schedules.length === 0) {
    return (
      <div className="schedule-box">
        <div className="schedule-top no-schedule">Không có lịch cố định</div>
        <button
          className="btn-register"
          onClick={() =>
            navigate("/dat-lich-kham", {
              state: { doctor, date: "Không cố định", slot: { id: null, slot: "Tự chọn" }, },  
            })
          }
        >
          Đăng ký khám
        </button>
      </div>
    );
  }

  if (!selectedDay) {
    return <div className="schedule-box">Đang tải lịch khám...</div>;
  }

  const realDate = getNextDateOf(selectedDay.day); 

  const handleClickSlot = (slotObj) => {  
    navigate("/dat-lich-kham", {
      state: {
        fromDoctorPage: true, 
        doctor,
        date: realDate,
        slot: slotObj, 
      },
    });
  };

  // Sắp xếp slot tăng dần theo giờ bắt đầu
  const sortedSlots = [...(selectedDay.slots || [])].sort((a, b) => {
    const getStartMinutes = (slotStr) => {
      const [start] = slotStr.slot.split(" - ");   // lấy phần "hh:mm"
      const [h, m] = start.split(":");
      return parseInt(h) * 60 + parseInt(m);
    };
    return getStartMinutes(a) - getStartMinutes(b);
  });

  return (
    <div className="schedule-box">
      <div className="schedule-top" onClick={() => setOpen(!open)}>
      {VIET_DAY[selectedDay.day]} ({formatVietnameseDate(getNextDateOf(selectedDay.day))})

        <span className="arrow">▼</span>
      </div>

      {open && (
        <div className="dropdown-days">
          {schedules.map((d) => (
            <div
              key={d.id}
              className="dropdown-item"
              onClick={() => {
                setSelectedDay(d);
                setOpen(false);
              }}
            >
              {VIET_DAY[d.day]} ({formatVietnameseDate(getNextDateOf(d.day))})

            </div>
          ))}
        </div>
      )}

      <div className="schedule-title">Chọn giờ khám</div>

      <div className="schedule-grid">

      {sortedSlots.map((slot) => {
        const disabled = bookedSlots.includes(slot.id);

        return (
          <span
            key={slot.id}
            className={`slot ${disabled ? "slot-disabled" : ""}`}
            onClick={() => !disabled && handleClickSlot({ id: slot.id, slot: slot.slot })}
          >
            {slot.slot}
          </span>
        );
      })}

      </div>

      <div className="schedule-note">Chọn và đặt (Phí đặt lịch 0đ)</div>
    </div>
  );
}

export default ScheduleCard;
