import React, { useEffect, useState } from "react";
import { subscribe } from "./toast";

const styles = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    info: "bg-blue-600",
};

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const unsub = subscribe((t) => {
            setToasts((prev) => [...prev, t]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((x) => x.id !== t.id));
            }, 3000);
        });
        return unsub;
    }, []);

    return (
        <div className="fixed top-6 right-6 z-9999 space-y-3">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in ${styles[t.type]}`}
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}
