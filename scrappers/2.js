// https://miamionthecheap.com/events/

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { appendEventsToSheet } = require("../GoogleSheets/sheets.js");

// --- Async function to fetch event details
const FetchEventDetails = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
            }
        });

        const $ = cheerio.load(response.data);
        const firstParagraph = $('[class*="entry-content"] p').first().text();

        return { description: firstParagraph };
    } catch (error) {
        console.error("Error fetching event details:", error.message);
        return { description: "" };
    }
};

// --- Async function to parse all events
const parsedEvents = async (events) => {
    return await Promise.all(events.map(async html => {
        try {
            const $ = cheerio.load(html);

            const title = $("h3 a").text().trim();
            const eventLink = $("h3 a").attr("href");

            let description = "";
            try {
                const details = await FetchEventDetails(eventLink);
                description = details.description || "";
            } catch (err) {
                console.warn(`Failed to fetch description for ${eventLink}:`, err.message);
            }

            const metaText = $("p.meta").text().trim();


            let timeMatch = "";
            if (metaText.startsWith("All Day")) {
              timeMatch = "All Day";
            } else {
              const match = metaText.match(/^.*?(?=\s?\|)/);
              timeMatch = match ? match[0].trim() : "";
            }

            // console.log("Time match:", eventLink,timeMatch);

            const costMatch = metaText.match(/(FREE|Discounted|\$\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?)/i);
            const locationMatch = metaText.split("|").map(s => s.trim()).slice(2).join(" ");

            return {
                website: "miamionthecheap.com",
                title,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }),
                time: timeMatch ? timeMatch.trim() : "",
                location: locationMatch || "",
                description,
                cost: costMatch ? costMatch[0] : "",
                paidOrFree: (costMatch && /free/i.test(costMatch[0])) ? "Free" : "Paid",
                eventLink
            };
        } catch (err) {
            console.error("Error parsing individual event block:", err.message);
            return null; // Return null so it doesn’t crash the .map
        }
    }));
};



// --- Main scraper
axios.get("https://miamionthecheap.com/events/", {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
    }
})
    .then(async response => {
        const html = response.data;
        const $ = cheerio.load(html);

        let events = [];
        let collect = false;
        
        $(".entry-content.mvt-content").children().each((i, el) => {
          const tag = $(el).get(0).tagName;
        
          if (tag === "h2" && $(el).hasClass("lotc-event") && $(el).text().includes("Today")) {
            collect = true;
            return;
          }
        
          if (collect && tag === "h2" && $(el).hasClass("lotc-event") && !$(el).text().includes("Today")) {
            collect = false;
            return;
          }
        
          if (collect && $(el).hasClass("lotc-v2") && $(el).hasClass("event")) {
            if (events.length >= 10) {
              collect = false; // Optional: stop collecting after 10
              return;
            }
            events.push($.html(el));
          }
        });
        
        // console.log("Extracted event blocks:", events.length);

        const parsed = (await parsedEvents(events)).filter(e => e !== null);
        // console.log("Parsed events:", parsed);

        // fs.writeFileSync("today-events.html", events.join("\n\n"));
        // fs.writeFileSync("today-events.json", JSON.stringify(parsed, null, 2));
        await appendEventsToSheet(parsed);
        // console.log("Saved to today-events.html and today-events.json");
    })
    .catch(error => {
        console.error("Error fetching page:", error.message);
    });
