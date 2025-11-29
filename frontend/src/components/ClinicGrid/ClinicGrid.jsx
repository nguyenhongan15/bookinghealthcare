import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ClinicGrid.css";
import { clinicService } from "../../services/clinicService";

function ClinicGrid({ limit }) {
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await clinicService.getAllClinics();
        let data = res.data.data || res.data; // Tùy backend trả ApiResponse hay List

        if (limit) data = data.slice(0, limit);

        setClinics(data);
      } catch (err) {
        console.error("Lỗi load cơ sở y tế:", err);
      }
    };

    fetchClinics();
  }, [limit]);

  return (
    <div className="clinic-grid">
      {clinics.map((item) => (
        <Link 
          to={`/co-so-y-te/${item.id}`} 
          className="clinic-card" 
          key={item.id}
        >
          <img
            src={
              item.image
                ? `http://localhost:8080${item.image}` // ảnh lưu trong DB dạng /images/clinics/file.jpg
                : "/default.png"
            }
            alt={item.name}
            className="clinic-img"
          />

          <div className="clinic-name">{item.name}</div>
          <div className="clinic-address">{item.address}</div>
        </Link>
      ))}
    </div>
  );
}

export default ClinicGrid;
