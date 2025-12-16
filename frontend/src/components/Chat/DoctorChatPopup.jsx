import { useState, useEffect, useRef } from "react";
import "./DoctorChatPopup.css";
import api from "../../services/http";
import { Client } from "@stomp/stompjs";
import { API_BASE } from "../../config/env";

export default function DoctorChatPopup({ onClose }) {
  const rawUser = JSON.parse(localStorage.getItem("user"));
  const doctorId = rawUser?.doctorId;

  const [partners, setPartners] = useState([]);
  const [current, setCurrent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [stompClient, setStompClient] = useState(null);
  const subRef = useRef(null);
  const connectedRef = useRef(false);

  // Load danh sách user đã chat
  useEffect(() => {
    api.get(`/chat/partners/doctor/${doctorId}`).then((res) => {
      setPartners(res.data.data || []);
    });
  }, [doctorId]);

  useEffect(() => {
    if (!doctorId) return;

    api.get(`/chat/partners/doctor/${doctorId}`).then((res) => {
      setPartners(res.data.data || []);
    });
  }, [doctorId]);

  // WebSocket
  useEffect(() => {
    const client = new Client({
      brokerURL: import.meta.env.VITE_WS_BASE_URL,
      reconnectDelay: 2000,
      onConnect: () => {
        console.log("Doctor WS connected!");
        connectedRef.current = true;
      },
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, []);

  const openChat = (user) => {
    if (!connectedRef.current || !stompClient) {
      console.warn("WebSocket chưa sẵn sàng!");
      return;
    }

    setCurrent(user);

    api
      .get("/chat/history", {
        params: { doctorId, userId: user.id },
      })
      .then((res) => setMessages(res.data.data || []));

    if (subRef.current) subRef.current.unsubscribe();

    // --- Đăng ký ROOM SUY NHẤT ---
    const room = `/topic/room.${doctorId}.${user.id}`;
    console.log("Doctor subscribe:", room);

    subRef.current = stompClient.subscribe(room, (msg) => {
      const data = JSON.parse(msg.body);
      setMessages((prev) => [...prev, data]);
    });
  };

  const sendMessage = () => {
    if (!current || !text.trim() || !stompClient) return;

    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        doctorId,
        userId: current.id,
        content: text,
        fromRole: "DOCTOR",
      }),
    });

    setText("");
  };

  return (
    <div className="chat-popup">
      <div className="chat-left">
        <div className="chat-title">Danh sách bệnh nhân</div>

        {partners.map((u) => (
          <div
            key={u.id}
            className={`chat-partner ${current?.id === u.id ? "active" : ""}`}
            onClick={() => openChat(u)}
          >
            <div>{u.name}</div>
            {u.booked && <span className="badge-booked">Đã đặt lịch</span>}
          </div>
        ))}
      </div>

      <div className="chat-right">
        {!current ? (
          <div className="empty-chat">Chọn 1 bệnh nhân để bắt đầu chat</div>
        ) : (
          <>
            <div className="chat-header">{current.name}</div>

            <div className="chat-messages">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`bubble ${
                    m.fromRole === "DOCTOR" ? "me" : "them"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập tin nhắn..."
              />
              <button onClick={sendMessage}>Gửi</button>
            </div>
          </>
        )}
      </div>

      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
