export const createCard = (album, isCompare = false) => {
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

export const applyHighlight = (card, perKeyData, index) => {
    const keys = ["title", "price", "specs", "rating"];
    keys.forEach(key => {
        const { normalizedValues, mode, isTie } = perKeyData[key];
        const value = normalizedValues[index];
        const el = key === "title" ? card.querySelector("h3") :
            key === "price" ? card.querySelector("p:nth-of-type(1)") :
                key === "specs" ? card.querySelector("p:nth-of-type(2)") :
                    card.querySelector("p:nth-of-type(3)");
        el.classList.toggle("highlight", isTie ? true : value !== mode);
    });
};
