/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "../../Component/toast";
import { Filter, CheckCircle, Play } from "lucide-react";
import PageLoader from "../../Component/ui/PageLoader";

export default function VolunteerHome() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [bloodFilter, setBloodFilter] = useState("all");

  /* ===============================
     LOAD REQUESTS
  ================================ */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await API.get("/donations");
        if (!cancelled) {
          setRequests(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        toast.error("Failed to load donation requests");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => (cancelled = true);
  }, []);

  /* ===============================
     UPDATE STATUS (VOLUNTEER)
  ================================ */
  const updateStatus = async (id, nextStatus) => {
    try {
      setUpdatingId(id);

      if (nextStatus === "inprogress") {
        await API.patch(`/donations/${id}/accept`);
      }

      if (nextStatus === "done") {
        await API.patch(`/donations/${id}/done`);
      }

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, donationStatus: nextStatus } : r
        )
      );

      toast.success("Status updated");
    } catch {
      toast.error("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ===============================
     FILTERING
  ================================ */
  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.donationStatus !== statusFilter)
        return false;
      if (bloodFilter !== "all" && r.bloodGroup !== bloodFilter)
        return false;
      return true;
    });
  }, [requests, statusFilter, bloodFilter]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center text-slate-400">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Volunteer Dashboard
        </h1>
        <p className="text-slate-500">
          Manage blood donation requests responsibly
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-white/70 backdrop-blur shadow px-4 py-2">
          <Filter size={16} className="text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>

        <div className="rounded-xl bg-white/70 backdrop-blur shadow px-4 py-2">
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="bg-transparent text-sm focus:outline-none cursor-pointer"
          >
            <option value="all">All Blood Groups</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
              <option key={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-3xl bg-white/70 backdrop-blur shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left">Recipient</th>
              <th className="px-6 py-4">Blood</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50/60 transition">
                <td className="px-6 py-4 font-medium">{r.recipientName}</td>

                <td className="px-6 py-4 font-semibold text-rose-600">
                  {r.bloodGroup}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {r.recipientDistrict}, {r.recipientUpazila}
                </td>

                <td className="px-6 py-4 text-xs text-slate-500">
                  {r.donationDate}
                  <div>{r.donationTime}</div>
                </td>

                {/* ACTION BUTTONS */}
                <td className="px-6 py-4">
                  {r.donationStatus === "pending" && (
                    <ActionBtn
                      loading={updatingId === r._id}
                      onClick={() => updateStatus(r._id, "inprogress")}
                      icon={<Play size={14} />}
                      color="blue"
                      label="Accept"
                    />
                  )}

                  {r.donationStatus === "inprogress" && (
                    <ActionBtn
                      loading={updatingId === r._id}
                      onClick={() => updateStatus(r._id, "done")}
                      icon={<CheckCircle size={14} />}
                      color="green"
                      label="Mark Done"
                    />
                  )}

                  {r.donationStatus === "done" && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===============================
   ACTION BUTTON
================================ */
function ActionBtn({ label, onClick, loading, icon, color }) {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium text-white shadow cursor-pointer
        ${colors[color]} disabled:opacity-50`}
    >
      {loading ? "..." : icon}
      {label}
    </button>
  );
}
