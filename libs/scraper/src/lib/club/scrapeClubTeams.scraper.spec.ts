import {mockFetchSampledata} from '../../test-helpers';
import {FEDERATION_STT} from './scrapeClubSearch.scraper';
import {ClubTeam, scrapeClubTeams} from './scrapeClubTeams';

describe('scrapeClubTeams', () => {

  describe('scrapeClubTeams sampledata', () => {
    const SAMPLEDATA_PATH = 'club/clubTeams.html';
    let actual: ClubTeam[];

    beforeEach(async () => {
      mockFetchSampledata(SAMPLEDATA_PATH);

      actual = await scrapeClubTeams(33282, FEDERATION_STT);
    });


    it('scrapes all entries', async () => {
      expect(actual)
        .toHaveLength(11);
    });

    it('scrapes first entry', async () => {
      expect(actual)
        .toContainEqual(
          {
            'captainDisplayName': 'Gilliéron, Severin',
            'championship': 'STT 20/21',
            'championshipName': 'STT Nationalligen 2020/21',
            'clubId': 33282,
            'currentPoints': {'opponent': 8, 'own': 0},
            'currentRanking': 9,
            'groupId': 207086,
            'groupName': 'Herren Nationalliga B Gruppe 2',
            'teamName': 'Herren',
          });
    });

    it('scrapes first entry in championship (after sub-header)', async () => {
      expect(actual)
        .toContainEqual(
          {
            'captainDisplayName': 'Göllnitz, Philippe',
            'championship': 'MTTV 20/21',
            'championshipName': 'MTTV Mannschaftsmeisterschaft 2020/21',
            'clubId': 33282,
            'currentPoints': {'opponent': 5, 'own': 7},
            'currentRanking': 3,
            'groupId': 206944,
            'groupName': '1. Liga Herren',
            'teamName': 'Herren II',
          });
    });

    it('scrapes last entry in championship', async () => {
      expect(actual)
        .toContainEqual(
          {
            'captainDisplayName': 'Glauser, Peter',
            'championship': 'MTTV 20/21',
            'championshipName': 'MTTV Mannschaftsmeisterschaft 2020/21',
            'clubId': 33282,
            'currentPoints': {'opponent': 8, 'own': 0},
            'currentRanking': 6,
            'groupId': 207129,
            'groupName': '3. Liga O40 Gruppe 1',
            'teamName': 'Senioren O40 III',
          });
    });

    it('scrapes tournament entry', async () => {
      expect(actual)
        .toContainEqual(
          {
            'captainDisplayName': undefined,
            'championship': 'Schweizer Cup 20/21',
            'championshipName': 'Schweizer Cup 2020/21',
            'clubId': 33282,
            'currentPoints': undefined,
            'currentRanking': undefined,
            'groupId': 206849,
            'groupName': '2. Hauptrunde Zone 3',
            'teamName': 'Herren',
          });
    });

  });
});
