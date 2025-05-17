// https://hollywoodfl.org/

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { appendEventsToSheet } = require("../GoogleSheets/sheets.js");

const FetchDetails = async (url) => {
    if (!url) {
        return;
    }


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
            "cookie": "CP_IsMobile=false; ASP.NET_SessionId=j5qkspoax1vdrd4cquqafccy; dpi=1.75; viewportHeight=746; screenWidth=1463; screenHeight=915; __RequestVerificationToken=e5YHYZkvWMcNYXh9wvY7CFQ1gCkeC8_ZTTR-f_N8YWvrkjYX_LD7vDrxllLOalHscI4H190mcbLWELhGt5O9A6IYKcbWcbhkILVV2zm5CPc1; CP_TrackBrowser={\"doNotShowLegacyMsg\":false,\"supportNewUI\":true,\"legacy\":false,\"isMobile\":false}; ai_user=2TXpY|2025-05-16T21:09:16.483Z; _ga=GA1.1.2077408792.1747429757; CP_HasWebFonts=true; _aeaid=adf0b880-3288-43de-887b-50f3830ec638; aelastsite=X2Wp8gWPM6JRc12e%2BVip7bWtpGcnZDhSDIycjRp8xwOGexbEgJN6vQPSysqgGpKi; aelreadersettings=%7B%22c_big%22%3A0%2C%22rg%22%3A0%2C%22memph%22%3A0%2C%22contrast_setting%22%3A0%2C%22colorshift_setting%22%3A0%2C%22text_size_setting%22%3A0%2C%22space_setting%22%3A0%2C%22font_setting%22%3A0%2C%22k%22%3A0%2C%22k_disable_default%22%3A0%2C%22hlt%22%3A0%2C%22disable_animations%22%3A0%2C%22display_alt_desc%22%3A0%7D; ai_session=sxMDQ|1747432156759|1747432367912.1; _ga_33YBW8NZV8=GS2.1.s1747432158$o2$g1$t1747432367$j0$l0$h0; viewportWidth=1448; responsiveGhost=0; _ga_XQ4J2TMGPS=GS2.1.s1747432158$o2$g1$t1747432368$j0$l0$h0; _ga_4BYWNCGX7C=GS2.1.s1747432158$o2$g1$t1747432369$j0$l0$h0; aeatstartmessage=true",
            "Referer": url,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });

    const result = await res.text();

    const $ = cheerio.load(result);

    const price = $('[itemprop="price"]').text().trim() || "NA";
    const description = $('[itemprop="description"]').text().trim() || "NA";

    // console.log("description", description);
    // console.log("price", price);

    return {
        price,
        description
    }







}

