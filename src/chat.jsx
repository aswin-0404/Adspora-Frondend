import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Send, ArrowLeft } from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000/api";

const Chat = ({ roomId, embedded = false }) => {
  const params = useParams();

    const [searchParams] = useSearchParams();
    const spaceIdFromQuery = searchParams.get("space");
    const ownerIdFromQuery = searchParams.get("owner");

  const resolvedRoomId = embedded ? roomId : params.roomId;

  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const decoded = jwtDecode(token);
  const userId = decoded.user_id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [space, setSpace] = useState(null);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!resolvedRoomId) return;

    axios
      .get(`${BASE_URL}/chat/messages/${resolvedRoomId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(res.data.messages || []);
        setSpace(res.data.space);
      })
      .catch(console.error);
  }, [resolvedRoomId, token]);

  useEffect(() => {
    if (!resolvedRoomId) return;

    axios.patch(
      `http://127.0.0.1:8000/api/chat/mark-read/${resolvedRoomId}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }, [resolvedRoomId, token]);

  useEffect(() => {
    if (!resolvedRoomId) return;

    // If socket already exists for this room, do nothing
    if (
      socketRef.current &&
      socketRef.current.readyState !== WebSocket.CLOSED
    ) {
      return;
    }

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${resolvedRoomId}/`);

    socketRef.current = ws;

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onclose = () => {
      socketRef.current = null;
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [resolvedRoomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
  if (!text.trim()) return;

  // First message → create room
  if (resolvedRoomId === "new") {
    const res = await axios.post(
      `${BASE_URL}/chat/room/`,
      {
        space_id: spaceIdFromQuery,
        owner_id: ownerIdFromQuery,
        text,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate(`/chat/${res.data.room_id}`);
    return;
  }

  // Normal message
  socketRef.current.send(
    JSON.stringify({
      text,
      sender_id: userId,
    })
  );

  setText("");
};


  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <div className="flex items-center gap-4 p-4 bg-white border-b">
        {!embedded && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {space && (
          <>
            <img
              src={space.images?.[0]?.image || "/placeholder.jpg"}
              alt={space.title}
              className="h-12 w-12 rounded-md object-cover"
            />
            <div>
              <p className="font-semibold text-sm">{space.title}</p>
              <p className="text-xs text-gray-500">
                {space.location} · ₹{space.price}
              </p>
            </div>
          </>
        )}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto p-6 space-y-3 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation 👋</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const mine = Number(msg.sender_id) === Number(userId);

            return (
              <div
                key={msg.id || index}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-xl text-sm shadow ${
                    mine
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.time_stamp && (
                    <p className="text-[10px] opacity-70 mt-1 text-right">
                      {new Date(msg.time_stamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white border-t flex gap-3">
        <input
          className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
