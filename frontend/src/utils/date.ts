import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { isISODateTimeString } from "./validation"

// dayjs plugins
/* eslint-disable */
dayjs.extend(utc)
dayjs.extend(timezone)
/* eslint-enable */

export const INVALID_DATE_TYPE_ERROR_MESSAGE = "Date must be a string"
export const ISO_DATE_FORMAT_ERROR_MESSAGE = "Date must be in ISO 8601 format"
export const DATE_PARSING_ERROR_MESSAGE = "Error parsing the date"

/**
 * Converts the input near-8601 string into straight 8601. Specifically, limits the ms to
 * 3 decimal places
 * @param date - The date string to format (expected to be in ISO 8601 date format).
 * @returns 8601-formatted date string
 *
 * Examples:
 *  Input: "2024-09-19T20:24:03.170962"
 *  Output: "2024-09-19T20:24:03.170Z"
 */
export const convertToISO8601 = (date: string) => {
  // Ensure the string has three decimal milliseconds
  const fixedFraction = date.slice(0, 23) // Limit milliseconds to three decimal places

  // Append 'Z' to indicate UTC time zone, or you can add a specific offset if known
  const iso8601 = `${fixedFraction}Z`

  return iso8601
}

/**
 * Format given date to specified format based relative to user's timezone.
 * Use this function to format the dateTime field retrieved from the database.
 * @param date - The date string to format (expected to be in ISO 8601 date format).
 * @returns Formatted date string
 * @throws Error message if the input is not valid ISO string or date cannot be parsed.
 *
 * Examples:
 *  Input: "2024-09-23T12:00:00"
 *  Output: "Sep 23, 2024 08:00AM" (if user's in America/New_York timezone)
 */
export const formatISODateToUserTimezone = (date: string): string => {
  if (typeof date !== "string") {
    throw new Error(INVALID_DATE_TYPE_ERROR_MESSAGE)
  }

  if (!isISODateTimeString(date)) {
    throw new Error(ISO_DATE_FORMAT_ERROR_MESSAGE)
  }

  // Unsafe access to 'error' typed value is handled by dayjs' isValid function
  /* eslint-disable */
  const parsedDate = dayjs.utc(date)
  if (!parsedDate.isValid()) {
    throw new Error(DATE_PARSING_ERROR_MESSAGE)
  }

  const userTimezone = dayjs.tz.guess()
  return parsedDate.tz(userTimezone).format("MMM DD, YYYY hh:mm A")
  /* eslint-enable */
}
