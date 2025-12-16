import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Clinicpage.css";
import { clinicService } from "../../services/clinicService";
import { doctorService } from "../../services/doctorService";
import { scheduleService } from "../../services/scheduleService";
import { API_BASE } from "../../config/env";

function ClinicDetail() {
  const { id } = useParams(); // id clinic
  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState({}); // { doctorId: [ { day, slots: [] } ] }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Lấy thông tin clinic
        const clinicRes = await clinicService.getClinicById(id);
        const clinicData = clinicRes.data.data || clinicRes.data;
        setClinic(clinicData);

        // 2. Lấy bác sĩ thuộc clinic
        const doctorRes = await doctorService.getDoctorsByClinic(id);
        const doctorList = doctorRes.data.data || doctorRes.data;
        setDoctors(doctorList);

        // 3. Lấy lịch khám của từng bác sĩ
        const map = {};

        for (const d of doctorList) {
          const dayRes = await scheduleService.getAvailableDays(d.id);
          const days = dayRes.data.data || dayRes.data || [];

          const dayWithSlots = [];

          for (const day of days) {
            const slotRes = await scheduleService.getAvailableSlots(day.id);
            const slots = slotRes.data.data || slotRes.data || [];
            dayWithSlots.push({ ...day, slots });
          }

          map[d.id] = dayWithSlots;
        }

        setSchedules(map);
      } catch (err) {
        console.error("Lỗi load clinic detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 40 }}>Đang tải dữ liệu...</div>;
  }

  if (!clinic) {
    console.error("API trả về sai:", clinicRes.data);
    return <div style={{ padding: 40 }}>Không tìm thấy cơ sở y tế</div>;
  }

  return (
    <div className="clinic-page">
      {/* Thông tin cơ sở y tế */}
      <div className="clinic-detail-header">
        {clinic.image && (
          <img
          src={`${API_BASE}${clinic.image}`}
            alt={clinic.name}
            className="clinic-detail-img"
          />
        )}

        <div className="clinic-detail-info">
          <h1 className="clinic-title">{clinic.name}</h1>
          <p className="clinic-detail-address">{clinic.address}</p>
          {clinic.hotline && (
            <p className="clinic-detail-hotline">Hotline: {clinic.hotline}</p>
          )}
        </div>
      </div>

      {/* Danh sách bác sĩ */}
      <h2 className="clinic-section-title">Bác sĩ tại cơ sở</h2>
      {doctors.length === 0 && <p>Chưa có bác sĩ nào được cấu hình.</p>}

      <div className="clinic-doctor-list">
        {doctors.map((doc) => (
          <div key={doc.id} className="clinic-doctor-card">
            <div className="clinic-doctor-main">
              <img
                src={
                  doc.image
                    ? `${API_BASE}${doc.image}`
                    : "/default-doctor.png"
                }
                alt={doc.name}
                className="clinic-doctor-avatar"
              />
              <div className="clinic-doctor-info">
                <Link
                  to={`/bac-si/thong-tin/${doc.id}`}
                  className="clinic-doctor-name"
                >
                  {doc.name}
                </Link>
                <div className="clinic-doctor-meta">
                  <span>{doc.speciality?.title}</span>
                  {doc.location && <span>• {doc.location}</span>}
                  {clinic.name && <span>• {clinic.name}</span>}
                </div>
                {doc.expertise && (
                  <p className="clinic-doctor-expertise">
                    Nhận khám: {doc.expertise}
                  </p>
                )}
              </div>
            </div>

            <div className="clinic-doctor-schedule">
                <h4>Giới thiệu</h4>
                <p>{doc.description || "Chưa có mô tả cho bác sĩ."}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default ClinicDetail;
