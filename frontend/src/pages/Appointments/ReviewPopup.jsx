import { useState } from "react";
import "./ReviewPopup.css";
import { reviewService } from "../../services/reviewService";
import { X } from "lucide-react";

export default function ReviewPopup({ booking, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    try {
      setLoading(true);

      await reviewService.create({
        bookingId: booking.id,
        rating,
        comment,
      });

      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Không thể gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div className="review-overlay" onClick={onClose}></div>

      {/* POPUP */}
      <div className="review-popup">
        {/* CLOSE */}
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h3>Đánh giá bác sĩ</h3>

        {/* RATING */}
        <div className="form-group">
          <label>⭐ Mức độ hài lòng</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {s} sao
              </option>
            ))}
          </select>
        </div>

        {/* COMMENT */}
        <div className="form-group">
          <label>📝 Nhận xét</label>
          <textarea
            placeholder="Hãy chia sẻ trải nghiệm của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* ACTION */}
        <div className="actions">
          <button
            className="submit-btn"
            onClick={submitReview}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Huỷ
          </button>
        </div>
      </div>
    </>
  );
}
