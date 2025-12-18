import React, { useState } from "react";
import API from "../../api/axios";
import { toast } from "../../components/toast";

export default function VolunteerSettings({ user }) {
    const [availability, setAvailability] = useState(user?.availability || "inactive");
    const [loading, setLoading] = useState(false);

    const save = async () => {
        try {
            setLoading(true);
            await API.patch("/volunteer/availability", {
                availability,
                district: user.district,
                upazila: user.upazila,
            });
            toast.success("Availability updated");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow border max-w-md">
            <h2 className="text-xl font-semibold mb-4">Volunteer Status</h2>

            <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
            >
                <option value="active">Active (Available)</option>
                <option value="inactive">Inactive (Unavailable)</option>
            </select>

            <button
                onClick={save}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                {loading ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
