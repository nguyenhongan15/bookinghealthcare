import { useState } from "react";
import "./AISuggestChat.css";
import { aiService } from "../../services/aiService";


export default function AISuggestChat({ onPickSpeciality, onPickDoctor }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [submittedText, setSubmittedText] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setSubmittedText(input);
      setLoading(true);
      setResult(null);

      const res = await aiService.suggest(input);
      setResult(res.data?.data || null);
    } catch (err) {
      console.error("AI suggest error:", err);
      alert("AI không thể gợi ý lúc này");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-box">
      {/* ================= HEADER ================= */}
      <div className="ai-chat-header">
        🤖 AI tư vấn y tế
        <span>Dựa trên triệu chứng bạn nhập</span>
      </div>

      {/* ================= BODY ================= */}
      <div className="ai-chat-body">
        {/* USER MESSAGE */}
        {submittedText && (
          <div className="chat-bubble user">
            {submittedText}
          </div>
        )}

        {/* AI LOADING */}
        {loading && (
          <div className="chat-bubble ai loading">
            AI đang phân tích triệu chứng...
          </div>
        )}

        {/* AI RESULT */}
        {result && !loading && (
          <div className="chat-bubble ai">
            {/* ===== SPECIALITY ===== */}
            <div className="ai-section">
              <strong>🔹 Chuyên khoa phù hợp</strong>

              {Array.isArray(result.specialties) && result.specialties.length > 0 ? (
                <ul className="ai-list">
                  {result.specialties.map((s) => (
                    <li
                      key={s.id}
                      className="ai-item"
                      onClick={() => onPickSpeciality?.(s)}
                    >
                      <span>{s.title}</span>
                      <span className="ai-action">Đi tới</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="ai-empty">
                  Không tìm thấy chuyên khoa phù hợp
                </div>
              )}
            </div>

            {/* ===== DOCTOR ===== */}
            <div className="ai-section">
              <strong>👨‍⚕️ Bác sĩ phù hợp</strong>

              {Array.isArray(result.doctors) && result.doctors.length > 0 ? (
                <ul className="ai-list">
                  {result.doctors.map((d) => (
                    <li
                      key={d.id}
                      className="ai-item"
                      onClick={() => onPickDoctor?.(d)}
                    >
                      <span>{d.fullName}</span>
                      <span className="ai-action">Xem</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="ai-empty">
                  Không tìm thấy bác sĩ phù hợp
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= INPUT ================= */}
      <div className="ai-chat-input">
        <textarea
          placeholder="Nhập triệu chứng (VD: đau đầu, chóng mặt, ho...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button onClick={handleSend} disabled={loading}>
          Gửi
        </button>
      </div>
    </div>
  );
}
