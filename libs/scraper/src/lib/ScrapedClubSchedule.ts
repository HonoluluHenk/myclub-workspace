export interface ScrapedScore {
  home: number,
  guest: number
}
export interface ScrapedClubSchedule {
  localDateTimeAsUTC: Date,
  homeTeam: string,
  guestTeam: string,
  location: string,
  score: ScrapedScore | undefined,
  matchMoved: boolean | undefined,
  matchHomeSwitched: boolean | undefined,
  round: number,
  teamCancelled: boolean | undefined,
  rawFlags: string,
}
