import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import PageLoader from "../../Component/ui/PageLoader";

export default function DonorHome() {
    const { user } = useContext(AuthContext);
    const [recentRequests, setRecentRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        API.get("/donations/my")
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : [];
                setRecentRequests(data.slice(0, 3));
            })
            .catch((err) => {
                console.error("Failed to load donor dashboard:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user]);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Welcome, {user.name}
                </h1>

                <Link
                    to="/dashboard/create"
                    className="inline-flex items-center justify-center rounded-xl
          bg-rose-600 px-5 py-2.5 text-white font-medium
          hover:bg-rose-700 transition"
                >
                    + Create Donation Request
                </Link>
            </div>

            {/* RECENT REQUESTS */}
            {recentRequests.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        My Recent Donation Requests
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-slate-500 border-b">
                                <tr>
                                    <th className="py-2">Recipient</th>
                                    <th className="py-2">Location</th>
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Time</th>
                                    <th className="py-2">Blood</th>
                                    <th className="py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentRequests.map((req) => (
                                    <tr key={req._id} className="border-b last:border-0">
                                        <td className="py-2">{req.recipientName}</td>
                                        <td className="py-2">
                                            {req.recipientDistrict}, {req.recipientUpazila}
                                        </td>
                                        <td className="py-2">{req.donationDate}</td>
                                        <td className="py-2">{req.donationTime}</td>
                                        <td className="py-2">{req.bloodGroup}</td>
                                        <td className="py-2 capitalize">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium
                        ${req.donationStatus === "pending"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : req.donationStatus === "inprogress"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : req.donationStatus === "done"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {req.donationStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 text-right">
                        <Link
                            to="/dashboard/requests"
                            className="text-sm font-medium text-rose-600 hover:underline"
                        >
                            View My All Requests →
                        </Link>
                    </div>
                </div>
            )}

            {/* EMPTY STATE */}
            {recentRequests.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                    <p className="text-slate-600 mb-4">
                        You haven’t created any donation request yet.
                    </p>
                    <Link
                        to="/dashboard/create"
                        className="inline-flex items-center justify-center rounded-xl
            bg-rose-600 px-5 py-2.5 text-white font-medium
            hover:bg-rose-700 transition"
                    >
                        Create Your First Request
                    </Link>
                </div>
            )}
        </div>
    );
}
