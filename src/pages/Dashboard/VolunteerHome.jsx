import React, { useEffect, useMemo, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "../../Component/toast";

const STATUS_OPTIONS = ["pending", "inprogress", "done"];

export default function VolunteerHome() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  /* filters */
  const [statusFilter, setStatusFilter] = useState("all");
  const [bloodFilter, setBloodFilter] = useState("all");

  /* ---------------- LOAD ALL REQUESTS ---------------- */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await API.get("/all-requests");
        const data = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) setRequests(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load donation requests");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => (cancelled = true);
  }, []);

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (id, nextStatus) => {
    try {
      setUpdatingId(id);

      if (nextStatus === "inprogress") {
        await API.patch(`/donation/accept/${id}`);
      } else if (nextStatus === "done") {
        await API.patch(`/donation/done/${id}`);
      }

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, donationStatus: nextStatus } : r
        )
      );

      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------- FILTERED DATA ---------------- */
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
      <div className="py-20 text-center text-slate-500">
        Loading volunteer dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Volunteer Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Manage all blood donation requests
        </p>
      </div>

      {/* FILTERS */}
      {/* <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Completed</option>
        </select>

        <select
          value={bloodFilter}
          onChange={(e) => setBloodFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Blood Groups</option>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
      </div> */}

      {/* DESKTOP TABLE */}
      {/* <div className="hidden md:block bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Recipient</th>
              <th className="px-4 py-3 text-left">Blood</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="px-4 py-3 font-medium">
                  {r.recipientName}
                </td>
                <td className="px-4 py-3">{r.bloodGroup}</td>
                <td className="px-4 py-3">
                  {r.recipientDistrict}, {r.recipientUpazila}
                </td>
                <td className="px-4 py-3">
                  {r.donationDate}
                  <div className="text-xs text-slate-500">
                    {r.donationTime}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {(user.role === "admin" || user.role === "volunteer") ? (
                    <select
                      disabled={updatingId === r._id}
                      value={r.donationStatus}
                      onChange={(e) =>
                        updateStatus(r._id, e.target.value)
                      }
                      className="rounded-md border px-2 py-1 text-sm"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-slate-600">{r.donationStatus}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* MOBILE CARDS */}
      {/* <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.map((r) => (
          <div key={r._id} className="bg-white border rounded-xl p-4 space-y-2">
            <p className="font-medium">{r.recipientName}</p>
            <p className="text-sm text-slate-500">
              {r.recipientDistrict}, {r.recipientUpazila}
            </p>
            <p className="text-xs text-slate-400">
              {r.donationDate} • {r.donationTime}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">{r.bloodGroup}</span>

              {(user.role === "admin" || user.role === "volunteer") ? (
                <select
                  disabled={updatingId === r._id}
                  value={r.donationStatus}
                  onChange={(e) =>
                    updateStatus(r._id, e.target.value)
                  }
                  className="rounded-md border px-2 py-1 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <span className="text-sm">{r.donationStatus}</span>
              )}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
