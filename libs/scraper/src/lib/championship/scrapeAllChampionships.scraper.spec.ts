import {Championship} from './championship.type';
import {scrapeAllChampionships} from './scrapeAllChampionships.scraper';
import {PreferredLanguage} from '../shared/i18n';
import {mockFetchSampledata} from '../../test-helpers';

describe('scrapeAllChampionships', () => {
  const SAMPLEDATA_PATH = 'championship/scrapeAllChamptionships/https _www.click-tt.ch_index.htm.de.html';

  describe('using mocked data', () => {
    let actual: Championship[];

    beforeEach(async () => {
      mockFetchSampledata(SAMPLEDATA_PATH);

      // noinspection MagicNumberJS
      actual = await scrapeAllChampionships(PreferredLanguage.German);
    });

    it('scrapes leagues and championships', async () => {
      expect(actual)
        .toEqual(<Championship[]>[
          {
            leagueName: 'Spielbetrieb 2020/21',
            name: 'Nationalliga 2020/21',
            id: 'STT 20/21',
          }, {
            leagueName: 'Spielbetrieb 2020/21',
            name: 'AGTT 2020/21',
            id: 'AGTT 20/21',
          }, {
            leagueName: 'Spielbetrieb 2020/21',
            name: 'ANJTT 2020/21',
            id: 'ANJTT 20/21',
          }, {
            leagueName: 'Spielbetrieb 2020/21',
            name: 'ATTT 2020/21',
            id: 'ATTT 20/21',
          }, {
            leagueName: 'Spielbetrieb 2020/21',
            name: 'AVVF 2020/21',
            id: 'AVVF 20/21',
          }, {
            leagueName: 'Spielbetrieb 2020/21',
            name: 'MTTV 2020/21',
            id: 'MTTV 20/21',
          }, {
            leagueName: 'Spielbetrieb 2020/21',
            name: 'NWTTV 2020/21',
            id: 'NWTTV 20/21',
          }, {
            leagueName: 'Spielbetrieb 2020/21',
            name: 'OTTV 2020/21',
            id: 'OTTV 20/21',
          }, {
            leagueName: 'Spielbetrieb 2020/21',
            name: 'TTVI 2020/21',
            id: 'TTVI 20/21',
          }, {
            leagueName: 'Cup 2020/21',
            name: 'Schweizer Cup 2020/21',
            id: 'Schweizer Cup 20/21',
          }, {
            leagueName: 'SJC 2020/21',
            name: 'SJC 2020/21',
            id: 'SJC 20/21',
          },
        ]);
    });

  });
});
