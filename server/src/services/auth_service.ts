import {User} from '../models/user';
import jwt from 'jsonwebtoken';
import config from '../config';
import {injectable} from 'inversify';

@injectable()
export default class AuthService {
    public sign(user: User): string {
        return jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            config.jwtSecret,
            { expiresIn: '1h' }
        );
    }
}