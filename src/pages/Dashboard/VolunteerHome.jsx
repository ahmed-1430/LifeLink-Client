import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "../../Component/toast";

export default function VolunteerHome() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({ pending: 0, inprogress: 0, done: 0 });
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await API.get("/all-requests");
                const data = res.data || [];
                setRequests(data);

                setStats({
                    pending: data.filter(r => r.donationStatus === "pending").length,
                    inprogress: data.filter(r => r.donationStatus === "inprogress").length,
                    done: data.filter(r => r.donationStatus === "done").length,
                });
            } catch {
                toast.error("Failed to load requests");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const updateLocal = (id, status) => {
        setRequests(prev =>
            prev.map(r => r._id === id ? { ...r, donationStatus: status } : r)
        );
    };

    const acceptRequest = async (id) => {
        try {
            setActionLoading(id);
            await API.patch(`/donation/accept/${id}`);
            updateLocalStatus(id, "inprogress");
            toast.success("Request accepted");
        } catch (err) {
            console.error(err);
            toast.error("Accept failed");
        } finally {
            setActionLoading(null);
        }
    };

    const completeRequest = async (id) => {
        try {
            setActionLoading(id);
            await API.patch(`/donation/done/${id}`);
            updateLocalStatus(id, "done");
            toast.success("Donation completed");
        } catch (err) {
            console.error(err);
            toast.error("Complete failed");
        } finally {
            setActionLoading(null);
        }
    };


    if (loading) return <div className="py-20 text-center">Loading…</div>;

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
                <Stat label="Pending" value={stats.pending} />
                <Stat label="In Progress" value={stats.inprogress} />
                <Stat label="Completed" value={stats.done} />
            </div>

            <div className="bg-white border rounded-xl p-6 space-y-4">
                {requests.map(req => (
                    <div key={req._id} className="border p-4 rounded-lg flex justify-between">
                        <div>
                            <p className="font-medium">{req.recipientName} • {req.bloodGroup}</p>
                            <p className="text-sm">{req.recipientDistrict}, {req.recipientUpazila}</p>
                        </div>

                        {/* DONOR VIEW ONLY */}
                        {user.role === "donor" && (
                            <span>{req.donationStatus}</span>
                        )}

                        {/* VOL / ADMIN */}
                        {(user.role === "volunteer" || user.role === "admin") && (
                            <>
                                {req.donationStatus === "pending" && (
                                    <button onClick={() => acceptRequest(req._id)} disabled={actionLoading === req._id}>
                                        Accept
                                    </button>
                                )}
                                {req.donationStatus === "inprogress" && (
                                    <button onClick={() => completeRequest(req._id)} disabled={actionLoading === req._id}>
                                        Complete
                                    </button>
                                )}
                                {req.donationStatus === "done" && <span>Done</span>}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const Stat = ({ label, value }) => (
    <div className="bg-white border rounded-xl p-4">
        <p className="text-sm">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
    </div>
);
