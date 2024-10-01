import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { isoDateTimePattern } from "./validation"

/**
 * Format given date to specified format based relative to user's timezone.
 * @param date - The date string to format (expected to be in ISO 8601 date format).
 * @returns Formatted date string or "Invalid Date" if the input is not valid.
 *
 * Examples:
 *  Input: "2024-09-23T12:00:00Z"
 *  Expected Output: "Sep 23, 2024 08:00AM" (if user's in America/New_York timezone)
 */

// dayjs plugins
/* eslint-disable */
dayjs.extend(utc)
dayjs.extend(timezone)
/* eslint-enable */

export const formatDate = (date: string): string => {
  const errorMessage = "Invalid Date"

  if (typeof date !== "string" || !isoDateTimePattern.value.test(date))
    return errorMessage
  // Unsafe access to 'error' typed value is handled by dayjs' isValid function
  /* eslint-disable */
  const parsedDate = dayjs.utc(date)
  const userTimezone = dayjs.tz.guess()
  return parsedDate.isValid()
    ? parsedDate.tz(userTimezone).format("MMM DD, YYYY hh:mm A")
    : errorMessage
  /* eslint-enable */
}
