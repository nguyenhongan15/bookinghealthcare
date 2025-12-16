import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config/env";
import "./Search.css";

import AISuggestChat from "../../components/AI/AISuggestChat";
import Specialgrid from "../../components/Specialgrid/Specialgrid";
import Doctorcard from "../Booking/Doctorcard";

import { doctorService } from "../../services/doctorService";

export default function Search() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await doctorService.getAll();
      setDoctors(res.data?.data || []);
    } catch (err) {
      console.error("Load doctors error", err);
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    !keyword ||
    d.fullName?.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="search-page">
      {/* ================= AI ================= */}
      <section className="search-ai">
        <AISuggestChat
          onPickSpeciality={(s) => {
            // 🔥 AI chọn chuyên khoa → ĐIỀU HƯỚNG
            navigate(`/chuyen-khoa/${s.code}`);
          }}
          onPickDoctor={(d) => {
            navigate(`/bac-si/thong-tin/${d.id}`);
          }}
        />
      </section>

      {/* ================= FILTER ================= */}
      <section className="search-filter">
        <input
          type="text"
          placeholder="Tìm bác sĩ theo tên..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </section>

      {/* ================= SPECIALITY GRID ================= */}
      <section className="search-section">
        <h2>Chuyên khoa</h2>

        {/* 🔥 DÙNG NGUYÊN Specialgrid – KHÔNG PROPS */}
        <Specialgrid />
      </section>

      {/* ================= DOCTOR LIST ================= */}
      <section className="search-section">
        <h2>Bác sĩ</h2>

        {filteredDoctors.length === 0 ? (
          <div className="empty">Không tìm thấy bác sĩ phù hợp</div>
        ) : (
          <div className="doctor-list">
            {filteredDoctors.map((d) => (
              <Doctorcard
                key={d.id}
                id={d.id}
                name={d.fullName}
                desc={d.description || d.speciality?.title}
                image={
                  d.image
                    ? `${API_BASE}${d.image}`
                    : "/default-doctor.png"
                }
                location={d.clinic?.address || "Đang cập nhật"}
                expertise={d.speciality?.title}
                schedule={d.schedules || []}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
