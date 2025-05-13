// https://www.munchkinfun.com/broward/cal

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { appendEventsToSheet } = require("../GoogleSheets/sheets.js");


const main = async () => {


    try {

        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json, text/javascript, */*; q=0.01");
        myHeaders.append("accept-language", "en-US,en;q=0.9,de;q=0.8");
        myHeaders.append("cache-control", "no-cache");
        myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        myHeaders.append("origin", "https://www.munchkinfun.com");
        myHeaders.append("pragma", "no-cache");
        myHeaders.append("priority", "u=1, i");
        myHeaders.append("referer", "https://www.munchkinfun.com/broward/cal");
        myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
        myHeaders.append("sec-fetch-dest", "empty");
        myHeaders.append("sec-fetch-mode", "cors");
        myHeaders.append("sec-fetch-site", "same-origin");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36");
        myHeaders.append("x-requested-with", "XMLHttpRequest");
        myHeaders.append("Cookie", "_pfy_kxcgs9x8_referrer=https%3A%2F%2Fwww.google.com%2F; _gid=GA1.2.530523195.1746870548; _ga_CCEDP046J0=GS2.2.s1746870548^$o3^$g0^$t1746870548^$j0^$l0^$h0; advanced_ads_visitor=%7B%22browser_width%22%3A581%7D; _gat=1; _ga=GA1.1.1067158740.1746090137; _ga_9W098V1QKV=GS2.1.s1746874247^$o4^$g1^$t1746874261^$j0^$l0^$h0; _ga_6LXKB1KZ10=GS2.1.s1746874247^$o4^$g1^$t1746874261^$j0^$l0^$h0");

        const raw = "global%5Bcalendars%5D%5B%5D=EVODV&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Baccord%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bbottom_nav%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bcal_id%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bcal_init_nonajax%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bcalendar_type%5D=daily&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bcurrentuser%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bday_incre%5D=0&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bdv_scroll_style%5D=def&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bdv_scroll_type%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bdv_view_style%5D=def&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bep_fields%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Betc_override%5D=yes&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevc_open%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_count%5D=0&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_location%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_order%5D=ASC&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_organizer%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_parts%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_past_future%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_status%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_tag%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_type%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_type_2%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_type_3%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_type_4%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_type_5%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_users%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bevent_virtual%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Beventtop_date_style%5D=0&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Beventtop_style%5D=2&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bexp_jumper%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bexp_so%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bfilter_relationship%5D=AND&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bfilter_show_set_only%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bfilter_type%5D=default&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bfilters%5D=yes&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bfixed_day%5D=9&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bfixed_month%5D=5&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bfixed_year%5D=2025&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bfocus_end_date_range%5D=1748735999&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bfocus_start_date_range%5D=1746057600&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bft_event_priority%5D=yes&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bheader_title%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_arrows%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_cancels%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_empty_months%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_end_time%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_et_dn%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_et_extra%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_et_tags%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_et_tl%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_ft%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_ft_img%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_month_headers%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_mult_occur%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_past%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_past_by%5D=ee&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_so%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_sort_options%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bics%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bjumper%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bjumper_count%5D=5&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bjumper_offset%5D=0&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Blang%5D=L1&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Blayout_changer%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Blivenow_bar%5D=yes&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bmapformat%5D=roadmap&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bmapiconurl%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bmaps_load%5D=yes&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bmapscroll%5D=false&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bmapzoom%5D=18&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bmembers_only%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bml_priority%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bmo1st%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bmonth_incre%5D=0&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bnumber_of_months%5D=1&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bonly_ft%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bpec%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bs%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bsearch%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bsearch_all%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bsep_month%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bshow_et_ft_img%5D=yes&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bshow_limit%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bshow_limit_ajax%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bshow_limit_paged%5D=1&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bshow_limit_redir%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bshow_repeats%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bshow_rsvp%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bshow_upcoming%5D=0&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bshow_year%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bsocial_share%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bsort_by%5D=sort_date&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Btile_bg%5D=0&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Btile_bg_size%5D=full&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Btile_count%5D=2&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Btile_height%5D=0&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Btile_style%5D=0&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Btiles%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Busers%5D=all&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bux_val%5D=0&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bview_switcher%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bwpml_l1%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bwpml_l2%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bwpml_l3%5D=&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Byl_priority%5D=no&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5Bhide_date_box%5D=yes&cals%5Bevcal_calendar_697%5D%5Bsc%5D%5B_cver%5D=4.4.3";

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };


        async function fetchData() {
            try {
                const response = await fetch("https://www.munchkinfun.com/broward/?evo-ajax=eventon_init_load", requestOptions);
                const result = await response.text();
                const data = JSON.parse(result);
                //   console.log("response ????????", data?.cals?.evcal_calendar_697?.html);
                const html = data?.cals?.evcal_calendar_697?.html;

                if (!html) return;
                // Create a DOM parser
                const $ = cheerio.load(html);
                const scripts = [];

                $("script").each((i, elem) => {
                    scripts.push($.html(elem));
                });


                console.log("scripts.length", scripts.length)

                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = today.getMonth() + 1; // Months are 0-indexed
                const dd = today.getDate();
                const todayStr = `${yyyy}-${mm}-${dd}`; // e.g., "2025-5-10"


                const filteredEvents = scripts.filter((script) => {
                    const match = script.match(/<script[^>]*>(.*?)<\/script>/s);
                    if (!match) return false;

                    try {
                        const json = JSON.parse(match[1]);
                        return json.startDate?.startsWith(todayStr);
                    } catch (e) {
                        return false;
                    }
                });

                // console.log("Filtered Events for Today:", filteredEvents);
                console.log("filteredEvents.length", filteredEvents.length)


                // fs.writeFileSync("event.json", JSON.stringify(filteredEvents, null, 2), "utf-8");

                let formattedData = [];


                formattedData = filteredEvents.map((script) => {
                    const match = script.match(/<script[^>]*>(.*?)<\/script>/s);

                    if (!match) return null;

                    try {
                        const json = JSON.parse(match[1]);

                        // Helpers
                        const formattedDate = (dateStr) => {


                            // Match parts: YYYY-M-DTHH:MM±HH:MM or ±H:MM
                            const match = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{2}:\d{2})(?::\d{2})?([+-])(\d{1,2}):(\d{2})$/);
                            if (!match) return null;

                            let [, year, month, day, time, sign, tzHour, tzMin] = match;

                            // Zero-pad month, day, and tzHour if needed
                            month = month.padStart(2, '0');
                            day = day.padStart(2, '0');
                            tzHour = tzHour.padStart(2, '0');

                            const fixDateString = `${year}-${month}-${day}T${time}:00${sign}${tzHour}:${tzMin}`;
                            const date = new Date(fixDateString);


                            const formattedDate = date.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            });


                            return formattedDate;
                        };

                        const formatTime = (start, end) => {
                            const fixDateString = (dateStr) => {
                                const match = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{2}:\d{2})(?::(\d{2}))?([+-])(\d{1,2}):(\d{2})$/);
                                if (!match) return null;

                                let [, year, month, day, time, seconds = '00', sign, tzHour, tzMin] = match;
                                month = month.padStart(2, '0');
                                day = day.padStart(2, '0');
                                tzHour = tzHour.padStart(2, '0');

                                return `${year}-${month}-${day}T${time}:${seconds}${sign}${tzHour}:${tzMin}`;
                            };

                            const fixedStart = fixDateString(start);
                            const fixedEnd = fixDateString(end);

                            if (!fixedStart || !fixedEnd) return null;

                            const startTime = new Date(fixedStart).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true
                            });

                            const endTime = new Date(fixedEnd).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true
                            });

                            return `${startTime} - ${endTime}`;
                        };


                        const getAddress = (location) => {
                            const data = location[0];
                            return `${data?.name} - ${data?.address?.streetAddress}, `;
                        };

                        return {
                            website: "https://www.munchkinfun.com",
                            title: json.name,
                            date: formattedDate(json.startDate),
                            time: formatTime(json.startDate, json.endDate),
                            location: getAddress(json.location),
                            description: json.description?.replace(/<[^>]*>/g, "").trim(),
                            cost: "N/A",
                            paidOrFree: "N/A",
                            eventLink: json.url,
                        };
                    } catch (e) {
                        console.log("error: ", e)
                        return null;
                    }
                })



                await appendEventsToSheet(formattedData);






            } catch (error) {
                console.error("Fetch error >>>>>>>> ", error);
            }
        }

        fetchData();



        // const fetchPromises = [];

        // const today = new Date();
        // const options = { month: "long", day: "numeric" };
        // const todayFormatted = today.toLocaleDateString("en-US", options);

        // let count = 0;

        // $(".events-date-header").each((i, el) => {
        //     const dateText = $(el).text().trim();

        //     if (dateText.includes(todayFormatted)) {
        //         const eventEls = $(el).nextUntil(".events-date-header");

        //         eventEls.each((j, eventEl) => {
        //             if (count >= 10) return false; // Exit the loop after 10 items

        //             const eventLink = $(eventEl).find("a").attr("href");
        //             const title = $(eventEl).find("h2").text().trim();
        //             //   console.log("title", title);

        //             if (eventLink) {
        //                 fetchPromises.push(FetchEventDetails(`https://mommypoppins.com${eventLink}`, title));
        //                 count++;
        //             }
        //         });
        //     }
        // });


        // const results = await Promise.all(fetchPromises);
        // const filtered = results.filter(Boolean); // remove nulls from failed fetches
        // await appendEventsToSheet(filtered);
        // console.log("Scraped Events:");
        // console.log(filtered);

    } catch (error) {
        console.error("Error fetching events list:", error.message);
    }
};

main();
