import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

jest.mock('node-fetch');
const {Response} = jest.requireActual('node-fetch');
import MockInstance = jest.MockInstance;
import {Championship} from './championship.type';
import {scrapeAllChampionships} from './scrapeAllChampionships.scraper';
import {SupportedLang} from '../shared/i18n';


describe('scrapeAllChampionships', () => {
  const PATH_TO_SAMPLEDATA = '../../../../../sampledata/championship/scrapeAllChamptionships/https _www.click-tt.ch_index.htm.de.html';
  // const ROWS_IN_SAMPLEDATA = 11;

  describe('using mocked data', () => {
    const fetchMock = fetch as any as MockInstance<Promise<Response>, any[]>;

    let actual: Championship[];

    beforeEach(async () => {
      const file = path.join(__dirname, PATH_TO_SAMPLEDATA);
      const fixture = fs.readFileSync(file).toString();

      fetchMock.mockReturnValue(Promise.resolve(new Response(fixture)));

      // noinspection MagicNumberJS
      actual = await scrapeAllChampionships(SupportedLang.de);
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
          }
        ]);
    });

  });
});
