import { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";

export default function ProfilePage() {
    const [tab, setTab] = useState("profile");

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
                <p className="text-sm text-slate-500">
                    Manage your account information and security
                </p>
            </div>

            {/* TABS */}
            <div className="flex gap-2 border-b">
                <TabButton active={tab === "profile"} onClick={() => setTab("profile")}>
                    Profile Info
                </TabButton>
                <TabButton active={tab === "security"} onClick={() => setTab("security")}>
                    Security
                </TabButton>
            </div>

            {/* CONTENT */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                {tab === "profile" && <ProfileInfo />}
                {tab === "security" && <ChangePassword />}
            </div>
        </div>
    );
}

function TabButton({ children, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition cursor-pointer
        ${active
                    ? "border-rose-600 text-rose-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
        >
            {children}
        </button>
    );
}
