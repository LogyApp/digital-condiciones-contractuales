import { Router } from 'express';
import { listarActcon } from '../controllers/actconController.js';

const router = Router();

router.get('/', listarActcon);

export default router;