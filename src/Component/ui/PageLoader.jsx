import Spinner from "./Spinner";

export default function PageLoader({ label = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <Spinner size={32} />
            <p className="mt-3 text-sm text-slate-500">{label}</p>
        </div>
    );
}
