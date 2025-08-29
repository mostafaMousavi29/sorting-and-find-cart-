export const setupSearch = (data, inputEl, callback, delay = 200) => {
    let timeout;
    inputEl.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const query = inputEl.value.trim().toLowerCase();
            const filtered = data.filter(item => item.title.toLowerCase().includes(query));
            callback(filtered);
        }, delay);
    });
};
