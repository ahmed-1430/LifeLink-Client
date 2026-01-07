import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import PageLoader from "../../Component/ui/PageLoader";
import { Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function DonorHome() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [recentRequests, setRecentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        if (!user) return;

        API.get("/donations/my")
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : [];
                setRecentRequests(data.slice(0, 3));
            })
            .finally(() => setLoading(false));
    }, [user]);

    /* ===============================
       ACTIONS
    ================================ */
    const markDone = async (id) => {
        setActionId(id);
        await API.patch(`/donations/${id}/done`);
        refresh();
    };

    const cancelReq = async (id) => {
        if (!confirm("Cancel this donation request?")) return;
        setActionId(id);
        await API.patch(`/donations/${id}/cancel`);
        refresh();
    };

    const deleteReq = async (id) => {
        if (!confirm("Delete this donation request permanently?")) return;
        setActionId(id);
        await API.delete(`/donations/${id}`);
        refresh();
    };

    const refresh = async () => {
        const res = await API.get("/donations/my");
        setRecentRequests(res.data.slice(0, 3));
        setActionId(null);
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-12">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Welcome, {user.name} 👋
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage your blood donation requests
                    </p>
                </div>

                <Link
                    to="/dashboard/create"
                    className="rounded-xl bg-rose-600 px-6 py-2.5 text-white font-medium shadow hover:bg-rose-700 transition"
                >
                    + Create Request
                </Link>
            </div>

            {/* RECENT REQUESTS */}
            {recentRequests.length > 0 ? (
                <div className="rounded-3xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden">

                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between">
                        <h2 className="text-lg font-semibold">
                            My Recent Donation Requests
                        </h2>
                        <span className="text-xs text-slate-500">Last 3</span>
                    </div>

                    <table className="w-full text-sm">
                        <thead className="text-slate-500">
                            <tr>
                                <th className="px-6 py-4 text-left">Recipient</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Blood</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentRequests.map((r) => (
                                <tr key={r._id} className="hover:bg-slate-50/60 transition">
                                    <td className="px-6 py-4 font-medium">
                                        {r.recipientName}
                                        {r.donationStatus === "inprogress" && (
                                            <div className="text-xs text-slate-500 mt-1">
                                                Donor: {r.donorInfo?.name} ({r.donorInfo?.email})
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {r.recipientDistrict}, {r.recipientUpazila}
                                    </td>

                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {r.donationDate}
                                        <div>{r.donationTime}</div>
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-rose-600">
                                        {r.bloodGroup}
                                    </td>

                                    <td className="px-6 py-4">
                                        <StatusBadge status={r.donationStatus} />
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <IconBtn
                                            icon={<Eye size={16} />}
                                            onClick={() => navigate(`/requests/${r._id}`)}
                                        />

                                        {r.donationStatus === "pending" && (
                                            <IconBtn
                                                icon={<Edit size={16} />}
                                                onClick={() => navigate(`/dashboard/edit/${r._id}`)}
                                            />
                                        )}

                                        {r.donationStatus === "inprogress" && (
                                            <>
                                                <IconBtn
                                                    icon={<CheckCircle size={16} />}
                                                    color="green"
                                                    loading={actionId === r._id}
                                                    onClick={() => markDone(r._id)}
                                                />
                                                <IconBtn
                                                    icon={<XCircle size={16} />}
                                                    color="red"
                                                    loading={actionId === r._id}
                                                    onClick={() => cancelReq(r._id)}
                                                />
                                            </>
                                        )}

                                        <IconBtn
                                            icon={<Trash2 size={16} />}
                                            color="red"
                                            loading={actionId === r._id}
                                            onClick={() => deleteReq(r._id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="px-6 py-4 border-t border-slate-100 text-right">
                        <Link
                            to="/dashboard/requests"
                            className="text-sm font-medium text-rose-600 hover:underline"
                        >
                            View My All Requests →
                        </Link>
                    </div>
                </div>
            ) : (
                /* EMPTY STATE */
                <div className="rounded-3xl bg-white/70 backdrop-blur-md shadow p-10 text-center">
                    <p className="text-slate-600 mb-4">
                        You haven’t created any donation request yet.
                    </p>
                    <Link
                        to="/dashboard/create"
                        className="inline-flex rounded-xl bg-rose-600 px-6 py-2.5 text-white font-medium hover:bg-rose-700"
                    >
                        Create Your First Request
                    </Link>
                </div>
            )}
        </div>
    );
}

/* ===============================
   UI COMPONENTS
================================ */
function StatusBadge({ status }) {
    const map = {
        pending: "bg-amber-100 text-amber-700",
        inprogress: "bg-blue-100 text-blue-700",
        done: "bg-green-100 text-green-700",
        canceled: "bg-red-100 text-red-700",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${map[status]}`}>
            {status}
        </span>
    );
}

function IconBtn({ icon, onClick, color = "slate", loading }) {
    const colors = {
        slate: "text-slate-600 hover:bg-slate-100",
        green: "text-green-600 hover:bg-green-50",
        red: "text-red-600 hover:bg-red-50",
    };

    return (
        <button
            disabled={loading}
            onClick={onClick}
            className={`inline-flex items-center justify-center h-9 w-9 rounded-lg transition ${colors[color]} disabled:opacity-50`}
        >
            {icon}
        </button>
    );
}
