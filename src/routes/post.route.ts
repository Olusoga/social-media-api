import { Router } from 'express';
import { commentPostController, createPost, getAllPostswithCounts, getFeed, getPostWithCountsController, likePostController } from '../controllers/post.controller';
import auth from '../middlewares/auth';
import { createPostValidationSchema } from '../middlewares/validations';
import { validate } from '../middlewares/validatioRequest';

const router = Router();

router.get('/', getAllPostswithCounts)
router.get('/:postId', getPostWithCountsController)
router.post('/', auth, validate(createPostValidationSchema),  createPost);
router.get('/feeds', auth, getFeed)
router.post('/like', auth, likePostController)
router.post('/comment', auth, commentPostController)

export default router;