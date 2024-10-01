// Disabling these ESLint rules for mocking the "dayjs" module
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Disabling to mock return value of "dayjs.tz.guess" function
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { formatDate } from "../../src/utils"
import "@testing-library/jest-dom"
import dayjs from "dayjs"

const timezoneTestData = {
  input: "2024-09-23T12:00:00Z",
  timezones: [
    {
      timezone: "America/New_York", // Eastern Daylight Time (EDT)
      expected: "Sep 23, 2024 08:00 AM",
    },
    {
      timezone: "America/Chicago", // Central Daylight Time (CDT)
      expected: "Sep 23, 2024 07:00 AM",
    },
    {
      timezone: "America/Denver", // Mountain Daylight Time (MDT)
      expected: "Sep 23, 2024 06:00 AM",
    },
    {
      timezone: "America/Los_Angeles", // Pacific Daylight Time (PDT)
      expected: "Sep 23, 2024 05:00 AM",
    },
    {
      timezone: "America/Anchorage", // Alaska Daylight Time (AKDT)
      expected: "Sep 23, 2024 04:00 AM",
    },
    {
      timezone: "Pacific/Honolulu", // Hawaii-Aleutian Standard Time (HAST, no DST)
      expected: "Sep 23, 2024 02:00 AM",
    },
  ],
}

describe("formatDate", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should format valid ISO date string correctly for different timezones", () => {
    for (const { timezone, expected } of timezoneTestData.timezones) {
      jest.spyOn(dayjs.tz, "guess").mockReturnValue(timezone)
      expect(formatDate(timezoneTestData.input)).toBe(expected)
    }
  })

  it("should return 'Invalid Date' for invalid ISO date string", () => {
    const input = "12345"
    const expectedOutput = "Invalid Date"
    expect(formatDate(input)).toBe(expectedOutput)
  })

  it("should return 'Invalid Date' for an empty string", () => {
    const input = ""
    const expectedOutput = "Invalid Date"
    expect(formatDate(input)).toBe(expectedOutput)
  })
})
