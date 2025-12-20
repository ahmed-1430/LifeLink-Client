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
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-rose-600 text-white shadow-md hover:bg-rose-700 hover:shadow-lg focus:ring-rose-500",
        secondary:
            "bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 focus:ring-slate-400",
        ghost:
            "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300",
        danger:
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            disabled={disabled || loading}
            className={clsx(base, variants[variant], sizes[size], className)}
            {...props}
        >
            {loading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            )}
            {children}
        </button>
    );
}
