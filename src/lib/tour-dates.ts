import type { Tour } from "@/data/tours";

const TOUR_TIME_ZONE = "Asia/Kolkata";

const monthNameToIndex = new Map<string, number>([
  ["january", 0],
  ["jan", 0],
  ["february", 1],
  ["feb", 1],
  ["march", 2],
  ["mar", 2],
  ["april", 3],
  ["apr", 3],
  ["may", 4],
  ["june", 5],
  ["jun", 5],
  ["july", 6],
  ["jul", 6],
  ["august", 7],
  ["aug", 7],
  ["september", 8],
  ["sep", 8],
  ["sept", 8],
  ["october", 9],
  ["oct", 9],
  ["november", 10],
  ["nov", 10],
  ["december", 11],
  ["dec", 11],
]);

function getMonthIndex(monthText: string) {
  return monthNameToIndex.get(monthText.trim().toLowerCase());
}

function createUtcDate(year: number, monthIndex: number, day: number) {
  return new Date(Date.UTC(year, monthIndex, day));
}

function isValidCalendarDate(year: number, monthIndex: number, day: number) {
  return (
    Number.isInteger(year) &&
    Number.isInteger(monthIndex) &&
    Number.isInteger(day) &&
    monthIndex >= 0 &&
    monthIndex <= 11 &&
    day >= 1 &&
    day <= 31
  );
}

function parseIsoDate(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);

  if (!isValidCalendarDate(year, monthIndex, day)) {
    return undefined;
  }

  return createUtcDate(year, monthIndex, day);
}

function parseDashSeparatedDate(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);

  if (!match) {
    return undefined;
  }

  const first = Number(match[1]);
  const second = Number(match[2]);
  const year = Number(match[3]);

  if (!isValidCalendarDate(year, second - 1, first)) {
    return undefined;
  }

  return createUtcDate(year, second - 1, first);
}

function parseHumanDate(value: string) {
  const trimmed = value.trim();
  const monthFirstMatch = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (monthFirstMatch) {
    const monthIndex = getMonthIndex(monthFirstMatch[1]);
    const day = Number(monthFirstMatch[2]);
    const year = Number(monthFirstMatch[3]);

    if (monthIndex !== undefined && isValidCalendarDate(year, monthIndex, day)) {
      return createUtcDate(year, monthIndex, day);
    }
  }

  const dayFirstMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (dayFirstMatch) {
    const day = Number(dayFirstMatch[1]);
    const monthIndex = getMonthIndex(dayFirstMatch[2]);
    const year = Number(dayFirstMatch[3]);

    if (monthIndex !== undefined && isValidCalendarDate(year, monthIndex, day)) {
      return createUtcDate(year, monthIndex, day);
    }
  }

  return undefined;
}

function parseDateValue(value: string) {
  return parseIsoDate(value) ?? parseDashSeparatedDate(value) ?? parseHumanDate(value);
}

function parseTourDateLabel(value: string, fallbackYear?: number) {
  const trimmed = value.trim();
  const rangeMatch = trimmed.match(
    /^(\d{1,2})\s*[-\u2013\u2014]\s*(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?$/,
  );

  if (rangeMatch) {
    const endDay = Number(rangeMatch[2]);
    const monthIndex = getMonthIndex(rangeMatch[3]);
    const year = rangeMatch[4] ? Number(rangeMatch[4]) : fallbackYear;

    if (
      monthIndex !== undefined &&
      year !== undefined &&
      isValidCalendarDate(year, monthIndex, endDay)
    ) {
      return createUtcDate(year, monthIndex, endDay);
    }
  }

  return parseDateValue(trimmed);
}

function getDateKey(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TOUR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

function isDatePast(date: Date, referenceDate = new Date()) {
  return getDateKey(referenceDate) > getDateKey(date);
}

function formatTourDate(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return trimmed;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, monthIndex, day));

  if (Number.isNaN(date.getTime())) {
    return trimmed;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(date)
    .replace(",", "");
}

export function isScheduledDateExpired(value: string, referenceDate = new Date()) {
  const parsedDate = parseDateValue(value);
  if (!parsedDate) {
    return false;
  }

  return isDatePast(parsedDate, referenceDate);
}

export function getTourRibbonLabel(
  tour: Pick<Tour, "tourDate" | "tourDateLabel">,
  referenceDate = new Date(),
) {
  const tourDate = tour.tourDate?.trim();
  const tourDateLabel = tour.tourDateLabel?.trim();
  const startDate = tourDate ? parseDateValue(tourDate) : undefined;
  const expiryDate = startDate
    ? startDate
    : tourDateLabel
      ? parseTourDateLabel(tourDateLabel)
      : undefined;

  if (expiryDate && isDatePast(expiryDate, referenceDate)) {
    return "Coming Soon";
  }

  if (tourDateLabel) {
    return tourDateLabel;
  }

  if (tourDate) {
    return formatTourDate(tourDate);
  }

  return "Coming Soon";
}
