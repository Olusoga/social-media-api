import { Router } from 'express';
import { commentPostController, createPost, getFeed, getPostWithCountsController, likePostController } from '../controllers/post.controller';
import auth from '../middlewares/auth';
import { createPostValidationSchema } from '../middlewares/validations';
import { validate } from '../middlewares/validatioRequest';

const router = Router();

router.post('/', auth, validate(createPostValidationSchema),  createPost);
router.get('/:postId', getPostWithCountsController)
router.get('/feeds', auth, getFeed)
router.post('/like', auth, likePostController)
router.post('/comment', auth, commentPostController)

export default router;