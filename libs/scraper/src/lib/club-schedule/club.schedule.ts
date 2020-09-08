export interface Score {
  home: number,
  guest: number
}
export interface ClubSchedule {
  divisionName: string,
  startDateTime: Date,
  homeTeam: string,
  guestTeam: string,
  location: string,
  score: Score | undefined,
  matchRescheduled: boolean | undefined,
  matchHomeSwitched: boolean | undefined,
  round: number,
  teamCancelled: boolean | undefined,
  matchFlags: string,
  resultFlags: string,
  unhandledFlags: string,
}
