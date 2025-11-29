import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Pages
import Home from './pages/Home/home'
import Search from './pages/Search/Search'
import Specialtypage from './pages/Specialtypage/Specialtypage'
import ClinicPage from './pages/Clinicpage/Clinicpage'
import Bookingpage from './pages/Booking/Bookingpage'
import BookingDetail from './pages/Booking/BookingDetail'
import BookingTicket from './pages/Booking/BookingTicket'

// Components
import Header from './components/header/Header'
import Footer from './components/Footer/Footer'


function App() {
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
            <Route path="/bac-si/:slug" element={<Bookingpage />} />
            <Route path="/dat-lich-kham" element={<BookingDetail />} />
            <Route path="/phieu-thong-tin" element={<BookingTicket />} />


            <Route
              path="*"
              element={
                <div style={{ padding: '40px' }}>
                  <h2>Không tìm thấy trang</h2>
                  <Link to="/">Về trang chủ</Link>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
