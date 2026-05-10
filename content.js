(function () {

    // Prevent duplicate UI
    if (document.getElementById("zr-floating-ui")) return;

    // CREATE UI
    const div = document.createElement("div");

    div.id = "zr-floating-ui";

    div.innerHTML = `
        <div style="
            position:fixed;
            top:20px;
            right:20px;
            width:280px;
            background:white;
            border:1px solid #ccc;
            padding:15px;
            z-index:999999;
            border-radius:10px;
            box-shadow:0 0 10px rgba(0,0,0,0.2);
            font-family:Arial;
        ">
            <h3>ZR Maps Scraper</h3>

            <input 
                type="text"
                id="zr-keyword"
                placeholder="Business / Lead keyword"
                style="width:100%; padding:8px; margin-bottom:10px;"
            />

            <input 
                type="text"
                id="zr-city"
                placeholder="City name"
                style="width:100%; padding:8px; margin-bottom:10px;"
            />

            <input 
                type="text"
                id="zr-url"
                placeholder="Google Maps URL (optional)"
                style="width:100%; padding:8px; margin-bottom:10px;"
            />

            <button 
                id="zr-start"
                style="
                    width:100%;
                    padding:10px;
                    background:#007bff;
                    color:white;
                    border:none;
                    cursor:pointer;
                    border-radius:5px;
                "
            >
                Start Scraping
            </button>

            <button 
                id="zr-download"
                style="
                    width:100%;
                    padding:10px;
                    margin-top:10px;
                    background:#28a745;
                    color:white;
                    border:none;
                    cursor:pointer;
                    border-radius:5px;
                    opacity:1;
                "
            >
                Download CSV
            </button>

            <div id="zr-status" style="margin-top:10px;"></div>
        </div>
    `;

    document.body.appendChild(div);

    // START BUTTON
    document.getElementById("zr-start")
    .addEventListener("click", async () => {

        const keyword =
            document.getElementById("zr-keyword").value.trim();

        const city =
            document.getElementById("zr-city").value.trim();

        const url =
            document.getElementById("zr-url").value.trim();

        if (!url && (!keyword || !city)) {
            alert("Enter URL OR keyword + city");
            return;
        }

        // clear old data
        await chrome.storage.local.remove("scrapedData");

        document.getElementById("zr-status")
        .innerHTML = "⏳ Opening Google Maps...";

        chrome.runtime.sendMessage({
            action: "openMaps",
            keyword,
            city,
            url
        });
    });

    let scrapedData = [];

    // RECEIVE SCRAPED DATA
    chrome.runtime.onMessage.addListener((msg) => {

        if (msg.action === "scrapingComplete") {

            scrapedData = msg.data;

            chrome.storage.local.set({
                scrapedData: scrapedData
            });

            document.getElementById("zr-status")
            .innerHTML =
            `✅ ${scrapedData.length} leads scraped`;
        }
    });

    // DOWNLOAD CSV
    document.getElementById("zr-download")
    .addEventListener("click", async () => {

        const stored =
            await chrome.storage.local.get("scrapedData");

        const data =
            stored.scrapedData || [];

        if (!data.length) {
            alert("No data scraped yet");
            return;
        }

        let csv =
`Title,Category,Rating,Reviews,Address,Phone,Website,Image,URL\n`;

        data.forEach(item => {

            csv +=
`"${item.title}",
"${item.category}",
"${item.rating}",
"${item.reviews}",
"${item.address}",
"${item.phone}",
"${item.website}",
"${item.image}",
"${item.url}"\n`;

        });

        const blob = new Blob([csv], {
            type: "text/csv"
        });

        const url =
            URL.createObjectURL(blob);

        chrome.runtime.sendMessage({
            action: "downloadCSV",
            url
        });
    });

})();