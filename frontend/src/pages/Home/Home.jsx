import { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

import Specialgrid from "../../components/Specialgrid/Specialgrid";
import ClinicGrid from "../../components/ClinicGrid/ClinicGrid";
import AISuggestChat from "../../components/AI/AISuggestChat";

function Home() {
  const [openAI, setOpenAI] = useState(false);

  return (
    <div className="home-page">
      {/* ================= BANNER ================= */}
      <section className="home-banner" id="tai-nha">
        <div className="home-banner-inner">
          <h1 className="home-banner-title">
            Đặt lịch khám bệnh, tư vấn sức khoẻ từ xa
          </h1>

          {/* ===== SEARCH BOX (GIỮ NGUYÊN) ===== */}
          <div className="home-search-box">
            <input
              type="text"
              placeholder="Tìm gói khám tổng quát"
              className="home-search-input"
            />
            <button className="home-search-btn">🔍</button>
          </div>

          

          {/* 🔥 NÚT CHAT AI BÊN DƯỚI */}
          <button
            className="home-ai-btn"
            onClick={() => setOpenAI(true)}
          >
            🤖 Chat với AI tư vấn sức khoẻ
          </button>

          <p className="home-ai-note">
            Nhập triệu chứng để AI gợi ý chuyên khoa và bác sĩ phù hợp
          </p>
        </div>
      </section>

      {/* ================= AI POPUP ================= */}
      {openAI && (
        <div className="ai-overlay">
          <div className="ai-popup">
            <button
              className="ai-close"
              onClick={() => setOpenAI(false)}
            >
              ✕
            </button>

            <AISuggestChat
              onPickSpeciality={(s) =>
                window.location.href = `/chuyen-khoa/${s.code}`
              }
              onPickDoctor={(d) =>
                window.location.href = `/bac-si/thong-tin/${d.id}`
              }
            />
          </div>
        </div>
      )}

      {/* ================= CHUYÊN KHOA ================= */}
      <section className="home-section">
        <div className="home-section-header">
          <h2>Chuyên khoa</h2>
          <Link to="/kham-chuyen-khoa" className="home-more-btn">
            Xem thêm
          </Link>
        </div>

        <Specialgrid limit={4} />
      </section>

      {/* ================= CƠ SỞ Y TẾ ================= */}
      <section className="home-section">
        <div className="home-section-header">
          <h2>Cơ sở y tế</h2>
          <Link to="/co-so-y-te" className="home-more-btn">
            Xem thêm
          </Link>
        </div>

        <ClinicGrid limit={4} />
      </section>
    </div>
  );
}

export default Home;
