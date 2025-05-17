//https://southfloridafamilylife.com/

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { appendEventsToSheet } = require("../GoogleSheets/sheets.js");

// const FetchDetails = async (url) => {
//     if (!url) {
//         return;
//     }


//     const res = await fetch(url, {
//         "headers": {
//             "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//             "accept-language": "en-US,en;q=0.9,de;q=0.8",
//             "cache-control": "no-cache",
//             "pragma": "no-cache",
//             "priority": "u=0, i",
//             "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
//             "sec-ch-ua-mobile": "?0",
//             "sec-ch-ua-platform": "\"Windows\"",
//             "sec-fetch-dest": "document",
//             "sec-fetch-mode": "navigate",
//             "sec-fetch-site": "same-origin",
//             "sec-fetch-user": "?1",
//             "upgrade-insecure-requests": "1",
//             "cookie": "CP_IsMobile=false; ASP.NET_SessionId=j5qkspoax1vdrd4cquqafccy; dpi=1.75; viewportHeight=746; screenWidth=1463; screenHeight=915; __RequestVerificationToken=e5YHYZkvWMcNYXh9wvY7CFQ1gCkeC8_ZTTR-f_N8YWvrkjYX_LD7vDrxllLOalHscI4H190mcbLWELhGt5O9A6IYKcbWcbhkILVV2zm5CPc1; CP_TrackBrowser={\"doNotShowLegacyMsg\":false,\"supportNewUI\":true,\"legacy\":false,\"isMobile\":false}; ai_user=2TXpY|2025-05-16T21:09:16.483Z; _ga=GA1.1.2077408792.1747429757; CP_HasWebFonts=true; _aeaid=adf0b880-3288-43de-887b-50f3830ec638; aelastsite=X2Wp8gWPM6JRc12e%2BVip7bWtpGcnZDhSDIycjRp8xwOGexbEgJN6vQPSysqgGpKi; aelreadersettings=%7B%22c_big%22%3A0%2C%22rg%22%3A0%2C%22memph%22%3A0%2C%22contrast_setting%22%3A0%2C%22colorshift_setting%22%3A0%2C%22text_size_setting%22%3A0%2C%22space_setting%22%3A0%2C%22font_setting%22%3A0%2C%22k%22%3A0%2C%22k_disable_default%22%3A0%2C%22hlt%22%3A0%2C%22disable_animations%22%3A0%2C%22display_alt_desc%22%3A0%7D; ai_session=sxMDQ|1747432156759|1747432367912.1; _ga_33YBW8NZV8=GS2.1.s1747432158$o2$g1$t1747432367$j0$l0$h0; viewportWidth=1448; responsiveGhost=0; _ga_XQ4J2TMGPS=GS2.1.s1747432158$o2$g1$t1747432368$j0$l0$h0; _ga_4BYWNCGX7C=GS2.1.s1747432158$o2$g1$t1747432369$j0$l0$h0; aeatstartmessage=true",
//             "Referer": url,
//             "Referrer-Policy": "strict-origin-when-cross-origin"
//         },
//         "body": null,
//         "method": "GET"
//     });

//     const result = await res.text();

//     const $ = cheerio.load(result);

//     const price = $('[itemprop="price"]').text().trim() || "NA";
//     const description = $('[itemprop="description"]').text().trim() || "NA";

//     // console.log("description", description);
//     // console.log("price", price);

//     return {
//         price,
//         description
//     }







// }

