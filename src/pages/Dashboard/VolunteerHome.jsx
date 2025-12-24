import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "../../Component/toast";

const VolunteerHome = () => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({
        pending: 0,
        accepted: 0,
        completed: 0,
    });
    const [actionLoading, setActionLoading] = useState(null);

    /* ---------------- Load volunteer requests ---------------- */
    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);

                // ✅ CORRECT API
                const res = await API.get("/volunteer/requests");
                const all = Array.isArray(res.data) ? res.data : [];

                if (cancelled) return;

                setRequests(all);

                setStats({
                    pending: all.filter((r) => r.donationStatus === "pending").length,
                    accepted: all.filter((r) => r.donationStatus === "accepted").length,
                    completed: all.filter((r) => r.donationStatus === "completed").length,
                });
            } catch (err) {
                console.error("Volunteer load error:", err);
                toast.error("Failed to load donation requests");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => (cancelled = true);
    }, []);

    /* ---------------- Accept request ---------------- */
    const acceptRequest = async (id) => {
        if (!window.confirm("Accept this donation request?")) return;

        setActionLoading(id);

        try {
            await API.patch(`/donation/${id}/accept`);

            setRequests((prev) =>
                prev.map((r) =>
                    r._id === id ? { ...r, donationStatus: "accepted" } : r
                )
            );

            setStats((s) => ({
                ...s,
                pending: s.pending - 1,
                accepted: s.accepted + 1,
            }));

            toast.success("Request accepted successfully");
        } catch (err) {
            console.error("Accept failed:", err);
            toast.error(err.response?.data?.message || "Accept failed");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-16 text-slate-500">
                Loading volunteer dashboard…
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Stat label="Pending Requests" value={stats.pending} color="blue" />
                <Stat label="Accepted" value={stats.accepted} color="orange" />
                <Stat label="Completed" value={stats.completed} color="green" />
            </div>

            {/* REQUEST LIST */}
            <div className="bg-white border rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Available Donation Requests
                </h2>

                {requests.length === 0 ? (
                    <p className="text-slate-500">No donation requests available.</p>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between bg-slate-50 hover:bg-slate-100 transition"
                            >
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {req.recipientName} • {req.bloodGroup}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {req.recipientDistrict}, {req.recipientUpazila}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {req.hospitalName}
                                    </p>
                                </div>

                                <div className="mt-3 md:mt-0">
                                    {req.donationStatus === "pending" && (
                                        <button
                                            onClick={() => acceptRequest(req._id)}
                                            disabled={actionLoading === req._id}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            {actionLoading === req._id
                                                ? "Accepting..."
                                                : "Accept"}
                                        </button>
                                    )}

                                    {req.donationStatus === "accepted" && (
                                        <span className="px-3 py-1 rounded-md bg-orange-100 text-orange-700 text-sm">
                                            Accepted
                                        </span>
                                    )}

                                    {req.donationStatus === "completed" && (
                                        <span className="px-3 py-1 rounded-md bg-green-100 text-green-700 text-sm">
                                            Completed
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ---------------- Small Stat Component ---------------- */
const Stat = ({ label, value, color }) => (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className={`text-3xl font-semibold text-${color}-600`}>{value}</p>
    </div>
);

export default VolunteerHome;
