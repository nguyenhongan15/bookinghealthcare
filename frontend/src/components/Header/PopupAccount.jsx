import "./PopupAccount.css";

export default function PopupAccount({ user, onLogout, onClose, pos }) {
  return (
    <>
      {/* Overlay mờ phía sau — click để đóng */}
      <div className="acc-overlay" onClick={onClose}></div>

      {/* POPUP */}
      <div
        className="acc-popup"
        style={{
          left: pos.x,          // 📌 Căn giữa theo icon
          top: pos.y            // 📌 Hiển thị ngay dưới icon
        }}
      >
        <div className="acc-header">
          <div className="acc-avatar">{user.fullName[0]}</div>

          <div>
            <div className="acc-name">
              {user.role === "DOCTOR" ? user.doctor?.fullName : user.fullName}
            </div>
            <div className="acc-email">{user.email}</div>
          </div>
        </div>

        <button className="acc-btn">Thông tin tài khoản</button>
        <button className="acc-btn">Lịch hẹn của tôi</button>
        <button className="acc-btn logout" onClick={onLogout}>Đăng xuất</button>
      </div>
    </>
  );
}
