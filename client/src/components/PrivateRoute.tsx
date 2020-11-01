import React from 'react';
import {Route, Redirect, RouteProps} from 'react-router-dom';

interface PrivateRouteProps extends RouteProps{
    component: any;
    loggedIn: boolean;
}

export const PrivateRoute = ({ component: Component, loggedIn, ...rest }: PrivateRouteProps) => {
    return (
        <Route {...rest} render={props => (
            loggedIn
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )} />
    )
}
