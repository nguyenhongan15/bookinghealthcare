{/*import { useParams } from "react-router-dom";
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
export default Bookingpage;*/}



import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Bookingpage.css";

import Doctorcard from "./Doctorcard";
import { doctorService } from "../../services/doctorService";
import { specialityService } from "../../services/specialityService";

function Bookingpage() {
  const { slug } = useParams();

  const [speciality, setSpeciality] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // 1️⃣ Lấy tất cả chuyên khoa để map slug → specialityId
    specialityService.getAllSpecialities()
      .then(res => {
        const list = res.data;

        // Kiểm tra code === slug
        const match = list.find((sp) => sp.code === slug);

        setSpeciality(match);

        // Nếu tìm thấy → load bác sĩ
        if (match) {
          doctorService
            .getDoctorsBySpeciality(match.id)
            .then((res) => {
              setDoctors(res.data.data); // vì backend trả: { message, data }
            })
            .catch((err) => console.error(err));
        }
      })
      .catch(err => console.error(err));
  }, [slug]);

  if (!speciality) {
    return <h2 style={{ padding: 40 }}>Không tìm thấy chuyên khoa</h2>;
  }

  return (
    <div className="booking-container">
      <div className="booking-breadcrumb">
        Khám chuyên khoa / <span className="current">{speciality.title}</span>
      </div>

      <h1 className="booking-title">{speciality.title}</h1>

      <div className="booking-description">
        <h3>Các bác sĩ chuyên khoa {speciality.title} cực kỳ uy tín</h3>
      </div>

      <div className="booking-filters">
        <select>
          <option>Toàn quốc</option>
          <option>Hà Nội</option>
          <option>Đà Nẵng</option>
          <option>TP Hồ Chí Minh</option>
        </select>
      </div>

      {doctors.map((doc) => (
        <div key={doc.id} className="doctor-wrapper">
          <Doctorcard
            id={doc.id}
            name={doc.name}
            image={doc.image}
            description={doc.description}
            location={doc.location}
          />
        </div>
      ))}
    </div>
  );
}

export default Bookingpage;
