import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/api";

const OwnerInbox = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/chat/owner/inbox/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRooms(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Inbox</h2>

      {rooms.map((room) => (
        <div
          key={room.room_id}
          onClick={() => navigate(`/chat/${room.room_id}`)}
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow mb-3 cursor-pointer hover:bg-gray-50"
        >
          <div>
            <p className="font-semibold">{room.space.title}</p>
            <p className="text-sm text-gray-500">
              Advertiser: {room.advertiser.name}
            </p>
            <p className="text-sm text-gray-400 truncate">
              {room.last_message}
            </p>
          </div>

          <p className="text-xs text-gray-400">
            {room.last_time &&
              new Date(room.last_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OwnerInbox;
