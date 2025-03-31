import { TemporalUnit } from "src/app/model/temporal-unit";
import { MathUtil } from "src/app/util/math-util";

export type distance = number;
export const km: distance = 1;

export type angle = number;
export const deg: angle = 1;
export const rad: angle = MathUtil.deg2rad(deg);

export type time = number;
export const days: time = 1;
export const minutes: time = TemporalUnit.MINUTE.as(TemporalUnit.DAY);

// Coordinate systems
export type DistLong = { distance: distance, trueLongitude: angle };
export type Orbital = DistLong & { heliocentric: boolean, ascendingNodeLongitude: angle, inclination: angle };
export type RaDec = { rightAscension: angle, declination: angle }; // position relative to earth
export type AzAlt = { azimuth: angle, altitude: angle }; // position relative to observer on earth
