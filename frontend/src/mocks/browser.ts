import { http, HttpResponse } from 'msw'

export const handlers = [
    http.get('http://localhost/items', () => {
        return HttpResponse.json({
            firstName: 'John',
            lastName: 'Maverick',
        })
    }),
]