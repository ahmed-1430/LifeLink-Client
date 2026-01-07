import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { Droplet, MapPin, Calendar, MessageSquare } from "lucide-react";

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

  /* ===============================
     FETCH DISTRICTS
  ================================ */
  useEffect(() => {
    API.get("/geo/districts")
      .then((res) => setDistricts(res.data || []))
      .catch(() => setDistricts([]));
  }, []);

  /* ===============================
     FETCH UPAZILAS
  ================================ */
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

  /* ===============================
     SUBMIT
  ================================ */
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
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
          Create Donation Request
        </h1>
        <p className="mt-1 text-slate-500">
          Provide accurate information to help donors reach you faster
        </p>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={submit}
        className="rounded-3xl bg-white/70 backdrop-blur-md shadow-xl p-8 space-y-10"
      >

        {/* REQUESTER INFO */}
        <Section title="Requester Information">
          <ReadOnly label="Requester Name" value={user?.name} />
          <ReadOnly label="Requester Email" value={user?.email} />
        </Section>

        {/* RECIPIENT */}
        <Section title="Recipient Details">
          <Input
            label="Recipient Name"
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            required
          />

          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Recipient District"
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
            >
              <option value="">Select district</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>

            <Select
              label="Recipient Upazila"
              name="recipientUpazila"
              value={form.recipientUpazila}
              onChange={handleChange}
              required
            >
              <option value="">Select upazila</option>
              {upazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </Select>
          </div>
        </Section>

        {/* LOCATION */}
        <Section title="Donation Location">
          <Input
            label="Hospital Name"
            name="hospitalName"
            value={form.hospitalName}
            onChange={handleChange}
            required
          />
          <Input
            label="Full Address"
            name="fullAddress"
            value={form.fullAddress}
            onChange={handleChange}
            required
          />
        </Section>

        {/* DONATION INFO */}
        <Section title="Donation Information">
          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Blood Group"
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              required
            >
              <option value="">Select blood group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                <option key={bg}>{bg}</option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input type="date" label="Donation Date" name="donationDate" value={form.donationDate} onChange={handleChange} required />
              <Input type="time" label="Donation Time" name="donationTime" value={form.donationTime} onChange={handleChange} required />
            </div>
          </div>
        </Section>

        {/* MESSAGE */}
        <Section title="Request Message">
          <textarea
            name="requestMessage"
            rows="4"
            value={form.requestMessage}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            placeholder="Explain why blood is needed..."
          />
        </Section>

        {error && (
          <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Requesting..." : "Request Blood"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===============================
   REUSABLE COMPONENTS
================================ */
function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <div className="grid md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>
      <select
        {...props}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
      >
        {children}
      </select>
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>
      <input
        readOnly
        value={value || ""}
        className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm"
      />
    </div>
  );
}
