import './Header.css'
import LogoIcon from "../../assets/icons/logo.svg";

import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="bc-header">
      <div className="bc-header-inner">
        <div className="bc-logo-area">
          <div className="bc-hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <Link to="/" className="bc-logo">
          <img src={LogoIcon} alt="Logo" className="bc-logo-image" />

            <div className="bc-logo-text">
              <span className="bc-logo-main">HealthCare</span>
              <span className="bc-logo-sub">Nền tảng chăm sóc sức khỏe</span>
            </div>
          </Link>
        </div>

        <nav className="bc-nav">
          <NavLink to="/" className="bc-nav-item">
            Trang chủ
          </NavLink>
          <a className="bc-nav-item" href="#tai-nha">
            Tại nhà
          </a>
          <a className="bc-nav-item" href="#tai-vien">
            Tại viện
          </a>
          <a className="bc-nav-item" href="#song-khoe">
            Bài viết
          </a>
        </nav>

        <div className="bc-header-actions">
          <Link to="/tim-kiem" className="bc-header-link">
            Tìm kiếm
          </Link>
          <button className="bc-header-btn">Lịch hẹn</button>
        </div>
      </div>
    </header>
  )
}

export default Header
