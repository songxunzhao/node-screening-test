import React, { Component } from 'react';
import './App.css';
import { Router, Route } from "react-router-dom";
import { connect } from 'react-redux';
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import {DepositListPage, DepositPage} from "./pages/deposits";
import { HomePage } from "./pages/home/HomePage";
import { history } from './helpers/history';
import {alertActions} from "./store/actions/alert.action";
import {RootState} from "./store/reducers";
import { PrivateRoute } from "./components";
import {AlertState} from "./store/reducers/alert.reducer";
import {Alert} from "@material-ui/lab";
import {UserListPage, UserPage} from "./pages/users";
import {RevenuePage} from "./pages/deposits/RevenuePage";

interface AppProps {
    alert: AlertState,
    loggedIn: boolean
}

class App extends Component<AppProps> {
    constructor(props: any) {
        super(props);
        const { dispatch } = props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    render() {
        const { alert, loggedIn } = this.props;

        return (
            <div>
                {alert.message &&
                    <Alert severity={alert.type}>{alert.message}</Alert>
                }
                <Router history={history}>
                    <PrivateRoute exact loggedIn={loggedIn} path='/' component={HomePage}/>
                    <Route path='/login' component={LoginPage}/>
                    <Route path='/register'>
                        <RegisterPage/>
                    </Route>
                    <Route exact path='/users'>
                        <UserListPage/>
                    </Route>
                    <Route exact path='/users/create'>
                        <UserPage/>
                    </Route>
                    <Route exact path='/users/edit/:id'>
                        <UserPage/>
                    </Route>
                    <Route exact path='/deposits'>
                        <DepositListPage/>
                    </Route>
                    <Route path='/deposits/create'>
                        <DepositPage/>
                    </Route>
                    <Route path='/deposits/edit/:id'>
                        <DepositPage/>
                    </Route>
                    <Route path='/deposits/revenue'>
                        <RevenuePage/>
                    </Route>
                </Router>
            </div>
        );
    }
}

function mapStateToProps(state: RootState) {
    const { alert, authentication: {loggedIn} } = state;
    return {
        alert,
        loggedIn
    };
}

const connectedApp = connect(mapStateToProps)(App);
export default connectedApp;
