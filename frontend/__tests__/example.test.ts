import { server } from "./mocks/node.ts"

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

describe("API requests", () => {
  test("GET /items returns data", async () => {
    const response = await fetch("http://localhost/items")
    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.firstName).toEqual("John")
  })
})
describe("404 page not found", () => {
  it("returns a 404 status code", async () => {
    const response = await fetch("http://localhost/not-found")
    expect(response.status).toBe(404)
  })
})

describe("true is truthy and false is falsy", () => {
  it("true is truthy", () => {
    expect(true).toBe(true)
  })

  it("false is falsy", () => {
    expect(false).toBe(false)
  })
})

describe("null is falsy", () => {
  it("null is falsy", () => {
    expect(null).toBeFalsy()
  })
})
describe("API Test", () => {
  test("Returns API", async () => {
    const response = await fetch("http://localhost/api/v1/items")
    const data = await response.json()
    expect(data.firstName).toEqual("John")
  })
})
