import {Filters, Params, PlayerCalendarService} from './player-calendar.service';
import {DateTime} from 'luxon';

describe('PlayerCalendarService', () => {
  const service: PlayerCalendarService = new PlayerCalendarService();

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('instance', () => {
    let _orignalDateNow: () => number;

    beforeEach(() => {
      _orignalDateNow = Date.now;
      // invoked by stamp/DTSTAMP
      // noinspection MagicNumberJS
      Date.now = jest.fn().mockReturnValue(Date.UTC(2019, 11, 21, 1, 2, 3));
    });

    afterEach(() => {
      Date.now = _orignalDateNow;
    });

    it('should export', () => {
      const params: Params = {
        homeTeamIDs: ['Team1a', 'Team1b'],
        scheduleName: 'Test Plan',
        scheduleDescription: 'Test Plan Description',
        season: {
          id: 'Season1',
          name: 'Saison Testing',
          shortName: 'ST',
          clubs: {
            Club1: {
              id: 'Club1',
              name: 'TTC Ostermundigen',
              shortName: 'TTCO',
              teamIds: ['Team1a', 'Team1b'],
              locationIds: ['LocationA'],
            },
            'Club2': {
              id: 'Club2',
              name: 'Der Gegner',
              shortName: 'DG',
              teamIds: ['dg1'],
              locationIds: ['LocationB'],
            },
            'Club3': {
              id: 'Club3',
              name: 'Enemy at the Gates',
              shortName: 'EATG',
              teamIds: ['eatg1'],
              locationIds: ['LocationC'],
            },
          },
          teams: {
            'Team1a': {
              id: 'Team1a',
              name: 'Ostermundigen 4',
              shortName: 'OM 4',
            },
            'Team1b': {
              id: 'Team1b',
              name: 'Ostermundigen Senioren 1',
              shortName: 'OM Sen1',
            },
            'dg1': {
              id: 'dg1',
              name: 'Der Gegner 1',
              shortName: 'DG 1',
            },
            'eatg1': {
              id: 'eatg1',
              name: 'Enemy at the Gates eins',
              shortName: 'EATG 1',
            },
          },
          locations: {
            'LocationA': {
              id: 'LocationA',
              name: 'Orange Halle',
              shortName: '(A)',
              address: {lines: ['Dennighofenstr.']},
            },
            'LocationB': {
              id: 'LocationB',
              name: 'Beim Gegner',
              shortName: '(B)',
              address: {lines: ['The Gates']},
            },
            'LocationC': {
              id: 'LocationC',
              name: 'Somewhere',
              shortName: '(C)',
              address: {lines: ['Irgendwo']},
            },
          },
          encounters: [
            {
              id: '1a-2',
              seasonId: 'Season1',
              homeTeamId: 'Team1a',
              guestTeamId: 'dg1',
              startAsUTC: DateTime.fromISO('1976-11-19T20:00:00', {zone: 'utc'}),
              locationId: 'LocationA',
            }, {
              id: '3-1b',
              seasonId: 'Season1',
              homeTeamId: 'eatg1',
              guestTeamId: 'Team1b',
              startAsUTC: DateTime.fromISO('2019-12-22T19:45:00', {zone: 'utc'}),
              locationId: 'LocationB',
            }, {
              id: '2-3',
              seasonId: 'Season1',
              homeTeamId: 'dg1',
              guestTeamId: 'eatg1',
              startAsUTC: DateTime.fromISO('2019-12-22T19:45:00', {zone: 'utc'}),
              locationId: 'LocationC',
            },
          ],
        },
      };

      params.filter = Filters.forTeams(['Team1a', 'Team1b']);
      const actual = service.createIcal(params);

      const expected = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//sebbo.net//ical-generator//EN
NAME:Test Plan
X-WR-CALNAME:Test Plan
X-WR-CALDESC:Test Plan Description
BEGIN:VEVENT
UID:Season1:Team1a---dg1@myclub
SEQUENCE:0
DTSTAMP:20191221T010203Z
DTSTART:19761119T200000Z
DTEND:19761119T220000Z
SUMMARY:H: OM 4 - DG 1
LOCATION:Orange Halle\\, Dennighofenstr.
DESCRIPTION:Heimspiel: Ostermundigen 4 - Der Gegner 1
END:VEVENT
BEGIN:VEVENT
UID:Season1:eatg1---Team1b@myclub
SEQUENCE:0
DTSTAMP:20191221T010203Z
DTSTART:20191222T194500Z
DTEND:20191222T214500Z
SUMMARY:A: EATG 1 - OM Sen1
LOCATION:Beim Gegner\\, The Gates
DESCRIPTION:Auswärtsspiel: Enemy at the Gates eins - Ostermundigen Seniore
 n 1
END:VEVENT
END:VCALENDAR
`.trim().replace(/\n/g, '\r\n');
      expect(actual)
        .toEqual(expected);

    });
  });
});