const main = async () => {
    try {
        async function fetchData() {

            try {
                const response = await fetch("https://southfloridafamilylife.com/?evo-ajax=eventon_init_load", {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "en-US,en;q=0.9,de;q=0.8",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "pragma": "no-cache",
                        "priority": "u=1, i",
                        "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                        "cookie": "_gid=GA1.2.829683860.1747377034; _fbp=fb.1.1747377034809.99417084067483082; cookie_notice_accepted=true; _ga_PXY47XX4W5=GS2.1.s1747470843$o5$g1$t1747470930$j0$l0$h0; _ga=GA1.1.253183248.1747377031; __cf_bm=mvxV9YYn0WCPfrL8GDcdSNLVXvuXvQf.0REdxIl_ynU-1747470932-1.0.1.1-TNlpZF06p2tox.Y2vL1PILJ1yLJSmMWyeWuzzCObgrZ2JrzdizIDixj.wXumZruKC6N.0CMO119TeP8x8nJ5p08Jykedo.IhVitHpJ_8mrU",
                        "Referer": "https://southfloridafamilylife.com/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": "global%5Bcalendars%5D%5B%5D=EVOFC&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Baccord%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bbottom_nav%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bcal_id%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bcal_init_nonajax%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bcalendar_type%5D=fullcal&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bcurrentuser%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bday_incre%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bep_fields%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Betc_override%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevc_open%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_count%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_location%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_order%5D=ASC&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_organizer%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_parts%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_past_future%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_status%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_tag%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_type%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_type_2%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_type_3%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_type_4%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_type_5%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_users%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bevent_virtual%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Beventtop_date_style%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Beventtop_style%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bexp_jumper%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bexp_so%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bfilter_relationship%5D=AND&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bfilter_show_set_only%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bfilter_style%5D=default&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bfilter_type%5D=default&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bfilters%5D=yes&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bfixed_day%5D=16&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bfixed_month%5D=5&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bfixed_year%5D=2025&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bfocus_end_date_range%5D=1748750399&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bfocus_start_date_range%5D=1746072000&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bft_event_priority%5D=yes&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bgrid_ux%5D=2&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bheat%5D=yes&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_arrows%5D=yes&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_cancels%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_empty_months%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_end_time%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_et_dn%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_et_extra%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_et_tags%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_et_tl%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_ft%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_ft_img%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_month_headers%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_mult_occur%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_past%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_past_by%5D=ee&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_so%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhide_sort_options%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bhover%5D=numname&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bics%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bjumper%5D=yes&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bjumper_count%5D=5&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bjumper_offset%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Blang%5D=L1&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Blayout_changer%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Blivenow_bar%5D=yes&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bload_fullmonth%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bmapformat%5D=roadmap&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bmapiconurl%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bmaps_load%5D=yes&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bmapscroll%5D=false&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bmapzoom%5D=14&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bmembers_only%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bml_priority%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bml_toend%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bmo1st%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bmonth_incre%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bnexttogrid%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bnumber_of_months%5D=1&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bonly_ft%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bpec%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bs%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bsearch%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bsearch_all%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bsep_month%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bshow_et_ft_img%5D=yes&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bshow_limit%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bshow_limit_ajax%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bshow_limit_paged%5D=1&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bshow_limit_redir%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bshow_repeats%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bshow_search%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bshow_upcoming%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bshow_year%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bsocial_share%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bsort_by%5D=sort_date&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bstyle%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Btile_bg%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Btile_bg_size%5D=full&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Btile_count%5D=2&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Btile_height%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Btile_style%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Btiles%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Busers%5D=all&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bux_val%5D=0&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bview_switcher%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bwpml_l1%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bwpml_l2%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Bwpml_l3%5D=&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Byl_priority%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5Byl_toend%5D=no&cals%5Bevcal_calendar_135%5D%5Bsc%5D%5B_cver%5D=4.9.6",
                    "method": "POST"
                });
                const result = await response.json();

                // fs.writeFileSync("result.json", JSON.stringify(result, null, 2));

                debugger;
                // If you specifically want to extract HTML from result.cals.evcal_calendar_135.html
                const rawHtml = result?.cals?.evcal_calendar_135.html;

                const $ = cheerio.load(rawHtml);
                const eventonItems = $('.eventon_list_event.evo_eventtop.scheduled').toArray();

                // console.log("eventonItems.length", eventonItems.length);
                // console.log("htmlLists", htmlLists[0]);
                // if (rawHtml) {
                //     fs.writeFileSync("result.html", rawHtml);
                //     const htmlContent = $.html(eventonItems[0]);

                //     fs.writeFileSync("result1.html", htmlContent);


                // } else {
                //     console.error("HTML not found in result");
                // }

                const events2 = await Promise.all(eventonItems.slice(0, 100).map(async el => {
                    const $el = $(el);


                    const startDateStr = $el.find('[itemprop="startDate"]').attr('content');



                    const title = $el.find('.evcal_event_title').text().trim();
                    const link = $el.find('a').attr('href');
                    const description =
                        $el.find('.evcal_desc').text().trim() || // try evcal_desc first
                        $el.find('.event_description').text().trim() || // fallback if different class
                        '';
                    const eventTime = $el.find('.evo_eventcard_time_t').text().trim();

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    function getTodayFormatted() {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = today.getMonth() + 1;
                        const day = today.getDate();
                        return `${year}-${month}-${day}`;
                    }

                    function isDateNotFuture(dateStr) {
                        // Extract only the date part before "T" (if present)
                        const dateOnly = dateStr.split('T')[0];
                        const inputDate = new Date(dateOnly);
                        const today = new Date(getTodayFormatted());

                        // Compare dates (set hours to 0 to avoid timezone issues)
                        inputDate.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);

                        return inputDate <= today;
                    }

                    if (!isDateNotFuture(startDateStr)) return;

                    const locationText = $el.find('[itemprop="streetAddress"]').text().trim();

                    return {
                        website: "https://southfloridafamilylife.com/",
                        title,
                        date: today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                        time: eventTime || "NA",
                        location: locationText || "NA",
                        description: description || "NA", // replace with actual if FetchDetails used
                        cost: "NA",
                        paidOrFree: "NA",
                        eventLink: link,
                    };
                }));

                const Filteredevents = events2.filter(Boolean).slice(0, 10);


                // console.log("Filteredevents", Filteredevents);
                await appendEventsToSheet(Filteredevents);
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
