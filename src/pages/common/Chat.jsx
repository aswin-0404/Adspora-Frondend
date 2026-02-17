import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Send, ArrowLeft } from "lucide-react";
import Navbar from "../../components/layout/Navbar";

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

    socketRef.current.send(
      JSON.stringify({
        text,
        sender_id: userId,
      })
    );

    setText("");
  };


  return (
    <>
      {!embedded && <Navbar />}
      <div className={`w-full flex flex-col bg-gray-50/50 ${embedded ? "h-full" : "min-h-screen pt-16"}`}>

        <div className="flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10 shadow-sm shrink-0">
          {!embedded && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {space ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={space.images?.[0]?.image || "/placeholder.jpg"}
                  alt={space.title}
                  className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{space.title}</p>
                <p className="text-xs text-gray-500 font-medium">
                  {space.location} · <span className="text-indigo-600">₹{space.price}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          )}
        </div>

        <div className="flex-1 min-h-0 w-full overflow-y-auto p-4 space-y-6 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')]">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-300">
                <Send size={32} />
              </div>
              <p className="text-lg font-medium text-gray-600">No messages yet</p>
              <p className="text-sm">Start the conversation nicely 👋</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const mine = Number(msg.sender_id) === Number(userId);

              return (
                <div
                  key={msg.id || index}
                  className={`flex ${mine ? "justify-end" : "justify-start"} animate-slide-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm shadow-sm relative group ${mine
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                      }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    <div className={`flex items-center gap-1 mt-1 ${mine ? "justify-end text-indigo-200" : "justify-start text-gray-400"}`}>
                      <span className="text-[10px] font-medium">
                        {msg.time_stamp && new Date(msg.time_stamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} className="h-2" />
        </div>

        <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-2 py-2 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
            <input
              className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm text-gray-800 placeholder:text-gray-400"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg transform active:scale-95"
            >
              <Send size={16} className={text.trim() ? "translate-x-0.5" : ""} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
