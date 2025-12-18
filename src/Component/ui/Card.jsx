import React from "react";
import clsx from "clsx";

export default function Card({ children, className }) {
    return (
        <div
            className={clsx(
                "rounded-xl bg-white border shadow-sm p-4",
                className
            )}
        >
            {children}
        </div>
    );
}
