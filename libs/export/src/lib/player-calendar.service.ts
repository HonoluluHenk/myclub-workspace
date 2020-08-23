import * as ical from "ical-generator";
import * as moment from "moment";

export interface UID {
  id: string;
}

export interface Named {
  name: string;
}

export interface ShortNamed {
  shortName: string;
}

export interface Address {
  lines: string[]
}

export interface Team extends UID, Named, ShortNamed {
}

export interface Location extends UID, Named, ShortNamed {
  address: Address,
  coordinates?: Coordinates
}

export interface Club extends UID, Named, ShortNamed {
  teamIds: string[];
  locationIds: string[];
}

export interface TeamEncounter extends UID {
  seasonId: string,
  homeTeamId: string,
  guestTeamId: string,
  startAsUTC: moment.Moment,
  locationId: string
}

export interface TypedMap<T extends UID> {
  [id: string]: T
}

export interface Season extends UID, Named, ShortNamed {
  clubs: TypedMap<Club>,
  teams: TypedMap<Team>,
  locations: TypedMap<Location>,
  encounters: TeamEncounter[],
}

export type EncounterFilter = (encounter: TeamEncounter) => boolean;

export interface Params {
  fieldBuilder?: FieldBulder,
  filter?: EncounterFilter,
  homeTeamIDs: string[],
  scheduleName: string,
  scheduleDescription?: string;
  season: Season,
}

export class FieldBulder {
  isHomeEncounter(encounter: TeamEncounter, params: Params): boolean {
    return !!params.homeTeamIDs.find(id => id === encounter.homeTeamId);
  }

  // noinspection JSUnusedLocalSymbols
  buildHomeEncounterShortPrefix(encounter: TeamEncounter, params: Params): string {
    // FIXME: locale
    return "H: ";
  }

  // noinspection JSUnusedLocalSymbols
  buildGuestEncounterShortPrefix(encounter: TeamEncounter, params: Params): string {
    // FIXME: locale
    return "A: ";
  }

  // noinspection JSUnusedLocalSymbols
  buildHomeEncounterPrefix(encounter: TeamEncounter, params: Params): string {
    // FIXME: locale
    return "Heimspiel: ";
  }

  // noinspection JSUnusedLocalSymbols
  buildGuestEncounterPrefix(encounter: TeamEncounter, params: Params): string {
    // FIXME: locale
    return "Auswärtsspiel: ";
  }

  buildScheduleName(params: Params): string {
    return params.scheduleName;
  }

  buildScheduleDescription(params: Params): string | undefined {
    return params.scheduleDescription;
  }

  buildEncounterId(encounter: TeamEncounter, params: Params): string {
    return params.season.id + ":" + encounter.homeTeamId + "---" + encounter.guestTeamId;
  }

  // noinspection JSUnusedLocalSymbols
  buildEncounterStart(encounter: TeamEncounter, params: Params): moment.Moment {
    return moment(encounter.startAsUTC);
  }

  buildEncounterEnd(encounter: TeamEncounter, params: Params): moment.Moment {
    return this.buildEncounterStart(encounter, params).add(2, "hour");
  }

  // noinspection JSUnusedLocalSymbols
  buildEncounterSummary(encounter: TeamEncounter, params: Params): string {
    const prefix = this.buildEncounterSummaryPrefix(encounter, params);

    const homeTeamName = params.season.teams[encounter.homeTeamId].shortName;
    const guestTeamName = params.season.teams[encounter.guestTeamId].shortName;

    const result = `${prefix}${homeTeamName} - ${guestTeamName}`;
    return result;
  }

  private buildEncounterSummaryPrefix(encounter: TeamEncounter, params: Params) {
    let prefix = "";
    if (params.homeTeamIDs.length !== 0) {
      prefix = this.isHomeEncounter(encounter, params)
        ? this.buildHomeEncounterShortPrefix(encounter, params)
        : this.buildGuestEncounterShortPrefix(encounter, params);
    }
    return prefix;
  }

// noinspection JSUnusedLocalSymbols
  buildEncounterDescription(encounter: TeamEncounter, params: Params): string | undefined {
    const prefix = this.buildEncounterDescriptionPrefix(encounter, params);

    const homeTeamName = params.season.teams[encounter.homeTeamId].name;
    const guestTeamName = params.season.teams[encounter.guestTeamId].name;

    const result = `${prefix}${homeTeamName} - ${guestTeamName}`;
    return result;
  }

  private buildEncounterDescriptionPrefix(encounter: TeamEncounter, params: Params) {
    let prefix = "";
    if (params.homeTeamIDs.length !== 0) {
      prefix = this.isHomeEncounter(encounter, params)
        ? this.buildHomeEncounterPrefix(encounter, params)
        : this.buildGuestEncounterPrefix(encounter, params);
    }
    return prefix;
  }

  buildEncounterLocation(encounter: TeamEncounter, params: Params): string | undefined {
    const location = params.season.locations[encounter.locationId];
    if (location) {
      return location.name + ", " + location.address.lines.join(", ");
    } else {
      return undefined;
    }
  }
}

export namespace Filters {
  export function forTeams(teamIds: string[]): EncounterFilter {
    return e => teamIds.includes(e.homeTeamId) || teamIds.includes(e.guestTeamId);
  }

  export function forLocations(locationIds: string[]): EncounterFilter {
    return e => locationIds.includes(e.locationId);
  }
}

export class PlayerCalendarService {

  constructor() {
  }

  createIcal(params: Params): string {
    const builder = params.fieldBuilder || new FieldBulder();

    const name = builder.buildScheduleName(params);
    const description = builder.buildScheduleDescription(params);

    const cal = ical({
      domain: "myclub",
      name,
      description
    });

    const encounters = params.season.encounters
      .filter(encounter => params.filter ? params.filter(encounter) : true);

    encounters
      .forEach(encounter => {
        cal.createEvent({
          id: builder.buildEncounterId(encounter, params),
          start: builder.buildEncounterStart(encounter, params),
          end: builder.buildEncounterEnd(encounter, params),
          summary: builder.buildEncounterSummary(encounter, params),
          description: builder.buildEncounterDescription(encounter, params),
          location: builder.buildEncounterLocation(encounter, params),
          stamp: moment()
        });
      });

    const result = cal.toString();
    return result;
  }
}
