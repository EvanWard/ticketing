import type { Request, Response, NextFunction } from 'express';
import NotAuthorizedError from '../errors/notAuthorizedError';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    next();
};

export default requireAuth;