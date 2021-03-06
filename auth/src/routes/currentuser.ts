import express from 'express';
import type { Request, Response } from 'express';
import currentUser from '../middlewares/currentUser';

const router = express.Router();

router.get(
    '/api/users/currentuser',
    currentUser,
    (req: Request, res: Response) => {
        res.send({
            currentUser: req.currentUser || null,
        });
    }
);

export default router;
