import express from 'express';
import { createUser, getUsersByEmail } from '../db/users';
import { random, authentication } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        //include salt and password in response because they are set select: false in schema (moongose)
        const user = await getUsersByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(400);
        }

        //generate new session token
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        //set cookie with session token
        res.cookie('sessionToken', user.authentication.sessionToken, {
            domain: 'localhost',
            path: '/',
        }); 
    
        return res.status(200).json(user).end();
    }
    catch(error) {
        console.log(error)
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {username, password, email, role} = req.body;

        if (!username || !password || !email) {
            return res.sendStatus(400);
        }

        const existingUser = await getUsersByEmail(email);

        if(existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            username,
            email,
            authentication: {
                password: authentication(salt, password),
                salt,
                sessionToken: random(),
            },
            role: role || 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return res.status(200).json(user).end();

    }
    catch(error) {
        console.log(error)
        return res.sendStatus(400);
    }
};