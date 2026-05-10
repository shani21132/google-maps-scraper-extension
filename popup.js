const startBtn = document.getElementById("startBtn");
const downloadBtn = document.getElementById("downloadBtn");
const statusDiv = document.getElementById("status");

let scrapedData = [];

// START SCRAPING
startBtn.addEventListener("click", async () => {

    statusDiv.innerHTML = "⏳ Scraping started...";

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(tab.id, {
        action: "startScraping"
    });
});


// RECEIVE DATA
chrome.runtime.onMessage.addListener((msg) => {

    if (msg.action === "scrapingComplete") {

        scrapedData = msg.data;

        statusDiv.innerHTML =
            `✅ Scraped ${scrapedData.length} leads`;

        downloadBtn.disabled = false;
    }
});


// DOWNLOAD CSV
downloadBtn.addEventListener("click", () => {

    if (!scrapedData.length) return;

    let csv =
        "Title,Address,Image,URL\n";

    scrapedData.forEach(item => {

        csv += `"${item.title}","${item.address}","${item.image}","${item.url}"\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url: url,
        filename: "google_maps_leads.csv"
    });
});