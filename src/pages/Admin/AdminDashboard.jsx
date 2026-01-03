import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AdminDashboard() {
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
        pending: requests.filter(r => r.donationStatus === "pending").length,
        inprogress: requests.filter(r => r.donationStatus === "inprogress").length,
        done: requests.filter(r => r.donationStatus === "done").length,
    };

    if (loading) {
        return (
            <p className="text-center py-10 text-slate-500">
                Loading admin dashboard…
            </p>
        );
    }

    return (
        <div className="space-y-8">
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Stat title="Pending" value={stats.pending} color="blue" />
                <Stat title="In Progress" value={stats.inprogress} color="orange" />
                <Stat title="Completed" value={stats.done} color="green" />
            </div>

            {/* TABLE */}
            <div className="bg-white p-6 rounded-xl shadow border">
                <h2 className="text-xl font-semibold mb-4">
                    All Donation Requests
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b text-slate-500">
                            <tr>
                                <th className="text-left py-2">Recipient</th>
                                <th className="text-center">Blood</th>
                                <th className="text-center">Location</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {requests.map((req) => (
                                <tr
                                    key={req._id}
                                    className="border-b hover:bg-slate-50"
                                >
                                    <td className="py-2">{req.recipientName}</td>
                                    <td className="text-center font-semibold text-red-600">
                                        {req.bloodGroup}
                                    </td>
                                    <td className="text-center">
                                        {req.recipientDistrict}
                                    </td>
                                    <td className="text-center capitalize">
                                        {req.donationStatus}
                                    </td>
                                </tr>
                            ))}

                            {requests.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="py-6 text-center text-slate-500"
                                    >
                                        No donation requests found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Stat({ title, value, color }) {
    const colors = {
        blue: "text-blue-600",
        orange: "text-orange-600",
        green: "text-green-600",
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="text-sm text-slate-500">{title}</h3>
            <p className={`text-3xl font-semibold ${colors[color]}`}>
                {value}
            </p>
        </div>
    );
}
