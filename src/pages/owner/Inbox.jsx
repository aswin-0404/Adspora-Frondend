import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OwnerNavbar from "../../components/layout/OwnerNavbar";
import Chat from "../common/Chat";

const BASE_URL = "https://adspora-backend.onrender.com/api";

const OwnerInbox = ({ className = "h-[calc(100vh-64px)]" }) => {
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/chat/owner/inbox/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setRooms(res.data))
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!rooms.length) return;

    rooms.forEach((room) => {
      axios
        .get(`${BASE_URL}/message/count/${room.room_id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUnreadCounts((prev) => ({
            ...prev,
            [room.room_id]: res.data.count,
          }));
        })
        .catch(console.error);
    });
  }, [rooms, token]);

  return (
    <div className={`flex bg-white shadow-xl ${className}`}>
      <div className="w-full md:w-2/5 bg-white border-r border-gray-100 flex flex-col z-20">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Inbox</h2>
          <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">
            Conversations with advertisers
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center bg-gray-50/30">
              <div className="h-16 w-16 bg-gray-100/80 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-gray-900 font-medium mb-1">No conversations yet</p>
              <p className="text-sm">When advertisers contact you, messages will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {rooms.map((room) => (
                <li
                  key={room.room_id}
                  onClick={() => setActiveRoomId(room.room_id)}
                  className={`relative group px-5 py-4 cursor-pointer transition-all duration-200 hover:bg-indigo-50/40
                    ${activeRoomId === room.room_id
                      ? "bg-indigo-50 border-r-4 border-indigo-600"
                      : "border-transparent"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {room.advertiser.name.charAt(0)}
                      </div>
                      {unreadCounts[room.room_id] > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm ring-1 ring-red-500">
                          {unreadCounts[room.room_id]}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className={`text-sm font-semibold truncate ${activeRoomId === room.room_id ? "text-indigo-700" : "text-gray-900"}`}>
                          {room.advertiser.name}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium">Recently</span>
                      </div>

                      <p className="text-xs font-medium text-gray-500 mb-1 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                        {room.space.title}
                      </p>

                      <p className={`text-sm truncate leading-relaxed ${unreadCounts[room.room_id] > 0 ? "font-semibold text-gray-800" : "text-gray-500"}`}>
                        {room.last_message || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="hidden md:flex w-3/5 bg-gray-50/50 relative overflow-hidden">
        {activeRoomId ? (
          <Chat roomId={activeRoomId} embedded />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')]">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 animate-pulse">
              <span className="text-4xl">📬</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Inbox</h3>
            <p className="text-gray-500 text-center max-w-xs">Select a conversation from the list to view message history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerInbox;

