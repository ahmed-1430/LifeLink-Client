import { useState } from "react";
import API from "../../api/axios";

export default function ChangePassword() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        try {
            await API.patch("/auth/password", form);
            setMsg("Password updated successfully");
            setForm({ currentPassword: "", newPassword: "" });
        } catch (err) {
            setMsg(err.response?.data?.message || "Password update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4 max-w-md">
            {msg && (
                <p className="text-sm text-center text-blue-600 bg-blue-50 py-2 rounded-lg">
                    {msg}
                </p>
            )}

            <input
                type="password"
                placeholder="Current password"
                value={form.currentPassword}
                onChange={(e) =>
                    setForm({ ...form, currentPassword: e.target.value })
                }
                className="input"
                required
            />

            <input
                type="password"
                placeholder="New password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="input"
                required
            />

            <button
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-xl text-sm font-medium"
            >
                {loading ? "Updating..." : "Change Password"}
            </button>
        </form>
    );
}
