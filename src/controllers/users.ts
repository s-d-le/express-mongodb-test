import express from 'express';
import { deleteUserById, updateUserById, getUser, getUsers, getUsersById } from '../db/users';

//User role required
export const getUserInfo = async (req: express.Request, res: express.Response) => {
    try {
        const user = await getUser();

        return res.status(200).json(user).end();
    }
    catch(error) {
        console.log(error)
        return res.sendStatus(400);
    }
}


//Admin role required
export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users).end();
    }
    catch(error) {
        console.log(error)
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        return res.json(deletedUser).end();
    }
    catch(error) {
        console.log(error)
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if(!username) {
            return res.sendStatus(400);
        }

        const user = await getUsersById(id);
        user.username = username;

        await user.save();
        return res.status(200).json(user).end();
    }
    catch(error) {
        console.log(error)
        return res.sendStatus(400);
    }
}