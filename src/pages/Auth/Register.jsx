/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

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

                if (Array.isArray(raw)) {
                    setDistricts(raw);
                } else if (raw?.data && Array.isArray(raw.data)) {
                    setDistricts(raw.data);
                } else {
                    console.warn("Unexpected districts format:", raw);
                    setDistricts([]);
                }
            } catch (err) {
                console.error("District load error:", err);
                setDistricts([]);
            } finally {
                setFetchingDistricts(false);
            }
        };

        loadDistricts();
    }, []);

    // -------------------------
    // Load Upazilas by District
    // -------------------------
    useEffect(() => {
        if (!form.district) {
            setUpazilas([]);
            return;
        }

        const loadUpazilas = async () => {
            try {
                const res = await API.get(`/upazilas/${form.district}`);
                const raw = res.data;

                if (Array.isArray(raw)) {
                    setUpazilas(raw);
                } else if (raw?.data && Array.isArray(raw.data)) {
                    setUpazilas(raw.data);
                } else {
                    console.warn("Unexpected upazilas format:", raw);
                    setUpazilas([]);
                }
            } catch (err) {
                console.error("Upazila load error:", err);
                setUpazilas([]);
            }
        };

        loadUpazilas();
    }, [form.district]);

    const handleChange = (e) =>
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

    // -------------------------
    // Validation
    // -------------------------
    const validate = () => {
        if (!form.name.trim()) return "Name is required.";
        if (!form.email.trim()) return "Email is required.";
        if (!form.password || form.password.length < 6)
            return "Password must be at least 6 characters.";
        if (!form.bloodGroup) return "Choose your blood group.";
        if (!form.district) return "Choose your district.";
        if (!form.upazila) return "Choose your upazila.";
        return null;
    };

    // -------------------------
    // Submit Register Form
    // -------------------------
    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        const v = validate();
        if (v) return setError(v);

        setLoading(true);

        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                avatar: form.avatar || defaultAvatar(form.name),
                bloodGroup: form.bloodGroup,
                district: form.district,
                upazila: form.upazila,
            };

            const res = await API.post("/register", payload);

            // token handling
            const token =
                res.data?.token || res.data?.accessToken || res.data?.jwt;
            const user = res.data?.user || null;

            // If token returned → log in directly
            if (token) {
                login(token, user);
                navigate("/dashboard", { replace: true });
                return;
            }

            // If no token → fallback to login
            try {
                const loginRes = await API.post("/login", {
                    email: form.email,
                    password: form.password,
                });

                const loginToken =
                    loginRes.data?.token ||
                    loginRes.data?.accessToken ||
                    loginRes.data?.jwt;
                const loginUser = loginRes.data?.user || null;

                if (loginToken) {
                    login(loginToken, loginUser);
                    navigate("/dashboard", { replace: true });
                    return;
                }
            } catch (err) {
                console.warn("Auto login failed");
            }

            // fallback success
            setSuccessMsg(
                res.data?.message || "Registration successful. Please login."
            );
            setTimeout(() => navigate("/login"), 900);
        } catch (err) {
            console.error("Register error:", err);
            setError(
                err.response?.data?.message || "Registration failed. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // -------------------------
    // UI Layout
    // -------------------------
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-slate-50 p-6">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">

                    {/* LEFT */}
                    <div className="hidden lg:flex flex-col gap-6 p-10 bg-linear-to-b from-blue-600 to-blue-700 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                                LL
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">LifeLink</h3>
                                <p className="text-sm opacity-90">
                                    Connect donors & save lives.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold">
                                Join the LifeLink community
                            </h2>
                            <p className="mt-2 text-sm text-white/90">
                                Register as a donor — help people in need in your area.
                            </p>
                        </div>

                        <div className="mt-auto text-sm opacity-90">
                            Secure. Fast. Trusted Nationwide.
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="p-8">
                        <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                            Create an account
                        </h2>
                        <p className="text-sm text-slate-500 mb-4">
                            Register to request and donate blood
                        </p>

                        {error && (
                            <div className="mb-3 text-sm text-red-700 bg-red-50 p-3 rounded">
                                {error}
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-3 text-sm text-green-700 bg-green-50 p-3 rounded">
                                {successMsg}
                            </div>
                        )}

                        <form
                            onSubmit={submit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                            {/* Name */}
                            <div className="md:col-span-2">
                                <label className="text-sm mb-1 block">Full Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Your full name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm mb-1 block">Email</label>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    type="email"
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-200"
                                    placeholder="you@domain.com"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm mb-1 block">Password</label>
                                <input
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    type="password"
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Min 6 characters"
                                />
                            </div>

                            {/* Avatar */}
                            <div>
                                <label className="text-sm mb-1 block">Avatar URL</label>
                                <input
                                    name="avatar"
                                    value={form.avatar}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-200"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Blood group */}
                            <div>
                                <label className="text-sm mb-1 block">Blood Group</label>
                                <select
                                    name="bloodGroup"
                                    value={form.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-200"
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

                            {/* District */}
                            <div>
                                <label className="text-sm mb-1 block">District</label>
                                <select
                                    name="district"
                                    value={form.district}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-200"
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
                            </div>

                            {/* Upazila */}
                            <div>
                                <label className="text-sm mb-1 block">Upazila</label>
                                <select
                                    name="upazila"
                                    value={form.upazila}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-200"
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

                            {/* Submit */}
                            <div className="md:col-span-2 flex justify-between items-center mt-2">
                                <p className="text-sm">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </p>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
