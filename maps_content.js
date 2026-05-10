(async function () {

    console.log("🚀 Google Maps Scraper Started");

    const sleep = (ms) =>
        new Promise(res => setTimeout(res, ms));

    // =========================
    // WAIT FOR MAPS
    // =========================

    await sleep(5000);

    const feed =
        document.querySelector('div[role="feed"]');

    if (!feed) {

        console.log("❌ Feed not found");
        return;
    }

    // =========================
    // SCROLL TO LOAD ALL RESULTS
    // =========================

    console.log("⏳ Loading all results...");

    let lastHeight = 0;

    for (let i = 0; i < 30; i++) {

        feed.scrollTo(0, feed.scrollHeight);

        await sleep(2500);

        if (feed.scrollHeight === lastHeight)
            break;

        lastHeight = feed.scrollHeight;
    }

    console.log("✅ All results loaded");

    // =========================
    // GO BACK TO TOP
    // =========================

    feed.scrollTo(0, 0);

    await sleep(3000);

    // =========================
    // GET ALL BUSINESS LINKS
    // =========================

    const links =
        [...document.querySelectorAll('a.hfpxzc')];

    console.log(`📌 Found ${links.length} businesses`);

    let results = [];

    // =========================
    // PROCESS EACH BUSINESS
    // =========================

    for (let i = 0; i < links.length; i++) {

        try {

            console.log(`🚀 Opening ${i + 1}`);

            // REFRESH LINKS
            const refreshedLinks =
                [...document.querySelectorAll('a.hfpxzc')];

            const link =
                refreshedLinks[i];

            if (!link) continue;

            // SCROLL INTO VIEW
            link.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            await sleep(2000);

            // CLICK BUSINESS
            console.log("🖱 Clicking business");

            link.click();

            // WAIT DETAILS PANEL
            await sleep(5000);

            // =========================
            // EXTRACT DETAILS
            // =========================

            const title =
                document.querySelector('h1.DUwDvf')?.innerText || "";

            const rating =
                document.querySelector('div.F7nice span')?.innerText || "";

            const reviews =
                document.querySelector('div.F7nice span:last-child')?.innerText || "";

            const category =
                document.querySelector('button.DkEaL')?.innerText || "";

            const address =
                document.querySelector('button[data-item-id="address"]')?.innerText || "";

            const phone =
                document.querySelector('button[data-item-id^="phone"]')?.innerText || "";

            const website =
                document.querySelector('a[data-item-id="authority"]')?.href || "";

            const image =
                document.querySelector('.RZ66Rb img')?.src || "";

            const url =
                window.location.href;

            const business = {
                title,
                rating,
                reviews,
                category,
                address,
                phone,
                website,
                image,
                url
            };

            results.push(business);

            console.log("✅ Saved:", business);

            // SAVE LIVE
            chrome.storage.local.set({
                scrapedData: results
            });

            // SEND LIVE UPDATE
            chrome.runtime.sendMessage({
                action: "scrapingComplete",
                data: results
            });

            // WAIT BEFORE NEXT
            await sleep(2000);

        } catch (err) {

            console.log("❌ Error:", err);
        }
    }

    alert(`✅ Scraping Complete\n\nTotal Leads: ${results.length}`);

})();