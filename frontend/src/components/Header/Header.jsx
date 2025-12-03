import { useState, useEffect, useRef } from "react";
import "./Header.css";

import LogoIcon from "../../assets/icons/logo.svg";
import profileIcon from "../../assets/icons/profile.svg";

import RegisterLoginPopup from "../../pages/Auth/RegisterLoginPopup";
import PopupAccount from "./PopupAccount";
import DoctorChatPopup from "../Chat/DoctorChatPopup";

import { Link, NavLink } from "react-router-dom";

function Header() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [user, setUser] = useState(null);

  const profileBtnRef = useRef(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowAccountPopup(false);
  };

  const openAccountPopup = () => {
    if (profileBtnRef.current) {
      const rect = profileBtnRef.current.getBoundingClientRect();

      setPopupPos({
        x: rect.left + rect.width / 2,  // 📌 Căn giữa theo icon
        y: rect.bottom + 50              // 📌 Hiện ngay dưới icon (8px margin)
      });
    }
    setShowAccountPopup(true);
  };

  return (
    <header className="bc-header">
      <div className="bc-header-inner">

        {/* LOGO */}
        <div className="bc-logo-area">
          <Link to="/" className="bc-logo">
            <img src={LogoIcon} alt="Logo" className="bc-logo-image" />

            <div className="bc-logo-text">
              <span className="bc-logo-main">HealthCare</span>
              <span className="bc-logo-sub">Nền tảng chăm sóc sức khỏe</span>
            </div>
          </Link>
        </div>

        {/* MENU */}
        <nav className="bc-nav">
          <NavLink to="/" className="bc-nav-item">Trang chủ</NavLink>
          <a className="bc-nav-item" href="#tai-nha">Tại nhà</a>
          <a className="bc-nav-item" href="#tai-vien">Tại viện</a>
          <a className="bc-nav-item" href="#song-khoe">Bài viết</a>
        </nav>

        {/* ACTIONS */}
        <div className="bc-header-actions">
          <Link to="/tim-kiem" className="bc-header-link">Tìm kiếm</Link>

          {/* PROFILE */}
          <button
            ref={profileBtnRef}
            className="bc-header-link profile-btn"
            onClick={() => {
              if (user) openAccountPopup();
              else setShowLoginPopup(true);
            }}
          >
            <img src={profileIcon} alt="Profile" style={{ width: 20 }} />
            {user ? user.fullName.split(" ").slice(-1)[0] : "Tài khoản"}
          </button>
          {/* </button>

          <button className="bc-header-btn">Chat </button>
        </div> */}

          {user ? (
            user.role === "DOCTOR" ? (
              <button
                className="bc-header-btn"
                onClick={() => setShowChatPopup(true)}
              >
                  Chat
              </button>
            ) : (
            <Link to="/lich-hen" className="bc-header-btn">
              Lịch hẹn
            </Link>
          )
        ) : (
          // chưa đăng nhập → khi bấm Chat thì mở Login
          <button
            className="bc-header-btn"
            onClick={() => setShowLoginPopup(true)}
          >
            Chat
        </button>
      )}
      </div>
    </div>
      {/* POPUP ACCOUNT */}
      {showAccountPopup && user && (
        <PopupAccount
          user={user}
          onLogout={handleLogout}
          onClose={() => setShowAccountPopup(false)}
          pos={popupPos}   // 📌 truyền vị trí popup xuống component
        />
      )}

      {/* POPUP LOGIN */}
      {showLoginPopup && (
        <RegisterLoginPopup
          onClose={() => setShowLoginPopup(false)}
          onUpdated={() => {
            const u = localStorage.getItem("user");
            if (u) setUser(JSON.parse(u));
          }}
        />
      )}
      {/* {showChatPopup && user?.role === "DOCTOR" && (
        <DoctorChatPopup
          doctor={{ id: user.doctorId, name: user.fullName }}
          onClose={() => setShowChatPopup(false)}
        />
      )} */}
      {showChatPopup && user?.role === "DOCTOR" && (
        <DoctorChatPopup onClose={() => setShowChatPopup(false)} />
      )}

      {showChatPopup && user?.role === "USER" && (
        <UserChatPopup onClose={() => setShowChatPopup(false)} />
      )}

    </header>
  );
}

export default Header;
