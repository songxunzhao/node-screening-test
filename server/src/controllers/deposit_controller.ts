import { RegistrableController } from './registrable_controller';
import express, {Request, Response, NextFunction} from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import {getRepository, Repository, SelectQueryBuilder} from 'typeorm';
import { User } from '../models/user';
import {Deposit} from '../models/deposit';
import {validate} from 'class-validator';
import {injectable} from 'inversify';
import logger from '../util/logger';
import {Revenue} from '../models/revenue';

@injectable()
export class DepositController implements RegistrableController {
    public register(app: express.IRouter): void {
        const router = express.Router();
        app.use('/deposits', [checkJwt], router);
        router.route('/')
            .get(this._getAll.bind(this))
            .post(this._create.bind(this));

        router.route('/revenue')
            .get(this._revenue.bind(this));

        router.use('/:id', DepositController.depositMiddleware)
            .route('/:id')
            .get(this._get.bind(this))
            .put(this._update.bind(this))
            .delete(this._delete.bind(this));
    }

    async _getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = res.locals.jwtPayload;
        const { from, to, userId:queryUserId, min, max, bank } = req.query;

        const userRepository: Repository<User> = getRepository(User);
        const depositRepository: Repository<Deposit> = getRepository(Deposit);
        const fromDate = from ? Date.parse(from as string) : null;
        const toDate = to ? new Date(to as string) : null;
        let user: User;

        try {
            user = await userRepository.findOneOrFail({
                id
            });
        } catch(e) {
            res.status(401).send({
                status: 'fail',
                message: 'User wasn\'t authorized'
            })
            return;
        }

        const queryBuilder: SelectQueryBuilder<Deposit> = depositRepository
            .createQueryBuilder('deposit')


        if(fromDate && toDate) {
            queryBuilder
                .where('(startDate between :from and :to or endDate between :from and :to)', {from, to})
        } else if(fromDate) {
            queryBuilder
                .where('endDate >= :from', {from})
        } else if(toDate) {
            queryBuilder
                .where('startDate <= :to', {to})
        }

        let searchUserId: string|number = queryUserId as string;
        if(user.role !== 'ADMIN') {
            searchUserId = user.id;
        }

        if(searchUserId) {
            queryBuilder.andWhere('userId=:userId', {userId: searchUserId})
        }

        if(bank) {
            queryBuilder.andWhere('bankName like :bankName', {bankName: `${bank}%`})
        }

        if(min && max) {
            queryBuilder.andWhere('initialAmount between :min and :max', {min, max})
        } else if(min) {
            queryBuilder.andWhere('initialAmount >= :min', {min})
        } else if(max) {
            queryBuilder.andWhere('initialAmount <= :max', {max})
        }

        queryBuilder.leftJoinAndMapOne('deposit.user', 'deposit.user', 'user')
        const deposits = await queryBuilder.getMany();

