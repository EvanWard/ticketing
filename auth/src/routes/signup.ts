import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import RequestValidationError from '../errors/requestValidationError';
import DatabaseConnectionError from '../errors/databaseConnectionError';
import User from '../models/user';
import BadRequestError from '../errors/badRequestError';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail()
        .withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new BadRequestError('Email already in use');
    }

    const { password } = req.body;

    const user = User.build({ email, password });
    await user.save();

    res.status(201).send(user);
});

export default router;
