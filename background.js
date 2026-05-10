chrome.runtime.onMessage.addListener((msg, sender) => {

    // =========================
    // OPEN SEARCH IN SAME TAB
    // =========================

    if (msg.action === "openMaps") {

        let mapsUrl = "";

        // URL MODE
        if (msg.url && msg.url.length > 5) {

            mapsUrl = msg.url;
        }
        else {

            const search =
                `${msg.keyword} ${msg.city}`;

            mapsUrl =
                `https://www.google.com/maps/search/${encodeURIComponent(search)}`;
        }

        // UPDATE CURRENT TAB
        chrome.tabs.update(sender.tab.id, {
            url: mapsUrl
        });
    }

    // =========================
    // DOWNLOAD CSV
    // =========================

    if (msg.action === "downloadCSV") {

        chrome.downloads.download({
            url: msg.url,
            filename: "google_maps_leads.csv"
        });
    }
});