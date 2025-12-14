import "./CancelBookingPopup.css";
import { XCircle } from "lucide-react";

export default function CancelBookingPopup({
  open,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="cancel-overlay">
      <div className="cancel-popup">
        

        <h3>Bạn chắc chắn muốn huỷ lịch hẹn?</h3>
        <p>
          Lịch hẹn đã huỷ sẽ không thể khôi phục lại.
        </p>

        <div className="actions">
          <button className="btn-secondary" onClick={onClose}>
            Quay lại
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Huỷ lịch
          </button>
        </div>
      </div>
    </div>
  );
}
