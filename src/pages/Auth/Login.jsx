import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.email || !form.password) {
            setError("Please fill email and password.");
            return;
        }

        setLoading(true);
        try {
            const res = await API.post("/login", {
                email: form.email,
                password: form.password,
            });

            // support backends that return token in different shapes
            const token = res.data?.token || res.data?.accessToken || res.data?.jwt;
            const user = res.data?.user || null;

            if (!token) {
                // sometimes login returns only user and cookies — adapt as needed
                setError("Login succeeded but token not returned.");
                setLoading(false);
                return;
            }

            // call context login (will store token and decode)
            login(token, user);

            // navigate to dashboard
            navigate("/dashboard", { replace: true });
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || err.message || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-slate-50 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border overflow-hidden">
                {/* header */}
                <div className="px-6 py-6 bg-white/60">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 text-blue-700 text-2xl font-bold">LL</div>
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
                            <p className="text-sm text-slate-500">Sign in to your LifeLink account</p>
                        </div>
                    </div>
                </div>

                {/* form */}
                <div className="px-6 py-8">
                    {error && (
                        <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-700 mb-1">Email</label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                type="email"
                                required
                                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="you@domain.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-700 mb-1 justify-between">
                                <span>Password</span>
                                <Link to="/forgot" className="text-sm text-blue-600 hover:underline">Forgot?</Link>
                            </label>

                            <div className="relative">
                                <input
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    type={showPwd ? "text" : "password"}
                                    required
                                    className="w-full rounded-lg border px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd((s) => !s)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
                                >
                                    {showPwd ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 disabled:opacity-60 transition"
                        >
                            {loading ? "Signing you in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-4 text-sm text-slate-600 text-center">
                        Don’t have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline">Create one</Link>
                    </div>
                </div>

                {/* footer */}
                <div className="px-6 py-4 bg-slate-50 text-xs text-slate-500 text-center">
                    By continuing you agree to LifeLink Terms & Privacy.
                </div>
            </div>
        </div>
    );
}
export default Login;