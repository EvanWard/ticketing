import mongoose from 'mongoose';
import Password from '../services/password';

interface IUserAttrs {
    email: string;
    password: string;
}

interface IUserModel extends mongoose.Model<IUserDocument> {
    build(attrs: IUserAttrs): IUserDocument;
}

interface IUserDocument extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// function keyword for this context
userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: IUserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;
