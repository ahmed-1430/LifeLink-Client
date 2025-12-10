/* eslint-disable no-empty */
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminHome = () => {
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
                // Fetch all users
                const usersRes = await API.get("/admin/users");

                // Fetch all requests
                const reqRes = await API.get("/admin/requests");

                const allReq = reqRes.data || [];

                const pending = allReq.filter((r) => r.status === "pending").length;
                const completed = allReq.filter((r) => r.status === "completed").length;

                // Funding endpoint (optional)
                let fundingTotal = 0;
                try {
                    const fundRes = await API.get("/funding/all");
                    fundingTotal = fundRes.data?.totalAmount || 0;
                } catch { }

                if (!cancelled) {
                    setStats({
                        totalUsers: usersRes.data?.length || 0,
                        totalRequests: allReq.length,
                        pendingRequests: pending,
                        completedRequests: completed,
                        totalFunding: fundingTotal,
                    });

                    setRecent(allReq.slice(0, 5)); // latest 5
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

    const statusColor = (s) => {
        if (s === "pending") return "bg-orange-100 text-orange-700";
        if (s === "approved") return "bg-blue-100 text-blue-700";
        if (s === "completed") return "bg-green-100 text-green-700";
        return "bg-slate-100 text-slate-700";
    };

    if (loading)
        return <div className="text-center py-16 text-slate-500">Loading admin panel...</div>;

    return (
        <div className="space-y-10">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                <AdminStatCard
                    label="Total Users"
                    count={stats.totalUsers}
                    icon="👥"
                    color="text-blue-600"
                />

                <AdminStatCard
                    label="Total Requests"
                    count={stats.totalRequests}
                    icon="📑"
                    color="text-purple-600"
                />

                <AdminStatCard
                    label="Pending Requests"
                    count={stats.pendingRequests}
                    icon="⏳"
                    color="text-orange-600"
                />

                <AdminStatCard
                    label="Completed Requests"
                    count={stats.completedRequests}
                    icon="✅"
                    color="text-green-600"
                />

                <AdminStatCard
                    label="Funding Collected"
                    count={"৳" + stats.totalFunding}
                    icon="💰"
                    color="text-red-600"
                />
            </div>

            {/* RECENT REQUESTS */}
            <div className="bg-white border rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>

                {recent.length === 0 ? (
                    <p className="text-slate-500 text-sm">No requests found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b">
                                    <th className="py-3 px-4 text-sm font-medium text-slate-600">Patient</th>
                                    <th className="py-3 px-4 text-sm font-medium text-slate-600">Blood</th>
                                    <th className="py-3 px-4 text-sm font-medium text-slate-600">Location</th>
                                    <th className="py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recent.map((r) => (
                                    <tr key={r._id} className="border-b hover:bg-slate-50 transition">
                                        <td className="py-3 px-4">{r.patientName}</td>
                                        <td className="py-3 px-4 font-medium">{r.bloodGroup}</td>
                                        <td className="py-3 px-4 text-sm text-slate-600">
                                            {r.district}, {r.upazila}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-md text-sm font-medium ${statusColor(
                                                    r.status
                                                )}`}
                                            >
                                                {r.status}
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
export default AdminHome;