import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Send, ArrowLeft } from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000/api";

const Chat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  console.log("ROOM ID FROM URL:", roomId);

  const token = localStorage.getItem("access");
  const decoded = jwtDecode(token);
  const userId = decoded.user_id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [space, setSpace] = useState(null);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

 
  useEffect(() => {
    if (!roomId) return;

    axios
      .get(`${BASE_URL}/chat/messages/${roomId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.messages) {
          setMessages(res.data.messages);
          setSpace(res.data.space);
        } else {
          setMessages(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, [roomId, token]);

  
  useEffect(() => {
    if (!roomId) return;

    socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}/`);

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => socketRef.current?.close();
  }, [roomId]);

  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = () => {
    if (!text.trim()) return;

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        text: text,
        sender_id: userId,
      })
    );

    setText("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      
      <div className="flex items-center gap-4 p-4 bg-white border-b">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        {space ? (
          <>
            <img
              src={space.images?.[0]?.image || "/placeholder.jpg"}
              alt={space.title}
              className="h-12 w-12 rounded-md object-cover"
            />

            <div className="flex flex-col">
              <p className="font-semibold text-sm">{space.title}</p>
              <p className="text-xs text-gray-500">
                {space.location} · ₹{space.price}
              </p>
            </div>
          </>
        ) : (
          <p className="font-semibold text-sm">Chat</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.map((msg, index) => {
          const mine = Number(msg.sender_id) === Number(userId);


          return (
            <div
              key={msg.id || index}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-3xl px-4 py-2 rounded-xl text-sm shadow ${
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
        })}

        <div ref={bottomRef} />
      </div>

      
      <div className="p-4 bg-white border-t flex gap-3">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
