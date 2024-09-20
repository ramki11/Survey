import { sum } from "../src/sum"
import { describe, test, expect, beforeAll } from "@jest/globals"
import { server } from '../src/mocks/node.ts';

beforeAll(() => {
    server.listen()
})

describe('Sum function', () => {
    test('Returns correct value', () => {
        expect(sum(2, 3)).toEqual(5)
    })
})

describe('API Test', () => {
    test('Returns API', async () => {
        const response = await fetch('http://localhost/api/v1/items')
        const data = await response.json()
        expect(data.firstName).toEqual('John')
    })
})
