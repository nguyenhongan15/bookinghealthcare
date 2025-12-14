import UserAppointments from "./UserAppointments";
import DoctorAppointments from "./DoctorAppointments";

export default function Appointments() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <div className="appointments-page">Vui lòng đăng nhập</div>;
  }

  if (user.role === "DOCTOR") {
    return <DoctorAppointments />;
  }

  return <UserAppointments />;
}
