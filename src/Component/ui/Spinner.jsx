import React from "react";

export default function Spinner({ size = 24 }) {
    return (
        <div
            style={{ width: size, height: size }}
            className="animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
        />
    );
}
