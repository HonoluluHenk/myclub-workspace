import {mockFetchSampledata} from '../../test-helpers';
import {ClubListEntry, scrapeClubSearchList} from './scrapeClubSearchList.scraper';

describe('scrapeClubSearchList', () => {

  describe('clubSearch list sampledata', () => {
    const SAMPLEDATA_PATH = 'clubs/clubSearch-list.html';
    let actual: ClubListEntry[];

    beforeEach(async () => {
      mockFetchSampledata(SAMPLEDATA_PATH);

      actual = await scrapeClubSearchList(
        'https://www.click-tt.ch/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubSearch?searchPattern=CH.05&federation=STT&regionName=Mittell%C3%A4ndischer+Tischtennisverband&federations=STT',
      );
    });


    it('scrapes all entries', async () => {
      expect(actual)
        .toHaveLength(47);
    });

    it('scrapes correct values', async () => {
      expect(actual[0])
        .toEqual(<ClubListEntry>{
          clubId: 33089,
          clubInfoURL: '/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubInfoDisplay?club=33089',
          clubNumber: 50035,
          clubName: 'Aarberg',
        });

      expect(actual[46])
        .toEqual(<ClubListEntry>{
          clubId: 33156,
          clubInfoURL: '/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubInfoDisplay?club=33156',
          clubNumber: 50039,
          clubName: 'bls Spiez',
        });
    });

    it('scrapes umlauts', async () => {
      expect(actual[21])
        .toEqual(<ClubListEntry>{
          clubId: 33115,
          clubInfoURL: '/cgi-bin/WebObjects/nuLigaTTCH.woa/wa/clubInfoDisplay?club=33115',
          clubNumber: 50063,
          clubName: 'Münchenbuchsee',
        });
    });

  });
});
