import express from 'express';
import type { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import BadRequestError from '../errors/badRequestError';
import validateRequest from '../middlewares/validateRequest';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail()
        .withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
],
validateRequest,
async (req: Request, res: Response) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new BadRequestError('Email already in use');
    }

    const { password } = req.body;

    const user = User.build({ email, password });
    await user.save();

    // generate jwt
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_KEY!);

    // store on session
    req.session = {
        jwt: userJwt,
    };

    res.status(201).send(user);
});

export default router;
