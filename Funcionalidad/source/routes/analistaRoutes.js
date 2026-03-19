import { Router } from 'express';
import { listarAnalistas, servirFirmaAnalista } from '../controllers/analistaController.js';

const router = Router();

router.get('/', listarAnalistas);
router.get('/firma/:identificacion', servirFirmaAnalista);

export default router;