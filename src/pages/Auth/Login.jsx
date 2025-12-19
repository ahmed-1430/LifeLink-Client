import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

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
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center">Welcome back</h2>
                <p className="text-sm text-slate-500 text-center mt-1">
                    Login to continue to LifeLink
                </p>

                {error && (
                    <div className="mt-4 text-sm text-red-600 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded-lg px-3 py-2"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-lg px-3 py-2"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        required
                    />

                    <Button loading={loading} className="w-full">
                        Login
                    </Button>
                </form>

                <p className="mt-4 text-sm text-center text-slate-600">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
            </Card>
        </div>
    );
}
