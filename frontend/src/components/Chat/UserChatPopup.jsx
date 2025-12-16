
import { useState, useEffect, useRef } from "react";
import "./UserChatPopup.css";
import api from "../../services/http";
import { Client } from "@stomp/stompjs";
import { API_BASE } from "../../config/env";

export default function UserChatPopup({ initialDoctor, onClose, onFirstMessage }) {
  const rawUser = JSON.parse(localStorage.getItem("user"));
  const userId = rawUser?.id;

  const [partners, setPartners] = useState([]);
  const [current, setCurrent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [text, setText] = useState("");

  const subRef = useRef(null);
  const firstMsgNotifiedRef = useRef(false);

  useEffect(() => {
    if (!userId) return;
    api.get(`/chat/partners/user/${userId}`).then((res) => {
      setPartners(res.data.data || []);
    });
  }, [userId]);

  useEffect(() => {
    const client = new Client({
      brokerURL: import.meta.env.VITE_WS_BASE_URL,
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  const openChat = (doc) => {
    if (!connected || !doc) return;

    setCurrent(doc);

    api
      .get("/chat/history", {
        params: { doctorId: doc.id, userId },
      })
      .then((res) => {
        setMessages(res.data.data || []);
      });

    if (subRef.current) subRef.current.unsubscribe();

    subRef.current = stompClient.subscribe(
      `/topic/room.${doc.id}.${userId}`,
      (msg) => {
        const data = JSON.parse(msg.body);
        setMessages((prev) => [...prev, data]);
      }
    );
  };

  useEffect(() => {
    if (initialDoctor && connected) {
      openChat({
        id: initialDoctor.id,
        name: initialDoctor.name,
        image: initialDoctor.image,
      });
    }
  }, [initialDoctor, connected]);

  const sendMessage = () => {
    if (!current || !connected || !text.trim()) return;

    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        doctorId: current.id,
        userId,
        content: text,
        fromRole: "USER",
      }),
    });

    if (!firstMsgNotifiedRef.current && onFirstMessage) {
      onFirstMessage(current);
      firstMsgNotifiedRef.current = true;
    }

    setText("");
  };

  return (
    <div className="chat-popup">
      <div className="chat-left">
        <div className="chat-title">Danh sách bác sĩ</div>

        {partners.map((d) => (
          <div
            key={d.id}
            className={`chat-partner ${current?.id === d.id ? "active" : ""}`}
            onClick={() =>
              openChat({
                id: d.id,
                name: d.name,
                image: d.image,
              })
            }
          >
            <img
              src={
                d.image
                  ? `${API_BASE}${d.image}`
                  : "/default-doctor.png"
              }
              alt={d.name}
            />
            <div>
              <div>{d.name}</div>
              {d.booked && <span className="badge-booked">Đã đặt lịch</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-right">
        {!current ? (
          <div className="empty-chat">Chọn 1 bác sĩ để bắt đầu chat</div>
        ) : (
          <>
            <div className="chat-header">{current.name}</div>

            <div className="chat-messages">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`bubble ${
                    m.fromRole === "USER" ? "me" : "them"
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

