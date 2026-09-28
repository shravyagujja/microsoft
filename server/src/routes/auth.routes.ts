import { Router } from 'express';
import { signup, login, onboard, me } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/onboard', onboard);
router.get('/me', me);

export default router;
