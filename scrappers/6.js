// https://www.thepalmbeaches.com/events

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { appendEventsToSheet } = require("../GoogleSheets/sheets.js");
const { arrayBuffer } = require("stream/consumers");

// const FetchDetails = async (eventId) => {
//     const res = await fetch(`https://www.broward.org/parks/_api/web/lists/GetByTitle('Events')/items?$select=*,Recurring/Title,FeaturedImage/Title,Park/Title&$expand=Recurring/Id,FeaturedImage/Id,Park/Id&$filter=ID%20eq%20${eventId}`, {
//         "headers": {
//             "accept": "application/json; odata=verbose",
//             "accept-language": "en-US,en;q=0.9,de;q=0.8",
//             "cache-control": "no-cache",
//             "pragma": "no-cache",
//             "priority": "u=1, i",
//             "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
//             "sec-ch-ua-mobile": "?0",
//             "sec-ch-ua-platform": "\"Windows\"",
//             "sec-fetch-dest": "empty",
//             "sec-fetch-mode": "cors",
//             "sec-fetch-site": "same-origin",
//             "x-requested-with": "XMLHttpRequest",
//             "cookie": "NSC_Opo-HTMC-CspxbsePsh_TTM_wTfswfs=ffffffffc3a0df7c45525d5f4f58455e445a4a42378b; _gid=GA1.2.1693970482.1747062922; WSS_FullScreenMode=false; nmstat=f9c36ada-0910-759c-4b0c-1bee0a70ba96; WT_FPC=id=2ebbc13c524e8028ac31747025121953:lv=1747036070622:ss=1747036070622; _gat=1; _gat_gtag_UA_20386207_1=1; _ga=GA1.1.990087167.1747062922; _ga_PF38FHRCMM=GS2.1.s1747073814$o3$g1$t1747073888$j60$l0$h0",
//             "Referer": "https://www.broward.org/Parks/Pages/Event.aspx?event=2261",
//             "Referrer-Policy": "strict-origin-when-cross-origin"
//         },
//         "body": null,
//         "method": "GET"
//     });

//     const result = await res.text();
//     const data = JSON.parse(result);

//     const item = data?.d?.results[0];
//     const Price = item.Price || "N/A";
//     return {
//         website: "https://www.broward.org/",
//         title: item.Title,
//         date: new Date().toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric"
//         }),
//         time: item.Time,
//         location: item.Park?.Title,
//         description: item.Description,
//         cost: Price,
//         paidOrFree: Price.includes("$") ? "Paid" : "Free",
//         eventLink: `https://www.broward.org/Parks/Pages/Event.aspx?event=${eventId}`,
//     };
// }

