import {ClubSchedule, scrapeClubSchedule} from '@myclub/scraper';
import {DateTime} from 'luxon';
import {fetchMock, mockFetchSampledata} from '../../test-helpers';


describe('ClubScheduleScraper', () => {
  const SAMPLEDATA_PATH = 'Club-Calendar/click-TT – Begegnungen.html';
  const ROWS_IN_SAMPLEDATA = 20;

  describe('using mocked data', () => {
    const expected_url = 'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubMeetings?club=456&searchType=1&searchTimeRangeFrom=01.07.2020&searchTimeRangeTo=31.06.2021';

    let actual: ClubSchedule[];

    beforeEach(async () => {
      mockFetchSampledata(SAMPLEDATA_PATH);

      // noinspection MagicNumberJS
      actual = await scrapeClubSchedule(2020, 456);
    });

    it('parses the correct number of rows', async () => {
      // noinspection MagicNumberJS
      expect(actual.length)
        .toEqual(ROWS_IN_SAMPLEDATA);
    });

    describe('DateTime parsing', () => {
      it('parses DateTime', () => {
        expect(actual[0].startDateTime.toISOString())
          .toEqual('2020-08-17T17:45:00.000Z');
      });

      it('fills empty dates with value from leading row', () => {
        // sanity check: row with date + time
        expect(actual[5].startDateTime)
          .toEqual(DateTime.fromISO('2020-09-07T17:45:00Z').toJSDate());
        // row with date filled from previous line
        expect(actual[6].startDateTime)
          .toEqual(DateTime.fromISO('2020-09-07T17:45:00Z').toJSDate());
      });
    });


    describe('team name parsing', () => {

      function teamNames(mapper: (schedule: ClubSchedule) => string): string[] {
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

        // console.error('eams',names);

        expect(names)
          .toEqual([
            'Bern VIII',
            'Ittigen',
            'Ittigen II',
            'Ittigen III',
            'Kirchberg II',
            'Ostermundigen II',
            'Regio Moossee',
            'Stettlen',
            'Thun IV',
            'Tiefenau II',
            'Wynigen',
          ]);
      });

      it('parses all guest team names', () => {
        const names = teamNames(e => e.guestTeam);

        expect(names)
          .toEqual([
            'Belp',
            'Bern IV',
            'Burgdorf V',
            'Ittigen',
            'Ittigen II',
            'Ittigen III',
            'Köniz IV',
            'Langenthal',
            'Langnau',
            'Langnau II',
            'Ostermundigen IV',
            'Ostermundigen VII',
            'Regio Moossee II',
            'Romanel',
          ]);
      });

    });

    describe('flags parsing', () => {
      it('must recognize all flags', () => {
        const allUnknowns = actual
          .map(a => a.unhandledFlags)
          .join('');

        expect(allUnknowns)
          .toEqual('');
      });

      describe('matchHomeSwitched flag ("t")', function () {
        const SWITCHED_HOME_ROWIDX = [6, 19];

        it('must parse the flag if set', () => {
          const switchedIndexes = actual
            .map((a, idx) => a.matchHomeSwitched ? idx : undefined)
            .filter(idx => idx !== undefined);

          expect(switchedIndexes)
            .toEqual(SWITCHED_HOME_ROWIDX);
        });
      });

      describe('matchRescheduled flag ("v")', () => {
        const MATCH_RESCHEDULED_ROWIDX = [0, 3, 6, 15, 19];

        it('must parse the flag if set', () => {
          const rescheduledIndexes = actual
            .map((a, idx) => a.matchRescheduled ? idx : undefined)
            .filter(idx => idx !== undefined);

          expect(rescheduledIndexes)
            .toEqual(MATCH_RESCHEDULED_ROWIDX);
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
