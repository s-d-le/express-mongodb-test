import express from 'express';
import { get, merge } from 'lodash';
import { getUsersByToken } from '../db/users';

//Get user with session token from cookie, then add user to request object
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
 try {
    const sessionToken = req.cookies['sessionToken']; //cookie name is set in login controller

    if (!sessionToken) {
        return res.sendStatus(403); //not authenticated
    }

    const existingUser = await getUsersByToken(sessionToken);

    if (!existingUser) {
        return res.sendStatus(403); //no user with this session token
    }

    merge(req, {user: existingUser}); //add user to request object

    return next();
 }
 catch(error) {
    console.log(error)
    return res.sendStatus(400);
 }
}

export const isAuthenticatedAsAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
       const sessionToken = req.cookies['sessionToken']; //cookie name is set in login controller
   
       if (!sessionToken) {
           return res.sendStatus(403); //not authenticated
       }
   
       const existingUser = await getUsersByToken(sessionToken);
   
       if (!existingUser) {
           return res.sendStatus(403); //no user with this session token
       }
   
       merge(req, {user: existingUser}); //add user to request object
   
       if (get(existingUser, 'role') !== 'admin') {
           return res.sendStatus(403); //not admin
       }
   
       return next();
    }
    catch(error) {
       console.log(error)
       return res.sendStatus(400);
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
       const { id } = req.params;
       const currentUserId = get(req, 'user._id') as string

       console.log(currentUserId)

       if (!currentUserId) {
           return res.sendStatus(403); //not authenticated
       }

       if (currentUserId.toString() !== id) {
           return res.sendStatus(403); //not owner
       }
   
       return next();
    }
    catch(error) {
       console.log(error)
       return res.sendStatus(400);
    }
}