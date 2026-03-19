import { getAnalistas, getFirmaAnalista } from '../services/analistaService.js';
import storage from '../config/gcs.js';

const listarAnalistas = async (req, res) => {
    try {
        const analistas = await getAnalistas();
        res.status(200).json({ success: true, data: analistas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener analistas', error: error.message });
    }
};

const servirFirmaAnalista = async (req, res) => {
    try {
        const { identificacion } = req.params;
        const path = await getFirmaAnalista(identificacion);

        if (!path) {
            return res.status(404).json({ success: false, message: 'Firma no encontrada' });
        }

        const archivo = storage.bucket('firmas-images').file(path);
        const [metadata] = await archivo.getMetadata();

        res.setHeader('Content-Type', metadata.contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');

        archivo.createReadStream().pipe(res);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener firma', error: error.message });
    }
};

export { listarAnalistas, servirFirmaAnalista };