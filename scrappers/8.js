// https://www.palmbeachculture.com/events/

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { appendEventsToSheet } = require("../GoogleSheets/sheets.js");

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
            "cookie": "DO-LB=\"Cg4xMC4xMTYuMC42OjQ0MxDYz8UL\"; _gcl_au=1.1.1941558853.1747423572; _ga=GA1.1.2040808801.1747423572; _pin_unauth=dWlkPVpUUXhaVEV4TnpjdFptWmlaUzAwT1RNMkxUa3haRGN0TURBMU1qbGhZemxqTldNeA; _fbp=fb.1.1747423575774.827977105252428676; cf_clearance=di_FzU6VZzxiq.umYj90sTU6kemj_V.4b795gAXiN_Y-1747425523-1.2.1.1-_j_WFGNet7Y8NU2Mw41RowfYaLGZYrV_LQqP3YSc2_JiUOIzHcVR88kqBnv.GPG26iQNtxe4.nH.jMsn7D7XJVMZdkWqLp2m.i2peKHzBRWB0CEPVWxYZqsYHQeH2ruyRg.DJuCXRI0jJCZS5jpaqV9yUHomo2ADcMQQI4bsr_UtYpq7NLog84SykhtLRg7LPLKlXoKuJGbo5ZcKVY3fFR5GG6nNPem7porB9wckFWORMJO.GtPj80adRlDUe8qAmmHj7bLHR3I7ZLpMAOZMsJhdqzbstW6lDo8Z.Ocj3YaRCTPXje.rdnjZPSBzDPhBHEgoqvB1D6XVxwXkxQxLoEKu1w3cEmg7q9wMnPivf8E; _ga_6HEC9SJQGY=GS2.1.s1747423572$o1$g1$t1747426240$j60$l0$h1764539886$dTYL44yUCOtypSr5TskIXt65lHwVGHH-1bQ; _derived_epik=dj0yJnU9WVhLaGZhc0lhWmFzNGVHRG93dGlxV3h6Ui1OT05QTnkmbj1xekIxTGRGVzFaV3Bic3Nsa2lNRUd3Jm09MSZ0PUFBQUFBR2dubThNJnJtPTEmcnQ9QUFBQUFHZ25tOE0mc3A9Mg; _privy_A169E5AC8A03128459FB99AF=%7B%22uuid%22%3A%22167570f2-460e-4d4a-a78f-dacd1fa818c9%22%2C%22variations%22%3A%7B%7D%2C%22country_code%22%3A%22IN%22%2C%22region_code%22%3A%22IN_%22%2C%22postal_code%22%3A%22%22%7D",
            "Referer": "https://www.palmbeachculture.com/events/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });

    const result = await res.text();

    const $ = cheerio.load(result);

    const addressEl = $('.tribe-address');
    const street = addressEl.find('.tribe-street-address').text().trim();
    const city = addressEl.find('.tribe-locality').text().trim();
    const zip = addressEl.find('.tribe-postal-code').text().trim();
    const country = addressEl.find('.tribe-country-name').text().trim();

    const fullAddress = `${street} - ${city}, ${zip} ${country}`;


    const descriptionText = $('.tribe-events-single-event-description.tribe-events-content').text().trim();




    return {
        address: fullAddress,
        description: descriptionText,
    }

}

const main = async () => {
    try {
        async function fetchData() {
            try {
                const response = await fetch("https://www.palmbeachculture.com/events/", {
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
                        "cookie": "DO-LB=\"Cg4xMC4xMTYuMC42OjQ0MxDYz8UL\"; _gcl_au=1.1.1941558853.1747423572; _ga=GA1.1.2040808801.1747423572; _pin_unauth=dWlkPVpUUXhaVEV4TnpjdFptWmlaUzAwT1RNMkxUa3haRGN0TURBMU1qbGhZemxqTldNeA; _fbp=fb.1.1747423575774.827977105252428676; _derived_epik=dj0yJnU9bDNFZ0dRQUxQbkFHekJTM1VySkp5eXcwUk5OVEUwMWEmbj1tNUV3aUdrNTZSU0hDaC1OWDYtNExBJm09MSZ0PUFBQUFBR2dubVBNJnJtPTEmcnQ9QUFBQUFHZ25tUE0mc3A9Mg; _ga_6HEC9SJQGY=GS2.1.s1747423572$o1$g1$t1747425520$j60$l0$h1764539886$dTYL44yUCOtypSr5TskIXt65lHwVGHH-1bQ; cf_clearance=di_FzU6VZzxiq.umYj90sTU6kemj_V.4b795gAXiN_Y-1747425523-1.2.1.1-_j_WFGNet7Y8NU2Mw41RowfYaLGZYrV_LQqP3YSc2_JiUOIzHcVR88kqBnv.GPG26iQNtxe4.nH.jMsn7D7XJVMZdkWqLp2m.i2peKHzBRWB0CEPVWxYZqsYHQeH2ruyRg.DJuCXRI0jJCZS5jpaqV9yUHomo2ADcMQQI4bsr_UtYpq7NLog84SykhtLRg7LPLKlXoKuJGbo5ZcKVY3fFR5GG6nNPem7porB9wckFWORMJO.GtPj80adRlDUe8qAmmHj7bLHR3I7ZLpMAOZMsJhdqzbstW6lDo8Z.Ocj3YaRCTPXje.rdnjZPSBzDPhBHEgoqvB1D6XVxwXkxQxLoEKu1w3cEmg7q9wMnPivf8E; _privy_A169E5AC8A03128459FB99AF=%7B%22uuid%22%3A%22167570f2-460e-4d4a-a78f-dacd1fa818c9%22%2C%22variations%22%3A%7B%7D%2C%22country_code%22%3A%22IN%22%2C%22region_code%22%3A%22IN_HR%22%2C%22postal_code%22%3A%22122004%22%7D",
                        "Referer": "https://www.google.com/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": null,
                    "method": "GET"
                });

                const result = await response.text();
                const $ = cheerio.load(result);
                const items = $('.tribe-common-g-row.tribe-common-g-row--gutters article').toArray();

                const events = await Promise.all(items.slice(0, 10).map(async el => {
                    const titleElement = $(el).find('h3.tribe-events-pro-photo__event-title a');
                    const title = titleElement.text().trim() || "NA";
                    const href = titleElement.attr('href') || "NA";


                    const { address, description } = await FetchDetails(href);

                    const timeText = $(el).find('.tribe-events-pro-photo__event-datetime').text().trim();
                    const Price = $(el).find('.tribe-events-c-small-cta__price').text().trim();

                    const timeMatches = [...timeText.matchAll(/@ (\d{1,2}:\d{2} ?[ap]m)/gi)];
                    const timeRange = timeMatches.length === 2
                        ? `${timeMatches[0][1]} - ${timeMatches[1][1]}`
                        : "NA";

                    return {
                        website: "https://www.palmbeachculture.com/events/",
                        title,
                        date: new Date().toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric"
                        }),
                        time: timeRange,
                        location: address || "NA",
                        description: description || "NA",
                        cost: Price ? Price : "NA",
                        paidOrFree: Price ? (Price.toLowerCase() === "free" ? "Free" : "Paid") : "NA",
                        eventLink: href
                    };
                }));



                await appendEventsToSheet(events);
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
