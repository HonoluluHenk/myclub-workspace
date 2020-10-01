import {mockFetchSampledata} from '../../test-helpers';
import {ClubSearchOptions, FEDERATION_STT, scrapeClubSearchOptions} from './scrapeClubSearch.scraper';

describe('scrapeClubSearch', () => {

  describe('clubSearch sampledata', () => {
    const SAMPLEDATA_PATH = 'club/clubSearch.html';
    let actual: ClubSearchOptions[];

    beforeEach(async () => {
      mockFetchSampledata(SAMPLEDATA_PATH);

      actual = await scrapeClubSearchOptions();
    });


    it('scrapes all entries', async () => {
      expect(actual)
        .toHaveLength(8);
    });

    it('scrapes all values', async () => {
      expect(actual)
        .toEqual([{
          federation: FEDERATION_STT,
          regionName: 'Association Genevoise de Tennis de Table',
          searchPattern: 'CH.01',
          searchURL: 'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.01&federation=STT&regionName=Association+Genevoise+de+Tennis+de+Table&federations=STT',
        }, {
          federation: FEDERATION_STT,
          regionName: 'Association Neuchâteloise et Jurassienne de Tennis de Table',
          searchPattern: 'CH.02',
          searchURL: 'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.02&federation=STT&regionName=Association+Neuch%C3%A2teloise+et+Jurassienne+de+Tennis+de+Table&federations=STT',
        }, {
          federation: FEDERATION_STT,
          regionName: 'Associazione Ticinese Tennis Tavolo',
          searchPattern: 'CH.03',
          searchURL: 'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.03&federation=STT&regionName=Associazione+Ticinese+Tennis+Tavolo&federations=STT',
        }, {
          federation: FEDERATION_STT,
          regionName: 'Association Vaud, Valais, Fribourg',
          searchPattern: 'CH.04',
          searchURL: 'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.04&federation=STT&regionName=Association+Vaud%2C+Valais%2C+Fribourg&federations=STT',
        }, {
          federation: FEDERATION_STT,
          regionName: 'Mittelländischer Tischtennisverband',
          searchPattern: 'CH.05',
          searchURL: 'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.05&federation=STT&regionName=Mittell%C3%A4ndischer+Tischtennisverband&federations=STT',
        }, {
          federation: FEDERATION_STT,
          regionName: 'Nordwestschweizerischer Tischtennisverband',
          searchPattern: 'CH.06',
          searchURL: 'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.06&federation=STT&regionName=Nordwestschweizerischer+Tischtennisverband&federations=STT',
        }, {
          federation: FEDERATION_STT,
          regionName: 'Ostschweizer Tischtennisverband',
          searchPattern: 'CH.07',
          searchURL: 'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.07&federation=STT&regionName=Ostschweizer+Tischtennisverband&federations=STT',
        }, {
          federation: FEDERATION_STT,
          regionName: 'Tischtennisverband Innerschweiz',
          searchPattern: 'CH.08',
          searchURL: 'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.08&federation=STT&regionName=Tischtennisverband+Innerschweiz&federations=STT',
        },
        ]);
    });

  });
});
