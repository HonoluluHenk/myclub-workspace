import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

// !!!!!!! IMPORTANT !!!!!!!!
// jest mock of 'node-fetch': see test-setup.ts

const {Response} = jest.requireActual('node-fetch');

export const fetchMock = fetch as any as jest.MockInstance<Promise<Response>, any[]>;

export function mockFetchSampledata(pathToResponseData: string): void {
  const file = path.join(__dirname, '../../../sampledata/' + pathToResponseData);
  const fixture = fs.readFileSync(file).toString();

  fetchMock.mockReturnValue(Promise.resolve(new Response(fixture)));
}
