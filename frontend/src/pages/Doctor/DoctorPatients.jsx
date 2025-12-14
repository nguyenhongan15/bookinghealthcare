import "./DoctorPatients.css";
import { useEffect, useState } from "react";
import { User, FileText, X, Phone } from "lucide-react";
import api from "../../services/http";
import { healthProfileService } from "../../services/healthProfileService";

export default function DoctorPatients() {
  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?.doctorId;

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [patientName, setPatientName] = useState("");

  // =====================
  // LOAD PATIENT LIST
  // =====================
  useEffect(() => {
    if (!doctorId) return;

    api
      .get("/bookings/doctor-schedule", {
        params: { doctorId },
      })
      .then((res) => {
        const list = res.data?.data || [];

        /**
         * doctor-schedule đã order desc theo createdAt
         * → bệnh nhân mới nằm trên
         * → chỉ cần lọc trùng userId
         */
        const map = new Map();

        list.forEach((b) => {
          if (!b.userId) return;
          if (!map.has(b.userId)) {
            map.set(b.userId, {
              userId: b.userId,
              patientName: b.patientName,
              patientPhone: b.patientPhone,
              lastDate: b.date,
              lastTime: b.time,
            });
          }
        });

        setPatients(Array.from(map.values()));
      })
      .finally(() => setLoading(false));
  }, [doctorId]);

  // =====================
  // VIEW HEALTH PROFILE
  // =====================
  const viewHealthProfile = async (p) => {
    try {
      const res = await healthProfileService.doctorViewPatient(
        p.userId,
        doctorId
      );

      if (res.data?.success) {
        setProfile(res.data.data);
        setPatientName(p.patientName);
        setShowProfile(true);
      } else {
        alert(res.data?.message || "Không thể xem hồ sơ");
      }
    } catch {
      alert("Không thể xem hồ sơ sức khoẻ");
    }
  };

  if (loading) {
    return <div className="dp-page">Đang tải danh sách bệnh nhân...</div>;
  }

  return (
    <div className="dp-page">
      <h1>Bệnh nhân của tôi</h1>
      <p className="dp-sub">Bệnh nhân mới nhất được hiển thị trên cùng</p>

      {patients.length === 0 ? (
        <div className="dp-empty">Chưa có bệnh nhân</div>
      ) : (
        <div className="dp-list">
          {patients.map((p, idx) => (
            <div key={p.userId} className="dp-item">
              <div className="dp-left">
                <div className="dp-avatar">
                  <User size={18} />
                </div>

                <div className="dp-info">
                  <div className="dp-name">
                    {idx === 0 && <span className="dp-new">MỚI</span>}
                    {p.patientName}
                  </div>

                  <div className="dp-meta">
                    <span>
                      <Phone size={14} /> {p.patientPhone}
                    </span>
                    <span>
                      🕒 {p.lastDate} | {p.lastTime}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="dp-view-btn"
                onClick={() => viewHealthProfile(p)}
              >
                <FileText size={16} />
                Xem hồ sơ
              </button>
            </div>
          ))}
        </div>
      )}

      {/* =====================
          HEALTH PROFILE POPUP
         ===================== */}
      {showProfile && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button
              className="modal-close"
              onClick={() => setShowProfile(false)}
            >
              <X size={18} />
            </button>

            <h3>Hồ sơ sức khoẻ</h3>
            <p className="patient-name">{patientName}</p>

            <div className="hp-section">
              <strong>Tiền sử bệnh</strong>
              <p>{profile?.medicalHistory || "Không có"}</p>
            </div>

            <div className="hp-section">
              <strong>Dị ứng</strong>
              <p>{profile?.allergies || "Không có"}</p>
            </div>

            <div className="hp-section">
              <strong>Thuốc đang dùng</strong>
              <p>{profile?.currentMedications || "Không có"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
