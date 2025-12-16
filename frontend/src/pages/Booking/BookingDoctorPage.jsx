import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Doctorcard from "./Doctorcard";
import { doctorService } from "../../services/doctorService";
import { scheduleService } from "../../services/scheduleService";
import { API_BASE } from "../../config/env";

function BookingDoctorPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState([]);

  // Load doctor info
  useEffect(() => {
    doctorService.getDoctorById(id).then((res) => {
      setDoctor(res.data.data || res.data);
    });
  }, [id]);

  // Load schedule
  useEffect(() => {
    const loadSchedule = async () => {
      const resDays = await scheduleService.getDaysByDoctor(id);
      const days = resDays.data || [];

      const fullSchedule = [];

      for (const day of days) {
        const slotRes = await scheduleService.getSlotsByDay(day.id);
        fullSchedule.push({
          id: day.id,
          day: day.day,
          slots: (slotRes.data || []).map((s) => ({
            id: s.id,
            slot: s.slot,
          })),
        });
      }

      setSchedule(fullSchedule);
    };

    loadSchedule();
  }, [id]);

  if (!doctor) return <h2 style={{ padding: 40 }}>Đang tải...</h2>;

  return (
    <div className="booking-container">
      <Doctorcard
        id={doctor.id}
        name={doctor.name}
        desc={doctor.description}
        image={
          doctor.image ? `${API_BASE}${doctor.image}` : "/default-doctor.png"
        }
        location={doctor.location}
        schedule={schedule}
      />
    </div>
  );
}

export default BookingDoctorPage;
