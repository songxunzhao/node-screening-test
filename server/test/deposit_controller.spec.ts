import {releaseDatabase, setupDatabase} from './database';
import {getRepository, Repository} from 'typeorm';
import {User} from '../src/models/user';
import {Deposit} from '../src/models/deposit';
import request from 'supertest';
import app from '../src/app';
import AuthService from '../src/services/auth_service';
import config from '../src/config';

describe('Deposit API endpoints', () => {
    let normalUser;
    let adminUser;
    const authService = new AuthService();

    beforeAll(async () => {
        await setupDatabase();
        const userRepository: Repository<User> = getRepository(User);
        normalUser = new User();
        normalUser.email = 'test@gmail.com'
        normalUser.name = 'test';
        normalUser.password = '123456';
        normalUser.isDeleted = false;
        normalUser.hashPassword();
        await userRepository.save(normalUser);

        adminUser = new User();
        adminUser.email = 'admin@gmail.com'
        adminUser.name = 'admin';
        adminUser.password = '123456';
        adminUser.role = 'ADMIN'
        adminUser.isDeleted = false;
        adminUser.hashPassword();
        await userRepository.save(adminUser);

        const depositRepository: Repository<Deposit> = getRepository(Deposit);
        const deposit = new Deposit();
        deposit.bankName = 'American Express';
        deposit.accountNumber = '123456';
        deposit.initialAmount = 123.35;
        deposit.startDate = new Date('2010-10-30')
        deposit.endDate = new Date('2025-10-30')
        deposit.interestPercentage = 10;
        deposit.taxesPercentage = 30;
        deposit.user = normalUser;
        await depositRepository.save(deposit);
    });

    afterAll(() => {
        return releaseDatabase();
    });

    test('Should be able to create deposit', async () => {
        const authToken = authService.sign(normalUser);

        const response = await request(app)
            .post(config.apiPath + '/deposits/')
            .set('auth', authToken)
            .send({
                bankName: 'CT bank',
                accountNumber: '123456',
                initialAmount: 123.45,
                startDate: '2010-11-30',
                endDate: '2025-11-30',
                interestPercentage: 10,
                taxesPercentage: 30,
                userId: normalUser.id
            });
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.result).toMatchObject({
            bankName: 'CT bank',
            accountNumber: '123456',
            initialAmount: 123.45,
            interestPercentage: 10,
            taxesPercentage: 30
        });
    });

    test('Should be able to update deposit', async () => {
        const authToken = authService.sign(normalUser);
        const response = await request(app)
            .put(config.apiPath + '/deposits/2')
            .set('auth', authToken)
            .send({
                bankName: 'Test bank',
                accountNumber: '123456',
                initialAmount: 123.45,
                startDate: '2010-11-30',
                endDate: '2025-11-30',
                interestPercentage: 10,
                taxesPercentage: 30,
                userId: normalUser.id
            });
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.result).toMatchObject({
            id: 2,
            bankName: 'Test bank'
        });
    });

    test('Should be able to get a deposit', async () => {
        const authToken = authService.sign(normalUser);
        const response = await request(app)
            .get(config.apiPath + '/deposits/1')
            .set('auth', authToken);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.result).toMatchObject({
            id: 1,
            bankName: 'American Express'
        });
    });

    test('Should be able to delete a deposit', async () => {
        const authToken = authService.sign(normalUser);
        const response = await request(app)
            .delete(config.apiPath + '/deposits/2')
            .set('auth', authToken);
        expect(response.body).toHaveProperty('status', 'success');
    });

    test('Should be able to search deposits', async () => {
        const authToken = authService.sign(normalUser);

        const response = await request(app)
            .get(config.apiPath + '/deposits/')
            .set('auth', authToken)
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.result).toHaveLength(1);
    });

    test('Should be able to search deposits by userId', async () => {
        const authToken = authService.sign(adminUser);

        const response = await request(app)
            .get(config.apiPath + '/deposits/')
            .query({
                'userId': 2
            })
            .set('auth', authToken)
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.result).toHaveLength(0);
    });

    test('Should be able to search deposits by date', async () => {
        const authToken = authService.sign(adminUser);

        const response = await request(app)
            .get(config.apiPath + '/deposits/')
            .query({
                'from': '2025-11-29'
            })
            .set('auth', authToken)
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.result).toHaveLength(0);
    });

    test('Should be able to search deposits by min and max', async () => {
        const authToken = authService.sign(adminUser);

        const response = await request(app)
            .get(config.apiPath + '/deposits/')
            .query({
                min: 100,
                max: 150
            })
            .set('auth', authToken)
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.result).toHaveLength(1);
    });

    test('Should be able to search deposits by bank name', async () => {
        const authToken = authService.sign(adminUser);

        const response = await request(app)
            .get(config.apiPath + '/deposits/')
            .query({
                bank: 'American'
            })
            .set('auth', authToken)
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.result).toHaveLength(1);
    });

    test('Should be able to get revenues', async () => {
        const authToken = authService.sign(adminUser);

        const response = await request(app)
            .get(config.apiPath + '/deposits/revenue')
            .query({
                from: '2020-10-15',
                to: '2020-11-15'
            })
            .set('auth', authToken)
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.result).toHaveLength(1);
        expect(response.body.result[0].change).toBeGreaterThan(0.74)
    });
});
