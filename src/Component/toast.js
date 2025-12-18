let listeners = [];
let id = 0;

export const toast = {
    success: (message) => emit({ type: "success", message }),
    error: (message) => emit({ type: "error", message }),
    info: (message) => emit({ type: "info", message }),
};

function emit(payload) {
    const t = { id: ++id, ...payload };
    listeners.forEach((l) => l(t));
}

export function subscribe(fn) {
    listeners.push(fn);
    return () => (listeners = listeners.filter((l) => l !== fn));
}
