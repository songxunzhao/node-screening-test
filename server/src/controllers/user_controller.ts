import {injectable} from 'inversify';
import {RegistrableController} from './registrable_controller';
import express, {Request, Response, NextFunction} from 'express';
import 'reflect-metadata';
import {checkJwt} from '../middlewares/checkJwt';
import {checkRole} from '../middlewares/checkRole';
import {User} from '../models/user';
import {getRepository, Repository} from 'typeorm';
import {validate} from 'class-validator';
import logger from '../util/logger';

@injectable()
export class UserController implements RegistrableController {
    public register(app: express.IRouter): void {
        const router = express.Router();
        app.use('/users', [checkJwt, checkRole(['ADMIN', 'MANAGER'])], router);
        router.route('/:id')
            .get(this._get.bind(this))
            .delete(this._delete.bind(this))
            .put(this._update.bind(this));

        router.route('/')
            .get(this._getAll.bind(this))
            .post(this._create.bind(this))
    }

    async _getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userRepository: Repository<User> = getRepository(User);
        const users: User[] = await userRepository.find();
        res.send({
            status: 'success',
            result: users
        });
    }

    async _create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, email, password, role, isDeleted } = req.body;
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = password;
        user.role = role;
        user.isDeleted = isDeleted;

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
            res.status(409).send('username already in use');
            return;
        }

        res.status(201).send({
            status: 'success',
            message: 'User created'
        });
    }

    async _delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        const userRepository: Repository<User> = getRepository(User);
        await userRepository.delete(id);

        res.send({
            status: 'success'
        })
    }

    async _update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, name, role, isDeleted } = req.body;
        const id = parseInt(req.params.id, 10);
        const userRepository: Repository<User> = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id)
            user.email = email;
            user.name = name;
            user.role = role;
            user.isDeleted = isDeleted;

            await userRepository.save(user);

            res.send({
                status: 'success',
                result: user
            })
        } catch(e) {
            res.status(400).send({
                status: 'fail',
                message: 'User was not found'
            })
        }
    }

    async _get(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userRepository: Repository<User> = getRepository(User);
        const id = req.params.id;

        try {
            const user: User = await userRepository.findOneOrFail(id);
            res.send({
                status: 'success',
                result: user.serialize()
            });
        } catch(e) {
            res.status(400).send({
                status: 'fail',
                message: 'User was not found'
            })
        }

    }
}
