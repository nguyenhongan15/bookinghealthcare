import "./HealthProfile.css";
import { useEffect, useState } from "react";
import { healthProfileService } from "../../services/healthProfileService";

export default function HealthProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
    shareWithDoctor: false,
  });

  // =====================
  // LOAD HEALTH PROFILE
  // =====================
  useEffect(() => {
    if (!userId) return;

    healthProfileService
      .getMyProfile(userId)
      .then((res) => {
        if (res.data?.success && res.data.data) {
          setForm({
            medicalHistory: res.data.data.medicalHistory || "",
            allergies: res.data.data.allergies || "",
            currentMedications: res.data.data.currentMedications || "",
            shareWithDoctor: res.data.data.shareWithDoctor || false,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // =====================
  // HANDLE CHANGE
  // =====================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================
  // SAVE
  // =====================
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await healthProfileService.updateMyProfile(userId, form);

      if (res.data?.success) {
        alert("✅ Cập nhật hồ sơ sức khoẻ thành công");
      } else {
        alert("❌ Không thể lưu hồ sơ");
      }
    } catch (err) {
      alert("❌ Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="hp-page">Đang tải hồ sơ...</div>;
  }

  return (
    <div className="hp-page">
      <h1>Hồ sơ sức khoẻ</h1>
      <p className="hp-sub">
        Thông tin này giúp bác sĩ hiểu rõ tình trạng sức khoẻ của bạn
      </p>

      <div className="hp-card">
        {/* MEDICAL HISTORY */}
        <div className="hp-field">
          <label>Tiền sử bệnh</label>
          <textarea
            name="medicalHistory"
            value={form.medicalHistory}
            onChange={handleChange}
            placeholder="Ví dụ: Cao huyết áp, tiểu đường..."
          />
        </div>

        {/* ALLERGIES */}
        <div className="hp-field">
          <label>Dị ứng</label>
          <textarea
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
            placeholder="Ví dụ: Dị ứng thuốc, thực phẩm..."
          />
        </div>

        {/* MEDICATIONS */}
        <div className="hp-field">
          <label>Thuốc đang dùng</label>
          <textarea
            name="currentMedications"
            value={form.currentMedications}
            onChange={handleChange}
            placeholder="Tên thuốc, liều lượng..."
          />
        </div>

        {/* SHARE */}
        <div className="hp-checkbox">
          <input
            type="checkbox"
            id="share"
            name="shareWithDoctor"
            checked={form.shareWithDoctor}
            onChange={handleChange}
          />
          <label htmlFor="share">
            Cho phép bác sĩ xem hồ sơ sức khoẻ của tôi
          </label>
        </div>

        {/* SAVE */}
        <button
          className="hp-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : "Lưu hồ sơ"}
        </button>
      </div>
    </div>
  );
}
