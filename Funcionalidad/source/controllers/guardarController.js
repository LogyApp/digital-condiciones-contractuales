import { guardarPDF, guardarFirma } from '../services/guardarService.js';
import pool from '../config/database.connection.js';

const guardarActcon = async (req, res) => {
    try {
        const { identificacion, pdfBase64, firmaBase64, firmaModificada } = req.body;

        if (!identificacion || !pdfBase64) {
            return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
        }

        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        const urlPdf = await guardarPDF(identificacion, pdfBuffer);

        let urlFirma = null;
        if (firmaModificada && firmaBase64) {
            const firmaBuffer = Buffer.from(firmaBase64.replace(/^data:image\/png;base64,/, ''), 'base64');
            urlFirma = await guardarFirma(identificacion, firmaBuffer);
        }

        await pool.query(`
            UPDATE Digital_ACTCON 
            SET url_pdf = ?, fecha_firma = NOW()
            WHERE identificacion = ?
        `, [urlPdf, identificacion]);

        res.status(200).json({ success: true, urlPdf, urlFirma });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al guardar', error: error.message });
    }
};

export { guardarActcon };