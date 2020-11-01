import express, {NextFunction, Request, Response} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import {RegistrableController} from './controllers/registrable_controller';
import container from './inversify.config';
import TYPES from './types';
import config from './config';

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json({strict: false}));
app.use(bodyParser.urlencoded({extended: false}));

const router = express.Router();
app.use(config.apiPath, router);

const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller);

controllers.forEach(controller => controller.register(router));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send('Internal Server Error');
});

export default app;
