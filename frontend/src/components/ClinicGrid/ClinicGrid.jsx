import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ClinicGrid.css";
import { clinicService } from "../../services/clinicService";
import { API_BASE } from "../../config/env";

function ClinicGrid({ limit }) {
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await clinicService.getAllClinics();
  
        console.log("RES:", res.data);
  
        // --- FIX QUAN TRỌNG ---
        let data = res.data.data; 
  
        if (!Array.isArray(data)) {
          console.error("❌ API không trả về array:", data);
          return;
        }
  
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
                ? `${API_BASE}${item.image}`
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
