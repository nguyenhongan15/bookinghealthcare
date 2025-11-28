import "./Footer.css";
import LogoIcon from "../../assets/icons/logo.svg";

function Footer() {
  return (
    <footer className="bc-footer">

      {/* ======= TOP SECTION (3 COLUMNS) ======= */}
      <div className="footer-grid">

        {/* LEFT: Company info */}
        <div className="footer-info">
          <h4>Môn Công nghệ phần mềm</h4>
          <p>📍 Nhóm Thành – Mùi – Ân – Lộc</p>
          <p>🧾 Dự án đặt lịch khám chữa bệnh - tư vấn sức khoẻ online</p>
          <p>📞 Zalo: 0383376067 (9h - 20h)</p>
          <p>📧 anngh2004@gmail.com (9h - 20h)</p>


          
        </div>

        {/* CENTER COLUMN: Logo + Links */}
        <div className="footer-center">
          <div className="footer-logo">
            <img src={LogoIcon} alt="HealthCare" />
            <span className="footer-logo-text">HealthCare</span>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <a href="#">Liên hệ hợp tác</a>
              <a href="#">Chuyển đổi số</a>
              <a href="#">Chính sách bảo mật</a>
              <a href="#">Quy chế hoạt động</a>
            </div>

            <div className="footer-col">
              <a href="#">Tuyển dụng</a>
              <a href="#">Điều khoản sử dụng</a>
              <a href="#">Câu hỏi thường gặp</a>
              <a href="#">Sức khỏe doanh nghiệp</a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN removed (Đối tác nội dung) */}

      </div>

      {/* ======= DOWNLOAD APP ROW ======= */}
      <div className="footer-download">
        📱 Tải ứng dụng HealthCare cho điện thoại hoặc máy tính bảng:
        <a href="#"> Android </a> - 
        <a href="#"> iPhone/iPad </a> - 
        <a href="#"> Khác </a>
      </div>

      {/* ======= BOTTOM BAR ======= */}
      <div className="footer-bottom">
        <p>© 2025 HealthCare.</p>

        <div className="footer-social">
          <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok" />
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
          <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="Youtube" />
        </div>
      </div>

    </footer>
  );
}

export default Footer;
