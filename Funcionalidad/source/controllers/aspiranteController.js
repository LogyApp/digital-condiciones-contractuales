import { getAspirantes } from '../services/aspiranteService.js';

const listarAspirantes = async (req, res) => {
    try {
        const aspirantes = await getAspirantes();
        res.status(200).json({ success: true, data: aspirantes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener aspirantes', error: error.message });
    }
};

export { listarAspirantes };