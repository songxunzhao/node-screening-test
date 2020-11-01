import {inject, injectable} from 'inversify';
import {RegistrableController} from './registrable_controller';
import express, {Request, Response, NextFunction} from 'express';
import 'reflect-metadata';
import {Repository, getRepository} from 'typeorm';
import {User} from '../models/user';
import {validate} from 'class-validator';
import logger from '../util/logger';
import TYPES from '../types';

@injectable()
export class AccountController implements RegistrableController {
    @inject(TYPES.AuthService) authService;

    public register(app: express.IRouter): void {
        const router = express.Router();
        app.use('/account', router);

        router.route('/login').post(this._login.bind(this));

        router.route('/register').post(this._register.bind(this));
    }

    async _login(req: Request, res: Response, next: NextFunction): Promise<void> {

        const { email, password } = req.body;
        if(!(email && password)) {
            res.status(400).send();
        }
        const userRepository: Repository<User> = getRepository(User);

        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { email } });
        } catch (error) {
            res.status(400).send({
                status: 'fail',
                message: 'Not valid user'
            });
        }

        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(400).send({
                status: 'fail',
                message: 'Wrong password'
            });
            return;
        }

        // Sign JWT, valid for 1 hour
        const token = this.authService.sign(user);

        res.status(200).send({
            status: 'success',
            result: {
                user,
                token
            }
        });
    }

    async _register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, email, password } = req.body;
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = password;

        const errors = await validate(user);
        if (errors.length > 0) {
           res.status(400).send({
               status: 'fail',
               message: 'Not valid information',
               errors
           });
           return;
        }

        user.hashPassword();

        const userRepository: Repository<User> = getRepository(User);
        try {
            await userRepository.save(user);
        } catch(e) {
            logger.error(e.message);
            res.status(409).send({
                status: 'fail',
                message:'email already in use'
            });
            return;
        }

        res.status(201).send({
            status: 'success',
            message: 'User created'
        });
    }
}
