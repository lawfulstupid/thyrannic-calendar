import { TemporalUnit } from "src/app/model/temporal-unit";
import { MathUtil } from "src/app/util/math-util";

export type distance = number;
export const km: distance = 1;
export const AU: distance = 149_600_000 * km;

export type angle = number;
export const deg: angle = 1;
export const rad: angle = MathUtil.deg2rad(deg);

export type time = number;
export const days: time = 1;
export const minutes: time = TemporalUnit.MINUTE.as(TemporalUnit.DAY);
