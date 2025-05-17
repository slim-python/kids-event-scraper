const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const environment = process.env.NODE_ENV;


// Dynamically load all JS files in the "test" folder
const Folder = "scrappers"


const testFolder = path.join(__dirname, Folder);
const scrapers = fs.readdirSync(testFolder)
  .filter(file => file.endsWith('.js'))
  .map(file => path.join(Folder, file));

// Delay between scrapers (in milliseconds)
let delay = environment === "DEVELOPMENT" ? 1 * 60 * 1000 : 10 * 60 * 1000; // 1 minute for development, 10 minutes for production
// const delay = 1 * 60 * 1000; // 1 minutes
// const delay = 10 * 60 * 1000; // 10 minutess

// Log file setup
const logFile = path.join(__dirname, 'scraper-log.txt');

function log(message) {

  const date = new Date();

const options = {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
  const fullMessage = `[${formattedDate}] ${message}\n`;
  fs.appendFileSync(logFile, fullMessage);
  console.log(fullMessage.trim());
}

function runScraper(file) {
  return new Promise((resolve) => {
    const filePath = path.resolve(__dirname, file);
    log(`🔁 Starting ${filePath}...`);
    exec(`node "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        log(`❌ Error in ${file}: ${error.message}`);
        if (stderr) log(`stderr: ${stderr}`);
      } else {
        log(`✅ ${file} completed.`);
        if (stdout) log(`stdout: ${stdout}`);
      }
      resolve(); // Continue to next
    });
  });
}

async function runAllScrapers() {
  for (let i = 0; i < scrapers.length; i++) {
    await runScraper(scrapers[i]);
    if (i < scrapers.length - 1) {
      log(`⏳ Waiting ${delay / 60000} minutes before next scraper...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  log('🎉 All scrapers done for today.');
}

runAllScrapers();
