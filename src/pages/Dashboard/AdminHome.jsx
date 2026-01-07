/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Users, Droplet, Wallet, Activity } from "lucide-react";
import PageLoader from "../../Component/ui/PageLoader";

export default function AdminHome() {
    const [stats, setStats] = useState({
        totalDonors: 0,
        totalRequests: 0,
        totalFunding: 0,
    });

    const [recentRequests, setRecentRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const loadDashboard = async () => {
            try {
                const [usersRes, requestsRes, fundRes] = await Promise.all([
                    API.get("/admin/users"),
                    API.get("/donations"),
                    API.get("/funds/total"),
                ]);

                const donors =
                    usersRes.data?.filter((u) => u.role === "donor") || [];

                if (!cancelled) {
                    setStats({
                        totalDonors: donors.length,
                        totalRequests: requestsRes.data?.length || 0,
                        totalFunding: fundRes.data?.total || 0,
                    });

                    setRecentRequests(requestsRes.data?.slice(0, 6) || []);
                }
            } catch (err) {
                console.error("Admin dashboard error:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadDashboard();
        return () => (cancelled = true);
    }, []);

    if (loading) {
        return (
            <div className="py-28 flex items-center justify-center">
                <PageLoader/>
            </div>
        );
    }

    return (
        <div className="space-y-14">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Admin Overview
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Live system metrics & platform health
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/70 backdrop-blur-md px-4 py-2 shadow">
                    <Activity size={18} className="text-rose-500" />
                    <span className="text-sm font-medium text-slate-700">
                        System Online
                    </span>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    label="Total Donors"
                    value={stats.totalDonors}
                    icon={Users}
                    accent="blue"
                />
                <KpiCard
                    label="Blood Requests"
                    value={stats.totalRequests}
                    icon={Droplet}
                    accent="rose"
                />
                <KpiCard
                    label="Total Funding"
                    value={`$ ${stats.totalFunding}`}
                    icon={Wallet}
                    accent="emerald"
                />
            </div>

            {/* RECENT REQUESTS */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Recent Blood Requests
                    </h2>
                    <span className="text-xs text-slate-500">
                        Latest 6 entries
                    </span>
                </div>

                {recentRequests.length === 0 ? (
                    <div className="py-16 text-center text-slate-500">
                        No recent requests
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="text-slate-500">
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-3 text-left">Recipient</th>
                                <th className="px-6 py-3 text-left">Blood</th>
                                <th className="px-6 py-3 text-left">Location</th>
                                <th className="px-6 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRequests.map((r) => (
                                <tr
                                    key={r._id}
                                    className="hover:bg-slate-50/60 transition"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {r.recipientName}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-rose-600">
                                        {r.bloodGroup}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {r.recipientDistrict}, {r.recipientUpazila}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={r.donationStatus} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

/* ===============================
   KPI CARD (GLASS)
================================ */
function KpiCard({ label, value, icon: Icon, accent }) {
    const accents = {
        blue: "from-blue-500/20 to-transparent text-blue-600",
        rose: "from-rose-500/20 to-transparent text-rose-600",
        emerald: "from-emerald-500/20 to-transparent text-emerald-600",
    };

    return (
        <div className="relative rounded-3xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden">
            <div
                className={`absolute inset-0 bg-linear-to-br ${accents[accent]}`}
            />
            <div className="relative p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-1 text-3xl font-semibold text-slate-900">
                        {value}
                    </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-white shadow flex items-center justify-center">
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}

/* ===============================
   STATUS BADGE
================================ */
function StatusBadge({ status }) {
    const map = {
        pending: "bg-amber-100/70 text-amber-700",
        inprogress: "bg-blue-100/70 text-blue-700",
        done: "bg-green-100/70 text-green-700",
        canceled: "bg-red-100/70 text-red-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${map[status]}`}
        >
            {status}
        </span>
    );
}
