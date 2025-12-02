import { useLocation, useNavigate } from "react-router-dom";
import "./BookingTicket.css";
import logo from "../../assets/icons/logo.svg";

function BookingTicket() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Không có dữ liệu đặt khám!</h2>
        <button onClick={() => navigate("/")}>Về trang chủ</button>
      </div>
    );
  }

  const { ticket } = state;

  return (
    <div className="ticket-container">

      {/* KHUNG TRẮNG BAO TOÀN BỘ */}
      <div className="ticket-box">

        {/* LOGO + TEXT TRONG KHUNG */}
        <div className="header-row">
          <img src={logo} alt="logo" className="ticket-logo" />
          <span className="ticket-brand">HealthCare Service</span>
        </div>

        <h2 className="ticket-title">PHIẾU THÔNG TIN KHÁM BỆNH</h2>

        <div className="ticket-row">
          <span>Tên bệnh nhân</span>
          <strong>{ticket.fullname}</strong>
        </div>

        <div className="ticket-row">
          <span>Năm sinh</span>
          <strong>{ticket.birthyear}</strong>
        </div>

        <div className="ticket-row">
          <span>Số điện thoại</span>
          <strong>{ticket.phone}</strong>
        </div>

        <div className="ticket-row">
          <span>Ngày khám</span>
          <strong>{ticket.date}</strong>
        </div>

        <div className="ticket-row">
          <span>Giờ khám</span>
          <strong>{ticket.slot}</strong>
        </div>

        <div className="ticket-row">
          <span>Bác sĩ</span>
          <strong>{ticket.doctor.name}</strong>
        </div>

        <div className="ticket-row">
          <span>Nơi khám</span>
          <strong>{ticket.clinic?.name}</strong>
        </div>

        <div className="ticket-row">
          <span>Địa chỉ</span>
          <strong>{ticket.clinic?.address}</strong>
        </div>

        <div className="ticket-note">
          <b>Lưu ý</b>
          <ul>
            <li>Vui lòng đến Quầy tiếp nhận trước hẹn 15 phút.</li>
            <li>Xuất trình phiếu này cho nhân viên để làm thủ tục.</li>
            <li>Đảm bảo thông tin chính xác trước khi khám.</li>
          </ul>
        </div>

      </div>

      {/* BUTTONS */}
      <div className="ticket-actions">
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="ticket-btn"
        >
          Sao chép liên kết
        </button>

        <button className="ticket-btn-outline">
          Tải hướng dẫn
        </button>
      </div>
    </div>
  );
}

export default BookingTicket;
