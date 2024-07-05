import express from 'express';
import { followUserController } from '../controllers/user.controller';

const router = express.Router();

router.post('/:userId/follow/:userToFollowId', followUserController);

export default router;