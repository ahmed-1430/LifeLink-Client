import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await API.get("/admin/requests");
                setRequests(res.data || []);
            } catch (err) {
                console.error("Admin load error:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const stats = {
        pending: requests.filter(r => r.status === "pending").length,
        accepted: requests.filter(r => r.status === "accepted").length,
        completed: requests.filter(r => r.status === "completed").length,
    };

    if (loading) return <p className="text-center py-10">Loading admin data…</p>;

    return (
        <div className="space-y-8">
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Stat title="Pending" value={stats.pending} color="blue" />
                <Stat title="Accepted" value={stats.accepted} color="orange" />
                <Stat title="Completed" value={stats.completed} color="green" />
            </div>

            {/* REQUEST TABLE */}
            <div className="bg-white p-6 rounded-xl shadow border">
                <h2 className="text-xl font-semibold mb-4">All Requests</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b text-slate-500">
                            <tr>
                                <th className="text-left py-2">Patient</th>
                                <th>Blood</th>
                                <th>Location</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req._id} className="border-b hover:bg-slate-50">
                                    <td className="py-2">{req.patientName}</td>
                                    <td className="text-center">{req.bloodGroup}</td>
                                    <td className="text-center">{req.district}</td>
                                    <td className="text-center capitalize">{req.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Stat = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-sm text-slate-500">{title}</h3>
        <p className={`text-3xl font-semibold text-${color}-600`}>{value}</p>
    </div>
);

export default AdminDashboard;
