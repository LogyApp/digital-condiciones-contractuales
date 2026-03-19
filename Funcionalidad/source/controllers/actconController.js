import { getActcon } from '../services/actconService.js';

const listarActcon = async (req, res) => {
    try {
        const data = await getActcon();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener datos del acta', error: error.message });
    }
};

export { listarActcon };