import { Router } from 'express';
import { register, login } from '../controllers/authentication.controller';
import { signupSchema } from '../middleware/validations';
import { validateRequest } from '../middleware/validatioRequest';

const router = Router();

router.post('/signup', validateRequest(signupSchema), register)
router.post('/login', login);

export default router;