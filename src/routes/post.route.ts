import { Router } from 'express';
import { createPost } from '../controllers/post.controller';
import auth from '../middlewares/auth';
import { createPostValidationSchema } from '../middlewares/validations';
import { validate } from '../middlewares/validatioRequest';

const router = Router();

router.post('/', auth, validate(createPostValidationSchema),  createPost);

export default router;