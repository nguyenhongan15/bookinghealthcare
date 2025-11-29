import './Home.css'
import { Link } from "react-router-dom";

import Specialgrid from '../../components/Specialgrid/Specialgrid'
import ClinicGrid from "../../components/ClinicGrid/ClinicGrid";



function Home() {
  return (
    <div className="home-page">
      {/* Banner */}
      <section className="home-banner" id="tai-nha">
        <div className="home-banner-inner">
          <h1 className="home-banner-title">
            Đặt lịch khám bệnh, tư vấn sức khoẻ từ xa và làm đẹp
          </h1>

          <div className="home-search-box">
            <input
              type="text"
              placeholder="Tìm gói khám tổng quát"
              className="home-search-input"
            />
            <button className="home-search-btn">🔍</button>
          </div>

          <div className="home-tabs">
            <button className="home-tab active">Tất cả</button>
            <button className="home-tab">Tại nhà</button>
            <button className="home-tab" id="tai-vien">
              Tại viện
            </button>
            <button className="home-tab" id="song-khoe">
              Sống khỏe
            </button>
          </div>
        </div>
      </section>



      {/* Chuyên khoa nổi bật */}
      <section className="home-section">
        <div className="home-section-header">
          <h2>Chuyên khoa</h2>
          <Link to="/kham-chuyen-khoa" className="home-more-btn">Xem thêm</Link>
        </div>
        <Specialgrid limit={4} />

      </section> 
      
      {/* Cơ sở y tế */}
      <section className="home-section">
        <div className="home-section-header">
          <h2>Cơ sở y tế</h2>
          <Link to="/co-so-y-te" className="home-more-btn">Xem thêm</Link>
        </div>

      <ClinicGrid limit={4} />

      </section>

    </div>
  )
}

export default Home
