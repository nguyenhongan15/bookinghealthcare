import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Pages
import Home from './pages/Home/home'
import Search from './pages/Search/Search'
import Specialtypage from './pages/Specialtypage/Specialtypage'
import ClinicPage from './pages/Clinicpage/Clinicpage'
import ClinicDetail from './pages/Clinicpage/ClinicDetail'
import Bookingpage from './pages/Booking/Bookingpage'
import BookingDetail from './pages/Booking/BookingDetail'
import BookingTicket from './pages/Booking/BookingTicket'
import DoctorDetail from './pages/DoctorDetail/DoctorDetail'
import BookingDoctorPage from "./pages/Booking/BookingDoctorPage";

import { useState, useEffect } from "react";

// Components
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import FloatingChatButton from "./components/Chat/FloatingChatButton";
import UserChatPopup from "./components/Chat/UserChatPopup";
import DoctorChatPopup from './components/Chat/DoctorChatPopup';
import { doctorService } from "./services/doctorService";

function App() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const role = user?.role;
  const pendingDoctor = localStorage.getItem("pending_chat_doctor");

  const [chatEnabled, setChatEnabled] = useState(false); // đã gửi ít nhất 1 tin chưa
  const [lastDoctor, setLastDoctor] = useState(null); // bác sĩ chat gần nhất

  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupDoctor, setPopupDoctor] = useState(null);

  // SAI THÌ XOÁ NGUYÊN ĐOẠN NÀY========================================
  useEffect(() => {
    if (!user) {
      setChatEnabled(false);
      setLastDoctor(null);
      return;
    }

    const enabledKey = `chatEnabled_${user.id}`;
    const lastDoctorKey = `lastChatDoctor_${user.id}`;

    const enabled = localStorage.getItem(enabledKey) === "true";
    setChatEnabled(enabled);

    const rawDoc = localStorage.getItem(lastDoctorKey);
    setLastDoctor(rawDoc ? JSON.parse(rawDoc) : null);
  }, [rawUser]); // khi login / logout

  // ----------- GỌI TỪ TRANG DOCTORDETAIL -----------
  const handleStartChatFromDoctor = (doctor) => {
    // if (!user || user.role !== "USER") return;
    // setPopupDoctor(doctor);
    // setShowChatPopup(true);      // chưa bật nút chat nếu chưa gửi tin
    if (!doctor) return;
    setPopupDoctor(doctor);
    setShowChatPopup(true); 
  };

  // ----------- KHI GỬI TIN NHẮN ĐẦU TIÊN -----------
  const handleFirstMessageSent = (doctor) => {
    if (!user) return;

    const simpleDoctor = {
      id: doctor.id,
      name: doctor.name,
      image: doctor.image || null,
    };
    const enabledKey = `chatEnabled_${user.id}`;
    const lastDoctorKey = `lastChatDoctor_${user.id}`;

    localStorage.setItem(enabledKey, "true");
    localStorage.setItem(lastDoctorKey, JSON.stringify(simpleDoctor));

    setChatEnabled(true);
    setLastDoctor(simpleDoctor);
  };

  useEffect(() => {
    if (user && pendingDoctor) {
      (async () => {
        try {
          const res = await doctorService.getDoctorById(pendingDoctor);
          const doc = res.data.data;

          setPopupDoctor(doc);
          setShowChatPopup(true);

          localStorage.removeItem("pending_chat_doctor");
        } catch (err) {
          console.error("Lỗi load doctor pending:", err);
        }
      })();
    }
  }, [user]);

  // ----------- CLICK NÚT CHAT NỔI -----------
  const handleFloatingButtonClick = () => {
    setPopupDoctor(lastDoctor || null);
    setShowChatPopup(true);
  };

  const showFloatingButton =
    user && user.role === "USER" && chatEnabled === true;
  
  //==============================================================================  
  return (
    <Router>
      <div className="app-root">
        <Header />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tim-kiem" element={<Search />} />
            <Route path="/kham-chuyen-khoa" element={<Specialtypage />} />


            <Route path="/co-so-y-te" element={<ClinicPage />} />
            <Route path="/co-so-y-te/:id" element={<ClinicDetail />} />

            <Route path="/bac-si/:slug" element={<Bookingpage />} />
            <Route path="/chuyen-khoa/:slug" element={<Bookingpage />} />

            <Route path="/dat-lich-kham" element={<BookingDetail />} />
            <Route path="/dat-lich-kham/bac-si/:id" element={<BookingDoctorPage />} />

            <Route path="/phieu-thong-tin" element={<BookingTicket />} />

            <Route path="/bac-si/thong-tin/:id" element={<DoctorDetail onStartChat={handleStartChatFromDoctor} />} />
            <Route path="*" element={
              <div style={{ padding: '40px' }}>
                  <h2>Không tìm thấy trang</h2>
                  <Link to="/">Về trang chủ</Link>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
        {showFloatingButton && (<FloatingChatButton onClick={handleFloatingButtonClick} />)}
        {showChatPopup && role === "USER" && (
          <UserChatPopup
            initialDoctor={popupDoctor || lastDoctor}
            onClose={() => setShowChatPopup(false)}
            onFirstMessage={handleFirstMessageSent}
          />
        )}
        {showPopup && role === "DOCTOR" && (<DoctorChatPopup onClose={() => setShowPopup(false)} />
        )}
      </div>
    </Router>
  );
}

export default App
