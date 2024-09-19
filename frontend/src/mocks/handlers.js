import { rest } from 'msw';

export const handlers = [
    rest.get('/user', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                id: '123',
                firstName: 'John',
                lastName: 'Doe',
            })
        );
    }),
];