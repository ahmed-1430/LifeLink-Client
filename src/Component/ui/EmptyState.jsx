import React from "react";
import Button from "./Button";

export default function EmptyState({
    title = "Nothing here",
    description = "There is no data to display.",
    actionLabel,
    onAction,
}) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="text-lg font-semibold text-slate-800">{title}</div>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">
                {description}
            </p>

            {actionLabel && onAction && (
                <Button className="mt-4" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
