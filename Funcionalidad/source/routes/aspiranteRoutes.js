import { Router } from 'express';
import { listarAspirantes } from '../controllers/aspiranteController.js';

const router = Router();

router.get('/', listarAspirantes);

export default router;