const main = async () => {
    try {
        async function fetchData() {

            function getCalendarUrl(start, end) {
                const formatDate = (date) =>
                    date.toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                    });

                const startDate = formatDate(start);
                const endDate = formatDate(end);

                return `https://hollywoodfl.org/calendar.aspx?Keywords=&startDate=${startDate}&enddate=${endDate}&CID=27&showPastEvents=false`;
            }


            const today = new Date("2025-05-17");
            const tomorrow = new Date("2025-05-18");

            const Base_url = getCalendarUrl(today, tomorrow);


            try {
                const response = await fetch(Base_url, {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "en-US,en;q=0.9,de;q=0.8",
                        "cache-control": "no-cache",
                        "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryXNlRYq4JJmhxaATl",
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
                        "cookie": "CP_IsMobile=false; ASP.NET_SessionId=j5qkspoax1vdrd4cquqafccy; dpi=1.75; viewportHeight=746; screenWidth=1463; screenHeight=915; __RequestVerificationToken=e5YHYZkvWMcNYXh9wvY7CFQ1gCkeC8_ZTTR-f_N8YWvrkjYX_LD7vDrxllLOalHscI4H190mcbLWELhGt5O9A6IYKcbWcbhkILVV2zm5CPc1; CP_TrackBrowser={\"doNotShowLegacyMsg\":false,\"supportNewUI\":true,\"legacy\":false,\"isMobile\":false}; ai_user=2TXpY|2025-05-16T21:09:16.483Z; _ga=GA1.1.2077408792.1747429757; CP_HasWebFonts=true; _aeaid=adf0b880-3288-43de-887b-50f3830ec638; aelastsite=X2Wp8gWPM6JRc12e%2BVip7bWtpGcnZDhSDIycjRp8xwOGexbEgJN6vQPSysqgGpKi; aelreadersettings=%7B%22c_big%22%3A0%2C%22rg%22%3A0%2C%22memph%22%3A0%2C%22contrast_setting%22%3A0%2C%22colorshift_setting%22%3A0%2C%22text_size_setting%22%3A0%2C%22space_setting%22%3A0%2C%22font_setting%22%3A0%2C%22k%22%3A0%2C%22k_disable_default%22%3A0%2C%22hlt%22%3A0%2C%22disable_animations%22%3A0%2C%22display_alt_desc%22%3A0%7D; _ga_4BYWNCGX7C=GS2.1.s1747429757$o1$g1$t1747430099$j0$l0$h0; ai_session=M6FbE|1747429756485|1747430099710.4; viewportWidth=1448; responsiveGhost=0; _ga_XQ4J2TMGPS=GS2.1.s1747429757$o1$g1$t1747430100$j0$l0$h0; _ga_33YBW8NZV8=GS2.1.s1747429758$o1$g1$t1747430100$j0$l0$h0; aeatstartmessage=true",
                        "Referer": "https://hollywoodfl.org/events",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": "------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"__EVENTTARGET\"\r\n\r\n\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"__EVENTARGUMENT\"\r\n\r\n\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"__VIEWSTATE\"\r\n\r\n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\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"__VIEWSTATEGENERATOR\"\r\n\r\nB66867E1\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"ysnNotifyMe\"\r\n\r\n\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"strPage\"\r\n\r\n\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"intArchMainCatID\"\r\n\r\n\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"intArchMainItemID\"\r\n\r\n\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"chkCalendarID\"\r\n\r\n27\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"ShowInRssFeed\"\r\n\r\nfalse\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"RssConfigurationEnabled\"\r\n\r\nFalse\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"calendarView\"\r\n\r\nlist\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"eventID\"\r\n\r\n\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"showMoreExpandedDays\"\r\n\r\n\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl\r\nContent-Disposition: form-data; name=\"__RequestVerificationToken\"\r\n\r\n9DJNQ3QcHM7ZBg8s3IrRjFKB4UZkWDCvlceN9wNXGjuD1f8bFMhbGAMVfQ1dU5OILt4G1gQF25gKD6fcMyE7B48zfLgd8N5R3ryBvKoJii01\r\n------WebKitFormBoundaryXNlRYq4JJmhxaATl--\r\n",
                    "method": "POST"
                });
                const result = await response.text();
                const $ = cheerio.load(result);
                // console.log("result", result);

                const items = $('div.calendar > ol > li').toArray();

                // if (items.length > 0) {
                //     console.log($.html(items[0]));
                // }


                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Helper to check if two dates are the same day
                const isSameDay = (d1, d2) =>
                    d1 && d2 &&
                    d1.getFullYear() === d2.getFullYear() &&
                    d1.getMonth() === d2.getMonth() &&
                    d1.getDate() === d2.getDate();


                const todaysItems = items.filter(li => {
                    const startIso = $(li)
                        .find('.hidden [itemprop="startDate"]')
                        .text()
                        .trim();
                    const startDate = startIso ? new Date(startIso) : null;
                    return isSameDay(startDate, today);
                });

                // console.log("todaysItems", todaysItems.length);

                const events2 = await Promise.all(todaysItems.slice(0, 10).map(async el => {
                    const $el = $(el);
                    const title = $el.find('h3 a span').text().trim() || "NA";
                    const href = $el.find('h3 a').attr('href')
                        ? `https://hollywoodfl.org${$el.find('h3 a').attr('href')}`
                        : "NA";


                    const { price, description } = await FetchDetails(href);

                    const rawDateText = $el.find('.subHeader .date').text().trim();
                    const timeMatch = rawDateText.match(/(\d{1,2}:\d{2}\s?[APMapm]{2})\s*[-–]\s*(\d{1,2}:\d{2}\s?[APMapm]{2})/);
                    const timeRange = timeMatch ? `${timeMatch[1]} - ${timeMatch[2]}` : "NA";

                    const location = $el.find('.eventLocation .name').text().trim() || "NA";


                    return {
                        website: "https://hollywoodfl.org/",
                        title,
                        date: today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                        time: timeRange,
                        location,
                        description: description || "NA", // replace with actual if FetchDetails used
                        cost: price || "NA",
                        paidOrFree: price ? price.toLowerCase().includes("free") ? "Free" : "Paid" : "NA",
                        eventLink: href,
                    };
                }));

                // console.log("events2", events2);

                await appendEventsToSheet(events2);
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
