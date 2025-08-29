import { createCard, applyHighlight } from "./utils/domHelper.js";


import data from "./mock.js";

const app = document.getElementById("app");
const compareContainer = document.getElementById("compare");
const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");

let compareList = [];
let filteredData = [...data];
const keys = ["title", "price", "specs", "rating"];

const worker = new Worker("./utils/worker.js", { type: "module" });

worker.onmessage = (e) => {
    const { type, result, sorted, filtered } = e.data;

    switch (type) {
        case "computeHighlightDone":
            renderCompare(result);
            loader.style.display = "none";
            break;

        case "sortDone":
            compareList = sorted;
            worker.postMessage({
                type: "computeHighlight",
                payload: { compareList, keys }
            });
            break;

        case "searchDone":
            filteredData = filtered;
            displayAlbums(filteredData);
            loader.style.display = "none";
            break;
    }
};

// --- Display albums ---
const displayAlbums = (albums) => {
    app.innerHTML = "";
    const fragment = document.createDocumentFragment();
    albums.forEach(album => fragment.appendChild(createCard(album)));
    app.appendChild(fragment);
};

// --- Compare render ---
const renderCompare = (perKeyData) => {
    compareContainer.innerHTML = "";
    if (!compareList.length) return;

    const fragment = document.createDocumentFragment();
    compareList.forEach((album, i) => {
        const card = createCard(album, true);
        if (perKeyData) applyHighlight(card, perKeyData, i);
        fragment.appendChild(card);
    });
    compareContainer.appendChild(fragment);
};

// --- Add to compare ---
const addToCompare = (album) => {
    if (compareList.length >= 4) return alert("حداکثر ۴ آیتم می‌تواند مقایسه شود!");
    if (!compareList.includes(album)) {
        compareList.push(album);
        loader.style.display = "block";

        worker.postMessage({
            type: "sort",
            payload: { data: compareList, key: "price", asc: true }
        });
    }
};

// --- Event delegation ---
app.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.albumId) {
        const album = filteredData.find(a => String(a.id) === e.target.dataset.albumId);
        addToCompare(album);
        e.target.disabled = true;
    }
});

// --- Search using worker ---
let searchTimeout;
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        loader.style.display = "block";
        worker.postMessage({
            type: "search",
            payload: { data, query: searchInput.value }
        });
    }, 200);
});

displayAlbums(filteredData);
