
// https://westpalmbeach.macaronikid.com/events


import axios from 'axios';
import * as cheerio from 'cheerio';
//import cheerio from 'cheerio';
import fs from 'fs';
import { appendEventsToSheet } from '../GoogleSheets/sheets.js';
const EvnetsToScape = 10;

const apiUrl = "https://api.macaronikid.com/api/v1/event/v2?query={%22status%22:%22active%22,%22townOwner%22:%2258252a7c6f1aaf645c94f1f5%22,%22startDate%22:%222025-05-07T01:00:00.000Z%22,%22endDate%22:%222025-05-14T00:59:59.000Z%22}&impression=true";

// Function to fetch and parse event data
async function fetchEvents() {
  try {
    // Fetch the list of events
    const response = await axios.get(apiUrl, {
      headers: {
        "accept": "/",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "if-none-match": "W/\"16ec4-RN7sE+WZM4NrXTiVe/sd+UDpAqA\"",
        "Referer": "https://westpalmbeach.macaronikid.com/",
      },
    });

    // Extract events data
    const events = response.data;

    // Process each event
    const eventPromises = events.slice(0, EvnetsToScape).map(async (event) => {
      const eventLink = `https://westpalmbeach.macaronikid.com/events/${event._id}/${event.title.replace(/\s+/g, '-').toLowerCase()}`;

      // Fetch event details
      const { description, cost, paidOrFree } = await fetchEventDetails(eventLink);

      // Map to the required JSON format
      return {
        website: "https://westpalmbeach.macaronikid.com/events",
        title: event.title,
        date: formatDate(event.startDateTime),
        time: formatTime(event.startDateTime, event.endDateTime),
        location: event.where,
        description: description,
        cost: cost,
        paidOrFree: paidOrFree,
        eventLink: eventLink,
      };
    });


    // Wait for all promises to resolve
    const eventData = await Promise.all(eventPromises);

    // Write to JSON file
    // fs.writeFileSync('events.json', JSON.stringify(eventData, null, 2));
        await appendEventsToSheet(eventData);
    console.log('Event data saved to events.json');
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

// Function to fetch event details (scrape description, title, etc.)
async function fetchEventDetails(
  eventLink
) {

  // let eventLink = "https://westpalmbeach.macaronikid.com/events/68045894c46ad4d78c66140c/animal-reading-friends-(arf)-for-grades-k-5-(register)-at-lantana-road-branch"
  try {
    // Fetch the event page
    const response = await axios.get(eventLink);

    // Use cheerio to parse the HTML
    const $ = cheerio.load(response.data);



    // Save to file
    // fs.writeFileSync("test.html", fullHtml);

    const content = $('.article-content');
    let descriptionHtml = '';
    let startAppending = false;

    content.children().each((_, el) => {
      const tag = $(el).prop('tagName');

      if (tag === 'H3' && $(el).text().trim() === 'Description') {
        startAppending = true;
        return;
      }

      if (startAppending && tag === 'H3') {
        return false; // break loop
      }

      if (startAppending) {
        descriptionHtml += $.html(el) + '\n';
      }
    });

    // Strip HTML tags to get clean text (optional)
    const descriptionText = cheerio.load(descriptionHtml).text().trim();

    let costText = 'Not specified';
    let paidOrFree = 'Paid';


    let costHeading = $('h3:contains("Cost")');

    // Get the next sibling element, which could be text or an element
    let nextElement = costHeading[0].nextSibling;

    costText = nextElement && nextElement.nodeType === 3 ? nextElement.nodeValue.trim() : $(nextElement).text().trim();
    // console.log("costText",costText);

    if (/\$\d/.test(costText)) {
      paidOrFree = 'Paid';
  } else if (/free/i.test(costText)) {
      paidOrFree = 'Free';
  }




    // Extract event details (e.g., description)
    const description = descriptionText || 'No description available';
    // console.log("description",description,"costText",costText,"paidOrFree",paidOrFree);
    return { description, cost: costText, paidOrFree };
  } catch (error) {
    console.error('Error fetching event details:', error);
    return { description: 'No description available' };
  }
}

// Helper function to format date
function formatDate(dateTime) {
  const date = new Date(dateTime);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

// Helper function to format time
function formatTime(startDateTime, endDateTime) {
  const startTime = new Date(startDateTime);
  const endTime = new Date(endDateTime);

  return `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

fetchEvents();
