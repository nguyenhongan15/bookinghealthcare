import api from "../../services/http";
import "./PopupAccount.css";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config/env";

export default function PopupAccount({ user, onLogout, onClose, pos }) {
  const navigate = useNavigate();

  const go = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      {/* Overlay */}
      <div className="acc-overlay" onClick={onClose}></div>

      {/* Popup */}
      <div
        className="acc-popup"
        style={{ left: pos.x, top: pos.y }}
      >
        {/* HEADER */}
        <div className="acc-header">
          <div className="acc-avatar">
            {(user.role === "DOCTOR"
              ? user.doctor?.fullName
              : user.fullName)?.[0]}
          </div>

          <div>
            <div className="acc-name">
              {user.role === "DOCTOR"
                ? user.doctor?.fullName
                : user.fullName}
            </div>
            <div className="acc-email">{user.email}</div>
          </div>
        </div>

        {/* ===== USER ===== */}
        {user.role === "USER" && (
          <>
            <button
              className="acc-btn"
              onClick={() => go("/profile")}
            >
              Thông tin tài khoản
            </button>

            <button
              className="acc-btn"
              onClick={() => go("/profile/health")}
            >
              Hồ sơ sức khoẻ
            </button>
          </>
        )}

        {/* ===== DOCTOR ===== */}
        {user.role === "DOCTOR" && (
          <>
            <button
              className="acc-btn"
              onClick={() => go("/doctor/profile")}
            >
              Thông tin bác sĩ
            </button>

            <button
              className="acc-btn"
              onClick={() => go("/doctor/patients")}
            >
              Danh sách bệnh nhân
            </button>
          </>
        )}

        {/* LOGOUT */}
        <button className="acc-btn logout" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </>
  );
}
