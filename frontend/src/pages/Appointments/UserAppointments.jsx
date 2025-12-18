import "./Appointments.css";
import { CalendarDays, Clock, Stethoscope, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { bookingService } from "../../services/bookingService";
import CancelBookingPopup from "./CancelBookingPopup";
import ReviewPopup from "./ReviewPopup";


export default function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [now, setNow] = useState(new Date());
  const [reviewBooking, setReviewBooking] = useState(null);



  // ❌ Chưa đăng nhập
  if (!userId) {
    return (
      <div className="appointments-page">
        <h1>Lịch khám của tôi</h1>
        <div className="empty">Vui lòng đăng nhập để xem lịch hẹn</div>
      </div>
    );
  }

  useEffect(() => {
    if (!userId) return;
  
    bookingService
      .getByUserId(userId)
      .then((res) => {
        const data = res.data?.data || [];
        setAppointments(data);
        setFilteredAppointments(data);
      })
      .catch((err) => {
        console.error("❌ Lỗi lấy lịch hẹn:", err);
      })
      .finally(() => {
        setLoading(false); // ✅ BẮT BUỘC
      });
  }, [userId]);
  

  // 🔍 LỌC THEO NGÀY
  useEffect(() => {
    if (!selectedDate) {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter((b) => b.date === selectedDate)
      );
    }
  }, [selectedDate, appointments]);

  // ⏳ Loading
  if (loading) {
    return <div className="appointments-page">Đang tải lịch hẹn...</div>;
  }

  // 👉 MỞ POPUP HUỶ
  const openCancelPopup = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelPopup(true);
  };

  // ✅ XÁC NHẬN HUỶ
  const confirmCancel = async () => {
    try {
      await bookingService.updateStatus(selectedBookingId, "CANCELLED");

      setAppointments((prev) =>
        prev.map((b) =>
          b.id === selectedBookingId
            ? { ...b, status: "CANCELLED" }
            : b
        )
      );
    } catch (err) {
      alert("Không thể huỷ lịch, vui lòng thử lại");
      console.error(err);
    } finally {
      setShowCancelPopup(false);
      setSelectedBookingId(null);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000); // 30 giây update 1 lần
  
    return () => clearInterval(timer);
  }, []);
  
  function getSlotEndDateTime(item) {
    // item.date = "2025-12-18"
    // item.scheduleSlot.slot = "09:00 - 10:00"
    if (!item.date || !item.scheduleSlot?.slot) return null;
  
    const endTime = item.scheduleSlot.slot.split(" - ")[1]; // "10:00"
    return new Date(`${item.date}T${endTime}`);
  }
  
  function canReview(item) {
    const slotEnd = getSlotEndDateTime(item);
    if (!slotEnd) return false;
  
    return now > slotEnd && item.reviewed !== true;
  }
  

  return (
    <div className="appointments-page">
      <h1>Lịch khám của tôi</h1>

      {/* 🔍 FILTER BAR */}
      <div className="filter-bar">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        {selectedDate && (
          <button onClick={() => setSelectedDate("")}>
            Xoá lọc
          </button>
        )}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="empty">
          Không có lịch khám trong ngày này
        </div>
      ) : (
        <div className="appointment-list">
          {filteredAppointments.map((item) => (
            <div key={item.id} className="appointment-card">
              {/* NGÀY */}
              <div className="row">
                <CalendarDays size={18} />
                <span>{item.date}</span>
              </div>

              {/* GIỜ */}
              <div className="row">
                <Clock size={18} />
                <span>{item.scheduleSlot?.slot}</span>
              </div>

              {/* BÁC SĨ */}
              <div className="row">
                <Stethoscope size={18} />
                <span>{item.doctor?.name}</span>
              </div>

              {/* ĐỊA CHỈ */}
              <div className="row">
                <Building2 size={18} />
                <span>{item.doctor?.clinic?.address}</span>
              </div>

              {/* TRẠNG THÁI */}
              <span className={`status ${item.status?.toLowerCase()}`}>
                {item.status}
              </span>

              {/* ACTION */}
              {item.status === "PENDING" && (
                <button
                  className="cancel-btn"
                  onClick={() => openCancelPopup(item.id)}
                >
                  Huỷ lịch
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* POPUP HUỶ LỊCH */}
      <CancelBookingPopup
        open={showCancelPopup}
        onClose={() => {
          setShowCancelPopup(false);
          setSelectedBookingId(null);
        }}
        onConfirm={confirmCancel}
      />
      {reviewBooking && (
      <ReviewPopup
            booking={reviewBooking}
            onClose={() => setReviewBooking(null)}
            onSuccess={() => {
              bookingService.getByUserId(userId).then(res => {
                const data = res.data?.data || [];
                setAppointments(data);
                setFilteredAppointments(data);
              });
            }}
       />
       )}

    </div>
  );
}
