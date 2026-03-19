import { getActcon } from '../services/actconService.js';

const listarActcon = async (req, res) => {
    try {
        const { identificacion } = req.query;

        if (!identificacion) {
            return res.status(400).json({ success: false, message: 'Identificación requerida' });
        }

        const data = await getActcon(identificacion);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener datos del acta', error: error.message });
    }
};

export { listarActcon };