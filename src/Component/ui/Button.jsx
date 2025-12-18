import React from "react";
import clsx from "clsx";

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className,
    ...props
}) {
    const base =
        "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base",
    };

    return (
        <button
            disabled={disabled || loading}
            className={clsx(base, variants[variant], sizes[size], className)}
            {...props}
        >
            {loading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {children}
        </button>
    );
}