        res.send({
            status: 'success',
            result: deposits
        })

    }

    async _create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id: logUserId } = res.locals.jwtPayload;
        const userRepository: Repository<User> = getRepository(User);
        const depositRepository: Repository<Deposit> = getRepository(Deposit);

        try {
            const logUser: User = await userRepository.findOneOrFail(logUserId);
            const deposit = this.depositFromBody(req.body, logUser, null);
            const errors = await validate(deposit);
            if (errors.length > 0) {
                res.status(400).send({
                    status: 'fail',
                    message: 'Not valid information',
                    errors
                });
                return;
            }

            await depositRepository.save(deposit);
            res.send({
                status: 'success',
                result: deposit
            })
        } catch(e) {
            res.status(401).send({
                status: 'fail',
                message: 'User wasn\'t authorized'
            });
        }
    }

    async _get(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = res.locals.user;
        const deposit = res.locals.deposit;

        if((user.role !== 'ADMIN' && deposit.userId === user.id) ||
            user.role === 'ADMIN') {
            res.send({
                status: 'success',
                result: deposit
            });
        } else {
            res.status(403).send({
                status: 'fail',
                message: 'Not authorized to get the deposit'
            });
        }
    }

    async _update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = res.locals.user;
        let deposit = res.locals.deposit;
        const depositRepository: Repository<Deposit> = getRepository(Deposit);

        if((user.role !== 'ADMIN' && deposit.userId === user.id) ||
            user.role === 'ADMIN') {
            deposit = this.depositFromBody(req.body, user, deposit);
            const errors = await validate(deposit);
            if(errors.length > 0) {
                res.status(400).send({
                    status: 'fail',
                    message: 'Not valid information',
                    errors
                });
            } else {
                await depositRepository.save(deposit);
                res.send({
                    status: 'success',
                    result: deposit
                });
            }
        } else {
            res.status(403).send({
                status: 'fail',
                message: 'Not authorized to see deposit'
            });
        }
    }

    async _delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = res.locals.user;
        const deposit = res.locals.deposit;
        const depositRepository: Repository<Deposit> = getRepository(Deposit);
        if((user.role !== 'ADMIN' && deposit.userId === user.id) ||
            user.role === 'ADMIN') {
            logger.info(await depositRepository.delete({id: deposit.id}));
            res.send({
                status: 'success'
            });
        } else {
            res.status(403).send({
                status: 'fail',
                message: 'Not authorized to see deposit'
            });
        }
    }

    async _revenue(req: Request, res: Response, next: NextFunction): Promise<void> {
        const depositRepository: Repository<Deposit> = getRepository(Deposit);
        const deposits = await depositRepository.find({
            relations: ['user']
        })
        const {from, to} = req.query
        const fromDate = new Date(from as string)
        const toDate = new Date(to as string)
        const dayMiliseconds = 24 * 60 * 60 * 1000
        const revenues = deposits.map((deposit) => {
            let _from: Date;
            let _to: Date;
            if(fromDate > deposit.startDate) {
                _from = fromDate
            } else {
                _from = deposit.startDate
            }

            if(toDate < deposit.endDate) {
                _to = toDate
            } else {
                _to = deposit.endDate
            }

            const revenue: Revenue = Object.assign({}, deposit, {
                change: 0, from: from as string, to: to as string
            })

            if(_from < _to) {
                const days = (_to.getTime() - _from.getTime()) / dayMiliseconds
                const factor =
                    deposit.interestPercentage > 0
                        ? deposit.interestPercentage / 100 / 360 * ((100 - deposit.taxesPercentage) / 100)
                        : deposit.interestPercentage / 100 / 360
                const finalFactor = factor * days
                revenue.change = finalFactor * deposit.initialAmount
            }
            return revenue
        })
        res.send({
            status: 'success',
            result: revenues
        })
    }

    static async depositMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
        const depositId = req.params.id;
        const { userId } = res.locals.jwtPayload;
        const userRepository: Repository<User> = getRepository(User);
        const depositRepository: Repository<Deposit> = getRepository(Deposit);

        let user: User;
        try {
            user = await userRepository.findOneOrFail(userId);
            res.locals.user = user;
        } catch(e) {
            res.status(401).send({
                status: 'fail',
                message: 'User wasn\'t authorized'
            });
            return;
        }

        let deposit: Deposit;
        try {
            deposit = await depositRepository.findOneOrFail(depositId)
            res.locals.deposit = deposit;
        } catch(e) {
            res.status(400).send({
                status: 'fail',
                message: 'Deposit was\'t found'
            });
            return;
        }
        next();
    }

    private depositFromBody(body: any, loggedUser: User, oldDeposit: Deposit): Deposit {
        const {
            accountNumber,
            bankName,
            startDate,
            endDate,
            initialAmount,
            interestPercentage,
            taxesPercentage,
            userId
        } = body;
        const deposit: Deposit = oldDeposit ?? new Deposit();

        deposit.accountNumber = accountNumber;
        deposit.bankName = bankName;
        deposit.initialAmount = initialAmount;
        deposit.interestPercentage = interestPercentage;
        deposit.taxesPercentage = taxesPercentage;
        deposit.startDate = startDate;
        deposit.endDate = endDate;

        if(loggedUser.role === 'ADMIN') {
            deposit.userId = userId;
        } else {
            logger.info(loggedUser.id);
            deposit.userId = loggedUser.id;
        }
        return deposit
    }
}
