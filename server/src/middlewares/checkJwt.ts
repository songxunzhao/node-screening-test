import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // Get the jwt token from the head
    const token = req.headers.auth as string;
    let jwtPayload;

    // Try to validate the token and get data
    try {
        jwtPayload = (jwt.verify(token, config.jwtSecret) as any);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        // If token is not valid, respond with 401 (unauthorized)
        res.status(401).send();
        return;
    }

    // The token is valid for 1 hour
    // We want to send a new token on every request
    const { id, name, email } = jwtPayload;
    const newToken = jwt.sign({ id, name, email }, config.jwtSecret, {
        expiresIn: '1h'
    });
    res.setHeader('token', newToken);

    // Call the next middleware or controller
    next();
};
