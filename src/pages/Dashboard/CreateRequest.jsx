import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const initialForm = {
    patientName: "",
    bloodGroup: "",
    units: 1,
    district: "",
    upazila: "",
    contact: "",
    notes: "",
    urgent: false,
};

const CreateRequest = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [loadingDistricts, setLoadingDistricts] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // load districts once
    useEffect(() => {
        let cancelled = false;
        const loadDistricts = async () => {
            try {
                setLoadingDistricts(true);
                const res = await API.get("/districts");
                if (!cancelled) setDistricts(res.data || []);
            } catch (err) {
                console.error("Could not fetch districts:", err);
            } finally {
                if (!cancelled) setLoadingDistricts(false);
            }
        };
        loadDistricts();
        return () => (cancelled = true);
    }, []);

    // load upazilas whenever district changes
    useEffect(() => {
        if (!form.district) {
            setUpazilas([]);
            return;
        }
        let cancelled = false;
        const loadUpazilas = async () => {
            try {
                const res = await API.get(`/upazilas/${form.district}`);
                if (!cancelled) setUpazilas(res.data || []);
            } catch (err) {
                console.error("Could not fetch upazilas:", err);
                if (!cancelled) setUpazilas([]);
            }
        };
        loadUpazilas();
        return () => (cancelled = true);
    }, [form.district]);

    // prefill district if user has one
    useEffect(() => {
        if (user?.district && districts.length > 0 && !form.district) {
            // try to find matching id in districts; user.district might be id or name
            const found = districts.find(
                (d) => d.id === user.district || d._id === user.district || d.name === user.district
            );
            if (found) setForm((s) => ({ ...s, district: found.id || found._id }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, districts]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    };

    const validate = () => {
        if (!form.patientName.trim()) return "Patient name is required.";
        if (!form.bloodGroup) return "Blood group is required.";
        if (!form.district) return "District is required.";
        if (!form.upazila) return "Upazila is required.";
        if (!form.contact.trim()) return "Contact number is required.";
        if (isNaN(Number(form.units)) || Number(form.units) <= 0) return "Units must be a positive number.";
        return null;
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setSubmitting(true);
        try {
            // build payload - adapt keys if your backend expects different names
            const payload = {
                patientName: form.patientName,
                bloodGroup: form.bloodGroup,
                unitsNeeded: Number(form.units),
                district: form.district,
                upazila: form.upazila,
                contact: form.contact,
                notes: form.notes,
                urgent: !!form.urgent,
            };

            // POST to /donation (expects verifyJWT middleware)
            const res = await API.post("/donation", payload);
            setSuccess(res.data?.message || "Request created successfully");

            // short delay then navigate to requests list
            setTimeout(() => navigate("/dashboard/requests"), 900);
        } catch (err) {
            console.error("Create request error:", err);
            setError(err.response?.data?.message || "Failed to create request. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Create Donation Request</h1>
                <div className="text-sm text-slate-500">Logged in as {user?.name || user?.email}</div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm p-6">
                {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
                {success && <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded">{success}</div>}

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm text-slate-700 mb-1">Patient Name</label>
                        <input
                            name="patientName"
                            value={form.patientName}
                            onChange={handleChange}
                            placeholder="e.g. Mohammad Ahmed"
                            className="input input-bordered w-full rounded-md px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-700 mb-1">Blood Group</label>
                        <select
                            name="bloodGroup"
                            value={form.bloodGroup}
                            onChange={handleChange}
                            required
                            className="select select-bordered w-full"
                        >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-700 mb-1">Units Needed</label>
                        <input
                            name="units"
                            value={form.units}
                            onChange={handleChange}
                            type="number"
                            min="1"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-700 mb-1">Contact Number</label>
                        <input
                            name="contact"
                            value={form.contact}
                            onChange={handleChange}
                            type="tel"
                            placeholder="+8801XXXXXXXXX"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-700 mb-1">District</label>
                        <select
                            name="district"
                            value={form.district}
                            onChange={handleChange}
                            required
                            className="select select-bordered w-full"
                        >
                            <option value="">{loadingDistricts ? "Loading districts..." : "Select district"}</option>
                            {districts.map((d) => (
                                <option key={d.id || d._id} value={d.id || d._id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-700 mb-1">Upazila</label>
                        <select
                            name="upazila"
                            value={form.upazila}
                            onChange={handleChange}
                            required
                            className="select select-bordered w-full"
                        >
                            <option value="">{upazilas.length ? "Select upazila" : "Choose district first"}</option>
                            {upazilas.map((u) => (
                                <option key={u.id || u._id} value={u.name || u.id || u._id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm text-slate-700 mb-1">Notes (optional)</label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Any extra info (hospital, blood transfusion time, etc.)"
                            className="textarea textarea-bordered w-full"
                        />
                    </div>

                    <div className="flex items-center gap-3 mt-2 md:col-span-2">
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="urgent"
                                checked={form.urgent}
                                onChange={handleChange}
                                className="checkbox"
                            />
                            <span className="text-sm text-slate-700">Mark as urgent</span>
                        </label>
                    </div>

                    <div className="md:col-span-2 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="px-4 py-2 rounded-md border"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                        >
                            {submitting ? "Creating..." : "Create Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default CreateRequest;