import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';

// route related imports
import { default as currentUserRouter } from './routes/currentuser';
import { default as signinRouter } from './routes/signin';
import { default as signoutRouter } from './routes/signout';
import { default as signupRouter } from './routes/signup';
// error related imports
import errorHandler from './middlewares/errorHandler';
import NotFoundError from './errors/notFoundError';

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
    try {
        // mongodb://<host/service>:port/<dbname>
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening on 3000');
    });
};

start();
