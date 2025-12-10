import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const VolunteerHome = () => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({ pending: 0, active: 0, completed: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                // Get all public requests (or volunteer-specific backend route)
                const res = await API.get("/requests");
                const all = res.data || [];

                setRequests(all);

                // Auto-calc basic stats
                setStats({
                    pending: all.filter((r) => r.status === "pending").length,
                    active: all.filter((r) => r.status === "accepted").length,
                    completed: all.filter((r) => r.status === "completed").length,
                });
            } catch (err) {
                console.error("Failed to load volunteer data:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-slate-500">Loading volunteer data...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="text-sm text-slate-500 mb-1">Pending Requests</h3>
                    <p className="text-3xl font-semibold text-blue-600">{stats.pending}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="text-sm text-slate-500 mb-1">Active Missions</h3>
                    <p className="text-3xl font-semibold text-orange-500">{stats.active}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="text-sm text-slate-500 mb-1">Completed</h3>
                    <p className="text-3xl font-semibold text-emerald-500">{stats.completed}</p>
                </div>
            </div>

            {/* List of Requests */}
            <div className="bg-white p-6 rounded-xl shadow border">
                <h2 className="text-xl font-semibold mb-4">Available Donation Requests</h2>

                {requests.length === 0 ? (
                    <p className="text-slate-500">No requests available.</p>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between bg-slate-50 hover:bg-slate-100 transition"
                            >
                                <div>
                                    <p className="font-medium text-slate-800">
                                        {req.patientName} — {req.bloodGroup}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {req.district}, {req.upazila}
                                    </p>
                                </div>

                                <div className="mt-3 md:mt-0 flex items-center gap-3">
                                    {req.status === "pending" && (
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Accept Request
                                        </button>
                                    )}

                                    {req.status === "accepted" && (
                                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                                            Mark Completed
                                        </button>
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

export default VolunteerHome;
