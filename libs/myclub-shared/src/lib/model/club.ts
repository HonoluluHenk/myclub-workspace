/**
 * Interface for the 'Club' data
 */
import {DEFAULT_GROUP, IsUUID, MinLength, Nested, Required} from 'at-valid/lib/decorators';

const CREATE = "Create";

const DEFAULTS_OPTS = {groups: [DEFAULT_GROUP, CREATE]};

export class Country {
  @Required()
  @IsUUID()
  id: string;

  code: string;
}

export class Address {
  @Required()
  @IsUUID()
  id: string;

  lines: string[];
  postalCode: string;
  city: string;
  country: Country
}

export class ClubLocation {
  @Required()
  @IsUUID()
  id: string;

  @Required()
  @MinLength()
  name: string;

  @Required()
  @MinLength()
  shortName: string;

  @Required()
  @MinLength()
  @Nested()
  address: Address;
}

export class ClubEntity {
  @Required(DEFAULTS_OPTS)
  @IsUUID(undefined, DEFAULTS_OPTS)
  id: string; // Primary ID

  /**
   * technical id parsed from remote systems by the scraper
   */
  @Required(DEFAULTS_OPTS)
  @MinLength(undefined, DEFAULTS_OPTS)
  remoteId: string;

  /**
   * Numers used for humans to identity the club
   */
  @Required(DEFAULTS_OPTS)
  @MinLength(undefined, DEFAULTS_OPTS)
  clubNumber: string;

  @Required(DEFAULTS_OPTS)
  @MinLength(undefined, DEFAULTS_OPTS)
  name: string;

  @Required(DEFAULTS_OPTS)
  @MinLength(undefined, DEFAULTS_OPTS)
  shortName: string;

  @Required(DEFAULTS_OPTS)
  @MinLength()
  @Nested()
  locations: ClubLocation[];
}
