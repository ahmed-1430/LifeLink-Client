import Button from "../ui/Button";

export default function Topbar({ user, onLogout }) {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div>
                <h1 className="text-lg font-semibold text-slate-800">
                    Welcome, {user?.name || "User"}
                </h1>
                <p className="text-sm text-slate-500 capitalize">
                    Role: {user?.role}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <img
                    src={user?.avatar}
                    alt="avatar"
                    className="h-9 w-9 rounded-full object-cover border"
                />
                <Button variant="secondary" size="sm" onClick={onLogout}>
                    Logout
                </Button>
            </div>
        </header>
    );
}
