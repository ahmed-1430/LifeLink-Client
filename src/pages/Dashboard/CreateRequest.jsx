import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function CreateDonationRequest() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    recipientName: "",
    district: "",
    districtName: "",
    upazila: "",
    hospital: "",
    address: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    message: "",
  });


  /* ---------------- Fetch districts ---------------- */
  useEffect(() => {
    API.get("/districts")
      .then((res) => setDistricts(res.data || []))
      .catch(() => setDistricts([]));
  }, []);

  /* ---------------- Fetch upazilas ---------------- */
  useEffect(() => {
    if (!form.district) {
      setUpazilas([]);
      return;
    }

    API.get(`/upazilas/${form.district}`)
      .then((res) => setUpazilas(res.data || []))
      .catch(() => setUpazilas([]));
  }, [form.district]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (user?.status === "blocked") {
      return setError("Blocked users cannot create donation requests.");
    }

    setLoading(true);

    try {
      await API.post("/donation", {
        recipientName: form.recipientName,
        recipientDistrict: form.districtName, 
        recipientUpazila: form.upazila,       
        hospitalName: form.hospital,
        fullAddress: form.address,
        bloodGroup: form.bloodGroup,
        donationDate: form.donationDate,
        donationTime: form.donationTime,
        requestMessage: form.message,
      });

      navigate("/dashboard/requests");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold text-slate-900 mb-8">
        Create Donation Request
      </h1>

      <form
        onSubmit={submit}
        className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 space-y-8"
      >
        {/* REQUESTER INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Requester Name
            </label>
            <input
              readOnly
              value={user?.name || ""}
              className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Requester Email
            </label>
            <input
              readOnly
              value={user?.email || ""}
              className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-700"
            />
          </div>
        </div>

        {/* RECIPIENT */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Recipient Name
          </label>
          <input
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            placeholder="Recipient full name"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-600"
          />
        </div>

        {/* LOCATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Recipient District
            </label>
            <select
              value={form.district}
              onChange={(e) => {
                const selected = districts.find(d => d.id === e.target.value);
                setForm({
                  ...form,
                  district: selected.id,
                  districtName: selected.name,
                });
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-700 cursor-pointer"
            >
              <option value="">Select district</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Recipient Upazila
            </label>
            <select
              name="upazila"
              value={form.upazila}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-400 text-slate-600 cursor-pointer"
            >
              <option value="">Select upazila</option>
              {upazilas.map((u) => (
                <option key={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* HOSPITAL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Hospital Name
          </label>
          <input
            name="hospital"
            value={form.hospital}
            onChange={handleChange}
            placeholder="Dhaka Medical College Hospital"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-400 text-slate-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Address
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Zahir Raihan Rd, Dhaka"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-400 text-slate-600"
          />
        </div>

        {/* BLOOD + DATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-400 text-slate-600 cursor-pointer"
            >
              <option value="">Select</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                <option key={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Donation Date
            </label>
            <input
              type="date"
              name="donationDate"
              value={form.donationDate}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-400 text-slate-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Donation Time
          </label>
          <input
            type="time"
            name="donationTime"
            value={form.donationTime}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-400 text-slate-600"
          />
        </div>

        {/* MESSAGE */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Request Message
          </label>
          <textarea
            name="message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            placeholder="Explain why blood is needed"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-rose-400 resize-none text-slate-600"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 shadow disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Requesting..." : "Request Blood"}
          </button>
        </div>
      </form>
    </div>
  );
}
