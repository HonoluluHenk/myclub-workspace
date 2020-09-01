import {ScrapedClubSchedule} from '@myclub/scraper';
import * as fs from 'fs';
import * as path from 'path';
import {FetchMock} from 'jest-fetch-mock';
import {ClubScheduleScraper} from './club-schedule-scraper';
import {DateTime} from 'luxon';

const fetchMock = fetch as FetchMock;

describe('ClubScheduleScraper', () => {
  const PATH_TO_SAMPLEDATA = '../../../../../sampledata/spielplan-gesamt-MTTV2020-21/click-TT – Gruppe.html';
  const ROWS_IN_SAMPLEDATA = 90;

  it('should create instance', () => {
    expect(new ClubScheduleScraper())
      .toBeTruthy();
  });

  describe('using mocked data', () => {
    const expected_url = 'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/groupPage?displayTyp=gesamt&displayDetail=meetings&championship=foo&group=123';

    let actual: ScrapedClubSchedule[];

    beforeEach(async () => {
      fetchMock.resetMocks();
      const file = path.join(__dirname, PATH_TO_SAMPLEDATA);
      const fixture = fs.readFileSync(file).toString();
      fetchMock.mockResponse((r) => {
        return r.url === expected_url
          ? Promise.resolve(fixture)
          : Promise.reject(`invalid url: ${r.url}`);
      });

      // noinspection MagicNumberJS
      actual = await new ClubScheduleScraper()
        .scrape('foo', 123);
    });

    it('parses the correct number of rows', async () => {
      // noinspection MagicNumberJS
      expect(actual.length)
        .toEqual(ROWS_IN_SAMPLEDATA);
    });

    describe('DateTime parsing', () => {
      it('parses DateTime', () => {
        expect(actual[0].localDateTimeAsUTC.toISOString())
          .toEqual('2020-08-18T18:00:00.000Z');
      });

      it('fills empty dates with value from leading row', () => {
        // sanity check: row with date + time
        expect(actual[3].localDateTimeAsUTC)
          .toEqual(DateTime.fromISO('2020-08-29T11:30:00Z').toJSDate());
        // row with date filled from previous line
        expect(actual[4].localDateTimeAsUTC)
          .toEqual(DateTime.fromISO('2020-08-29T14:00:00Z').toJSDate());
      });
    });


    describe('team name parsing', () => {
      const ALL_TEAM_NAMES = [
        'Aarberg III',
        'Brügg',
        'Burgdorf III',
        'Heimberg III',
        'Kirchberg',
        'Münsingen II',
        'Ostermundigen III',
        'Port III',
        'Solothurn III',
        'Solothurn IV',
      ];

      function teamNames(mapper: (schedule: ScrapedClubSchedule) => string): string[] {
        const teamNameIter = actual
          .map(mapper)
          .reduce((acc, name) => acc.add(name), new Set<string>())
          .values();

        const names = Array.from(teamNameIter)
          .sort();

        return names;
      }

      it('parses all home team names', () => {
        const names = teamNames(e => e.homeTeam);

        expect(names)
          .toEqual(ALL_TEAM_NAMES);
      });

      it('parses all guest team names', () => {
        const names = teamNames(e => e.guestTeam);

        expect(names)
          .toEqual(ALL_TEAM_NAMES);
      });

    });

    describe('matchHomeSwitched flag ("t")', function () {
      const SWITCHED_HOME_ROWIDX = [4, 49];

      it('must parse the flag if set', () => {
        SWITCHED_HOME_ROWIDX.forEach(idx => {
          expect(actual[idx].matchHomeSwitched, `entry@idx ${idx}(row:${idx + 1})`)
            .toBe(true);
        });
      });

      it('must parse the flag if unset', () => {
        SWITCHED_HOME_ROWIDX.forEach(idx => {
          delete actual[idx];
        });

        actual.forEach(e => {
          expect(e.matchHomeSwitched)
            .toBe(false);
        });
      });
    });

    describe('matchMoved flag ("v")', () => {
      const MATCH_MOVED_ROWIDX = [6, 9, 10, 14, 15, 28, 34, 40, 59, 61, 63, 69, 82];

      it('must parse the flag if set', () => {
        MATCH_MOVED_ROWIDX.forEach(idx => {
          expect(actual[idx].matchMoved, `idx: ${idx}`)
            .toBe(true);
        });
      });

      it('must parse the flag if unset', () => {
        MATCH_MOVED_ROWIDX.forEach(idx => {
          delete actual[idx];
        });

        actual.forEach((e, idx) => {
          expect(e.matchMoved, `entry@idx ${idx}(row:${idx + 1}): ${e.localDateTimeAsUTC.toISOString()}: ${e.homeTeam} -> ${e.guestTeam}`)
            .toBe(false);
        });
      });
    });

    it('must pass team id argument', () => {
      // console.log('output', JSON.stringify(fetchMock.mock.calls));
      expect(fetchMock.mock.calls[0][0])
        .toEqual(expected_url);
    });

  });
});
