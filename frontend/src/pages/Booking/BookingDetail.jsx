import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingDetail.css";
import api from "../../services/http";

import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";



import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaBirthdayCake,
  FaMapMarkerAlt,
} from "react-icons/fa";


function BookingDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Không có dữ liệu lịch khám</h2>
        <button onClick={() => navigate("/")}>Về trang chủ</button>
      </div>
    );
  }

    // Dữ liệu từ step trước
    const doctor = state.doctor; // phải có id
    const selectedDate = state.date;
    const selectedSlot = state.slot; // {id, slot}

    // MỚI THÊM VÀO =============================================
    const [fullDoctor, setFullDoctor] = useState(null);

useEffect(() => {
  const loadDoctor = async () => {
    const res = await api.get(`/doctors/${doctor.id}`);
    setFullDoctor(res.data.data);
  };
  loadDoctor();
}, [doctor]);
 //==================================================

  // FORM STATE
  const [form, setForm] = useState({
    fullname: "",
    gender: "Nam",
    phone: "",
    email: "",
    birthyear: "",
    province: "",
    district: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const districtsData = {
    "Hà Nội": ["Đống Đa", "Ba Đình", "Hoàn Kiếm", "Thanh Xuân", "Cầu Giấy"],
    "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Tân Bình"],
    "Đà Nẵng": [
      "Hải Châu",
      "Thanh Khê",
      "Hoà Cường",
      "An Khê",
      "An Hải",
      "Sơn Trà",
      "Ngũ Hành Sơn",
      "Hoà Khánh",
      "Hải Vân",
      "Liên Chiểu",
      "Cẩm Lệ",
      "Hoà Xuân",
    ],
    Khác: ["Huyện khác"],
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullname.trim()) newErrors.fullname = "Vui lòng nhập họ tên";

    if (!form.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Số điện thoại phải gồm 10 chữ số";

    if (!form.email) newErrors.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Email không hợp lệ";

    if (!form.birthyear)
      newErrors.birthyear = "Vui lòng nhập năm sinh";
    else if (form.birthyear < 1900 || form.birthyear > 2025)
      newErrors.birthyear = "Năm sinh không hợp lệ";

    if (!form.province) newErrors.province = "Hãy chọn Tỉnh / Thành phố";

    if (!form.district) newErrors.district = "Hãy chọn Quận / Huyện";

    if (!form.reason.trim())
      newErrors.reason = "Vui lòng nhập lý do khám";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      setLoading(true); // bật loading

      const res = await api.post("/bookings", {
        patientName: form.fullname,
        gender: form.gender,
        patientPhone: form.phone,
        email: form.email,
        birthyear: form.birthyear,
        province: form.province,
        district: form.district,
        reason: form.reason,

        doctorId: doctor.id,
        scheduleSlotId: selectedSlot.id,

        // Gửi thêm thông tin để email đầy đủ
        doctorName: doctor.name,
        doctorLocation: doctor.location,
        date: selectedDate,
        slot: selectedSlot.slot,
      },  
    );
  
      // Sau khi tạo booking thành công → sang trang phiếu
      navigate("/phieu-thong-tin", {
        state: {
          ticket: {
            fullname: form.fullname,
            phone: form.phone,
            birthyear: form.birthyear,
            date: selectedDate,
            slot: selectedSlot.slot,
            // doctor,  // LỖI THÌ LẤY LẠI DÒNG NÀY XOÁ 1 DÒNG DƯỚI
            doctor: fullDoctor,
            clinic: fullDoctor.clinic, // NẾU LỖI THÌ XOÁ DÒNG NÀY
          },
        },
      });
  
    } catch (err) {
      alert("Không thể đặt lịch!");
    } finally {
      setLoading(false); // tắt loading khi chuyển trang xong
    }
  };

  return (
    <div className="booking-wrapper">
      <div className="doctor-header">
        <img src={doctor.image} alt="" />
        <div>
          <h2>{doctor.name}</h2>{doctor?.location && ( 
            <div className="doctor-info-line"> 📍 {doctor.location}
            </div>
          )}
        </div>
      </div>

      <div className="booking-content">
        <div className="left-box">
          <div className="left-title">Thông tin lịch khám</div>
          <div className="info-item">📅 Ngày: <strong>{selectedDate}</strong></div>
          <div className="info-item">⏰ Giờ: <strong>{selectedSlot?.slot || "Chưa chọn"}</strong></div>
          <div className="info-item">📍 Địa chỉ: <strong>{doctor.location}</strong></div>
          <div className="price-box">500.000đ</div>
        </div>

        {/* RIGHT BOX – FORM */}
        <div className="form-box">
          <div className="form-section-title">Thông tin bệnh nhân</div>

          {/* FULLNAME */}
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Họ và tên bệnh nhân"
              value={form.fullname}
              onChange={(e) => updateForm("fullname", e.target.value)}
            />
          </div>
          {errors.fullname && (
            <p className="error-text">{errors.fullname}</p>
          )}

          {/* GENDER */}
          <div className="gender-row">
            <label>
              <input
                type="radio"
                checked={form.gender === "Nam"}
                onChange={() => updateForm("gender", "Nam")}
              />
              Nam
            </label>
            <label>
              <input
                type="radio"
                checked={form.gender === "Nữ"}
                onChange={() => updateForm("gender", "Nữ")}
              />
              Nữ
            </label>
          </div>

          {/* PHONE */}
          <div className="input-group">
            <FaPhoneAlt className="input-icon" />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={(e) => updateForm("phone", e.target.value)}
            />
          </div>
          {errors.phone && (
            <p className="error-text">{errors.phone}</p>
          )}

          {/* EMAIL */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="error-text">{errors.email}</p>
          )}

          {/* BIRTHYEAR */}
          <div className="input-group">
            <FaBirthdayCake className="input-icon" />
            <input
              type="number"
              placeholder="Năm sinh"
              value={form.birthyear}
              onChange={(e) => updateForm("birthyear", e.target.value)}
            />
          </div>
          {errors.birthyear && (
            <p className="error-text">{errors.birthyear}</p>
          )}

          {/* PROVINCE */}
          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <select
              value={form.province}
              onChange={(e) => updateForm("province", e.target.value)}
            >
              <option value="">Tỉnh / Thành phố</option>
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
              <option>Khác</option>
            </select>
          </div>
          {errors.province && (
            <p className="error-text">{errors.province}</p>
          )}

          {/* DISTRICT */}
          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <select
              value={form.district}
              disabled={!form.province}
              onChange={(e) => updateForm("district", e.target.value)}
            >
              <option value="">Quận / Huyện</option>
              {form.province &&
                districtsData[form.province].map((d, i) => (
                  <option key={i}>{d}</option>
                ))}
            </select>
          </div>
          {errors.district && (
            <p className="error-text">{errors.district}</p>
          )}

          {/* REASON */}
          <div className="input-group">
            <textarea
              placeholder="Ghi chú thêm"
              value={form.reason}
              onChange={(e) => updateForm("reason", e.target.value)}
            />
          </div>
          {errors.reason && (
            <p className="error-text">{errors.reason}</p>
          )}

          {/* SUBMIT */}
          <button className="submit-btn" onClick={handleSubmit}>
            Xác nhận đặt lịch
          </button>
        </div>
      </div>
      {loading && <LoadingScreen text="Đang xử lý đặt lịch..." />}
    </div>
  );
}

export default BookingDetail;
