import {Container} from 'inversify';
import {RegistrableController} from './controllers/registrable_controller';
import TYPES from './types';
import {UserController} from './controllers/user_controller';
import {AccountController} from './controllers/account_controller';
import {DepositController} from './controllers/deposit_controller';
import AuthService from './services/auth_service';

const container = new Container();

container.bind<RegistrableController>(TYPES.Controller).to(UserController);
container.bind<RegistrableController>(TYPES.Controller).to(AccountController);
container.bind<RegistrableController>(TYPES.Controller).to(DepositController);

container.bind(TYPES.AuthService).to(AuthService);
export default container