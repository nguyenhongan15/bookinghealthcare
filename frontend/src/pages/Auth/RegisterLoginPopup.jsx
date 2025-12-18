import { useState } from "react";
import api from "../../services/http";
import "./AuthPopup.css";

function convertNameToUsername(name) {
  return name
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

async function checkUsernameAvailable(baseName) {
  let finalName = baseName;
  let counter = 0;

  while (true) {
    const checkName = counter === 0 ? finalName : `${finalName}${counter}`;
    try {
      const res = await api.get(`/auth/check-username?username=${checkName}`);
      if (res.data?.data?.available === true) return checkName;
    } catch (err) {
      return checkName;
    }
    counter++;
  }
}

export default function RegisterLoginPopup({ onClose, onUpdated }) {
  const [isRegister, setIsRegister] = useState(false);

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [regErr, setRegErr] = useState("");

  const [checkingUser, setCheckingUser] = useState(false);
  const [phoneErr, setPhoneErr] = useState("");

  const handleFullNameChange = async (e) => {
    const name = e.target.value;
    setFullName(name);

    const base = convertNameToUsername(name);
    if (base.trim() === "") {
      setUsername("");
      return;
    }

    setCheckingUser(true);
    const uniqueName = await checkUsernameAvailable(base);
    setUsername(uniqueName);
    setCheckingUser(false);
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        username: loginUser,
        password: loginPass,
      });
      localStorage.setItem("user", JSON.stringify(res.data.data));
      onUpdated();
      onClose();
    } catch (err) {
      setLoginErr("Sai tài khoản hoặc mật khẩu!");
    }
  };

  const handleRegister = async () => {
    if (phoneErr !== "" || phone.length !== 10) {
      setPhoneErr("Số điện thoại phải đúng 10 số");
      return;
    }
    try {
      const res = await api.post("/auth/register", {
        fullName,
        phone,
        email,
        username,
        password: phone,
      });
      localStorage.setItem("user", JSON.stringify(res.data.data));
      onUpdated();
      onClose();
    } catch (err) {
      setRegErr("Email đã tồn tại, đăng nhập hoặc dùng email khác");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        {/* LEFT IMAGE */}
        <div className="popup-left">
          <img
            src="https://images.pexels.com/photos/7672255/pexels-photo-7672255.jpeg"
            alt="login-banner"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="popup-right">

          {/* HEADER */}
          <div className="popup-right-header">
            <h2>{isRegister ? "Đăng ký" : "Đăng nhập"}</h2>
            <span className="close-btn" onClick={onClose}>×</span>
          </div>

          <div className="popup-right-body">

            {/* LOGIN FORM */}
            {!isRegister && (
              <>
                {loginErr && <p className="error">{loginErr}</p>}

                <label>Tên đăng nhập</label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                />

                <label>Mật khẩu</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                />

                <button onClick={handleLogin} className="primary-btn">
                  Đăng nhập
                </button>

                <p className="switch-text">
                  Chưa có tài khoản?
                  <span onClick={() => setIsRegister(true)}> Đăng ký ngay</span>
                </p>
              </>
            )}

            {/* REGISTER FORM */}
            {isRegister && (
              <>
                {regErr && <p className="error">{regErr}</p>}

                <label>Tên đăng nhập</label>
                <div className="input-rel">
                  <input value={username} disabled />
                  {checkingUser && <div className="spinner"></div>}
                </div>

                <label>Họ và tên</label>
                <input value={fullName} onChange={handleFullNameChange} />

                <label>Email <span style={{fontWeight: 400}}></span></label>
                    <input
                    type="email"
                    placeholder="abc123@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Số điện thoại</label>
                <input
                  value={phone}
                  maxLength={10}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!/^\d*$/.test(v)) return;
                    setPhone(v);
                    setPhoneErr(v.length === 10 ? "" : "Số điện thoại phải đúng 10 số");
                  }}
                />
                {phoneErr && <p className="error">{phoneErr}</p>}

                <button
                  onClick={handleRegister}
                  className="primary-btn"
                  disabled={checkingUser || phoneErr !== "" || phone.length !== 10}
                >
                  {checkingUser ? "Đang tạo username..." : "Tạo tài khoản"}
                </button>

                <p className="switch-text">
                  Đã có tài khoản?
                  <span onClick={() => setIsRegister(false)}> Đăng nhập ngay</span>
                </p>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
