import {createConnection, getConnection} from 'typeorm';
import {User} from '../src/models/user';
import {Deposit} from '../src/models/deposit';

export const setupDatabase = () => {
    return createConnection({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [User, Deposit],
        synchronize: true,
        logging: false
    });
};

export const releaseDatabase  = () => {
    const connection = getConnection();
    return connection.close();
};