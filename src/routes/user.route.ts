import express from 'express';
import { followUserController } from '../controllers/user.controller';
import auth from '../middlewares/auth';

const router = express.Router();

router.post('/:userToFollowId/follow',auth, followUserController);

export default router;