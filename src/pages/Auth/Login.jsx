import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../component/ui/Button";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import { Droplet, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const { login, user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    /* ================= REDIRECT ================= */
    useEffect(() => {
        if (!authLoading && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, authLoading, navigate]);

    /* ================= SUBMIT ================= */
    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await API.post("/auth/login", {
                email: form.email.trim(),
                password: form.password,
            });

            login(res.data.token, res.data.user);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message || "Invalid email or password"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">

            {/* ================= LEFT (INFO) ================= */}
            <div className="hidden md:flex items-center justify-center px-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-rose-50 via-white to-blue-50" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-300/30 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300/20 rounded-full blur-[120px]" />

                <div className="relative w-11/12 mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                            L
                        </span>
                        <span className="text-xl font-bold text-slate-900">
                            LifeLink
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                        Welcome back.
                        <br />
                        Let’s save lives.
                    </h1>

                    <p className="mt-4 text-slate-600">
                        Sign in to manage donation requests, help patients,
                        and support your community.
                    </p>
                </div>
            </div>

            {/* ================= RIGHT (FORM) ================= */}
            <div className="flex items-center justify-center px-6">
                <div
                    className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_-30px_rgba(15,23,42,0.35)] p-8"
                >
                    {/* HEADER */}
                    <div className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                            <Droplet size={22} />
                        </div>

                        <h2 className="text-2xl font-semibold text-slate-900">
                            Sign in to LifeLink
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Enter your credentials to continue
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 text-center">
                            {error}
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={submit} className="mt-6 space-y-4">

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                className="w-full rounded-xl bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-rose-500 outline-none"
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({ ...form, password: e.target.value })
                                    }
                                    className="w-full rounded-xl bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-rose-500 outline-none pr-10"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full mt-2 rounded-xl py-3 shadow-lg cursor-pointer">
                            {submitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>

                    {/* FOOTER */}
                    <p className="mt-6 text-sm text-center text-slate-600">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-rose-600 font-medium hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
