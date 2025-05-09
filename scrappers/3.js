const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { appendEventsToSheet } = require("../GoogleSheets/sheets.js");

const FetchEventDetails = async (url, title) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Host': 'mommypoppins.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': 'mobile=0'
      },
      responseType: 'text'
    });

    const $ = cheerio.load(response.data);

    // fs.writeFileSync('event.html', response.data, 'utf-8');
    const dateText = $('.event-info-container > div').first().text().trim();
    const date = dateText.split('\n')[0].trim();

    const time = $('.event-info-container > div strong')
      .filter((i, el) => {
        const txt = $(el).text().toLowerCase();
        return txt.includes('am') || txt.includes('pm');
      })
      .first()
      .text()
      .trim();

    // console.log("time");
    // console.log("time", time);



    const locationName = $('.event-location .location-row').first().text().trim();
    const locationAddress = $('.event-location .location-row a').text().trim();
    const location = `${locationName}, ${locationAddress}`.replace(/,\s*$/, '');

    // Extract price
    let price = '';
    $('.event-info-container div').each((i, el) => {
      const strong = $(el).find('strong').first();
      if (strong.text().trim() === 'Price:') {
        const fullText = $(el).text().trim();
        price = fullText.replace('Price:', '').trim();
      }
    });

    const paidOrFree = price.toLowerCase().includes('free') ? 'Free' : 'Paid';

    const description = $('#main-content article .event-body-container.body')
      .text()
      .trim();

    return {
      website: "mommypoppins.com",
      title,
      date,
      time,
      location,
      description,
      cost: price,
      paidOrFree,
      eventLink: url,
    };

  } catch (error) {
    console.error('Error fetching event details:', error.message);
    return null;
  }
};

const main = async () => {
  try {
    const response = await axios.get("https://mommypoppins.com/events/1670_2455/anywhere_miami-south-florida/all/tag/all/age/all/all/all/type/deals/0/near/0/0", {
      headers: {
        "Cookie": "mobile=0"
      }
    });

    const $ = cheerio.load(response.data);

    const fetchPromises = [];

    const today = new Date();
    const options = { month: "long", day: "numeric" };
    const todayFormatted = today.toLocaleDateString("en-US", options);

    let count = 0;

    $(".events-date-header").each((i, el) => {
      const dateText = $(el).text().trim();
    
      if (dateText.includes(todayFormatted)) {
        const eventEls = $(el).nextUntil(".events-date-header");
    
        eventEls.each((j, eventEl) => {
          if (count >= 10) return false; // Exit the loop after 10 items
    
          const eventLink = $(eventEl).find("a").attr("href");
          const title = $(eventEl).find("h2").text().trim();
        //   console.log("title", title);
    
          if (eventLink) {
            fetchPromises.push(FetchEventDetails(`https://mommypoppins.com${eventLink}`, title));
            count++;
          }
        });
      }
    });
    

    const results = await Promise.all(fetchPromises);
    const filtered = results.filter(Boolean); // remove nulls from failed fetches
    await appendEventsToSheet(filtered);
    // console.log("Scraped Events:");
    // console.log(filtered);

  } catch (error) {
    console.error("Error fetching events list:", error.message);
  }
};

main();
