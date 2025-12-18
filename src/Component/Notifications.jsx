import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Notifications() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        API.get("/notifications").then(res => setItems(res.data || []));
    }, []);

    const markRead = async (id) => {
        await API.patch(`/notifications/${id}/read`);
        setItems(prev =>
            prev.map(n => n._id === id ? { ...n, read: true } : n)
        );
    };

    if (!items.length) {
        return <p className="text-sm text-slate-500">No notifications</p>;
    }

    return (
        <div className="space-y-3">
            {items.map(n => (
                <div
                    key={n._id}
                    className={`p-3 rounded-lg border ${n.read ? "bg-slate-50" : "bg-blue-50 border-blue-200"
                        }`}
                >
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-slate-600">{n.message}</p>
                    {!n.read && (
                        <button
                            onClick={() => markRead(n._id)}
                            className="text-xs text-blue-600 mt-1"
                        >
                            Mark as read
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
