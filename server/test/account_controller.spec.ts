import request, {Response} from 'supertest';
import app from '../src/app';
import {setupDatabase, releaseDatabase} from './database';
import config from '../src/config';

describe('Account API endpoints', () => {
    beforeEach(() => {
        return setupDatabase();
    });

    afterEach(() => {
        return releaseDatabase();
    });

    test('Should be able to register user', async () => {
        await request(app)
            .post(config.apiPath + '/account/register')
            .send({
                name: 'Zhao',
                email: 'songxunzhao1991@gmail.com',
                password: '123456'
            })
            .expect(201);

    });

    test('Should be able to register and login', async () => {
        await request(app)
            .post(config.apiPath + '/account/register')
            .send({
                name: 'Zhao',
                email: 'songxunzhao1991@gmail.com',
                password: '123456'
            });

        const response: Response = await request(app)
            .post(config.apiPath + '/account/login')
            .send({
                email: 'songxunzhao1991@gmail.com',
                password: '123456'
            })
            .expect(200);

        expect(response.body.result).toHaveProperty('user');
        expect(response.body.result).toHaveProperty('token');

    });
});
