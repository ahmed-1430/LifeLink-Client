import { Droplet } from "lucide-react";

export default function PageLoader({ label = "Loading, please wait…" }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            {/* Glass Card */}
            <div
                className="
          relative flex flex-col items-center gap-4
          rounded-3xl px-10 py-8
          bg-white/70 backdrop-blur-xl
          shadow-xl
          border border-slate-200/60
        "
            >
                {/* Glow */}
                <div className="absolute inset-0 -z-10 rounded-3xl bg-rose-300/20 blur-2xl" />

                {/* Icon */}
                <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-rose-400/30 blur-xl animate-pulse" />
                    <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 shadow-inner">
                        <Droplet size={26} className="animate-bounce" />
                    </div>
                </div>

                {/* Text */}
                <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-slate-700">
                        {label}
                    </p>
                    <p className="text-xs text-slate-500">
                        Preparing everything for you
                    </p>
                </div>

                {/* Progress dots */}
                <div className="flex gap-1.5 mt-1">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="
                w-2 h-2 rounded-full bg-rose-400/70
                animate-pulse
              "
                            style={{ animationDelay: `${i * 150}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
