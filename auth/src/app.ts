import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

// route related imports
import { default as currentUserRouter } from './routes/currentuser';
import { default as signinRouter } from './routes/signin';
import { default as signoutRouter } from './routes/signout';
import { default as signupRouter } from './routes/signup';
// error related imports
import errorHandler from './middlewares/errorHandler';
import NotFoundError from './errors/notFoundError';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: true,
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export default app;