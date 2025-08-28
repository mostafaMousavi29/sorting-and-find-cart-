import { compareByKey, computeHighlightData} from "./utils/algoritm.js";
import {setupSearch} from "./utils/search.js";
import data from "./mock.js";

const app = document.getElementById("app");
const compareContainer = document.getElementById("compare");
const searchInput = document.getElementById("searchInput");
let compareList = [];
let filteredData = [...data];
const keys = ["title", "price", "specs", "rating"];

// --- create card ---
const createCard = (album, isCompare = false) => {
    const card = document.createElement("div");
    card.className = isCompare ? "compare-card" : "album-card";

    card.innerHTML = `
        <img src="${album.thumbnailUrl || album.url || ""}" alt="${album.title}">
        <h3>${album.title}</h3>
        <p>Price: $${album.price}</p>
        <p>Specs: ${Array.isArray(album.specs) ? album.specs.join(", ") : album.specs ?? "-"}</p>
        <p>Rating: ${album.rating ?? "-"}</p>
        ${!isCompare ? `<button data-album-id="${album.id}">مقایسه</button>` : ""}
    `;
    return card;
};

// ---added highlight ---
const applyHighlight = (card, perKeyData, index) => {
    keys.forEach(key => {
        const {normalizedValues, mode, isTie} = perKeyData[key];
        const value = normalizedValues[index];
        const el = key === "title" ? card.querySelector("h3") :
            key === "price" ? card.querySelector("p:nth-of-type(1)") :
                key === "specs" ? card.querySelector("p:nth-of-type(2)") :
                    card.querySelector("p:nth-of-type(3)");
        el.classList.toggle("highlight", isTie ? true : value !== mode);
    });
};

// ---  DocumentFragment & batch update ---
const displayAlbums = albums => {
    app.innerHTML = "";
    const fragment = document.createDocumentFragment();
    albums.forEach(album => fragment.appendChild(createCard(album)));
    app.appendChild(fragment);
};

// --- compare ---
const addToCompare = (album) => {
    if (compareList.length >= 4) return alert("حداکثر ۴ آیتم می‌تواند مقایسه شود!");
    if (!compareList.includes(album)) {
        compareList.push(album);
        renderCompare();
    }
};

// --- batch update ---
const renderCompare = () => {
    compareContainer.innerHTML = "";
    if (!compareList.length) return;

    compareList.sort(compareByKey("price", true));
    const perKeyData = computeHighlightData(compareList, keys);

    const fragment = document.createDocumentFragment();
    compareList.forEach((album, i) => {
        const card = createCard(album, true);
        applyHighlight(card, perKeyData, i);
        fragment.appendChild(card);
    });
    compareContainer.appendChild(fragment);
};

// --- Event delegation  ---
app.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.albumId) {
        const album = filteredData.find(a => String(a.id) === e.target.dataset.albumId);
        addToCompare(album);
        e.target.disabled = true;
    }
});

setupSearch(data, searchInput, filtered => {
    filteredData = filtered;
    displayAlbums(filteredData);
});

displayAlbums(filteredData);
