import React from "react";

const icons = {
    created: "📝",
    accepted: "🤝",
    completed: "✅",
};

export default function RequestTimeline({ timeline = [] }) {
    if (!timeline.length) {
        return <p className="text-sm text-slate-500">No activity yet.</p>;
    }

    return (
        <div className="space-y-4">
            {timeline.map((t, idx) => (
                <div key={idx} className="flex items-start gap-3">
                    <div className="text-xl">{icons[t.type]}</div>
                    <div>
                        <p className="text-sm font-medium capitalize">
                            {t.type} by {t.by?.name || "System"}
                        </p>
                        <p className="text-xs text-slate-500">
                            {new Date(t.at).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
