import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Specialgrid.css";
import { specialityService } from "../../services/specialityService";
import { API_BASE } from "../../config/env";

function Specialgrid({ limit }) {
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await specialityService.getAllSpecialities();
        let data = res.data.data || res.data;

        if (limit) data = data.slice(0, limit);

        setSpecialities(data);
      } catch (error) {
        console.error("Lỗi load chuyên khoa:", error);
      }
    };

    fetchData();
  }, [limit]);

  return (
    <div className="specialty-grid">
      {specialities.map((item) => (
        <Link key={item.id} to={`/chuyen-khoa/${item.code}`} className="specialty-card">

          <img
            src={item.image ? `${API_BASE}${item.image}` : "/default.png"}
            alt={item.title}
            className="specialty-img"
          />
          <div className="specialty-name">{item.title}</div>
        </Link>
      ))}
    </div>
  );
}

export default Specialgrid;
