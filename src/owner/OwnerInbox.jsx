import { useEffect, useState } from "react";
import axios from "axios";
import Chat from "../chat.jsx";

const BASE_URL = "http://127.0.0.1:8000/api";

const OwnerInbox = () => {
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
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      <div className="w-full md:w-2/5 bg-white border-r flex flex-col">
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Inbox</h2>
          <p className="text-sm text-gray-500 mt-1">
            Conversations with advertisers
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No conversations yet
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.room_id}
                onClick={() => setActiveRoomId(room.room_id)}
                className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition
                  ${
                    activeRoomId === room.room_id
                      ? "bg-indigo-50"
                      : "hover:bg-gray-100"
                  }`}
              >
                <div className="h-11 w-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold uppercase flex-shrink-0">
                  {room.advertiser.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0 border-b border-gray-100 pb-3 flex justify-between items-center">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {room.space.title}
                    </p>

                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {room.last_message || "No messages yet"}
                    </p>
                  </div>

                  {unreadCounts[room.room_id] > 0 && (
                    <span className="ml-3 bg-indigo-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full px-2">
                      {unreadCounts[room.room_id]}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="hidden md:flex w-3/5 bg-gray-100">
        {activeRoomId ? (
          <Chat roomId={activeRoomId} embedded />
        ) : (
          <div className="flex flex-col items-center justify-center w-full text-gray-400">
            <p className="text-sm">Select a conversation</p>
            <p className="text-xs mt-1">to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerInbox;
