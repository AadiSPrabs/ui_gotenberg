export const HISTORY_KEY = 'gotenberg_history';

export const getHistory = () => {
    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to parse history", e);
    }
    return [];
};

export const appendHistory = (record) => {
    const current = getHistory();
    // Prepend new record so newest is at the top
    const updated = [record, ...current].slice(0, 50); // Keep max 50 records
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
};

export const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    return [];
};

export const removeHistoryItem = (id) => {
    const current = getHistory();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
};