const main = async () => {
  try {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://www.thepalmbeaches.com/wp-json/custom-event/v1/expanded-events?page=1&per_page=12&include_child_terms=true",
          {
            headers: {
              accept: "*/*",
              "accept-language": "en-US,en;q=0.9,de;q=0.8",
              "cache-control": "no-cache",
              pragma: "no-cache",
              priority: "u=1, i",
              "sec-ch-ua":
                '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              cookie:
                '_swb=62b7e9de-553b-40ad-a033-1e6c74f2fc41; _gcl_au=1.1.634414748.1747401247; fc_storage_location=cookie; fc_pid_variable=fc_pid; cf_clearance=28vgA2gtC5IRaaTw7mnV2b1AK7_7kCFe97HYfWDYWUI-1747401249-1.2.1.1-1pPkVr_mpiRQeDLqIURldQilxYfCEtSzGltxw1KrNvv4UvFl6zj0krX6bECc1oXWMFuPgCs0Nqk1mQczuQrjp.g2RT5PO9GtVZA.pTemKftfI.0BPdVIqwajBdV71Her1U3s4P9yxUsODKz_mTS7dJ5Kci5hDlWF.m4gSTqYnuyxCB4.uSCCz1hNswFv1Z.J4OvcIzyW_pPw6LhsvdVZE5Rn1VFYnOqruMsr1IW.aHZu9mCSkTKrgCg_KWkkv2cKlCt9ccXIA6TkGWaZwhkItwDU6tak_NZEEBo47xZubExLAAkMMyPR0Qs1wZHbvSmxbQRKbujiSmDrAZvjd7JQo1Uvgaz3q_ojzK1WM9XXFac; _ga=GA1.1.1493337691.1747401247; mmpersona-js=W10=; _fbp=fb.1.1747401247913.534477399374486673; _ketch_consent_v1_=eyJhbmFseXRpY3MiOnsic3RhdHVzIjoiZ3JhbnRlZCIsImNhbm9uaWNhbFB1cnBvc2VzIjpbImFuYWx5dGljcyJdfSwiZXNzZW50aWFsX3NlcnZpY2VzIjp7InN0YXR1cyI6ImdyYW50ZWQiLCJjYW5vbmljYWxQdXJwb3NlcyI6WyJlc3NlbnRpYWxfc2VydmljZXMiXX0sInRhcmdldGVkX2FkdmVydGlzaW5nIjp7InN0YXR1cyI6ImdyYW50ZWQiLCJjYW5vbmljYWxQdXJwb3NlcyI6WyJwZXJzb25hbGl6YXRpb24iLCJiZWhhdmlvcmFsX2FkdmVydGlzaW5nIiwiZW1haWxfbWt0ZyJdfX0%3D; _clck=h3lu4f%7C2%7Cfvy%7C0%7C1962; cebs=1; _ce.clock_data=-2812%2C223.190.83.174%2C1%2C0e0369e2813db7deb26e5937c353aab4%2CChrome%2CIN; wp38160="WBUZTDDDDDDACVMXHZW-YUML-XHUZ-BTLZ-CIBCMCYJVCXWDZXWHWVAB-ZZUC-XKLA-HAHU-ZYWUBJAMMHBMDmoLiHstILHJoLl_JhtDD"; intercom-id-a9nifcds=4c601554-7236-4280-bcc2-f0b27d0dd7df; intercom-session-a9nifcds=; intercom-device-id-a9nifcds=919e2ad5-2cbc-4236-b409-388e92fc2642; _swb_consent_=eyJjb2xsZWN0ZWRBdCI6MTc0NzQwMTI1MiwiY29udGV4dCI6eyJzb3VyY2UiOiJiYW5uZXIuc2F2ZUN1cnJlbnRTdGF0ZSJ9LCJlbnZpcm9ubWVudENvZGUiOiJwcm9kdWN0aW9uIiwiaWRlbnRpdGllcyI6eyJzd2Jfd2Vic2l0ZV9zbWFydF90YWciOiI2MmI3ZTlkZS01NTNiLTQwYWQtYTAzMy0xZTZjNzRmMmZjNDEifSwianVyaXNkaWN0aW9uQ29kZSI6ImRlZmF1bHQiLCJwcm9wZXJ0eUNvZGUiOiJ3ZWJzaXRlX3NtYXJ0X3RhZyIsInB1cnBvc2VzIjp7ImFuYWx5dGljcyI6eyJhbGxvd2VkIjoidHJ1ZSIsImxlZ2FsQmFzaXNDb2RlIjoiZGlzY2xvc3VyZSJ9LCJlc3NlbnRpYWxfc2VydmljZXMiOnsiYWxsb3dlZCI6InRydWUiLCJsZWdhbEJhc2lzQ29kZSI6ImRpc2Nsb3N1cmUifSwidGFyZ2V0ZWRfYWR2ZXJ0aXNpbmciOnsiYWxsb3dlZCI6InRydWUiLCJsZWdhbEJhc2lzQ29kZSI6ImNvbnNlbnRfb3B0b3V0In19fQ%3D%3D; flyin_pages_visited_140=2; TPBpagecount=1; flyin_banner_seen_140=1; _ga_1KD1FF0DN7=GS2.1.s1747401247$o1$g1$t1747401456$j44$l0$h1416785821; _tq_id.TV-6327543654-1.5eaa=a08e3dd4f7323424.1747401248.0.1747401456..; _uetsid=a60bee60325711f0bad9f73d8185997a; _uetvid=a60c0130325711f099952d2cd0b70420; cebsp_=6; _clsk=rm6bfi%7C1747401458579%7C7%7C1%7Cl.clarity.ms%2Fcollect; _ce.s=v~9bcd017adf88467230c9273cb8df62f43c1d3008~lcw~1747401490949~vir~new~lva~1747401249375~vpv~0~v11.cs~433346~v11.s~a7ac5d00-3257-11f0-844b-493d6dcc6850~v11.ss~1747401250517~v11.sla~1747401491076~lcw~1747401491077',
              Referer: "https://www.thepalmbeaches.com/events",
              "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: null,
            method: "GET",
          }
        );

        const result = await response.text();
        const data = JSON.parse(result);


        const res = data?.events;

        const today = new Date().toISOString().split("T")[0]; // Gets today's date in YYYY-MM-DD format

        const filteredEvents = data?.events?.filter((event) => {
          return event.meta?.simpleview_event_startdate === today;
        });

        let arr1 = [];

        function formatTimeRange(startTime, endTime) {

            if (!startTime || !endTime) {
              return "NA";
            }

          const formatTo12Hour = (timeStr) => {
            const [hour, minute] = timeStr.split(":");
            const date = new Date();
            date.setHours(parseInt(hour), parseInt(minute));
            return date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          };

          const formattedStart = formatTo12Hour(startTime);
          const formattedEnd = formatTo12Hour(endTime);

          
          return `${formattedStart.toString()} - ${formattedEnd.toString()}`;
        }

        filteredEvents.slice(0,10).forEach((item) => {

          const data = {
            website: "https://www.thepalmbeaches.com/",
            title: item.title,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            time: formatTimeRange(
              item.meta_fields?.simpleview_event_starttime, item.meta_fields?.simpleview_event_endtime),
            location: item.meta_fields?.simpleview_event_location,
            description: item.Description,
            cost: "NA",
            paidOrFree: "NA",
            eventLink: item.link ? item.link.replace(/\\\//g, "/") : "",
          };

          arr1.push(data);
        });

        await appendEventsToSheet(arr1);

 
        return;
        const todayUTC = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format in UTC

        const today_ = new Date(); // current UTC time
        const arr = [];

        res
          .filter((item) => {
            const startDate = new Date(item.Date);
            const endDate = new Date(item.EndDate);
            return today_ >= startDate && today_ <= endDate;
          })
          .forEach((item) => {
            const today = new Date().toLocaleString("en-US", {
              weekday: "long",
            }); // e.g., "Tuesday"

            // console.log("today in word", today);

            if (
              item.Recurring.results[0]?.Title == "Everyday" ||
              item.Recurring.results[0]?.Title == `Every ${today}`
            ) {
              return arr.push(item.Id);
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
