import {mockFetchSampledata} from '../../test-helpers';
import {ChampionshipGroup, scrapeChampionship} from './scrapeChampionship.scraper';
import {PreferredLanguage} from '../shared/i18n';

describe('scrapeChampionship', () => {

  describe('MTTV sampledata (one league per column)', () => {
    const SAMPLEDATA_PATH = 'championship/scrapeChampionship/leaguePage-MTTV.html';
    let actual: ChampionshipGroup[];

    beforeEach(async () => {
      mockFetchSampledata(SAMPLEDATA_PATH);

      actual = await scrapeChampionship('MTTV 20/21', PreferredLanguage.German);
    });


    it('scrapes all entries', async () => {
      expect(actual)
        .toHaveLength(24);
    });

    it('scrapes sampledata', async () => {
      expect(actual[0])
        .toEqual(<ChampionshipGroup>{
          groupId: 206944,
          groupName: 'HE 1. Liga',
          leagueType: 'HE',
          url: '/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/groupPage?championship=MTTV+20%2F21&group=206944',
        });

      expect(actual[23])
        .toEqual(<ChampionshipGroup>{
          groupId: 207131,
          groupName: 'O40 3. Liga Gr. 3',
          leagueType: 'O40',
          url: '/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/groupPage?championship=MTTV+20%2F21&group=207131',
        });
    });
  });

  describe('NWTTV sampledata (multiple leagues per column)', () => {
    const SAMPLEDATA_PATH = 'championship/scrapeChampionship/leaguePage-NWTTV.html';
    let actual: ChampionshipGroup[];

    beforeEach(async () => {
      mockFetchSampledata(SAMPLEDATA_PATH);

      actual = await scrapeChampionship('NWTTV 20/21', PreferredLanguage.German);
    });


    it('scrapes all entries', async () => {
      expect(actual)
        .toHaveLength(27);
    });

    it('scrapes sampledata', async () => {
      // first group in first column ("Herren")
      expect(actual[0])
        .toEqual(<ChampionshipGroup>{
          groupId: 207174,
          groupName: 'HE 1. Liga Gr.1',
          leagueType: 'HE',
          url: '/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/groupPage?championship=NWTTV+20%2F21&group=207174',
        });

      // first group in 3rd column ("Senioren O40")
      expect(actual[18])
        .toEqual(<ChampionshipGroup>{
          groupId: 207282,
          groupName: 'O40 1. Liga Gr. 1',
          leagueType: 'O40',
          url: '/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/groupPage?championship=NWTTV+20%2F21&group=207282',
        });
      // second group in 3rd column ("Veteranen O50")
      expect(actual[19])
        .toEqual(<ChampionshipGroup>{
          groupId: 207283,
          groupName: 'O50 1. Liga Gr. 1',
          leagueType: 'O50',
          url: '/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/groupPage?championship=NWTTV+20%2F21&group=207283',
        });
    });
  });
});
