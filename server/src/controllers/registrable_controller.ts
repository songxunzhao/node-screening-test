import express from 'express';

export interface RegistrableController {
    register(app: express.IRouter): void;
}
