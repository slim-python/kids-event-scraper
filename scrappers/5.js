// https://www.broward.org/Parks/Pages/eventsearch.aspx

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { appendEventsToSheet } = require("../GoogleSheets/sheets.js");


const FetchDetails = async (eventId) => {
    const res = await fetch(`https://www.broward.org/parks/_api/web/lists/GetByTitle('Events')/items?$select=*,Recurring/Title,FeaturedImage/Title,Park/Title&$expand=Recurring/Id,FeaturedImage/Id,Park/Id&$filter=ID%20eq%20${eventId}`, {
        "headers": {
            "accept": "application/json; odata=verbose",
            "accept-language": "en-US,en;q=0.9,de;q=0.8",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "NSC_Opo-HTMC-CspxbsePsh_TTM_wTfswfs=ffffffffc3a0df7c45525d5f4f58455e445a4a42378b; _gid=GA1.2.1693970482.1747062922; WSS_FullScreenMode=false; nmstat=f9c36ada-0910-759c-4b0c-1bee0a70ba96; WT_FPC=id=2ebbc13c524e8028ac31747025121953:lv=1747036070622:ss=1747036070622; _gat=1; _gat_gtag_UA_20386207_1=1; _ga=GA1.1.990087167.1747062922; _ga_PF38FHRCMM=GS2.1.s1747073814$o3$g1$t1747073888$j60$l0$h0",
            "Referer": "https://www.broward.org/Parks/Pages/Event.aspx?event=2261",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });

    const result = await res.text();
    const data = JSON.parse(result);

    const item = data?.d?.results[0];
    const Price = item.Price || "N/A";
    return {
        website: "https://www.broward.org/",
        title: item.Title,
        date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }),
        time: item.Time,
        location: item.Park?.Title,
        description: item.Description,
        cost: Price,
        paidOrFree: Price.includes("$") ? "Paid" : "Free",
        eventLink: `https://www.broward.org/Parks/Pages/Event.aspx?event=${eventId}`,
    };
}



const main = async () => {


    try {
        async function fetchData() {
            try {
                const response = await fetch("https://www.broward.org/Parks/_api/web/lists/GetByTitle('Events')/items?$top=3000&$select=*,Park/Title,Recurring/Title,FeaturedImage/Title&$expand=Park/Id,Recurring,FeaturedImage/Id&$orderby=Date%20asc", {
                    "headers": {
                        "accept": "application/json; odata=verbose",
                        "accept-language": "en-US,en;q=0.9,de;q=0.8",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "priority": "u=1, i",
                        "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                        "cookie": "NSC_Opo-HTMC-CspxbsePsh_TTM_wTfswfs=ffffffffc3a0df7c45525d5f4f58455e445a4a42378b; _gid=GA1.2.1693970482.1747062922; _gat=1; _gat_gtag_UA_20386207_1=1; WSS_FullScreenMode=false; nmstat=f9c36ada-0910-759c-4b0c-1bee0a70ba96; _ga_PF38FHRCMM=GS2.1.s1747062921$o1$g1$t1747062972$j9$l0$h0; WT_FPC=id=2ebbc13c524e8028ac31747025121953:lv=1747025172350:ss=1747025121953; _ga=GA1.2.990087167.1747062922",
                        "Referer": "https://www.broward.org/Parks/Pages/eventsearch.aspx",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": null,
                    "method": "GET"
                });


                const result = await response.text();
                const data = JSON.parse(result);


                const res = data?.d?.results;

                // fs.writeFileSync("events.json", JSON.stringify(res, null, 2), "utf-8");

                const todayUTC = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format in UTC


                const today_ = new Date(); // current UTC time
                const arr = [];

                res
                    .filter(item => {
                        const startDate = new Date(item.Date);
                        const endDate = new Date(item.EndDate);
                        return today_ >= startDate && today_ <= endDate;
                    })
                    .forEach(item => {

                        const today = new Date().toLocaleString('en-US', { weekday: 'long' }); // e.g., "Tuesday"

                        // console.log("today in word", today);


                        if (
                            item.Recurring.results[0]?.Title == "Everyday" ||
                            item.Recurring.results[0]?.Title == `Every ${today}`
                        ) {

                            return arr.push(
                                item.Id,
                            );
                        }


                    });


                const formattedData = await Promise.all(
                    arr.slice(0, 10).map(async (eventId) => {
                        const eventDetails = await FetchDetails(eventId);
                        return {
                            ...eventDetails,
                        };
                    })
                );

                await appendEventsToSheet(formattedData);

                return;


            } catch (error) {
                console.error("Fetch error >>>>>>>> ", error);
            }
        }

        fetchData();

    } catch (error) {
        console.error("Error fetching events list:", error.message);
    }
};

main();




