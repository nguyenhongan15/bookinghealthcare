import api from "../../services/http";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../../config/env";
import "./Bookingpage.css";

import Doctorcard from "./Doctorcard";

import { doctorService } from "../../services/doctorService";
import { specialityService } from "../../services/specialityService";
import { scheduleService } from "../../services/scheduleService";

function Bookingpage() {
  const { slug } = useParams();

  const [speciality, setSpeciality] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState({}); // doctorId → schedule

  useEffect(() => {
    async function load() {
      try {
        const res = await specialityService.getAllSpecialities();
        const list = res.data;
  
        const match = list.find(sp => sp.code === slug);
        setSpeciality(match);
        if (!match) return;
  
        const resDoctors = await doctorService.getDoctorsBySpeciality(match.id);
        const docs = resDoctors.data.data;
        setDoctors(docs);
  
        for (const doc of docs) {
          const resDays = await scheduleService.getDaysByDoctor(doc.id);
          const daysRaw = resDays.data?.data || resDays.data || [];
  
          for (let day of daysRaw) {
            const resSlots = await scheduleService.getSlotsByDay(day.id);
            day.slots = (resSlots.data?.data || resSlots.data || []).map(s => ({
              id: s.id,
              slot: s.slot,
            }));
          }
  
          setSchedules(prev => ({ ...prev, [doc.id]: daysRaw }));
        }
      } catch (err) {
        console.error("🔥 LỖI Ở BOOKINGPAGE:", err);
      }
    }
    load();
  }, [slug]);

  if (!speciality)
    return <h2 style={{ padding: 40 }}>Không tìm thấy chuyên khoa</h2>;

  return (
    <div className="booking-container">
      <div className="booking-breadcrumb">
        Khám chuyên khoa / <span className="current">{speciality.title}</span>
      </div>

      <h1 className="booking-title">{speciality.title}</h1>

      {doctors.map((doc) => (
        <Doctorcard
          key={doc.id}
          id={doc.id}
          name={doc.name}
          desc={doc.expertise}
          image={doc.image ? `${API_BASE}${doc.image}` : "/default-doctor.png"}
          location={doc.location}
          schedule={schedules[doc.id] || []}
        />
      ))}
    </div>
  );
}

export default Bookingpage;

