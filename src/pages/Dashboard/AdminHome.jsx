/* eslint-disable no-empty */
import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AdminHome() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRequests: 0,
        pendingRequests: 0,
        completedRequests: 0,
        totalFunding: 0,
    });

    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const loadAdminStats = async () => {
            try {
                setLoading(true);

                /* ✅ CORRECT APIs */
                const usersRes = await API.get("/users");
                const reqRes = await API.get("/requests");

                const users = Array.isArray(usersRes.data) ? usersRes.data : [];
                const requests = Array.isArray(reqRes.data) ? reqRes.data : [];

                const pending = requests.filter(
                    (r) => r.donationStatus == "pending"
                ).length;

                const completed = requests.filter(
                    (r) => r.donationStatus == "completed"
                ).length;

                /* Optional funding (challenge requirement) */
                let fundingTotal = 0;
                try {
                    const fundRes = await API.get("/funding/all");
                    fundingTotal = fundRes.data?.totalAmount || 0;
                } catch { }

                if (!cancelled) {
                    setStats({
                        totalUsers: users.length,
                        totalRequests: requests.length,
                        pendingRequests: pending,
                        completedRequests: completed,
                        totalFunding: fundingTotal,
                    });

                    setRecent(requests.slice(0, 5));
                }
            } catch (err) {
                console.error("Admin dashboard load error:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadAdminStats();
        return () => (cancelled = true);
    }, []);

    const statusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-orange-100 text-orange-700";
            case "approved":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-green-100 text-green-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-slate-500">
                Loading admin dashboard…
            </div>
        );
    }

    return (
        <div className="space-y-10">

            {/* WELCOME */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                    Welcome back, Admin 👋
                </h1>
                <p className="text-sm text-slate-500">
                    Overview of platform activity and donation requests
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <Stat label="Total Users" value={stats.totalUsers} icon="👥" />
                <Stat label="Total Requests" value={stats.totalRequests} icon="📑" />
                <Stat label="Pending" value={stats.pendingRequests} icon="⏳" />
                <Stat label="Completed" value={stats.completedRequests} icon="✅" />
                <Stat label="Funding" value={`৳ ${stats.totalFunding}`} icon="💰" />
            </div>

            {/* RECENT REQUESTS */}
            <div className="bg-white border rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Recent Donation Requests
                </h2>

                {recent.length === 0 ? (
                    <p className="text-sm text-slate-500">No requests found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3 text-left">Recipient</th>
                                    <th className="px-4 py-3 text-left">Blood</th>
                                    <th className="px-4 py-3 text-left">Location</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map((r) => (
                                    <tr key={r._id} className="border-t hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium">
                                            {r.recipientName}
                                        </td>
                                        <td className="px-4 py-3">{r.bloodGroup}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {r.recipientDistrict}, {r.recipientUpazila}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                                                    r.donationStatus
                                                )}`}
                                            >
                                                {r.donationStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

/* STAT CARD */
function Stat({ label, value, icon }) {
    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-semibold text-slate-900">{value}</p>
        </div>
    );
}
