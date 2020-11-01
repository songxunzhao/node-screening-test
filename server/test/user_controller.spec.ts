import {releaseDatabase, setupDatabase} from './database';
import request from 'supertest';
import app from '../src/app';
import {getRepository} from 'typeorm';
import {User} from '../src/models/user';
import AuthService from '../src/services/auth_service';
import config from '../src/config';

describe('User API endpoints', () => {
    let normalUser;
    let adminUser;
    let manageUser;
    let adminToken;
    let normalToken;
    let manageToken;

    const authService = new AuthService();

    beforeAll(async () => {
        await setupDatabase();
        const userRepository = getRepository(User);

        normalUser = new User();
        normalUser.name = 'zhao';
        normalUser.email = 'songxunzhao1991@gmail.com';
        normalUser.role = 'NORMAL';
        normalUser.password = '123456';
        normalUser.hashPassword();
        await userRepository.save(normalUser);

        adminUser = new User();
        adminUser.name = 'admin'
        adminUser.email = 'admin@gmail.com';
        adminUser.role = 'ADMIN';
        adminUser.password = '123456';
        adminUser.hashPassword();
        await userRepository.save(adminUser);

        manageUser = new User();
        manageUser.name = 'manage';
        manageUser.email = 'manager@gmail.com';
        manageUser.role = 'MANAGER';
        manageUser.password = '123456';
        manageUser.hashPassword();
        await userRepository.save(manageUser);

        adminToken = authService.sign(adminUser);
        manageToken = authService.sign(manageUser);
        normalToken = authService.sign(normalUser);
    });

    afterAll(() => {
        return releaseDatabase();
    });

    test('Should be able to get all users', async () => {
        const response = await request(app)
            .get(config.apiPath + '/users/')
            .set('auth', adminToken);
        expect(response.body).toHaveProperty('result');
        expect(response.body.result).toHaveLength(3);
    });

    test('Should be able to get user', async () => {
        const response = await request(app)
            .get(config.apiPath + '/users/1')
            .set('auth', adminToken);
        expect(response.body).toHaveProperty('result');
        expect(response.body.result).toHaveProperty('id', 1);
    });

    test('Should be able to create user', async () => {
        const response = await request(app)
            .post(config.apiPath + '/users/')
            .send({
                name: 'test',
                email: 'test@gmail.com',
                password: '123456',
                role: 'MANAGER'
            })
            .set('auth', adminToken)
            .expect(201)
        expect(response.body).toHaveProperty('status', 'success');
    });

    test('Should be able to update user', async () => {
        const response = await request(app)
            .put(config.apiPath + '/users/4')
            .send({
                name: 'test1',
                email: 'test@gmail.com',
                password: '123456',
                role: 'MANAGER'
            })
            .set('auth', adminToken)
            .expect(200)
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('result');
        expect(response.body.result).toHaveProperty('name', 'test1');
    });

    test('Should be able to delete user', async () => {
        const response = await request(app)
            .delete(config.apiPath + '/users/4')
            .set('auth', adminToken)
            .expect(200)
        expect(response.body).toHaveProperty('status', 'success');
    });

    test('Should not allow operation for normal users', () => {
        return request(app)
            .get(config.apiPath + '/users/')
            .set('auth', normalToken)
            .expect(401);
    });

    test('Should allow operation for user managers', () => {
        return request(app)
            .get(config.apiPath + '/users/')
            .set('auth', manageToken)
            .expect(200)
    });

    test('Should allow operation for admin', () => {
        return request(app)
            .get(config.apiPath + '/users/')
            .set('auth', adminToken)
            .expect(200)
    });
});
