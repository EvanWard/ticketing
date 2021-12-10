import express from 'express';
import type { Request, Response } from 'express';
import { body } from 'express-validator';
import validateRequest from '../middlewares/validateRequest';
import User from '../models/user';
import BadRequestError from '../errors/badRequestError';
import Password from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage("Email must be valid."),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
],
validateRequest,
async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        throw new BadRequestError('Invalid credentials');
    }

    const doPasswordsMatch = await Password.compare(
        existingUser.password, password
    );

    if (!doPasswordsMatch) {
        throw new BadRequestError('Invalid credentials');
    }

    // generate jwt
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
    }, process.env.JWT_KEY!);

    // store on session
    req.session = {
        jwt: userJwt,
    };

    res.status(200).send(existingUser);
});

export default router;
