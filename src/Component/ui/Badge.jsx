import React from "react";
import clsx from "clsx";

export default function Badge({ children, color = "gray" }) {
    const colors = {
        gray: "bg-slate-100 text-slate-700",
        green: "bg-green-100 text-green-700",
        blue: "bg-blue-100 text-blue-700",
        red: "bg-red-100 text-red-700",
        yellow: "bg-yellow-100 text-yellow-800",
    };

    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                colors[color]
            )}
        >
            {children}
        </span>
    );
}
