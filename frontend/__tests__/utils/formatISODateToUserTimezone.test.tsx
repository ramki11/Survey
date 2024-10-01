// Disabling these ESLint rules for mocking the "dayjs" module
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Disabling to mock return value of "dayjs.tz.guess" function
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { formatISODateToUserTimezone } from "../../src/utils"
import "@testing-library/jest-dom"
import dayjs from "dayjs"

const timezoneTestData = {
  input: "2024-09-23T12:00:00Z",
  timezones: [
    {
      timezone: "America/New_York", // Eastern Daylight Time (EDT)
      expectedOutput: "Sep 23, 2024 08:00 AM",
    },
    {
      timezone: "America/Chicago", // Central Daylight Time (CDT)
      expectedOutput: "Sep 23, 2024 07:00 AM",
    },
    {
      timezone: "America/Denver", // Mountain Daylight Time (MDT)
      expectedOutput: "Sep 23, 2024 06:00 AM",
    },
    {
      timezone: "America/Los_Angeles", // Pacific Daylight Time (PDT)
      expectedOutput: "Sep 23, 2024 05:00 AM",
    },
    {
      timezone: "America/Anchorage", // Alaska Daylight Time (AKDT)
      expectedOutput: "Sep 23, 2024 04:00 AM",
    },
    {
      timezone: "Pacific/Honolulu", // Hawaii-Aleutian Standard Time (HAST, no DST)
      expectedOutput: "Sep 23, 2024 02:00 AM",
    },
  ],
}

describe("formatISODateToUserTimezone", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should format valid ISO date string correctly for different timezones when called with valid input", () => {
    for (const { timezone, expectedOutput } of timezoneTestData.timezones) {
      jest.spyOn(dayjs.tz, "guess").mockReturnValue(timezone)
      expect(formatISODateToUserTimezone(timezoneTestData.input)).toBe(
        expectedOutput,
      )
    }
  })

  it("should return 'Invalid Date' when called with invalid ISO date string", () => {
    const input = "12345"
    const expectedOutput = "Invalid Date"
    expect(formatISODateToUserTimezone(input)).toBe(expectedOutput)
  })

  it("should return 'Invalid Date' when called with an empty string", () => {
    const input = ""
    const expectedOutput = "Invalid Date"
    expect(formatISODateToUserTimezone(input)).toBe(expectedOutput)
  })
})
