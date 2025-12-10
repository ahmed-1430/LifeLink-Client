import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import StatCard from "../../Component/StatCard";

export default function DonorHome() {
    const { user } = useContext(AuthContext);

    const [stats, setStats] = useState({
        totalRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        bloodMatches: 0,
        nearbyDonors: 0,
    });

    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const loadDashboard = async () => {
            try {
                // Fetch donor’s own requests
                const res = await API.get("/my-requests");

                const all = res.data || [];
                const active = all.filter(
                    (r) => r.status === "pending" || r.status === "approved"
                );
                const completed = all.filter((r) => r.status === "completed");

                // Fetch blood group matches
                const matchRes = await API.get(
                    `/donors/match/${user?.role}/${user?.bloodGroup}`
                ).catch(() => ({ data: [] }));

                // Fetch nearby donors (same district)
                const nearRes = await API.get(
                    `/donors/nearby/${user?.district}`
                ).catch(() => ({ data: [] }));

                if (cancelled) return;

                setStats({
                    totalRequests: all.length,
                    activeRequests: active.length,
                    completedRequests: completed.length,
                    bloodMatches: matchRes.data?.length || 0,
                    nearbyDonors: nearRes.data?.length || 0,
                });

                // Last 3 requests
                setRecent(all.slice(0, 3));
            } catch (err) {
                console.error("Dashboard load error:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadDashboard();
        return () => (cancelled = true);
    }, [user]);

    if (loading)
        return (
            <div className="text-center py-20 text-slate-500">Loading dashboard...</div>
        );

    return (
        <div className="space-y-10">

            {/* TOP ROW — QUICK ACTION */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Welcome, {user?.name || "Donor"}
                </h1>

                <Link
                    to="/dashboard/create"
                    className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                >
                    + Create Request
                </Link>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">

                {/* Card */}
                <StatCard
                    count={stats.totalRequests}
                    label="Total Requests"
                    color="text-blue-600"
                    icon="📑"
                />

                <StatCard
                    count={stats.activeRequests}
                    label="Active Requests"
                    color="text-orange-600"
                    icon="⏳"
                />

                <StatCard
                    count={stats.completedRequests}
                    label="Completed"
                    color="text-green-600"
                    icon="✅"
                />

                <StatCard
                    count={stats.bloodMatches}
                    label="Group Matches"
                    color="text-red-600"
                    icon="🩸"
                />

                <StatCard
                    count={stats.nearbyDonors}
                    label="Nearby Donors"
                    color="text-purple-600"
                    icon="📍"
                />
            </div>

            {/* RECENT REQUESTS SECTION */}
            <div className="bg-white border rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>

                {recent.length === 0 ? (
                    <p className="text-slate-500 text-sm">No recent requests found.</p>
                ) : (
                    <div className="space-y-3">
                        {recent.map((req) => (
                            <div
                                key={req._id}
                                className="border rounded-lg p-4 flex justify-between items-center hover:bg-slate-50 transition"
                            >
                                <div>
                                    <div className="font-medium">{req.patientName}</div>
                                    <div className="text-sm text-slate-500">
                                        {req.bloodGroup} • {req.district}, {req.upazila}
                                    </div>
                                </div>

                                <span
                                    className={`text-sm font-medium px-3 py-1 rounded-md ${req.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : req.status === "pending"
                                                ? "bg-orange-100 text-orange-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {req.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}