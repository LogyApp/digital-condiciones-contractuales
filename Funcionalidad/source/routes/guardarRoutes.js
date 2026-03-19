import { Router } from 'express';
import { guardarActcon } from '../controllers/guardarController.js';

const router = Router();

router.post('/', guardarActcon);

export default router;