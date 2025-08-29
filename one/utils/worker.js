import {compareByKey, computeHighlightData} from "./algoritm.js";

self.onmessage = (e) => {
    const {type, payload} = e.data;

    switch (type) {
        case "computeHighlight": {
            const {compareList, keys} = payload;
            const result = computeHighlightData(compareList, keys);
            self.postMessage({type: "computeHighlightDone", result});
            break;
        }

        case "sort": {
            const {data, key, asc} = payload;
            const sorted = [...data].sort(compareByKey(key, asc));
            self.postMessage({type: "sortDone", sorted});
            break;
        }

        case "search": {
            const {data, query} = payload;
            const q = query.trim().toLowerCase();
            const filtered = data.filter(item =>
                item.title.toLowerCase().includes(q)
            );
            self.postMessage({type: "searchDone", filtered});
            break;
        }

        default:
            console.warn("Unknown worker message:", type);
    }
};
