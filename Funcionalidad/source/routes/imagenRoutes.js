import { Router } from 'express';
import { servirImagen } from '../controllers/imagenController.js';

const router = Router();

router.get('/', servirImagen);

export default router;