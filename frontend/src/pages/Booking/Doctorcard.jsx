import "./Doctorcard.css";
import ScheduleCard from "../../components/Schedule/ScheduleCard";

function Doctorcard({ name, desc, image, location, schedule }) {
  return (
    <div className="doctor-card">

      {/* LEFT SIDE */}
      <div className="doctor-left">
        <img src={image} alt={name} className="doctor-img" />

        <div className="doctor-info">
          <span className="doctor-badge">Yêu thích</span>
          <h3 className="doctor-name">{name}</h3>
          <p className="doctor-desc">{desc}</p>
          <p className="doctor-location">📍 {location}</p>

          <span className="doctor-viewmore">Xem thêm</span>
        </div>
      </div>

      {/* RIGHT SIDE — LỊCH NẰM Ở ĐÂY */}
      <div className="doctor-right">
        {/*<ScheduleCard schedules={schedule} />*/} {/*giu doan nay neu loi thi bo ra lai */}
        <ScheduleCard schedules={schedule} doctor={{ name, desc, image, location }} />


        <div className="doctor-address">
          <h4>Địa chỉ khám</h4>
          
        </div>

        <div className="doctor-price">
          <h4>Giá khám:</h4>
          <p>
            500.000đ <span className="price-detail">Xem chi tiết</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Doctorcard;
