import storage from '../config/gcs.js';

const servirImagen = async (req, res) => {
    try {
        const { bucket, path } = req.query;

        if (!bucket || !path) {
            return res.status(400).json({ success: false, message: 'Faltan parámetros bucket y path' });
        }

        const archivo = storage.bucket(bucket).file(decodeURIComponent(path));
        const [metadata] = await archivo.getMetadata();

        res.setHeader('Content-Type', metadata.contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');

        archivo.createReadStream().pipe(res);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener imagen', error: error.message });
    }
};

export { servirImagen };