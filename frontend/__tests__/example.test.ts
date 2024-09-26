import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

/* eslint-disable-next-line */
const inquiryURL = "http://localhost/api/v1/inquiries"

const handlers = [
  http.get(inquiryURL, () => {
    return HttpResponse.json({
      id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
      text: "Sample Inquiry",
      created_at: Date.now(),
    })
  }),
]
/* eslint-disable-next-line */
const server = setupServer(...handlers)

beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})

/* eslint-disable-next-line */
describe("API requests", () => {
  test("GET /items returns data", async () => {
    /* eslint-disable-next-line */
    const response = await fetch(inquiryURL)
    expect(response.ok).toBe(true)
  })
})
/* eslint-disable-next-line */
describe("true is truthy and false is falsy", () => {
  it("true is truthy", () => {
    expect(true).toBe(true)
  })

  it("false is falsy", () => {
    expect(false).toBe(false)
  })
})
/* eslint-disable-next-line */
describe("null is falsy", () => {
  it("null is falsy", () => {
    expect(null).toBeFalsy()
  })
})
