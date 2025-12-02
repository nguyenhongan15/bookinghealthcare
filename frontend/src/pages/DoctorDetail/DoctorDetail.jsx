import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import "./DoctorDetail.css";
import { doctorService } from "../../services/doctorService";
import { scheduleService } from "../../services/scheduleService";

function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [days, setDays] = useState([]);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await doctorService.getDoctorById(id);
        const data = res.data.data || res.data;
        setDoctor(data);
      } catch (err) {
        console.error("Lỗi load doctor:", err);
      }
    };

    const fetchScheduleDays = async () => {
      try {
        const res = await scheduleService.getAvailableDays(id);
        const data = res.data.data || res.data || [];
        setDays(data);
        if (data.length > 0) setSelectedDayId(data[0].id);
      } catch (err) {
        console.error("Lỗi load schedule days:", err);
      }
    };

    fetchDoctor();
    fetchScheduleDays();
  }, [id]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDayId) return;
      try {
        const res = await scheduleService.getAvailableSlots(selectedDayId);
        const data = res.data.data || res.data || [];
        setSlotsMap((prev) => ({ ...prev, [selectedDayId]: data }));
      } catch (err) {
        console.error("Lỗi load slots:", err);
      }
    };

    fetchSlots();
  }, [selectedDayId]);

  if (!doctor) {
    return <div style={{ padding: 40 }}>Đang tải thông tin bác sĩ...</div>;
  }

  

  return (
    <div className="doctor-detail-page">
      <div className="doctor-detail-main">
        <img
          src={
            doctor.image
              ? `http://localhost:8080${doctor.image}`
              : "/default-doctor.png"
          }
          alt={doctor.name}
          className="doctor-detail-avatar"
        />
        <div className="doctor-detail-info">
          <h1 className="doctor-detail-name">{doctor.name}</h1>
          <div className="doctor-detail-meta">
            {doctor.speciality?.title && <span>{doctor.speciality.title}</span>}
            {doctor.location && <span>• {doctor.location}</span>}
            {doctor.clinic?.name && <span>• {doctor.clinic.name}</span>}
          </div>

          <p className="doctor-detail-short">
            {doctor.description || frontendDescription}
          </p>
        </div>
      </div>

        {/* 🔥 THAY LỊCH KHÁM BẰNG THÀNH TÍCH / ACHIEVEMENT */}
        <div className="doctor-detail-achievement">
            <h2>Giới thiệu sơ lược về bác sĩ</h2>

            {doctor.achievement && doctor.achievement.trim() !== "" ? (
            <p className="doctor-achievement-text">{doctor.achievement}</p>
            ) : (
                <p className="doctor-achievement-text">Đang cập nhật...</p>
        )}
        </div>


        <div className="dat-lich-kham">
            <Link to={`/dat-lich-kham/bac-si/${doctor.id}`} 
            /*<Link to="/dat-lich-kham" state={{ doctor }}*/
            
            >  
                Đặt lịch khám với bác sĩ
            </Link>

        </div>
    </div>
  );
}

export default DoctorDetail;
