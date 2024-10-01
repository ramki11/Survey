import { formatDate } from "../../src/utils"
// import dayjs from "dayjs";
// jest.spyOn(dayjs.tz, "guess").mockReturnValue("America/Los_Angeles")

describe("formatDate", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should format valid ISO date string correctly", () => {
    const input = "2024-09-23T12:00:00Z"
    const expectedOutput = "Sep 23, 2024 08:00 AM"
    expect(formatDate(input)).toBe(expectedOutput)
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
