import { ScrapedClubSchedule } from "@myclub/scraper";
import * as fs from "fs";
import * as path from "path";
import { FetchMock } from "jest-fetch-mock";
import { ClubScheduleScraper } from "./club-schedule-scraper";
import * as moment from "moment";

const fetchMock = fetch as FetchMock;

describe("ClubScheduleScraper", () => {
  it("should create instance", () => {
    expect(new ClubScheduleScraper())
      .toBeTruthy();
  });

  describe("using mocked data", () => {
    const expected_url = "https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubMeetings";

    let actual: ScrapedClubSchedule[] | undefined;

    beforeEach(async () => {
      fetchMock.resetMocks();
      const file = path.join(__dirname, "../../../../../sampledata/Club-Calendar/click-TT – Begegnungen.html");
      const fixture = fs.readFileSync(file).toString();
      fetchMock.mockResponse((r) => {
        return r.url === expected_url
          ? Promise.resolve(fixture)
          : Promise.reject(`invalid url: ${r.url}`);
      });

      // noinspection MagicNumberJS
      actual = await new ClubScheduleScraper().scrape("foo", 123);
    });

    it("should parse all rows", async () => {
      // noinspection MagicNumberJS
      expect(actual!.length)
        .toEqual(140);
    });

    it("should fill empty dates", () => {
      // row with date + time
      expect(actual![2].dateTimeAsUTC)
        .toEqual(moment.utc("2019-08-28T19:30:00").toDate());
      // row with date filled from previous line
      expect(actual![3].dateTimeAsUTC)
        .toEqual(moment.utc("2019-08-28T19:45:00").toDate());
    });

    it("should have proper team names", () => {
      const teamNameIter = actual!
        .map(e => e.homeTeam)
        .reduce((acc, name) => acc.add(name), new Set<string>())
        .values();
      const names = Array.from(teamNameIter)
        .sort();

      // noinspection MagicNumberJS
      expect(names.length)
        .toEqual(64);

      expect(names[0])
        .toEqual("Aarberg");

      // noinspection MagicNumberJS
      expect(names[63])
        .toEqual("bls Spiez III");
    });

    it('should pass team id argument', () => {
      console.log('output', JSON.stringify(fetchMock.mock.calls));
      expect(fetchMock.mock.calls[0][0])
        .toEqual(expected_url);
    })

  });
});
