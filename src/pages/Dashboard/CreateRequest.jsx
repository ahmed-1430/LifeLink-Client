import { useEffect, useState, useContext } from "react";
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
    recipientDistrictId: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });


  //  FETCH DISTRICTS

  useEffect(() => {
    API.get("/geo/districts")
      .then((res) => setDistricts(res.data || []))
      .catch(() => setDistricts([]));
  }, []);


  //  FETCH UPAZILAS

  useEffect(() => {
    if (!form.recipientDistrictId) {
      setUpazilas([]);
      return;
    }

    API.get(`/geo/upazilas/${form.recipientDistrictId}`)
      .then((res) => setUpazilas(res.data || []))
      .catch(() => setUpazilas([]));
  }, [form.recipientDistrictId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  //  SUBMIT

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (user?.status === "blocked") {
      setError("Blocked users cannot create donation requests.");
      return;
    }

    setLoading(true);

    try {
      await API.post("/donations", {
        recipientName: form.recipientName,
        recipientDistrict: form.recipientDistrict,
        recipientUpazila: form.recipientUpazila,
        hospitalName: form.hospitalName,
        fullAddress: form.fullAddress,
        bloodGroup: form.bloodGroup,
        donationDate: form.donationDate,
        donationTime: form.donationTime,
        requestMessage: form.requestMessage,
      });

      navigate("/dashboard/my-donation-requests");
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
              className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Requester Email
            </label>
            <input
              readOnly
              value={user?.email || ""}
              className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        {/* RECIPIENT NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Recipient Name
          </label>
          <input
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-4 py-2.5"
          />
        </div>

        {/* LOCATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Recipient District
            </label>
            <select
              value={form.recipientDistrictId}
              onChange={(e) => {
                const selected = districts.find(
                  (d) => d.id === e.target.value
                );
                setForm({
                  ...form,
                  recipientDistrictId: selected?.id || "",
                  recipientDistrict: selected?.name || "",
                });
              }}
              required
              className="w-full rounded-xl border px-4 py-2.5"
            >
              <option value="">Select district</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Recipient Upazila
            </label>
            <select
              name="recipientUpazila"
              value={form.recipientUpazila}
              onChange={handleChange}
              required
              className="w-full rounded-xl border px-4 py-2.5"
            >
              <option value="">Select upazila</option>
              {upazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* HOSPITAL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Hospital Name
          </label>
          <input
            name="hospitalName"
            value={form.hospitalName}
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Full Address
          </label>
          <input
            name="fullAddress"
            value={form.fullAddress}
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-4 py-2.5"
          />
        </div>

        {/* BLOOD + DATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-4 py-2.5"
          >
            <option value="">Select blood group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg}>{bg}</option>
            ))}
          </select>

          <input
            type="date"
            name="donationDate"
            value={form.donationDate}
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-4 py-2.5"
          />
        </div>

        <input
          type="time"
          name="donationTime"
          value={form.donationTime}
          onChange={handleChange}
          required
          className="w-full rounded-xl border px-4 py-2.5"
        />

        {/* MESSAGE */}
        <textarea
          name="requestMessage"
          rows="4"
          value={form.requestMessage}
          onChange={handleChange}
          required
          className="w-full rounded-xl border px-4 py-3 resize-none"
        />

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
            className="px-6 py-2.5 rounded-xl border"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-rose-600 text-white"
          >
            {loading ? "Requesting..." : "Request Blood"}
          </button>
        </div>
      </form>
    </div>
  );
}
