import "server-only";
import { getClosedDays, getHolidayPeriods, getOpeningHours } from "@/lib/data";
import type { Availability } from "./availability";

export async function loadAvailability(): Promise<Availability> {
  const [hours, holidays, closedDays] = await Promise.all([
    getOpeningHours(),
    getHolidayPeriods(),
    getClosedDays(),
  ]);
  return { hours, holidays, closedDays };
}
