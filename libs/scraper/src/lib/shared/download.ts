import fetch from 'node-fetch';

const MSEC = 1000;

export async function download(url: string): Promise<string> {
  const response = await fetch(
    url,
    {
      method: 'GET',
      redirect: 'follow',
      timeout: 5 * MSEC,
      compress: true,
    });

  const responseText = await response.text();

  return responseText;
}
