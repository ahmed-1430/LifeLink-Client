// 🔹 REUSABLE STAT CARD COMPONENT
function StatCard({ count, label, color, icon }) {
    return (
        <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className={`text-3xl font-bold ${color}`}>{count}</h3>
            <p className="text-slate-600 text-sm mt-1">{label}</p>
        </div>
    );
}
export default StatCard