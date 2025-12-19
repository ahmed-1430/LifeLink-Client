import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const defaultAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
    )}&background=0D8ABC&color=fff&rounded=true`;

export default function Register() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        avatar: "",
        bloodGroup: "",
        district: "",
        upazila: "",
    });

    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [fetchingDistricts, setFetchingDistricts] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // -------------------------
    // Load Districts
    // -------------------------
    useEffect(() => {
        const loadDistricts = async () => {
            try {
                setFetchingDistricts(true);
                const res = await API.get("/districts");
                const raw = res.data;

                if (Array.isArray(raw)) setDistricts(raw);
                else if (raw?.data && Array.isArray(raw.data)) setDistricts(raw.data);
                else setDistricts([]);
            } catch {
                setDistricts([]);
            } finally {
                setFetchingDistricts(false);
            }
        };

        loadDistricts();
    }, []);

    // -------------------------
    // Load Upazilas
    // -------------------------
    useEffect(() => {
        if (!form.district) return setUpazilas([]);

        const loadUpazilas = async () => {
            try {
                const res = await API.get(`/upazilas/${form.district}`);
                const raw = res.data;

                if (Array.isArray(raw)) setUpazilas(raw);
                else if (raw?.data && Array.isArray(raw.data)) setUpazilas(raw.data);
                else setUpazilas([]);
            } catch {
                setUpazilas([]);
            }
        };

        loadUpazilas();
    }, [form.district]);

    const handleChange = (e) =>
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

    const validate = () => {
        if (!form.name.trim()) return "Full name is required.";
        if (!form.email.trim()) return "Email is required.";
        if (form.password.length < 6)
            return "Password must be at least 6 characters.";
        if (!form.bloodGroup) return "Select a blood group.";
        if (!form.district) return "Select your district.";
        if (!form.upazila) return "Select your upazila.";
        return null;
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        const v = validate();
        if (v) return setError(v);

        setLoading(true);

        try {
            const payload = {
                ...form,
                avatar: form.avatar || defaultAvatar(form.name),
            };

            const res = await API.post("/register", payload);

            const token =
                res.data?.token || res.data?.accessToken || res.data?.jwt;
            const user = res.data?.user || null;

            if (token) {
                login(token, user);
                return navigate("/dashboard", { replace: true });
            }

            // fallback login
            const loginRes = await API.post("/login", {
                email: form.email,
                password: form.password,
            });

            if (loginRes.data?.token) {
                login(loginRes.data.token, loginRes.data.user);
                return navigate("/dashboard", { replace: true });
            }

            setSuccessMsg("Registration successful. Please login.");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <Card className="w-full max-w-4xl p-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* LEFT — BRAND */}
                    <div className="hidden lg:flex flex-col justify-between p-10 bg-linear-to-b from-blue-600 to-blue-700 text-white">
                        <div>
                            <h1 className="text-2xl font-semibold">LifeLink</h1>
                            <p className="mt-1 text-sm opacity-90">
                                A trusted blood donation network
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-semibold">
                                Create your account
                            </h2>
                            <p className="mt-3 text-sm text-white/90">
                                Join thousands of donors helping save lives across the country.
                            </p>
                        </div>

                        <p className="text-sm opacity-80">
                            Secure • Fast • Community-driven
                        </p>
                    </div>

                    {/* RIGHT — FORM */}
                    <div className="p-8">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Sign up
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Create your LifeLink account
                        </p>

                        {error && (
                            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {successMsg && (
                            <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                {successMsg}
                            </div>
                        )}

                        <form
                            onSubmit={submit}
                            className="mt-6 space-y-5"
                        >
                            {/* Identity */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-slate-700">
                                    Personal Information
                                </h3>

                                <input
                                    name="name"
                                    placeholder="Full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password (min 6 chars)"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                                <input
                                    name="avatar"
                                    placeholder="Avatar URL (optional)"
                                    value={form.avatar}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2"
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-slate-700">
                                    Location & Blood Group
                                </h3>

                                <select
                                    name="bloodGroup"
                                    value={form.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2"
                                >
                                    <option value="">Select blood group</option>
                                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                                        (bg) => (
                                            <option key={bg} value={bg}>
                                                {bg}
                                            </option>
                                        )
                                    )}
                                </select>

                                <select
                                    name="district"
                                    value={form.district}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2"
                                >
                                    <option value="">
                                        {fetchingDistricts
                                            ? "Loading districts..."
                                            : "Select district"}
                                    </option>
                                    {districts.map((d) => (
                                        <option key={d.id || d._id} value={d.id || d._id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name="upazila"
                                    value={form.upazila}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2"
                                >
                                    <option value="">
                                        {upazilas.length
                                            ? "Select upazila"
                                            : "Choose district first"}
                                    </option>
                                    {upazilas.map((u) => (
                                        <option key={u.id || u._id} value={u.name}>
                                            {u.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* CTA */}
                            <div className="flex items-center justify-between pt-4">
                                <p className="text-sm text-slate-600">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </p>

                                <Button loading={loading}>
                                    Create account
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Card>
        </div>
    );
}
