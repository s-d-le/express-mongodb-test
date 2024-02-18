import express from 'express';

import { getUserInfo, deleteUser, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middleware';

export default (router: express.Router) => {
    router.get('/user', 
        isAuthenticated, 
        getUserInfo
    ); //calls isAuthenticated middleware before calling getAllUsers controller to check for token
    router.delete('/user/delete/:id',isAuthenticated, isOwner, deleteUser); //admin can delete anyone but user can only self delete
    router.patch('/user/update/:id',isAuthenticated, isOwner, updateUser); //admin can update anyone but user can only self update
}
