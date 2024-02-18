import express from 'express';

import authentication from './authentication';
import admin from './admin'
import user from './user';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    user(router);
    admin(router);
    return router;
};
