import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../component/ui/Button";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import { Droplet } from "lucide-react";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await API.post("/login", form);
            login(res.data.token, res.data.user);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">

            {/* LEFT: Brand / Message */}
            <div className="hidden md:flex flex-col justify-center px-16 bg-linear-to-br from-rose-50 via-white to-blue-50">
                <div className="max-w-md">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                            L
                        </span>
                        <span className="text-xl text-slate-900 font-bold">LifeLink</span>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 leading-snug">
                        Welcome back.
                        <br />
                        Let’s save lives together.
                    </h1>

                    <p className="mt-4 text-slate-600">
                        Log in to manage blood requests, respond to emergencies,
                        and stay connected with your community.
                    </p>
                </div>
            </div>

            {/* RIGHT: Login Form */}
            <div className="flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8">

                    {/* Header */}
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

                    {/* Error */}
                    {error && (
                        <div className="mt-4 text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-xl border text-slate-600 border-slate-300 px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-600 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-xl border text-slate-600 border-slate-300 px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                required
                            />
                        </div>

                        <Button
                            loading={loading}
                            className="w-full mt-2 cursor-pointer"
                        >
                            Sign in
                        </Button>
                    </form>

                    {/* Footer */}
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
