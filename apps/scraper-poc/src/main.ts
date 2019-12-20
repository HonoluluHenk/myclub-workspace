import { ScrapedClubSchedule } from "../../../libs/scraper/src/lib/ScrapedClubSchedule";
import { ClubScheduleScraper } from "./app/club-schedule-scraper";

/**
 * FIXME: this is a complete mess but a working Proof Of Concept.
 *  Needs some serious clenaup!
 */

const fs = require("fs");
const path = require("path");

(async () => {
  const scraper = new ClubScheduleScraper();

  let clubCalendar: ScrapedClubSchedule[];
  if (false) {
    // do actual web requests: Ostermundigen, 19/20
    // noinspection UnreachableCodeJS
    clubCalendar = await scraper.scrape(33282, "13-2870");
  } else {
    // load sampledata from file
    // noinspection UnreachableCodeJS
    const inFile = path.join(__dirname, "../../../sampledata/Club-Calendar/click-TT – Begegnungen.html");
    const data = fs.readFileSync(inFile);
    clubCalendar = scraper.scrapeFromHTML(data);
  }

  console.log(clubCalendar);
// console.log(clubCalendar.length);

  const outfile = path.join(__dirname, "../../../sampledata/ostermundigen-2019-20.json");
  fs.writeFileSync(outfile, JSON.stringify(clubCalendar));

})();


