import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import StatCard from "../../Component/StatCard";

const DonorHome = () => {
    const { user } = useContext(AuthContext);

    const [stats, setStats] = useState({
        totalRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        bloodMatches: 0,
    });

    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        const loadDashboard = async () => {
            try {
                /* ---------------- 1️⃣ Fetch My Requests ---------------- */
                const reqRes = await API.get("/my-requests");
                const requests = Array.isArray(reqRes.data) ? reqRes.data : [];

                const active = requests.filter(
                    (r) => r.status === "pending" || r.status === "approved"
                );
                const completed = requests.filter((r) => r.status === "completed");

                /* ---------------- 2️⃣ Fetch Matching Donors (SAFE) ---------------- */
                let bloodMatches = 0;

                if (user.bloodGroup && user.district && user.upazila) {
                    const matchRes = await API.get("/donors/match", {
                        params: {
                            bloodGroup: user.bloodGroup,
                            district: user.district,
                            upazila: user.upazila,
                        },
                    }).catch(() => ({ data: [] }));

                    bloodMatches = Array.isArray(matchRes.data)
                        ? matchRes.data.length
                        : 0;
                }

                if (cancelled) return;

                /* ---------------- 3️⃣ Update State ---------------- */
                setStats({
                    totalRequests: requests.length,
                    activeRequests: active.length,
                    completedRequests: completed.length,
                    bloodMatches,
                });

                setRecent(requests.slice(0, 3));
            } catch (err) {
                console.error("Donor dashboard load error:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadDashboard();
        return () => (cancelled = true);
    }, [user]);

    /* ---------------- Loading ---------------- */
    if (loading) {
        return (
            <div className="py-24 text-center text-slate-500">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="space-y-10">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Welcome, {user?.name || "Donor"}
                </h1>

                <Link
                    to="/dashboard/create"
                    className="inline-flex items-center justify-center rounded-xl
                     bg-rose-600 px-5 py-2.5 text-white font-medium
                     hover:bg-rose-700 transition"
                >
                    + Create Request
                </Link>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    label="Matching Donors"
                    color="text-red-600"
                    icon="🩸"
                />
            </div>

            {/* RECENT REQUESTS */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                    Recent Requests
                </h2>

                {recent.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        You haven’t created any requests yet.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {recent.map((req) => (
                            <div
                                key={req._id}
                                className="flex justify-between items-center
                           border rounded-xl p-4
                           hover:bg-slate-50 transition"
                            >
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {req.patientName}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {req.bloodGroup} • {req.district}, {req.upazila}
                                    </p>
                                </div>

                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded-full
                    ${req.status === "completed"
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
};

export default DonorHome;
