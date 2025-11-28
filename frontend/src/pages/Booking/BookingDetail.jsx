import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./BookingDetail.css";
import { FaUser, FaPhoneAlt, FaEnvelope, FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";

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

  const { doctor, date, slot } = state;

  // Form state
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

  // Lỗi của form
  const [errors, setErrors] = useState({});

  // Danh sách tỉnh – huyện mẫu
  const districtsData = {
    "Hà Nội": ["Đống Đa", "Ba Đình", "Hoàn Kiếm", "Thanh Xuân", "Cầu Giấy"],
    "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Tân Bình"],
    "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Hoà Cường", "An Khê", "An Hải", "Sơn Trà", "Ngũ Hành Sơn",
        , "Hoà Khánh", "Hải Vân", "Liên Chiểu", "Cẩm Lệ", "Hoà Xuân"
    ],
    Khác: ["Huyện khác"],
  };

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: null }); // clear error khi người dùng nhập lại
  };

  // Validate tất cả các field
  const validateForm = () => {
    let newErrors = {};

    if (!form.fullname.trim()) newErrors.fullname = "Vui lòng nhập họ tên";

    if (!form.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Số điện thoại phải gồm 10 chữ số";

    if (!form.email) newErrors.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Email không hợp lệ";

    if (!form.birthyear) newErrors.birthyear = "Vui lòng nhập năm sinh";
    else if (form.birthyear < 1900 || form.birthyear > 2025)
      newErrors.birthyear = "Năm sinh không hợp lệ";

    if (!form.province) newErrors.province = "Hãy chọn Tỉnh / Thành phố";
    if (!form.district) newErrors.district = "Hãy chọn Quận / Huyện";

    if (!form.reason.trim()) newErrors.reason = "Vui lòng nhập lý do khám";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gửi form

  const handleSubmit = () => {
    // Validate form nhanh
    if (!form.fullname || !form.phone || !form.birthyear) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
  
    // Gửi dữ liệu sang BookingTicket
    navigate("/phieu-thong-tin", {
      state: {
        ticket: {
          fullname: form.fullname,
          phone: form.phone,
          birthyear: form.birthyear,
          date,
          slot,
          doctor
        }
      }
    });
  };

  return (
    <div className="booking-detail-container">

      {/* HEADER */}
      <div className="booking-detail-header">
        <img src={doctor.image} alt={doctor.name} className="doctor-avatar" />

        <div>
          <h2 className="doctor-name">{doctor.name}</h2>

          <div className="booking-detail-time">
            <span>⏰ {slot}</span>
            <span> - {date}</span>
          </div>

          <div className="booking-detail-location">📍 {doctor.location}</div>

          <div className="booking-detail-clinic">
            Phòng khám Spinetech Clinic — Tòa nhà GP, 257 Giải Phóng, Hà Nội
          </div>
        </div>
      </div>

      {/* PRICE */}
      <div className="booking-price-box">
        <input type="radio" checked readOnly />
        <div>
          <strong>Giá khám</strong>
          <p>500.000đ</p>
        </div>
      </div>

      {/* BOOKING FOR WHO */}
      <div className="booking-who">
        <label>
          <input
            type="radio"
            name="who"
            defaultChecked
            onChange={() => updateForm("who", "self")}
          />{" "}
          Đặt cho mình
        </label>
        <label>
          <input
            type="radio"
            name="who"
            onChange={() => updateForm("who", "relative")}
          />{" "}
          Đặt cho người thân
        </label>
      </div>

      {/* FORM */}
      <form className="booking-form" onSubmit={(e) => e.preventDefault()}>

        {/* FULL NAME */}
        <div className="form-group icon-input">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Họ và tên bệnh nhân"
            value={form.fullname}
            onChange={(e) => updateForm("fullname", e.target.value)}
          />
        </div>
        {errors.fullname && <p className="error-text">{errors.fullname}</p>}

        {/* GENDER */}
        <div className="gender-row">
          <label>
            <input
              type="radio"
              name="gender"
              checked={form.gender === "Nam"}
              onChange={() => updateForm("gender", "Nam")}
            />{" "}
            Nam
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              checked={form.gender === "Nữ"}
              onChange={() => updateForm("gender", "Nữ")}
            />{" "}
            Nữ
          </label>
        </div>

        {/* PHONE */}
        <div className="form-group icon-input">
          <FaPhoneAlt className="input-icon" />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
          />
        </div>
        {errors.phone && <p className="error-text">{errors.phone}</p>}

        {/* EMAIL */}
        <div className="form-group icon-input">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => updateForm("email", e.target.value)}
          />
        </div>
        {errors.email && <p className="error-text">{errors.email}</p>}

        {/* BIRTH YEAR */}
        <div className="form-group icon-input">
          <FaBirthdayCake className="input-icon" />
          <input
            type="number"
            placeholder="Năm sinh"
            value={form.birthyear}
            onChange={(e) => updateForm("birthyear", e.target.value)}
          />
        </div>
        {errors.birthyear && <p className="error-text">{errors.birthyear}</p>}

        {/* PROVINCE */}
        <div className="form-group icon-input">
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
        {errors.province && <p className="error-text">{errors.province}</p>}

        {/* DISTRICT */}
        <div className="form-group icon-input">
          <FaMapMarkerAlt className="input-icon" />
          <select
            value={form.district}
            onChange={(e) => updateForm("district", e.target.value)}
            disabled={!form.province}
          >
            <option value="">Huyện / Quận</option>

            {form.province &&
              districtsData[form.province].map((d, i) => (
                <option key={i}>{d}</option>
              ))}
          </select>
        </div>
        {errors.district && <p className="error-text">{errors.district}</p>}

        {/* REASON */}
        <div className="form-group">
          <textarea
            placeholder="Lý do khám"
            value={form.reason}
            onChange={(e) => updateForm("reason", e.target.value)}
          ></textarea>
        </div>
        {errors.reason && <p className="error-text">{errors.reason}</p>}

      </form>

      {/* SUBMIT */}
      <button className="confirm-booking-btn" onClick={handleSubmit}>
        Xác nhận đặt khám
      </button>
    </div>
  );
}

export default BookingDetail;
