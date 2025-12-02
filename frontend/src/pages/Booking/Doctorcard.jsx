import "./Doctorcard.css";
import ScheduleCard from "../../components/Schedule/ScheduleCard";

import { useNavigate } from "react-router-dom";

function Doctorcard({ id, name, desc, image, location, expertise, schedule }) {
  const navigate = useNavigate();

  return (
    <div className="doctor-card">

      {/* LEFT SIDE */}
      <div className="doctor-left">
        <img src={image} alt={name} className="doctor-img" />

        <div className="doctor-info">
          <span className="doctor-badge">Yêu thích</span>
          <h3 className="doctor-name doctor-link" 
              onClick={() => navigate(`/bac-si/thong-tin/${id}`)}>{name}</h3>
          <p className="doctor-desc">{desc}</p>
          <p className="doctor-location">📍 {location}</p>

          <span className="doctor-viewmore"
            onClick={() => navigate(`/bac-si/thong-tin/${id}`)}
          >Xem thêm</span>
        </div>
      </div>

      {/* RIGHT SIDE — LỊCH, ĐỊA CHỈ, GIÁ */}
      <div className="doctor-right">

        <div className="doctor-info-card">
  
          {/* LỊCH KHÁM */}
          <div className="section">
            <h3 className="section-title">🗓 Lịch khám</h3>
            <ScheduleCard schedules={schedule} doctor={{ id, name, desc, image, location }} />
          </div>

          {/* ĐỊA CHỈ KHÁM */}
          <div className="section">
            <h3 className="section-title">Địa chỉ khám</h3>
            <p className="section-content">{location}</p>
          </div>

          {/* GIÁ KHÁM */}  
          <div className="section">
            <h3 className="section-title">Giá khám</h3>
            <p className="section-price">
              500.000đ <span className="price-detail">Xem chi tiết</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Doctorcard;
