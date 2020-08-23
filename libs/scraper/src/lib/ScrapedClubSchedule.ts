export interface ScrapedScore {
  home: number,
  guest: number
}
export interface ScrapedClubSchedule {
  dateTimeAsUTC: Date,
  homeTeam: string,
  guestTeam: string,
  divistion: string,
  location: string,
  locationComment: string,
  score: ScrapedScore | undefined,
  matchMoved: boolean | undefined,
  matchHomeSwitched: boolean | undefined,
  round: number,
  teamCancelled: boolean | undefined,
  rawFlags: string,
}
