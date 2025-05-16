// https://socialmiami.com/calendar/

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { appendEventsToSheet } = require("../GoogleSheets/sheets.js");
const { arrayBuffer } = require("stream/consumers");

const FetchDetails = async (url) => {
    const res = await fetch(url, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,de;q=0.8",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "__utmc=193276079; _ga=GA1.1.1194877898.1747418732; __utma=193276079.1319814061.1747418732.1747418732.1747418949.2; __utmz=193276079.1747418949.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utmt=1; __utmb=193276079.2.10.1747418949; _ga_DTK6JHFYQN=GS2.1.s1747418731$o1$g1$t1747420233$j0$l0$h0",
            "Referer": "https://socialmiami.com/calendar/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });

    const result = await res.text();

    const $ = cheerio.load(result);
    const article = $("article").first();
    const description = article.find("div.post_text_inner p").text().trim();
    const place = article.find("span.org_address:contains('Place')").next("span.field_row").text().trim();
    const address = article.find("span.org_address:contains('Address')").next("span.field_row").text().trim();

    return {
        address: `${place} - ${address}`,
        description: description,
    }

}

const main = async () => {
    try {
        async function fetchData() {
            try {
                const response = await fetch("https://socialmiami.com/calendar/", {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "en-US,en;q=0.9,de;q=0.8",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "priority": "u=0, i",
                        "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "cross-site",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1",
                        "cookie": "__utma=193276079.1319814061.1747418732.1747418732.1747418732.1; __utmc=193276079; __utmz=193276079.1747418732.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; _ga=GA1.1.1194877898.1747418732; _ga_DTK6JHFYQN=GS2.1.s1747418731$o1$g1$t1747418930$j0$l0$h0; __utmb=193276079.3.10.1747418732",
                        "Referer": "https://www.google.com/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": null,
                    "method": "GET"
                });

                const result = await response.text();

                // console.log("result", result);

                const $ = cheerio.load(result);
                const post_cntent = $("div.post_cntent");

                const arr2 = [];

                await Promise.all(
                    post_cntent.slice(0, 10).get().map(async (element, index) => {
                        const titleElement = $(element).find("h2.td_evnt_title a");
                        const href = titleElement.attr("href");

                        if (!titleElement.length || !href) {
                            console.warn(`Skipping element ${index}: No title or href`);
                            return;
                        }

                        const dateText = $(element).find("span.field_row").text().trim();

                        const { address, description } = await FetchDetails(href);

                        const timeMatch = [...dateText.matchAll(/(\d{1,2}:\d{2} (?:am|pm))/gi)];
                        const time =
                            timeMatch.length >= 2
                                ? `${timeMatch[0][0]} - ${timeMatch[1][0]}`
                                : "";

                        const data = {
                            website: "https://socialmiami.com/",
                            title: titleElement.text().trim(),
                            date: new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }),
                            time,
                            location: address,
                            description,
                            cost: "NA",
                            paidOrFree: "NA",
                            eventLink: href,
                        };

                        arr2.push(data);
                    })
                );

                // console.log("arr2", arr2);
                await appendEventsToSheet(arr2);

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
