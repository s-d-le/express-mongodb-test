import mongoose from "mongoose";    

//Schema: defines user model
const UserSchema = new mongoose.Schema({
    username: String,
    authentication: {
        password: {type: String, required: true, select: false}, //select: false - do not return password on fetch
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false},
    },
    email: String,
    role: {type: String, enum: ['admin', 'user'], default: 'user'},
    createdAt: Date,
    updatedAt: Date,
});

//Model: defines methods for user model
export const UserModel = mongoose.model('User', UserSchema);

export const getUser = () => UserModel.findOne();
export const getUsers = () => UserModel.find();
export const getUsersByEmail = (email: string) => UserModel.findOne({email});
export const getUsersByToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken
});
export const getUsersById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user: Record<string, any>) => user.toObject()); //toObject() - convert to plain object
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete({_id: id});
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);