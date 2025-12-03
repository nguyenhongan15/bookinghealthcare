import "./FloatingChatButton.css";
import { FaComments } from "react-icons/fa";

export default function FloatingChatButton({ onClick }) {
  return (
    <div className="floating-chat-btn" onClick={onClick}>
      <FaComments className="chat-icon" />
    </div>
  );
}
