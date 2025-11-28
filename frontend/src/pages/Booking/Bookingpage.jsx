import { useParams } from "react-router-dom";
import "./Bookingpage.css";

import Doctorcard from "./Doctorcard";


import { doctorData } from "../../fakedata/doctors";

function Bookingpage() {
  const { slug } = useParams();

  // Tìm bác sĩ theo slug
  const specialty = doctorData[slug];
  if (!specialty) {
    return <h2 style={{ padding: 40 }}>Không tìm thấy bác sĩ</h2>;
  } 

  return (
    <div className="booking-container">
      <div className="booking-breadcrumb">
        Khám chuyên khoa / <span className="current">{specialty.title}</span>
      </div>

      <h1 className="booking-title">{specialty.title}</h1>

      <div className="booking-description">
        <h3>Các bác sĩ chuyên khoa {specialty.title} cực kỳ uy tín</h3>
        <span className="view-more">Xem thêm</span>
      </div>

      <div className="booking-filters">
        <select>
          <option>Toàn quốc</option>
          <option>Hà Nội</option>
          <option>Đà Nẵng</option>
          <option>TP Hồ Chí Minh</option>
        </select>
      </div>

      {specialty.doctors.map((doc) => (
        <div key={doc.id} className="doctor-wrapper">
          <Doctorcard {...doc} />
          
        </div>
      ))}
    </div>
  );
}
export default Bookingpage;