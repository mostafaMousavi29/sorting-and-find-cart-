// --- Normalize any value for comparison ---
export const normalizeForCompare = (val) => {
    console.log("val",val)
    if (val == null) return "";
    // if (typeof val === "number") return String(+val);
    if (typeof val === "boolean") return val ? "true" : "false";
    if (Array.isArray(val)) {
        return val.map(v => String(v).trim().toLowerCase()).sort().join(" | ");
    }
    if (typeof val === "object") {
        return Object.keys(val)
            .sort()
            .map(k => `${k}:${normalizeForCompare(val[k])}`)
            .join(",");
    }
    return String(val).trim().toLowerCase();
};

// --- General comparison function for sorting ---
export const compareByKey = (key, ascending = true) => (a, b) => {
    const valA = normalizeForCompare(a[key]);
    const valB = normalizeForCompare(b[key]);

    const numA = parseFloat(valA);
    const numB = parseFloat(valB);

    if (!isNaN(numA) && !isNaN(numB)) {
        return ascending ? numA - numB : numB - numA;
    }

    if (valA < valB) return ascending ? -1 : 1;
    if (valA > valB) return ascending ? 1 : -1;
    return 0;
};

// --- Compute highlights based on majority (mode) ---
export const computeHighlightData = (items, keys) => {
    const perKeyData = {};
    keys.forEach((key) => {
        const normalizedValues = items.map(item => normalizeForCompare(item[key]));
        const freq = {};
        normalizedValues.forEach(nv => freq[nv] = (freq[nv] || 0) + 1);

        const counts = Object.values(freq);
        const maxCount = Math.max(...counts);
        const modes = Object.keys(freq).filter(nv => freq[nv] === maxCount);
        const isTie = modes.length !== 1;

        perKeyData[key] = {
            normalizedValues,
            mode: isTie ? null : modes[0],
            isTie,
        };
    });
    return perKeyData;
};
