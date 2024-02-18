import express from 'express';

import { getAllUsers, deleteUser } from '../controllers/users';
import { isAuthenticatedAsAdmin } from '../middleware';

export default (router: express.Router) => {
    router.get('/admin', 
        isAuthenticatedAsAdmin, 
        getAllUsers
    ); //calls isAuthenticatedAsAdmin middleware before calling getAllUsers controller to check for token
    router.delete('/admin/delete-user/:id',isAuthenticatedAsAdmin, deleteUser);
}
